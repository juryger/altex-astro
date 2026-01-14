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
  USER_THEME_CHANGED: "user-theme-changed",
} as const;

const getLocalStorageManager = (): StateManagerFeatures => {
  return {
    checkCataloSyncRequired: (expireDays: number): boolean => {
      const isSyncing = localStorage.getItem(
        LocalStorageKeys.CATALOG_SYNC_IN_PROGRESS
      );
      if (isSyncing !== null && regexTrue.test(isSyncing)) return false;

      const isSyncPosponed = localStorage.getItem(
        LocalStorageKeys.CATALOG_SYNC_POSTPONED
      );
      if (isSyncPosponed !== null && regexTrue.test(isSyncPosponed))
        return false;

      const lastSyncDate = localStorage.getItem(
        LocalStorageKeys.CATALOG_SYNC_DATE
      );

      const dateHandler = getDateHandler();
      return (
        lastSyncDate === null ||
        dateHandler.addDays(new Date(lastSyncDate), expireDays) <= new Date()
      );
    },
    checkCatalogSyncInProgress: (): boolean => {
      const isSyncing = localStorage.getItem(
        LocalStorageKeys.CATALOG_SYNC_IN_PROGRESS
      );
      return isSyncing !== null && regexTrue.test(isSyncing);
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
    getUserThemePreference: (): string | undefined => {
      var value = localStorage.getItem(LocalStorageKeys.USER_THEME_PREFERENCE);
      if (!value) return undefined;

      // Check user's last visit date and if it was more than 4 hrs ago, reset Theme preference
      const dateHandler = getDateHandler();
      const lastChange = localStorage.getItem(
        LocalStorageKeys.USER_THEME_CHANGED
      );
      console.log(
        "~ localStorageManger ~ theme last changed date:",
        lastChange
      );

      if (
        !lastChange ||
        dateHandler.addHours(new Date(lastChange), 4) <= new Date()
      ) {
        console.log(
          "~ localStorageManger ~ removing theme selection based on last change date %s vs now %s",
          lastChange ? dateHandler.addMinutes(new Date(lastChange), 1) : "none",
          new Date()
        );
        localStorage.removeItem(LocalStorageKeys.USER_THEME_PREFERENCE);
        return undefined;
      }

      return value;
    },
    setUserThemePreference: (value: string): void => {
      localStorage.setItem(LocalStorageKeys.USER_THEME_PREFERENCE, value);
    },
    getUserThemeChangeDate: (): Date | undefined => {
      const value = localStorage.getItem(LocalStorageKeys.USER_THEME_CHANGED);
      return value ? new Date(value) : undefined;
    },
    setUserThemeChangeDate: (value: Date): void => {
      localStorage.setItem(
        LocalStorageKeys.USER_THEME_CHANGED,
        value.toISOString()
      );
    },
  };
};

export { getLocalStorageManager, type StateManagerFeatures };
