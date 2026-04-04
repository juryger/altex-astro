import {
  EnvironmentNames,
  regexTrue,
  selectEnvironment,
} from "@/lib/domain/src";
import { getCatalogSyncHandler, type CatalogSyncStatus } from ".";
import { CatalogSyncType } from "../const";

const SyncComplete = "Catalog data has been saved to IndexedDB.";
const SyncFailed = "Failed to save catalog data to IndexedDB";
const CleanUpComplete = "Catalog data has been removed from IndexedDB.";
const SyncUnsupprtedCommand = "Cannot process unsupported command";

const withTracing = regexTrue.test(
  selectEnvironment(EnvironmentNames.PUBLIC_ENABLE_TRACING),
);

const handler = getCatalogSyncHandler({
  baseUrl: `${import.meta.env.PUBLIC_API_BASE_URL}`,
});

self.onmessage = async (e) => {
  const command = e.data as CatalogSyncType;
  if (!e.data || !command) {
    console.error(
      "🛑 ~ catalog-sync-worker ~ required input parameter does not have value:",
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
        const date = await handler.getReplicaDate();
        withTracing &&
          console.info(
            "🐾 ~ catalog-sync-worker ~ obtained replica date:",
            date,
          );
        syncStatus.syncData = date !== undefined ? date : undefined;
        break;
      case CatalogSyncType.Cache:
        const result = await Promise.all([
          handler.syncCategories(),
          handler.syncDiscounts(),
          handler.syncColors(),
        ]);
        syncStatus.resultMessage = SyncComplete;
        withTracing &&
          console.info(
            "🐾 ~ catalog-sync-worker ~ catalog references has been saved to IndexedDB, number of synced records:",
            result.reduce((acc, curr) => acc + curr, 0),
          );
        const replicaDate = await handler.getReplicaDate();
        withTracing &&
          console.info(
            "🐾 ~ catalog-sync-worker ~ obtained replica date:",
            replicaDate,
          );
        syncStatus.syncData =
          replicaDate !== undefined ? replicaDate : undefined;
        break;
      case CatalogSyncType.CleanUp:
        await handler.cleanUpCache();
        syncStatus.resultMessage = CleanUpComplete;
        break;
      default:
        syncStatus.resultMessage = SyncUnsupprtedCommand + `: ${command}.`;
        console.error(
          "🛑 ~ catalog-sync-worker ~ %s",
          syncStatus.resultMessage,
        );
        break;
    }
  } catch (error: any) {
    console.error(
      "🛑 ~ catalog-sync-worker ~ failed to sync reference data: %o",
      error,
    );
    syncStatus.syncType = CatalogSyncType.Failure;
    syncStatus.resultMessage = SyncFailed;
  }
  withTracing &&
    console.log("🐾 ~ catalog-sync-worker ~ sending response %o", syncStatus);
  self.postMessage(syncStatus);
};
