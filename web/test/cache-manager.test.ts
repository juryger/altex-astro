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
import { CacheManager } from "../src/core/services/cache/cacheManager";
import type { ProductColor } from "@/lib/dal/src";

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

// Skip caching of Filtered and Paged request

describe("Cache manager", () => {
  const cacheManager = CacheManager.instance();

  beforeAll(() => {
    console.log("Cache manager test suite init ...");
    vi.useFakeTimers();
  });

  afterAll(() => {
    console.log("Finalizing cache store ...");
    vi.useRealTimers();
    cacheManager.finalize();
  });

  beforeEach(() => {});

  afterEach(() => {});

  // it("foo", () => {
  //   assert.equal(Math.sqrt(4), 2);
  // });

  // Test Cases:
  // - 01: Get cache item which does not exist... should be empty
  test(`Get item which is missed in cache`, async () => {
    const colors = await cacheManager.get<ProductColor[]>(PRODUCT_COLORS_KEY);
    expect(colors).toMatchObject({ status: "NotAvailable" });
  });

  // - 02: Add cache item and retrieve it afterwards... should be valid item
  // - 03: Add cache item and retrieve it after staleTimeMs... should be empty
  // - 04: Acquire cache item set, delay execution, acquire same item set again... should be Failed with loading error
  // - 05: Acquire cache item set, delay execution, get item... should be empty Failed with loading error
  // - 06: Acquire cache item set, delay execution until acquire timeout, get item... should be empty
  // - 07: Add many cache items (up to cache limit), add one more... should be added with eviction of least recent one
});
