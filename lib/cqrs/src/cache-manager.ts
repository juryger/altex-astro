import type { CacheEntry, CacheEvictionStrategy } from "@/lib/domain";
import {
  EnvironmentNames,
  getErrorMessage,
  regexTrue,
  selectEnvironment,
} from "@/lib/domain";
import {
  CACHE_ITEMS_LIMIT,
  CACHE_LOAD_RETRY_ATTEMPS,
  CACHE_LOAD_RETRY_DELAY_MS,
  CACHE_ITEM_LOCK_TIMEOUT_1MN,
} from "@/lib/domain";
import { delayWithRetry } from "@/lib/domain";
import { getMostRecentEvictionStrategy } from "./cache/eviction/most-recent-eviction";

type CacheResult<T = any> = {
  value?: T;
  error?: Error;
  set?: (value: T, staleTimeMs: number) => void;
  clearSetLock?: () => void;
};

interface BaseCacheManager {
  contains: (key: string) => boolean;
  get: <T = any>(key: string) => Promise<CacheResult<T>>;
  getSize: () => number;
  getSizeLimit: () => number;
  containsInvalid: () => boolean;
  revalidate: () => boolean;
  reset: () => void;
  terminate: () => void;
}

class CacheManager implements BaseCacheManager {
  private static __instance: CacheManager;
  private sizeLimit: number;
  private withTracing: boolean;
  private cache: Map<string, CacheEntry<any>> = new Map();
  private evictionStrategy: CacheEvictionStrategy | undefined;

  constructor(
    evictionStrategy: CacheEvictionStrategy,
    sizeLimit: number,
    withTracing: boolean,
  ) {
    this.evictionStrategy = evictionStrategy;
    this.sizeLimit = sizeLimit;
    this.withTracing = withTracing;
  }

  static instance({
    evictionStrategy = getMostRecentEvictionStrategy(),
    sizeLimit = CACHE_ITEMS_LIMIT,
    withTracing = false,
  }: {
    evictionStrategy?: CacheEvictionStrategy;
    sizeLimit?: number;
    withTracing?: boolean;
  }) {
    if (!CacheManager.__instance) {
      CacheManager.__instance = new CacheManager(
        evictionStrategy,
        sizeLimit,
        withTracing,
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
        "🐾 ~ cacheManager ~ set key '%s' with value %o, length %i",
        key,
        value,
        this.cache.size,
      );
  }

  private isExpired<T = any>(key: string, value: CacheEntry<T>): boolean {
    const currDate = new Date();
    const result =
      value.staleTimestamp !== undefined &&
      value.staleTimestamp <= currDate.getTime();
    this.withTracing &&
      console.log("🐾 ~ cacheManager ~ '%s' isExpired:", key, result);
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
    this.withTracing &&
      console.log("🐾 ~ cacheManager ~ '%s' isAcquireExpired:", key, result);
    return result;
  }

  private isValid<T = any>(key: string, value: CacheEntry<T>): boolean {
    return !this.isExpired(key, value) && !this.isAcquireExpired(key, value);
  }

  private invalidate(key: string) {
    if (!this.cache.has(key)) return;
    this.withTracing &&
      console.log("🐾 ~ cacheManager ~ invalidating the item with key:", key);
    this.cache.delete(key);
  }

  private evict(): boolean {
    if (this.cache.size < this.sizeLimit) return true;

    if (this.withTracing) {
      console.log(
        "🐾 ~ cacheManager ~ evicting cache as cache size limit achieved %i, %o",
        this.sizeLimit,
        this.cache.entries().toArray(),
      );
    }
    const evictionKey = this.evictionStrategy?.findKey(this.cache);
    if (evictionKey === undefined) {
      console.warn(
        "~ cacheManager ~ Coluld not obtain any key for the eviction operation from the cache.",
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
        "🐾 ~ cacheManager ~ validate that loading of cache item with key '%s' is finished: %s",
        key,
        result,
      );
    }
    return result;
  }

  private aqcuireLock(key: string): Error | undefined {
    if (this.cache.size >= this.sizeLimit && !this.evict()) {
      const errorMessage = `Failed to acquire lock for cache item with key '${key}' because cache is full and eviction strategy failed`;
      console.error("~ cacheManager ~ %s", errorMessage);
      return new Error(errorMessage);
    }

    try {
      const currDate = new Date();
      this.cache.set(key, {
        isLoading: true,
        acquireTimestamp: currDate.getTime() + CACHE_ITEM_LOCK_TIMEOUT_1MN,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error("~ cacheManager ~ %s", errorMessage);
      return new Error(
        `Failed to acquire lock for cache item with key '${key}, see error details below: ${errorMessage}`,
      );
    }
  }

  async get<T = any>(key: string): Promise<CacheResult<T>> {
    this.withTracing &&
      console.log(
        "🐾 ~ cacheManager ~ obtaining cache item with key '%s'",
        key,
      );

    const cacheEntry = this.cache.has(key)
      ? (this.cache.get(key) as CacheEntry<T>)
      : undefined;

    const nonValid =
      cacheEntry !== undefined && this.isValid(key, cacheEntry) === false;

    if (cacheEntry === undefined || nonValid) {
      if (nonValid) this.invalidate(key);
      const error = this.aqcuireLock(key);
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
        "🐾 ~ cacheManager ~ get key '%s', expire on '%s'",
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
        "🐾 ~ cacheManager ~ checking that cache contains item with key '%s'",
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
        "🐾 ~ cacheManager ~ revalidate completed, the number of removed items: %i",
        currentSize - this.cache.size,
      );
    }

    return true;
  }

  reset() {
    this.cache.clear();
    this.withTracing &&
      console.log(
        "🐾 ~ cacheManager ~ reset completed, the number of all items: %i",
        this.cache.size,
      );
  }

  terminate() {
    this.cache.clear();
  }
}

export { type CacheResult, CacheManager };
