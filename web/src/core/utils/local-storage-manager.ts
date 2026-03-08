import { getDateHandler } from "./date-handler";
import { regexTrue } from "@/lib/domain";

type LocalStorageManager = {
  checkCataloSyncRequired(): boolean;
  checkCatalogSyncInProgress(): boolean;
  getCatalogSyncDate(): Date | undefined;
  setCatalogSyncDate(value: Date): void;
  resetCatalogSyncDate(): void;
  setCatalogSyncInProgress(value: boolean): void;
  getUserThemePreference(): string | undefined;
  setUserThemePreference(value: string): void;
  getUserThemeChangeDate(): Date | undefined;
  setUserThemeChangeDate(value: Date): void;
  getProductsViewScrollTop(): number | undefined;
  setProductsViewScrollTop(value: number): void;
};

const LocalStorageKeys = {
  CATALOG_SYNC_DATE: "catalog-sync-date",
  CATALOG_SYNC_IN_PROGRESS: "catalog-sync-in-progress",
  USER_THEME_PREFERENCE: "user-theme-preference",
  USER_THEME_CHANGED_DATE: "user-theme-changed-date",
  PRODUCTS_VIES_SCROLL_TOP: "products-view-scroll-top",
} as const;

const dateHandler = getDateHandler();

function IsCacheValid(value: Date, invalidateHours: number) {
  // console.log(
  //   "🧪 isCacheValid, current: '%o' vs '%o'",
  //   new Date(),
  //   value,
  // );
  const expiresOn = dateHandler.addHours(value, invalidateHours);
  return new Date() <= expiresOn;
}

const getLocalStorageManager = (
  invalidateHours: number = 4,
): LocalStorageManager => {
  return {
    checkCataloSyncRequired: (): boolean => {
      const isSyncing = localStorage.getItem(
        LocalStorageKeys.CATALOG_SYNC_IN_PROGRESS,
      );
      if (isSyncing !== null && regexTrue.test(isSyncing)) {
        console.warn(
          "~ local-storage-manager ~ catalog caching is in progress, cannot start another one.",
        );
        return false;
      }

      const lastSyncDate = localStorage.getItem(
        LocalStorageKeys.CATALOG_SYNC_DATE,
      );
      const isSyncRequired =
        lastSyncDate === null ||
        !IsCacheValid(new Date(lastSyncDate), invalidateHours);
      isSyncRequired &&
        console.warn(
          "~ local-storage-manager ~ catalog sync is required as it's either expired or new setup (%s))",
          lastSyncDate ? new Date(lastSyncDate) : "not set",
        );
      return isSyncRequired;
    },
    checkCatalogSyncInProgress: (): boolean => {
      const isSyncing = localStorage.getItem(
        LocalStorageKeys.CATALOG_SYNC_IN_PROGRESS,
      );
      return isSyncing !== null && regexTrue.test(isSyncing);
    },
    getCatalogSyncDate: (): Date | undefined => {
      const value = localStorage.getItem(LocalStorageKeys.CATALOG_SYNC_DATE);
      return value ? new Date(value) : undefined;
    },
    setCatalogSyncDate: (value: Date): void => {
      localStorage.setItem(
        LocalStorageKeys.CATALOG_SYNC_DATE,
        value.toISOString(),
      );
    },
    resetCatalogSyncDate: (): void => {
      localStorage.removeItem(LocalStorageKeys.CATALOG_SYNC_DATE);
    },
    setCatalogSyncInProgress: (value: boolean): void => {
      localStorage.setItem(
        LocalStorageKeys.CATALOG_SYNC_IN_PROGRESS,
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
      if (
        themeChangedDate === null ||
        !IsCacheValid(new Date(themeChangedDate), invalidateHours)
      ) {
        console.warn(
          "~ local-storage-manger ~ theme settings reset is required as it's either expired or new setup ('%s').",
          themeChangedDate !== null ? new Date(themeChangedDate) : "not set",
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
    getProductsViewScrollTop: (): number | undefined => {
      const value = localStorage.getItem(
        LocalStorageKeys.PRODUCTS_VIES_SCROLL_TOP,
      );
      return value ? Number.parseInt(value, 10) : undefined;
    },
    setProductsViewScrollTop: (value: number): void => {
      localStorage.setItem(
        LocalStorageKeys.PRODUCTS_VIES_SCROLL_TOP,
        value.toString(),
      );
    },
  };
};

export { getLocalStorageManager, type LocalStorageManager };
