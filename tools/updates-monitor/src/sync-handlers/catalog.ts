import { SyncTypes } from "@/lib/domain";
import { type BaseSyncHandler } from "../core";

const getCatalogSyncHandler = (monitorDirPath: string): BaseSyncHandler => {
  return {
    getSyncType: () => SyncTypes.Catalog,
    synchronise: async (): Promise<void> => {
      return Promise.reject("CatalogSyncHandler not implemented");
    },
  };
};

export { getCatalogSyncHandler };
