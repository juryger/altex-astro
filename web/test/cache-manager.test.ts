import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import { CacheManager } from "../src/core/services/cache/cacheManager";
import productColors from "./data/product-colors.json" with { type: "json" };
import type { ProductColor } from "../src/core/models/product-color";
import {
  CACHE_ITEM_LOCK_TIMEOUT_1MN,
  CacheKeys,
} from "../src/core/const/cache";
import type { Category } from "../src/core/models/category";
import type { MeasurementUnit } from "../src/core/models/measurement-unit";
import { type Discount } from "@/lib/domain/";

const CACHE_STALTE_TIME_MS = 10000;
const CACHE_SIZE_LIMIT = 5;

describe("Cache manager", () => {
  const cacheManager = CacheManager.instance({
    sizeLimit: CACHE_SIZE_LIMIT,
    withTracing: true,
  });
  const controller = new AbortController();
  //const signal = controller.signal;

  beforeAll(() => {
    console.log("Cache manager test suite init ...");
  });

  afterAll(() => {
    console.log("Finalizing cache store ...");
    cacheManager.terminate();
    controller.abort();
  });

  beforeEach(() => {});

  afterEach(() => {});

  test(`Get item which is missed in cache`, () => {
    const colors = cacheManager.contains(CacheKeys.ProductColors);
    expect(colors).toBe(false);
  });

  test(`Add new item and retrieve it immediately`, async () => {
    let getResult = await cacheManager.get<ProductColor[]>(
      CacheKeys.ProductColors,
    );
    expect(getResult.value).toBeUndefined();
    expect(getResult.error).toBeUndefined();
    expect(getResult.set).toBeDefined();

    if (getResult.set) {
      getResult.set(productColors, CACHE_STALTE_TIME_MS);
      expect(cacheManager.contains(CacheKeys.ProductColors)).toBe(true);
      expect(cacheManager.getSize()).toBe(1);
    }

    getResult = await cacheManager.get<ProductColor[]>(CacheKeys.ProductColors);
    expect(getResult.value).toBeDefined();
    expect(getResult.error).toBeUndefined();
    expect(getResult.set).toBeUndefined();
  });

  test(`Get cache item after stale timeout`, async () => {
    const getResult = await cacheManager.get<ProductColor[]>(
      CacheKeys.ProductColors,
    );
    expect(getResult.value).toBeDefined();
    expect(getResult.error).toBeUndefined();
    expect(getResult.set).toBeUndefined();
    expect(cacheManager.getSize()).toBe(1);

    vi.useFakeTimers();
    vi.advanceTimersByTime(CACHE_STALTE_TIME_MS);
    expect(cacheManager.contains(CacheKeys.ProductColors)).toBe(false);
    expect(cacheManager.getSize()).toBe(0);
    vi.useRealTimers();
  });

  test(`Get cache item, then skip setting value and try to obtain item again immediately`, async () => {
    let getResult = await cacheManager.get<ProductColor[]>(
      CacheKeys.ProductColors,
    );
    expect(getResult.value).toBeUndefined();
    expect(getResult.error).toBeUndefined();
    expect(getResult.set).toBeDefined();
    expect(cacheManager.getSize()).toBe(1);
    expect(cacheManager.contains(CacheKeys.ProductColors)).toBe(true);

    getResult = await cacheManager.get<ProductColor[]>(CacheKeys.ProductColors);
    expect(getResult.value).toBeUndefined();
    expect(getResult.set).toBeUndefined();
    expect(getResult.error).toBeDefined();
    expect(getResult.error?.message).toContain(
      "locked for retrieval by another request",
    );
  });

  test(`Get cache item, then skip setting value and try to obtain item again after lock timeout`, async () => {
    expect(cacheManager.getSize()).toBe(1);
    expect(cacheManager.contains(CacheKeys.ProductColors)).toBe(true);

    vi.useFakeTimers();
    vi.advanceTimersByTime(CACHE_ITEM_LOCK_TIMEOUT_1MN);
    expect(cacheManager.contains(CacheKeys.ProductColors)).toBe(false);
    expect(cacheManager.getSize()).toBe(0);
    vi.useRealTimers();
  });

  test(`Set number of cache items which exceeds the cache size '${CACHE_SIZE_LIMIT}' with evicting the least recent item`, async () => {
    vi.useFakeTimers();
    expect(cacheManager.getSize()).toBe(0);
    await cacheManager.get<ProductColor[]>(CacheKeys.ProductColors);
    vi.advanceTimersByTime(1000);
    await cacheManager.get<MeasurementUnit[]>(CacheKeys.MeasurementUnits);
    vi.advanceTimersByTime(1000);
    await cacheManager.get<Discount[]>(CacheKeys.Discounts);
    vi.advanceTimersByTime(1000);
    await cacheManager.get<Category[]>(CacheKeys.CategoriesAll);
    vi.advanceTimersByTime(1000);
    await cacheManager.get<Category[]>(CacheKeys.CategoriesRoot);
    vi.advanceTimersByTime(1000);
    await cacheManager.get<number>(`${CacheKeys.CategoriesParent}:zamk`);
    vi.advanceTimersByTime(1000);
    const getResult = await cacheManager.get<number>(
      `${CacheKeys.CategoriesParent}:lich`,
    );
    vi.useRealTimers();

    expect(cacheManager.getSize()).toBe(5);
    expect(getResult.value).toBeUndefined();
    expect(getResult.set).toBeDefined();
    expect(getResult.error).toBeUndefined();

    let containsCheck = cacheManager.contains(CacheKeys.CategoriesRoot);
    expect(containsCheck).toBe(false);
    containsCheck = cacheManager.contains(CacheKeys.CategoriesParent + ":lich");
    expect(containsCheck).toBe(true);
  });
});
