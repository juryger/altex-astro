enum CatalogSyncType {
  Sync = "sync-catalog",
  CleanUpCache = "clean-up-cache",
}

type CatalogSyncStatus = {
  syncType: CatalogSyncType;
  resultMessage?: string;
};

export { type CatalogSyncStatus, CatalogSyncType };
