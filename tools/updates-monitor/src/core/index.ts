import type { SyncTypes } from "@/lib/domain";
import type { CatalogUpdates } from "../models/catalog";

interface BaseSyncHandler {
  getSyncType: () => SyncTypes;
  synchronise: (monitorDirPath: string, data: CatalogUpdates) => Promise<void>;
}

interface BaseXmlHandler {
  parse: <T = any>(filePath: string) => Promise<T>;
}

interface BaseArchiveManager {
  extract: (filePath: string) => Promise<string>;
  cleanUp: (filePath: string) => Promise<void>;
}

interface SlugNamesConverter {
  transliterate: (value: string) => string;
}

interface BaseImageUploader {
  upload: (filePath: string, dstPath: string) => Promise<void>;
}

interface BaseReadReplicaManager {
  createDbCopy: (srcPath: string, dstPath: string) => Promise<void>;
  setActive: (filePath: string) => Promise<void>;
}

interface BaseFileManager {
  lookupByExtension: (
    dirPath: string,
    fileExt: string,
  ) => Promise<string | null>;
  move: (srcPath: string, dstPath: string) => Promise<void>;
  remove: (filePath: string, isDirectory?: boolean) => Promise<void>;
}

interface UpdatesManager {
  run: ({
    monitoringDirPath,
    poisonedDirName,
  }: {
    monitoringDirPath: string;
    poisonedDirName: string;
  }) => Promise<number>;
}

export {
  type BaseSyncHandler,
  type BaseXmlHandler,
  type BaseArchiveManager,
  type BaseFileManager,
  type UpdatesManager,
  type SlugNamesConverter,
  type BaseImageUploader,
  type BaseReadReplicaManager,
};
