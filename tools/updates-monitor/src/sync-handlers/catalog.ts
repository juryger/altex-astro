import { SyncTypes } from "@/lib/domain";
import { type BaseSyncHandler } from "../core";
import type { CatalogUpdates } from "../models/catalog";

const getCatalogSyncHandler = (): BaseSyncHandler => {
  return {
    getSyncType: () => SyncTypes.Catalog,
    synchronise: async (
      monitorDirPath: string,
      data: CatalogUpdates,
    ): Promise<void> => {
      return Promise.reject("CatalogSyncHandler not implemented");
    },
  };
};

export { getCatalogSyncHandler };
