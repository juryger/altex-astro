import { getDateHandler } from "./date-handler";
import { regexTrue } from "./regex";

type StateManagerFeatures = {
  checkCataloSyncRequired(expireDays: number): boolean;
  checkCatalogSyncInProgress(): boolean;
  setLastSyncDate(value: Date): void;
  setCatalogSyncInProgress(value: boolean): void;
  setCatalogSyncPostponed(value: boolean): void;
  getUserThemePreference(): string | undefined;
  setUserThemePreference(value: string): void;
  getUserThemeChangeDate(): Date | undefined;
  setUserThemeChangeDate(value: Date): void;
};

const LocalStorageKeys = {
  CATALOG_SYNC_DATE: "catalog-sync-date",
  CATALOG_SYNC_IN_PROGRESS: "catalog-sync-in-progress",
  CATALOG_SYNC_POSTPONED: "catalog-sync-postponed",
  USER_THEME_PREFERENCE: "user-theme-preference",
  USER_THEME_CHANGED_DATE: "user-theme-changed-date",
} as const;

function IsValidCacheItem(lastChangedAt: Date) {
  const dateHandler = getDateHandler();
  return (
    new Date() <=
    dateHandler.addHours(
      lastChangedAt,
      import.meta.env.PUBLIC_CACHE_INVALIDATE_IN_HOURS,
    )
  );
}

const getLocalStorageManager = (): StateManagerFeatures => {
  return {
    checkCataloSyncRequired: (expireDays: number): boolean => {
      const isSyncing = localStorage.getItem(
        LocalStorageKeys.CATALOG_SYNC_IN_PROGRESS,
      );
      if (isSyncing !== null && regexTrue.test(isSyncing)) return false;

      const isSyncPosponed = localStorage.getItem(
        LocalStorageKeys.CATALOG_SYNC_POSTPONED,
      );
      if (isSyncPosponed !== null && regexTrue.test(isSyncPosponed))
        return false;

      const lastSyncDate = localStorage.getItem(
        LocalStorageKeys.CATALOG_SYNC_DATE,
      );

      const dateHandler = getDateHandler();
      return (
        lastSyncDate === null ||
        dateHandler.addDays(new Date(lastSyncDate), expireDays) <= new Date()
      );
    },
    checkCatalogSyncInProgress: (): boolean => {
      const isSyncing = localStorage.getItem(
        LocalStorageKeys.CATALOG_SYNC_IN_PROGRESS,
      );
      return isSyncing !== null && regexTrue.test(isSyncing);
    },
    setLastSyncDate: (value: Date): void => {
      localStorage.setItem(
        LocalStorageKeys.CATALOG_SYNC_DATE,
        value.toISOString(),
      );
    },
    setCatalogSyncInProgress: (value: boolean): void => {
      localStorage.setItem(
        LocalStorageKeys.CATALOG_SYNC_IN_PROGRESS,
        value.toString(),
      );
    },
    setCatalogSyncPostponed: (value: boolean): void => {
      localStorage.setItem(
        LocalStorageKeys.CATALOG_SYNC_POSTPONED,
        value.toString(),
      );
    },
    getUserThemePreference: (): string | undefined => {
      const value = localStorage.getItem(
        LocalStorageKeys.USER_THEME_PREFERENCE,
      );
      if (!value) return undefined;

      const themeChangedDate = localStorage.getItem(
        LocalStorageKeys.USER_THEME_CHANGED_DATE,
      );
      if (!themeChangedDate) return undefined;

      console.log(
        "⚙️ ~ localStorageManger ~ Cache contains 'theme' with value '%s' and changed date '%s':",
        value,
        themeChangedDate,
      );

      const lastChangedAt = new Date(themeChangedDate);
      if (!IsValidCacheItem(lastChangedAt)) {
        console.log(
          "⚠️ ~ localStorageManger ~ removing theme as the value expired",
          lastChangedAt.toString(),
        );
        localStorage.removeItem(LocalStorageKeys.USER_THEME_PREFERENCE);
        localStorage.removeItem(LocalStorageKeys.USER_THEME_CHANGED_DATE);
        return undefined;
      }

      return value;
    },
    setUserThemePreference: (value: string): void => {
      localStorage.setItem(LocalStorageKeys.USER_THEME_PREFERENCE, value);
    },
    getUserThemeChangeDate: (): Date | undefined => {
      const value = localStorage.getItem(
        LocalStorageKeys.USER_THEME_CHANGED_DATE,
      );
      return value ? new Date(value) : undefined;
    },
    setUserThemeChangeDate: (value: Date): void => {
      localStorage.setItem(
        LocalStorageKeys.USER_THEME_CHANGED_DATE,
        value.toISOString(),
      );
    },
  };
};

export { getLocalStorageManager, type StateManagerFeatures };
