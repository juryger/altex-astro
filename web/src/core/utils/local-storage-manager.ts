import { getDateHandler } from "./date-handler";
import { regexTrue } from "@/lib/domain";

type StateManagerFeatures = {
  checkCataloSyncRequired(expireHours: number): boolean;
  checkCatalogSyncInProgress(): boolean;
  setCatalogSyncDate(value: Date): void;
  setCatalogSyncInProgress(value: boolean): void;
  setCatalogSyncPostponed(value: boolean): void;
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
  CATALOG_SYNC_POSTPONED: "catalog-sync-postponed",
  USER_THEME_PREFERENCE: "user-theme-preference",
  USER_THEME_CHANGED_DATE: "user-theme-changed-date",
  PRODUCTS_VIES_SCROLL_TOP: "products-view-scroll-top",
} as const;

function IsValid(lastChangedAt: Date) {
  const dateHandler = getDateHandler();
  return (
    new Date() <=
    dateHandler.addHours(
      lastChangedAt,
      Number.parseInt(import.meta.env.PUBLIC_CACHE_INVALIDATE_IN_HOURS, 10),
    )
  );
}

const getLocalStorageManager = (): StateManagerFeatures => {
  return {
    checkCataloSyncRequired: (expireHours: number): boolean => {
      const isSyncing = localStorage.getItem(
        LocalStorageKeys.CATALOG_SYNC_IN_PROGRESS,
      );
      if (isSyncing !== null && regexTrue.test(isSyncing)) {
        console.warn(
          "~ local-storage-manager ~ catalog caching is already in progress, cannot start another one while original is not finished.",
        );
        return false;
      }

      const isSyncPosponed = localStorage.getItem(
        LocalStorageKeys.CATALOG_SYNC_POSTPONED,
      );
      if (isSyncPosponed !== null && regexTrue.test(isSyncPosponed)) {
        console.warn(
          "~ local-storage-manager ~ catalog caching is postpone and not required.",
        );
        return false;
      }

      const lastSyncDate = localStorage.getItem(
        LocalStorageKeys.CATALOG_SYNC_DATE,
      );

      const dateHandler = getDateHandler();
      return (
        lastSyncDate === null ||
        dateHandler.addHours(new Date(lastSyncDate), expireHours) <= new Date()
      );
    },
    checkCatalogSyncInProgress: (): boolean => {
      const isSyncing = localStorage.getItem(
        LocalStorageKeys.CATALOG_SYNC_IN_PROGRESS,
      );
      return isSyncing !== null && regexTrue.test(isSyncing);
    },
    setCatalogSyncDate: (value: Date): void => {
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

      // console.log(
      //   "⚙️ ~ localStorageManger ~ Cache contains 'theme' with value '%s' and changed date '%s':",
      //   value,
      //   themeChangedDate,
      // );
      const lastChangedAt = new Date(themeChangedDate);
      if (!IsValid(lastChangedAt)) {
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

export { getLocalStorageManager, type StateManagerFeatures };
