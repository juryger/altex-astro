import type { CatalogSyncType } from "../const";

type CatalogSyncStatus = {
  syncType: CatalogSyncType;
  syncData: any | undefined;
  resultMessage: string | undefined;
};
export { getCatalogSyncHandler } from "./catalog-sync-handler";
export type { CatalogSyncStatus };
