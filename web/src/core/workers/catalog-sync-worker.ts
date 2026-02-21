import { getCatalogSyncHandler, type CatalogSyncStatus } from ".";
import { CatalogSyncType } from "../const";

const SyncComplete = "Catalog data has been saved to IndexedDB.";
const SyncFailed = "Failed to save catalog data to IndexedDB";
const CleanUpComplete = "Catalog data has been removed from IndexedDB.";
const SyncUnsupprtedCommand = "Cannot process unsupported command";

self.onmessage = async (e) => {
  const command = e.data as CatalogSyncType;
  if (!e.data || !command) {
    console.error(
      "🛠️ ~ catalog-sync-worker ~ required input parameter does not have value:",
      e,
    );
    return;
  }

  const syncStatus: CatalogSyncStatus = {
    syncType: command,
    resultMessage: "",
  };

  const handler = getCatalogSyncHandler({
    baseUrl: `${import.meta.env.PUBLIC_API_BASE_URL}`,
  });

  try {
    switch (command) {
      case CatalogSyncType.Cache:
        const result = await Promise.all([
          handler.syncCategories(),
          handler.syncDiscounts(),
          handler.syncProductColors(),
        ]);
        syncStatus.resultMessage = SyncComplete;
        console.info(
          "🛠️ ~ catalog-sync-worker ~ catalog references has been saved to IndexedDB, number of synced records:",
          result.reduce((acc, curr) => acc + curr, 0),
        );
        break;
      case CatalogSyncType.CleanUp:
        await handler.cleanUpCache();
        syncStatus.resultMessage = CleanUpComplete;
        break;
      default:
        syncStatus.resultMessage = SyncUnsupprtedCommand + `: ${command}.`;
        console.error(
          "🛠️ ~ catalog-sync-worker ~ %s",
          syncStatus.resultMessage,
        );
        break;
    }
  } catch (error: any) {
    console.error(
      "🛠️ ~ catalog-sync-worker ~ failed to sync reference data:",
      error,
    );
    syncStatus.syncType = CatalogSyncType.Failure;
    syncStatus.resultMessage = SyncFailed;
  }

  self.postMessage(syncStatus);
};
