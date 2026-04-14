import type { CacheEntry, CacheEvictionStrategy } from "@/lib/domain";
import {
  EnvironmentNames,
  getBinaryLock,
  getErrorMessage,
  regexTrue,
  selectEnvironment,
} from "@/lib/domain";
import {
  CACHE_LOAD_RETRY_ATTEMPS,
  CACHE_LOAD_RETRY_DELAY_MS,
  CACHE_ITEM_LOCK_TIMEOUT_1MN,
} from "@/lib/domain";
import { delayWithRetry } from "@/lib/domain";
import type { BaseCacheManager, CacheResult } from "../core";
import { getLeasRecentEvictionStrategy } from "../cache/eviction/least-recent-eviction";

class CacheManager implements BaseCacheManager {
  private static __instance: CacheManager;
  private sizeLimit: number;
  private withTracing: boolean;
  private cache: Map<string, CacheEntry<any>> = new Map();
  private evictionStrategy: CacheEvictionStrategy | undefined;
  private binaryLock = getBinaryLock();

  private constructor(
    evictionStrategy: CacheEvictionStrategy,
    withTracing?: boolean,
    cacheSizeLimit?: number,
  ) {
    this.evictionStrategy = evictionStrategy;
    this.withTracing =
      regexTrue.test(selectEnvironment(EnvironmentNames.ENABLE_TRACING)) ??
      withTracing;
    this.sizeLimit = parseInt(
      selectEnvironment(EnvironmentNames.CACHE_SIZE_LIMIT) ?? cacheSizeLimit,
      10,
    );
  }

  static instance({
    evictionStrategy = getLeasRecentEvictionStrategy(),
    withTracing = false,
    cacheSizeLimit = 50,
  }: {
    evictionStrategy?: CacheEvictionStrategy;
    withTracing?: boolean;
    cacheSizeLimit?: number;
  }) {
    if (!CacheManager.__instance) {
      CacheManager.__instance = new CacheManager(
        evictionStrategy,
        withTracing,
        cacheSizeLimit,
      );
    }
    return CacheManager.__instance;
  }

  private set<T = any>(key: string, value: T, staleTimeMs: number) {
    const currDate = new Date();
    this.cache.set(key, {
      data: value,
      isLoading: false,
      acquireTimestamp: undefined,
      staleTimestamp: currDate.getTime() + staleTimeMs,
    } as CacheEntry<T>);
    this.withTracing &&
      console.log(
        "🐾 ~ cache-manager ~ set key '%s', cache size: %i",
        key,
        this.cache.size,
      );
  }

  private isExpired<T = any>(key: string, value: CacheEntry<T>): boolean {
    const currDate = new Date();
    const result =
      value.staleTimestamp !== undefined &&
      value.staleTimestamp <= currDate.getTime();
    return result;
  }

  private isAcquireExpired<T = any>(
    key: string,
    value: CacheEntry<T>,
  ): boolean {
    const currDate = new Date();
    const result =
      value.acquireTimestamp !== undefined &&
      value.acquireTimestamp <= currDate.getTime();
    return result;
  }

  private isValid<T = any>(key: string, value: CacheEntry<T>): boolean {
    const isExpired = this.isExpired(key, value);
    const isAcquireExpired = this.isAcquireExpired(key, value);
    this.withTracing &&
      console.log(
        "🐾 ~ cache-manager ~ key: '%s', isExpired: '%s', isAcquireExpired: '%s' isAcquireExpired:",
        key,
        isExpired,
        isAcquireExpired,
      );
    return !isExpired && !isAcquireExpired;
  }

  private invalidate(key: string) {
    if (!this.cache.has(key)) return;
    this.withTracing &&
      console.log("🐾 ~ cache-manager ~ invalidating the item with key:", key);
    this.cache.delete(key);
  }

  private evict(): boolean {
    if (this.cache.size < this.sizeLimit) return true;

    if (this.withTracing) {
      console.log(
        "🐾 ~ cache-manager ~ evicting cache as cache size limit achieved %i",
        this.sizeLimit,
      );
    }
    const evictionKey = this.evictionStrategy?.findKey(this.cache);
    if (evictionKey === undefined) {
      console.warn(
        "⚠️ ~ cache-manager ~ Coluld not obtain any key for the eviction operation from the cache.",
      );
      return false;
    }

    this.invalidate(evictionKey);
    return true;
  }

