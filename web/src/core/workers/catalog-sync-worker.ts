import {
  CatalogSyncType,
  type CatalogSyncStatus,
} from "../models/catalog-sync";
import { getCatalogSyncHandler } from "./catalog-sync-handler";

self.onmessage = async (e) => {
  const command = e.data as CatalogSyncType;
  if (!e.data || !command) {
    console.error(
      "🛠️ ~ catalog-sync-worker ~ received unsupported command:",
      e
    );
    return;
  }

  const syncStatus: CatalogSyncStatus = {
    syncType: command,
    resultMessage: "",
  };

  const handler = getCatalogSyncHandler({
    apiBaseUrl: `${import.meta.env.PUBLIC_API_BASE_URL}`,
  });

  try {
    switch (command) {
      case CatalogSyncType.Sync:
        await handler
          .syncCategories()
          .then(() => handler.syncUnitOfMeasurements())
          .then(() => handler.syncProductColors());
        syncStatus.resultMessage =
          "Catalog data has been added to local cache.";
        break;
      case CatalogSyncType.CleanUpCache:
        await handler.cleanUpCache();
        syncStatus.resultMessage =
          "Catalog data has been removed from local cache.";
        break;
      default:
        syncStatus.resultMessage = `recieved unsupported command ${command}.`;
        console.error(
          "🛠️ ~ catalog-sync-worker ~ %s",
          syncStatus.resultMessage
        );
        break;
    }
  } catch (error: any) {
    console.error("🛠️ ~ catalog-sync-worker ~ failed to sync catalog", error);
    throw new Error(`Failed to sync catalog: ${(error as Error).message}`);
  }

  self.postMessage(syncStatus);
};
