enum CatalogSyncType {
  Cache = "catalog-cache",
  CleanUp = "catalog-clean-up",
  Failure = "catalog-failure",
}

type CatalogSyncStatus = {
  syncType: CatalogSyncType;
  resultMessage?: string;
};

export { type CatalogSyncStatus, CatalogSyncType };
