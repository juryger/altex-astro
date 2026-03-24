import { SyncTypes } from "@/lib/domain";
import { type BaseSyncHandler } from "../core";
import type { CatalogUpdates } from "../models/catalog";
import { getReadReplicaManager } from "../utils/read-replica-manager";

const readReplicaManager = getReadReplicaManager();

const getCatalogSyncHandler = (): BaseSyncHandler => {
  return {
    getSyncType: () => SyncTypes.Catalog,
    synchronise: async (
      inputDirPath: string,
      data: CatalogUpdates,
    ): Promise<void> => {
      try {
        // TODO: start transaction
        // TODO: Update catalog.db
        // TODO: Create db read replica and set it active
        //readReplicaManager.createDbCopy();
        //readReplicaManager.setActive();
        // TODO: Upload/delete images at S3 store
      } catch (error) {
        // TODO: rollback transaction
        // TODO: delete created read replica file
      }

      return Promise.reject("CatalogSyncHandler not implemented");
    },
  };
};

const updateCatalog = async (data: CatalogUpdates): Promise<void> => {};

export { getCatalogSyncHandler };
