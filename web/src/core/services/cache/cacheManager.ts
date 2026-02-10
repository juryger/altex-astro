import type {
  CacheEntry,
  CacheEvictionStrategy,
} from "@/web/src/core/models/cache";
import { getLeasRecentEvictionStrategy } from "./eviction/leastRecentEviction";
import { delayWithRetry } from "@/web/src/core/utils/delays";

const LOAD_RETRY_ATTEMPS = 1;
const LOAD_RETRY_DELAY_MS = 300;
const ACQUIRE_SET_TIMEOUT_MS = 60000;
const CACHE_ITEMS_COUNT_LIMIT = 20;

type CacheGetResult<T = any> = {
  status: "Failed" | "NotAvailable" | "Retrieved";
  value?: T;
  failedReason?: string;
};

type CacheAcquireSetResult<T = any> = {
  status: "Failed" | "Acquired" | "Retrieved";
  value?: T;
  failedReason?: string;
  set?: (value: T, staleTimeMs: number) => void;
};

export interface BaseCacheManager {
  get: <T = any>(key: string) => Promise<CacheGetResult<T>>;
  //getOrSet: <T = any>(key: string, queryFn: () => Promise<T>, staleTimeMs: number) => Promise<T>;
  acquireSet: <T = any>(key: string) => Promise<CacheAcquireSetResult<T>>;
  size: () => number;
  finalize: () => void;
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
      console.log("🐾 ~ cacheManager ~ set key '%s' with value %o", key, value);
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
    const entry = this.cache.get(key);
    if (entry === undefined) return;

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
    console.log(
      "~ cacheManager ~ The cache item with the name '%s' has been evicted.",
    );
    return true;
  }

  private async validateLoading<T = any>(
    key: string,
    value: CacheEntry<T>,
  ): Promise<boolean> {
    if (!value.isLoading) return false;

    return await delayWithRetry(
      LOAD_RETRY_DELAY_MS,
      LOAD_RETRY_ATTEMPS,
      () => (this.cache.get(key) as CacheEntry<T>).isLoading === false,
    );
  }

  async get<T = any>(key: string): Promise<CacheGetResult<T>> {
    if (!this.cache.has(key)) return { status: "NotAvailable" };

    const cacheEntry = this.cache.get(key) as CacheEntry<T> | undefined;
    if (cacheEntry && !this.isValid(cacheEntry)) {
      this.invalidate(key);
      return { status: "NotAvailable" };
    }

    if (cacheEntry && !cacheEntry.isLoading) {
      if (this.withTracing) {
        console.log(
          "🐾 ~ cacheManager ~ get key '%s' value %o, expire on '%s'",
          key,
          cacheEntry.data,
          cacheEntry.staleTimestamp
            ? new Date(cacheEntry.staleTimestamp).toLocaleString()
            : "NA",
        );
      }
      return {
        status: "Retrieved",
        value: cacheEntry.data,
      };
    }

    if (cacheEntry && !this.validateLoading(key, cacheEntry)) {
      const message = `Failed to get cache item with the key '${key}' because it has been locked for retrieval by another request and not resolved in expected time.`;
      console.warn("~ cacheManager ~ %s", message);
      return {
        status: "Failed",
        failedReason: message,
      };
    }

    return {
      status: "Retrieved",
      value: (this.cache.get(key) as CacheEntry<T>).data,
    };
  }

  async acquireSet<T = any>(key: string): Promise<CacheAcquireSetResult> {
    let cacheEntry = this.cache.get(key) as CacheEntry<T>;
    if (cacheEntry && !this.isValid(cacheEntry)) {
      this.invalidate(key);
    }

    cacheEntry = this.cache.get(key) as CacheEntry<T>;
    if (cacheEntry && (await this.validateLoading(key, cacheEntry)) === false) {
      const message = `Failed to obtain set operation because the specified key '${key}' has been locked for retrieval by another request and not resolved in expected time.`;
      console.warn("~ cacheManager ~ %s", message);
      return {
        status: "Failed",
        failedReason: message,
      };
    }

    if (this.cache.size >= CACHE_ITEMS_COUNT_LIMIT && !this.evict()) {
      const message =
        "Failed to obtain set operation because cache is full and eviction strategy failed";
      console.warn("~ cacheManager ~ %s", message);
      return {
        status: "Failed",
        failedReason: message,
      };
    }

    try {
      const currDate = new Date();
      this.cache.set(key, {
        isLoading: true,
        acquireTimestamp: currDate.getTime() + ACQUIRE_SET_TIMEOUT_MS,
      });

      return {
        status: "Acquired",
        set: (value: T, staleTimeMs: number) =>
          this.set<T>(key, value, staleTimeMs),
      };
    } catch (error) {
      const message = `Failed to acquire set operation for cache item with key '${key}, see error details below: ${error?.toString()}`;
      console.error("~ cacheManager ~ %s", message);
      return {
        status: "Failed",
        failedReason: message,
      };
    }
  }

  size() {
    return this.cache.size;
  }

  finalize() {
    this.cache.clear();
  }
}

export { CacheManager, type CacheAcquireSetResult, type CacheGetResult };
