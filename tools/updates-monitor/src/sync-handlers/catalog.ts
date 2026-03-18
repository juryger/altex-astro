import { SyncTypes } from "@/lib/domain/src/const";
import { type BaseSyncHandler } from "../core";
import { FailedResult } from "@/lib/domain/src";

const getCatalogSyncHandler = (monitorDirPath: string): BaseSyncHandler => {
  return {
    getType: () => SyncTypes.Catalog,
    synchronise: async () => {
      return FailedResult(new Error("CatalogSyncHandler not implemented"));
    },
  };
};

export { getCatalogSyncHandler };
