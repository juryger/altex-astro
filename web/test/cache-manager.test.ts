import {
  afterAll,
  afterEach,
  assert,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  test,
  vi,
} from "vitest";
import {
  CacheManager,
  type CacheGetResult,
} from "../src/core/services/cache/cacheManager";
import productColors from "./data/product-colors.json" with { type: "json" };
import type { ProductColor } from "../src/core/models/product-color";

const DEFAULT_STALTE_TIME_MS = 10000;

// NOTE: There are no caching of Filtered and Paged requests
const PRODUCT_COLORS_KEY = "product-colors";
const MEASUREMENT_UNITS_KEY = "measurement-units";
const DISCOUNTS_KEY = "discounts";
const CATEGORIES_ALL_KEY = "categories:all";
const CATEGORIES_ALL_COUNT_KEY = "categories:all:count";
const CATEGORIES_ROOT_KEY = "categories:root";
const CATEGORIES_ROOT_COUNT_KEY = "categories:root:count";
const CATEGORIES_ZAMK_KEY = "categories:zamki";
const CATEGORIES_ZAMK_COUNT_KEY = "categories:zamki:count";
const CATEGORIES_ZAMK_PRODUCTS_KEY =
  "categories:zamki:products:sort_field:sort_order";
const CATEGORIES_ZAMK_PRODUCTS_COUNT_KEY = "categories:zamki:products:count";

describe("Cache manager", () => {
  const cacheManager = CacheManager.instance(true);
  const controller = new AbortController();
  //const signal = controller.signal;

  beforeAll(() => {
    console.log("Cache manager test suite init ...");
    vi.useFakeTimers();
  });

  afterAll(() => {
    console.log("Finalizing cache store ...");
    vi.useRealTimers();
    cacheManager.terminate();
    controller.abort();
  });

  beforeEach(() => {});

  afterEach(() => {});

  // 01: Get cache item which does not exist... should return status NotAvailable
  test(`Get item which is missed in cache`, () => {
    const colors = cacheManager.contains(PRODUCT_COLORS_KEY);
    expect(colors).toBe(false);
  });

  // 02: Add new cache item and retrieve it afterwards... should return non-empty value with status Retrieved
  test(`Add new item and retrieve it afterwards`, async () => {
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

  // 03: Add cache item and retrieve it after staleTime... should be empty
  test(`Get cache item after staleTime`, async () => {
    const getResult =
      await cacheManager.get<ProductColor[]>(PRODUCT_COLORS_KEY);
    expect(getResult.value).toBeDefined();
    expect(getResult.error).toBeUndefined();
    expect(getResult.set).toBeUndefined();
    expect(cacheManager.getSize()).toBe(1);

    vi.advanceTimersByTime(DEFAULT_STALTE_TIME_MS);

    expect(cacheManager.contains(PRODUCT_COLORS_KEY)).toBe(false);
    expect(cacheManager.getSize()).toBe(0);
  });

  // - 04: Acquire cache item set, delay execution, acquire same item set again... should be Failed with loading error
  // - 05: Acquire cache item set, delay execution, get item... should be empty Failed with loading error
  // - 06: Acquire cache item set, delay execution until acquire timeout, get item... should be empty
  // - 07: Add many cache items (up to cache limit), add one more... should be added with eviction of least recent one
});
