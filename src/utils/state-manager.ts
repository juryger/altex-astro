interface StateManagerFeatures {
  checkCataloSyncRequired(cacheDays: number): boolean,
  checkCatalogSyncInProgress(): boolean,
  setLastSyncDate(value: Date): boolean,
  resetCatalogSyncInProgress(): void,
}

const getStateManager = (): StateManagerFeatures => {  
  const Key_CatalogSyncDate = 'catalog-sync-date';
  const Key_CatalogSyncInProgress = 'catalog-sync-in-progress';

  return {
    checkCataloSyncRequired: (cacheDays: number): boolean => {  
      return false;
    },
    checkCatalogSyncInProgress: (): boolean => {
      return false;
    },
    setLastSyncDate: (value: Date): boolean => {  
      return false;
    },
    resetCatalogSyncInProgress: (): void => {
    },
  }
}

export { getStateManager, type StateManagerFeatures }