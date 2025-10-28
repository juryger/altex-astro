type StateManagerFeatures = {
  checkCataloSyncRequired(expireDays: number): boolean;
  checkCatalogSyncInProgress(): boolean;
  setLastSyncDate(value: Date): void;
  setCatalogSyncInProgress(value: boolean): void;
  setCatalogSyncPostponed(value: boolean): void;
  getUserThemPreference(): string;
  setUserThemePreference(value: string): void;
};

const addDays = (date: Date, days: number): Date => {
  const currentDay = date.getDate();
  date.setDate(currentDay + days);
  return date;
};

const LocalStorageKeys = {
  CATALOG_SYNC_DATE: "catalog-sync-date",
  CATALOG_SYNC_IN_PROGRESS: "catalog-sync-in-progress",
  CATALOG_SYNC_POSTPONED: "catalog-sync-postponed",
  USER_THEME_PREFERENCE: "user-theme-preference",
} as const;

const getLocalStorageManager = (): StateManagerFeatures => {
  const regexTruePattern: RegExp = /^true$/i;

  return {
    checkCataloSyncRequired: (expireDays: number): boolean => {
      const isSyncing = localStorage.getItem(
        LocalStorageKeys.CATALOG_SYNC_IN_PROGRESS
      );
      if (isSyncing !== null && regexTruePattern.test(isSyncing)) return false;

      const isSyncPosponed = localStorage.getItem(
        LocalStorageKeys.CATALOG_SYNC_POSTPONED
      );
      if (isSyncPosponed !== null && regexTruePattern.test(isSyncPosponed))
        return false;

      const lastSyncDate = localStorage.getItem(
        LocalStorageKeys.CATALOG_SYNC_DATE
      );
      return (
        lastSyncDate === null ||
        addDays(new Date(lastSyncDate), expireDays) <= new Date()
      );
    },
    checkCatalogSyncInProgress: (): boolean => {
      const isSyncing = localStorage.getItem(
        LocalStorageKeys.CATALOG_SYNC_IN_PROGRESS
      );
      return isSyncing !== null && regexTruePattern.test(isSyncing);
    },
    setLastSyncDate: (value: Date): void => {
      localStorage.setItem(
        LocalStorageKeys.CATALOG_SYNC_DATE,
        value.toISOString()
      );
    },
    setCatalogSyncInProgress: (value: boolean): void => {
      localStorage.setItem(
        LocalStorageKeys.CATALOG_SYNC_IN_PROGRESS,
        value.toString()
      );
    },
    setCatalogSyncPostponed: (value: boolean): void => {
      localStorage.setItem(
        LocalStorageKeys.CATALOG_SYNC_POSTPONED,
        value.toString()
      );
    },
    getUserThemPreference: (): string => {
      return (
        localStorage.getItem(LocalStorageKeys.USER_THEME_PREFERENCE) ?? "light"
      );
    },
    setUserThemePreference: (value: string): void => {
      localStorage.setItem(LocalStorageKeys.USER_THEME_PREFERENCE, value);
    },
  };
};

export { getLocalStorageManager, type StateManagerFeatures };
