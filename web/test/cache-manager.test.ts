import {
  afterAll,
  afterEach,
  assert,
  beforeAll,
  beforeEach,
  describe,
  it,
  vi,
} from "vitest";
import { CacheManager } from "../src/core/services/cache/cacheManager";

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
  // - 01: Get cache item which is not exists... should be empty
  // - 02: Add cache item and retrieve it afterwards... should be valid item
  // - 03: Add cache item and retrieve it after staleTimeMs... should be empty
  // - 04: Acquire cache item set, delay execution, acquire same item set again... should be Failed with loading error
  // - 05: Acquire cache item set, delay execution, get item... should be empty Failed with loading error
  // - 06: Acquire cache item set, delay execution until acquire timeout, get item... should be empty
  // - 07: Add many cache items (up to cache limit), add one more... should be added with eviction of least recent one
});
