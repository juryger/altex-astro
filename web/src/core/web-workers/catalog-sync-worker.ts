import { regexTrue } from "@/lib/domain/src";
import { getCatalogSyncHandler, type CatalogSyncStatus } from ".";
import { CatalogSyncType } from "../const";

const SyncComplete = "Catalog data has been saved to IndexedDB.";
const SyncFailed = "Failed to save catalog data to IndexedDB";
const CleanUpComplete = "Catalog data has been removed from IndexedDB.";
const SyncUnsupprtedCommand = "Cannot process unsupported command";

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
  const syncStatus: CatalogSyncStatus = {
    syncType: command,
    syncData: undefined,
    resultMessage: "",
  };
  try {
    switch (command) {
      case CatalogSyncType.Replica:
        syncStatus.syncData = await getReplicaDate();
        break;
      case CatalogSyncType.Cache:
        const isOk = await syncReferences();
        syncStatus.resultMessage = isOk ? SyncComplete : SyncFailed;
        syncStatus.syncData = await getReplicaDate();
        break;
      case CatalogSyncType.CleanUp:
        await handler.cleanUpCache();
        syncStatus.resultMessage = CleanUpComplete;
        break;
      default:
        syncStatus.resultMessage = SyncUnsupprtedCommand + `: ${command}.`;
        console.error(
          "❌ ~ catalog-sync-worker ~ %s",
          syncStatus.resultMessage,
        );
        break;
    }
  } catch (error: any) {
    console.error(
      "❌ ~ catalog-sync-worker ~ failed to sync reference data: %o",
      error,
    );
    withTracing &&
      console.info(
        "🐾 ~ catalog-sync-worker ~ preapre to clean up cache and sync again.",
      );
    await handler.deleteDb(true);
    const isOk = await syncReferences(true);
    syncStatus.syncType = isOk
      ? CatalogSyncType.Cache
      : CatalogSyncType.Failure;
    syncStatus.resultMessage = isOk ? SyncComplete : SyncFailed;
    syncStatus.syncData = await getReplicaDate(true);
  }
  withTracing &&
    console.log("🐾 ~ catalog-sync-worker ~ sending response %o", syncStatus);
  self.postMessage(syncStatus);
};

const getReplicaDate = async (
  preventException: boolean = false,
): Promise<Date | undefined> => {
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
    if (!preventException) throw error;
    return undefined;
  }
};

const syncReferences = async (
  preventException: boolean = false,
): Promise<boolean> => {
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
    return true;
  } catch (error) {
    console.error(
      "❌ ~ catalog-sync-worker ~ failed to sync references %o",
      error,
    );
    if (!preventException) throw error;
    return false;
  }
};
