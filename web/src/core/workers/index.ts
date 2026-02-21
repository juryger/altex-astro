import type { CatalogSyncType } from "../const";

type CatalogSyncStatus = {
  syncType: CatalogSyncType;
  resultMessage?: string;
};

export { getCatalogSyncHandler } from "./catalog-sync-handler";
export type { CatalogSyncStatus };
