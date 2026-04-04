import { EnvironmentNames, regexTrue, selectEnvironment } from "@/lib/domain";
import { CategoriesViewMode } from "../const";
import { getDateHandler } from "./date-handler";

type LocalStorageManager = {
  checkCataloSyncRequired(): boolean;
  getCatalogSyncDate(): Date | undefined;
  setCatalogSyncDate(value: Date): void;
  resetCatalogSyncDate(): void;
  getCatalogReplicaDate(): Date | undefined;
  setCatalogReplicaDate(value: Date): void;
  getUserThemePreference(): string | undefined;
  setUserThemePreference(value: string): void;
  getUserThemeChangeDate(): Date | undefined;
  setUserThemeChangeDate(value: Date): void;
  getCategoriesViewMode(): CategoriesViewMode;
  setCategoriesViewMode(value: CategoriesViewMode): void;
};

const LocalStorageKeys = {
  CATALOG_SYNC_DATE: "catalog-sync-date",
  CATALOG_REPLICA_DATE: "catalog-replica-date",
  USER_THEME_PREFERENCE: "user-theme-preference",
  USER_THEME_CHANGED_DATE: "user-theme-changed-date",
  CATEGORIES_VIEW_MODE: "categories-view-mode",
} as const;

const withTracing = regexTrue.test(
  selectEnvironment(EnvironmentNames.PUBLIC_ENABLE_TRACING),
);

const dateHandler = getDateHandler();

function IsReplicaValid(replicaDate: Date, syncDate: Date) {
  const result = replicaDate < syncDate;
  console.log("~ local-storage-manager ~ isReplicaValid: ", result);
  return result;
}

function IsCacheValid(syncDate: Date, invalidateHours: number) {
  const expiresOn = dateHandler.addHours(syncDate, invalidateHours);
  const result = new Date() <= expiresOn;
  console.log("~ local-storage-manager ~ isCacheValid: ", result);
  return result;
}

const getLocalStorageManager = (
  invalidateHours: number = 4,
): LocalStorageManager => {
  return {
    checkCataloSyncRequired: (): boolean => {
      const lastSyncDate = localStorage.getItem(
        LocalStorageKeys.CATALOG_SYNC_DATE,
      );
      const replicaDate = localStorage.getItem(
        LocalStorageKeys.CATALOG_REPLICA_DATE,
      );
      const isSyncRequired =
        replicaDate === null ||
        lastSyncDate === null ||
        !IsReplicaValid(new Date(replicaDate), new Date(lastSyncDate)) ||
        !IsCacheValid(new Date(lastSyncDate), invalidateHours);
      isSyncRequired &&
        console.warn(
          "⚠️ ~ local-storage-manager ~ catalog sync is required as it's either outdated, read replica updated or new setup. Last sync date: '%s', replicate date: '%s')",
          lastSyncDate !== null ? new Date(lastSyncDate) : "not set",
          replicaDate !== null ? new Date(replicaDate) : "not set",
        );
      return isSyncRequired;
    },
    getCatalogSyncDate: (): Date | undefined => {
      const value = localStorage.getItem(LocalStorageKeys.CATALOG_SYNC_DATE);
      withTracing &&
        console.log(
          "🐾 ~ local-storage-manager ~ get CATALOG_SYNC_DATE: ",
          value,
        );
      return value ? new Date(value) : undefined;
    },
    setCatalogSyncDate: (value: Date): void => {
      withTracing &&
        console.log(
          "🐾 ~ local-storage-manager ~ set CATALOG_SYNC_DATE: ",
          value,
        );
      localStorage.setItem(
        LocalStorageKeys.CATALOG_SYNC_DATE,
        value.toISOString(),
      );
    },
    getCatalogReplicaDate: (): Date | undefined => {
      const value = localStorage.getItem(LocalStorageKeys.CATALOG_REPLICA_DATE);
      withTracing &&
        console.log(
          "🐾 ~ local-storage-manager ~ get CATALOG_REPLICA_DATE: ",
          value,
        );
      return value ? new Date(value) : undefined;
    },
    setCatalogReplicaDate: (value: Date): void => {
      withTracing &&
        console.log(
          "🐾 ~ local-storage-manager ~ set CATALOG_REPLICA_DATE: ",
          value,
        );
      localStorage.setItem(
        LocalStorageKeys.CATALOG_REPLICA_DATE,
        value.toISOString(),
      );
    },
    resetCatalogSyncDate: (): void => {
      withTracing &&
        console.log("🐾 ~ local-storage-manager ~ reseting CATALOG_SYNC_DATE");
      localStorage.removeItem(LocalStorageKeys.CATALOG_SYNC_DATE);
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
          "⚠️ ~ local-storage-manger ~ theme settings reset as it's either expired or new setup ('%s').",
          themeChangedDate !== null ? new Date(themeChangedDate) : "not set",
        );
        localStorage.removeItem(LocalStorageKeys.USER_THEME_PREFERENCE);
        localStorage.removeItem(LocalStorageKeys.USER_THEME_CHANGED_DATE);
        return undefined;
      }

      return value;
    },
    setUserThemePreference: (value: string): void => {
      withTracing &&
        console.log(
          "🐾 ~ local-storage-manager ~ set USER_THEME_PREFERENCE: ",
          value,
        );
      localStorage.setItem(LocalStorageKeys.USER_THEME_PREFERENCE, value);
    },
    getUserThemeChangeDate: (): Date | undefined => {
      const value = localStorage.getItem(
        LocalStorageKeys.USER_THEME_CHANGED_DATE,
      );
      withTracing &&
        console.log(
          "🐾 ~ local-storage-manager ~ get USER_THEME_CHANGED_DATE: ",
          value,
        );
      return value ? new Date(value) : undefined;
    },
    setUserThemeChangeDate: (value: Date): void => {
      withTracing &&
        console.log(
          "🐾 ~ local-storage-manager ~ set USER_THEME_CHANGED_DATE: ",
          value,
        );
      localStorage.setItem(
        LocalStorageKeys.USER_THEME_CHANGED_DATE,
        value.toISOString(),
      );
    },
    getCategoriesViewMode: (): CategoriesViewMode => {
      const value = localStorage.getItem(LocalStorageKeys.CATEGORIES_VIEW_MODE);
      withTracing &&
        console.log(
          "🐾 ~ local-storage-manager ~ get CATEGORIES_VIEW_MODE: ",
          value,
        );
      return value ? Number.parseInt(value, 10) : CategoriesViewMode.Compact;
    },
    setCategoriesViewMode: (value: CategoriesViewMode): void => {
      withTracing &&
        console.log(
          "🐾 ~ local-storage-manager ~ set CATEGORIES_VIEW_MODE: ",
          value,
        );
      localStorage.setItem(
        LocalStorageKeys.CATEGORIES_VIEW_MODE,
        value.toString(),
      );
    },
  };
};

export { getLocalStorageManager, type LocalStorageManager };
