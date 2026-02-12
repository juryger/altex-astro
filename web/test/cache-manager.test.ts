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
import { CACHE_ITEM_LOCK_TIMEOUT_MS } from "../src/core/const/cache";
import type { Category } from "../src/core/models/category";
import type { MeasurementUnit } from "../src/core/models/measurement-unit";
import type { Discount } from "../src/core/models/discount";

const DEFAULT_STALTE_TIME_MS = 10000;
const CACHE_SIZE_LIMIT = 5;
const PRODUCT_COLORS_KEY = "product-colors";
const MEASUREMENT_UNITS_KEY = "measurement-units";
const DISCOUNTS_KEY = "discounts";
const CATEGORIES_ALL_KEY = "categories:all";
const CATEGORIES_ALL_COUNT_KEY = "categories:all:count";
const CATEGORIES_ROOT_KEY = "categories:root";
const CATEGORIES_ROOT_COUNT_KEY = "categories:root:count";

describe("Cache manager", () => {
  const cacheManager = CacheManager.instance(CACHE_SIZE_LIMIT, true);
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
    const colors = cacheManager.contains(PRODUCT_COLORS_KEY);
    expect(colors).toBe(false);
  });

  test(`Add new item and retrieve it immediately`, async () => {
    let getResult = await cacheManager.get<ProductColor[]>(PRODUCT_COLORS_KEY);
    expect(getResult.value).toBeUndefined();
    expect(getResult.error).toBeUndefined();
    expect(getResult.set).toBeDefined();

    if (getResult.set) {
      getResult.set(productColors, DEFAULT_STALTE_TIME_MS);
      expect(cacheManager.contains(PRODUCT_COLORS_KEY)).toBe(true);
      expect(cacheManager.getSize()).toBe(1);
    }

    getResult = await cacheManager.get<ProductColor[]>(PRODUCT_COLORS_KEY);
    expect(getResult.value).toBeDefined();
    expect(getResult.error).toBeUndefined();
    expect(getResult.set).toBeUndefined();
  });

  test(`Get cache item after stale timeout`, async () => {
    const getResult =
      await cacheManager.get<ProductColor[]>(PRODUCT_COLORS_KEY);
    expect(getResult.value).toBeDefined();
    expect(getResult.error).toBeUndefined();
    expect(getResult.set).toBeUndefined();
    expect(cacheManager.getSize()).toBe(1);

    vi.useFakeTimers();
    vi.advanceTimersByTime(DEFAULT_STALTE_TIME_MS);
    expect(cacheManager.contains(PRODUCT_COLORS_KEY)).toBe(false);
    expect(cacheManager.getSize()).toBe(0);
    vi.useRealTimers();
  });

  test(`Get cache item, then skip setting value and try to obtain item again immediately`, async () => {
    let getResult = await cacheManager.get<ProductColor[]>(PRODUCT_COLORS_KEY);
    expect(getResult.value).toBeUndefined();
    expect(getResult.error).toBeUndefined();
    expect(getResult.set).toBeDefined();
    expect(cacheManager.getSize()).toBe(1);
    expect(cacheManager.contains(PRODUCT_COLORS_KEY)).toBe(true);

    getResult = await cacheManager.get<ProductColor[]>(PRODUCT_COLORS_KEY);
    expect(getResult.value).toBeUndefined();
    expect(getResult.set).toBeUndefined();
    expect(getResult.error).toBeDefined();
    expect(getResult.error?.message).toContain(
      "locked for retrieval by another request",
    );
  });

  test(`Get cache item, then skip setting value and try to obtain item again after lock timeout`, async () => {
    expect(cacheManager.getSize()).toBe(1);
    expect(cacheManager.contains(PRODUCT_COLORS_KEY)).toBe(true);

    vi.useFakeTimers();
    vi.advanceTimersByTime(CACHE_ITEM_LOCK_TIMEOUT_MS);
    expect(cacheManager.contains(PRODUCT_COLORS_KEY)).toBe(false);
    expect(cacheManager.getSize()).toBe(0);
    vi.useRealTimers();
  });

  test(`Set cache items number exceeding the cache size of ${CACHE_SIZE_LIMIT} with evicting the least recent item`, async () => {
    expect(cacheManager.getSize()).toBe(0);
    await cacheManager.get<ProductColor[]>(PRODUCT_COLORS_KEY);
    await cacheManager.get<MeasurementUnit[]>(MEASUREMENT_UNITS_KEY);
    await cacheManager.get<Discount[]>(DISCOUNTS_KEY);
    await cacheManager.get<Category[]>(CATEGORIES_ALL_KEY);
    await cacheManager.get<number>(CATEGORIES_ALL_COUNT_KEY);
    await cacheManager.get<Category[]>(CATEGORIES_ROOT_KEY);
    const getResult = await cacheManager.get<number>(CATEGORIES_ROOT_COUNT_KEY);
    expect(cacheManager.getSize()).toBe(5);
    expect(getResult.value).toBeUndefined();
    expect(getResult.set).toBeDefined();
    expect(getResult.error).toBeUndefined();

    let containsCheck = cacheManager.contains(PRODUCT_COLORS_KEY);
    expect(containsCheck).toBe(false);
    containsCheck = cacheManager.contains(MEASUREMENT_UNITS_KEY);
    expect(containsCheck).toBe(false);
    containsCheck = cacheManager.contains(DISCOUNTS_KEY);
    expect(containsCheck).toBe(true);
    containsCheck = cacheManager.contains(CATEGORIES_ROOT_COUNT_KEY);
    expect(containsCheck).toBe(true);
  });
});