  private async validateLoading<T = any>(
    key: string,
    value: CacheEntry<T>,
  ): Promise<boolean> {
    if (!value.isLoading) return true;
    const result = await delayWithRetry(
      CACHE_LOAD_RETRY_DELAY_MS,
      CACHE_LOAD_RETRY_ATTEMPS,
      () => (this.cache.get(key) as CacheEntry<T>).isLoading === false,
    );

    if (this.withTracing) {
      console.log(
        "🐾 ~ cache-manager ~ validate that loading of cache item with key '%s' is finished: %s",
        key,
        result,
      );
    }
    return result;
  }

  private async acquireLock(key: string): Promise<Error | undefined> {
    await this.binaryLock.acquire();
    try {
      if (this.cache.size >= this.sizeLimit && !this.evict()) {
        const errorMessage = `Failed to acquire lock for cache item with key '${key}' because cache is full and eviction strategy failed`;
        console.error("❌ ~ cache-manager ~ %s", errorMessage);
        return new Error(errorMessage);
      }
      const currDate = new Date();
      this.cache.set(key, {
        isLoading: true,
        acquireTimestamp: currDate.getTime() + CACHE_ITEM_LOCK_TIMEOUT_1MN,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error("❌ ~ cache-manager ~ %s", errorMessage);
      return new Error(
        `Failed to acquire lock for cache item with key '${key}, see error details below: ${errorMessage}`,
      );
    } finally {
      this.binaryLock.release();
    }
  }

  async get<T = any>(key: string): Promise<CacheResult<T>> {
    this.withTracing &&
      console.log(
        "🐾 ~ cache-manager ~ obtaining cache item with key '%s'",
        key,
      );

    const cacheEntry = this.cache.has(key)
      ? (this.cache.get(key) as CacheEntry<T>)
      : undefined;

    const nonValid =
      cacheEntry !== undefined && this.isValid(key, cacheEntry) === false;

    if (cacheEntry === undefined || nonValid) {
      if (nonValid) this.invalidate(key);
      const error = await this.acquireLock(key);
      return {
        error,
        set:
          error === undefined
            ? (value: T, staleTimeMs: number) =>
                this.set<T>(key, value, staleTimeMs)
            : undefined,
        clearSetLock:
          error === undefined ? () => this.invalidate(key) : undefined,
      } as CacheResult<T>;
    }

    if (
      cacheEntry.isLoading &&
      (await this.validateLoading(key, cacheEntry)) === false
    ) {
      const errorMessage = `Failed to get cache item with the key '${key}' because it has been locked for retrieval by another request and not resolved in expected time.`;
      console.error("~ cacheManager ~ %s", errorMessage);
      return {
        error: new Error(errorMessage),
      } as CacheResult<T>;
    }

    this.withTracing &&
      console.log(
        "🐾 ~ cache-manager ~ get key '%s', expire on '%s'",
        key,
        cacheEntry.staleTimestamp
          ? new Date(cacheEntry.staleTimestamp).toLocaleString()
          : "NA",
      );

    return {
      value: cacheEntry.data,
    } as CacheResult<T>;
  }

  getSize(): number {
    return this.cache.size;
  }

  getSizeLimit(): number {
    return this.sizeLimit;
  }

  contains(key: string): boolean {
    this.withTracing &&
      console.log(
        "🐾 ~ cache-manager ~ checking that cache contains item with key '%s'",
        key,
      );

    let item = this.cache.has(key) ? this.cache.get(key) : undefined;
    if (item !== undefined && !this.isValid(key, item)) {
      this.invalidate(key);
      item = undefined;
    }
    return item !== undefined;
  }

  containsInvalid(): boolean {
    return this.cache
      .entries()
      .some(([key, value]) => !this.isValid(key, value));
  }

  revalidate(): boolean {
    if (!this.containsInvalid()) return false;

    const currentSize = this.cache.size;
    this.cache.entries().forEach(([key, value]) => {
      if (!this.isValid(key, value)) this.invalidate(key);
    });

    if (currentSize < this.cache.size && this.withTracing) {
      console.log(
        "🐾 ~ cache-manager ~ revalidate completed, the number of removed items: %i",
        currentSize - this.cache.size,
      );
    }

    return true;
  }

  reset() {
    this.cache.clear();
    this.withTracing &&
      console.log(
        "🐾 ~ cache-manager ~ reset completed, the number of all items: %i",
        this.cache.size,
      );
  }

  terminate() {
    this.cache.clear();
  }
}

export { CacheManager };
