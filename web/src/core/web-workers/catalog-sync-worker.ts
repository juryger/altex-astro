import { regexTrue, getErrorMessage } from "@/lib/domain";
import { getCatalogSyncHandler, type CatalogSyncStatus } from ".";
import { CatalogSyncType } from "../const";

const SyncComplete = "Catalog data has been saved to IndexedDB.";
const SyncFailed = "Failed to save catalog data to IndexedDB.";
const CleanUpComplete = "Catalog data has been removed from IndexedDB.";
const SyncUnsupprtedCommand = "Cannot process unsupported command.";

const withTracing = regexTrue.test(import.meta.env.PUBLIC_ENABLE_TRACING);

const handler = getCatalogSyncHandler({
  baseUrl: `${import.meta.env.PUBLIC_API_BASE_URL}`,
});

self.onmessage = async (e) => {
  const command = e.data as CatalogSyncType;
  if (!e.data || !command) {
    console.error(
      "❌ ~ catalog-sync-worker ~ required input parameter does not have value:",
      e,
    );
    return;
  }
  const result: CatalogSyncStatus = {
    syncType: command,
    syncData: undefined,
    message: "",
  };
  switch (command) {
    case CatalogSyncType.Replica:
      result.syncData = await getReplicaDate();
      break;
    case CatalogSyncType.Cache:
      await syncReferences()
        .then(() => (result.message = SyncComplete))
        .catch((reason) => (result.message = `${SyncFailed} ${reason}`));
      break;
    case CatalogSyncType.CleanUp:
      await resetCacheStore()
        .then(() => (result.message = CleanUpComplete))
        .catch((reason) => (result.message = `${SyncFailed} ${reason}`));
      break;
    default:
      result.message = SyncUnsupprtedCommand + `: ${command}.`;
      console.error("❌ ~ catalog-sync-worker ~ %s", result.message);
      break;
  }
  withTracing &&
    console.log("🐾 ~ catalog-sync-worker ~ sending response %o", result);
  self.postMessage(result);
};

const getReplicaDate = async (): Promise<Date | undefined> => {
  try {
    const date = await handler.getReplicaDate();
    withTracing &&
      console.info("🐾 ~ catalog-sync-worker ~ obtained replica date:", date);
    return date;
  } catch (error) {
    console.error(
      "❌ ~ catalog-sync-worker ~ failed to get replica date %o",
      error,
    );
    return undefined;
  }
};

const resetCacheStore = async (): Promise<void> => {
  try {
    await handler.cleanUpCache();
    withTracing &&
      console.info("🐾 ~ catalog-sync-worker ~ chache store reset");
  } catch (error) {
    console.error(
      "❌ ~ catalog-sync-worker ~ failed to reset cache store. %o",
      error,
    );
    return Promise.reject(getErrorMessage(error));
  }
};

const syncReferences = async (): Promise<void> => {
  try {
    const result = await Promise.all([
      handler.syncCategories(),
      handler.syncDiscounts(),
      handler.syncColors(),
    ]);
    const totalSavedRecords = result.reduce((acc, curr) => acc + curr, 0);
    withTracing &&
      console.info(
        "🐾 ~ catalog-sync-worker ~ catalog references has been saved to IndexedDB, number of synced records:",
        totalSavedRecords,
      );
  } catch (error) {
    console.error(
      "❌ ~ catalog-sync-worker ~ failed to sync references, see more details below. %o",
      error,
    );
    await handler.deleteDb(true);
    return Promise.reject(getErrorMessage(error));
  }
};
