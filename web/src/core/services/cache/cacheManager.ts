import type {
  CacheEntry,
  CacheEvictionStrategy,
} from "@/web/src/core/models/cache";
import { getLeasRecentEvictionStrategy } from "./eviction/leastRecentEviction";
import { delayWithRetry } from "@/web/src/core/utils/delays";
import { getErrorMessage } from "@/web/src/core/utils/error-parser";

const LOAD_RETRY_ATTEMPS = 1;
const LOAD_RETRY_DELAY_MS = 300;
const ACQUIRE_SET_TIMEOUT_MS = 60000;
const CACHE_ITEMS_COUNT_LIMIT = 20;

type CacheGetResult<T = any> = {
  value?: T;
  error?: Error;
  set?: (value: T, staleTimeMs: number) => void;
};

export interface BaseCacheManager {
  contains: (key: string) => boolean;
  get: <T = any>(key: string) => Promise<CacheGetResult<T>>;
  getSize: () => number;
  terminate: () => void;
}

class CacheManager implements BaseCacheManager {
  private static __instance: CacheManager;
  private withTracing: boolean;
  private cache: Map<string, CacheEntry<any>> = new Map();
  private evictionStrategy: CacheEvictionStrategy | undefined;

  constructor(
    evictionStrategy: CacheEvictionStrategy,
    withTracing: boolean = false,
  ) {
    this.evictionStrategy = evictionStrategy;
    this.withTracing = withTracing;
  }

  static instance(withTracing: boolean = false) {
    if (!CacheManager.__instance) {
      CacheManager.__instance = new CacheManager(
        getLeasRecentEvictionStrategy(),
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
    if (this.withTracing) {
      console.log(
        "🐾 ~ cacheManager ~ set key '%s' with value %o, length %i",
        key,
        value,
        this.cache.size,
      );
    }
  }

  private isExpired<T = any>(value: CacheEntry<T>): boolean {
    const currDate = new Date();
    const result =
      value.staleTimestamp !== undefined &&
      value.staleTimestamp <= currDate.getTime();

    if (this.withTracing) {
      console.log("🐾 ~ cacheManager ~ isExpired:", result);
    }

    return result;
  }

  private isAcquireExpired<T = any>(value: CacheEntry<T>): boolean {
    const currDate = new Date();
    const result =
      value.acquireTimestamp !== undefined &&
      value.acquireTimestamp <= currDate.getTime();

    if (this.withTracing) {
      console.log("🐾 ~ cacheManager ~ isAcquireExpired:", result);
    }

    return result;
  }

  private isValid<T = any>(value: CacheEntry<T>): boolean {
    return !this.isExpired(value) && !this.isAcquireExpired(value);
  }

  private invalidate(key: string) {
    if (!this.cache.has(key)) return;
    if (this.withTracing) {
      console.log("🐾 ~ cacheManager ~ invalidating the item with key:", key);
    }
    this.cache.delete(key);
  }

  private evict(): boolean {
    if (this.cache.size < CACHE_ITEMS_COUNT_LIMIT) return true;

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
    return await delayWithRetry(
      LOAD_RETRY_DELAY_MS,
      LOAD_RETRY_ATTEMPS,
      () => (this.cache.get(key) as CacheEntry<T>).isLoading === false,
    );
  }

  private aqcuireLock(key: string): Error | undefined {
    if (this.cache.size >= CACHE_ITEMS_COUNT_LIMIT && !this.evict()) {
      const errorMessage = `Failed to acquire lock for cache item with key '${key}' because cache is full and eviction strategy failed`;
      console.error("~ cacheManager ~ %s", errorMessage);
      return new Error(errorMessage);
    }

    try {
      const currDate = new Date();
      this.cache.set(key, {
        isLoading: true,
        acquireTimestamp: currDate.getTime() + ACQUIRE_SET_TIMEOUT_MS,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error("~ cacheManager ~ %s", errorMessage);
      return new Error(
        `Failed to acquire lock for cache item with key '${key}, see error details below: ${errorMessage}`,
      );
    }
  }

  async get<T = any>(key: string): Promise<CacheGetResult<T>> {
    const cacheEntry = this.cache.has(key)
      ? (this.cache.get(key) as CacheEntry<T>)
      : undefined;

    const nonValid =
      cacheEntry !== undefined && this.isValid(cacheEntry) === false;

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
      } as CacheGetResult<T>;
    }

    if (
      cacheEntry.isLoading &&
      (await this.validateLoading(key, cacheEntry)) === false
    ) {
      const errorMessage = `Failed to get cache item with the key '${key}' because it has been locked for retrieval by another request and not resolved in expected time.`;
      console.error("~ cacheManager ~ %s", errorMessage);
      return {
        error: new Error(errorMessage),
      } as CacheGetResult<T>;
    }

    if (this.withTracing) {
      console.log(
        "🐾 ~ cacheManager ~ get key '%s', expire on '%s'",
        key,
        cacheEntry.staleTimestamp
          ? new Date(cacheEntry.staleTimestamp).toLocaleString()
          : "NA",
      );
    }
    return {
      value: cacheEntry.data,
    } as CacheGetResult<T>;
  }

  getSize(): number {
    return this.cache.size;
  }

  contains(key: string): boolean {
    let item = this.cache.has(key) ? this.cache.get(key) : undefined;
    if (item !== undefined && !this.isValid(item)) {
      this.invalidate(key);
      item = undefined;
    }
    return item !== undefined;
  }

  terminate() {
    this.cache.clear();
  }
}

export { CacheManager, type CacheGetResult };
