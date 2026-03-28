import type { ReadReplicaTypes, SyncTypes, Result } from "@/lib/domain";
import type { CatalogUpdatesRoot } from "../models/catalog";

const POST_CATALOG_DB_UPDATE_DELAY_MS = 1000;

interface BaseSyncHandler {
  getSyncType: () => SyncTypes;
  synchronise: (
    inputDirPath: string,
    value: CatalogUpdatesRoot,
    date: Date | undefined,
  ) => Promise<void>;
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

interface BaseImageManager {
  upload: (filePath: string, isThumbnail?: boolean) => Promise<void>;
  delete: (fileName: string, isThumbnail?: boolean) => Promise<void>;
}

interface BaseReadReplicaManager {
  validate: (type: ReadReplicaTypes) => Promise<void>;
  createDbCopy: (srcPath: string, replicaName: string) => Promise<string>;
  set: (type: ReadReplicaTypes, filePath: string) => Promise<void>;
  rollback: (type: ReadReplicaTypes, filePath: string) => Promise<void>;
}

interface BaseFileManager {
  lookupByExtension: (dirPath: string, fileExt: string) => Promise<string[]>;
  getCreatedDate: (filePath: string) => Promise<Date | undefined>;
  checkExistence: (filePath: string) => Promise<boolean>;
  copy: (srcPath: string, dstPath: string) => Promise<void>;
  move: (srcPath: string, dstPath: string) => Promise<void>;
  remove: ({
    filePath,
    isDirectory,
  }: {
    filePath: string;
    isDirectory?: boolean;
  }) => Promise<void>;
}

interface EmailComposer {
  sendGeneralEmail(message: string, isFailure?: boolean): Promise<Result>;
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
  POST_CATALOG_DB_UPDATE_DELAY_MS,
  type BaseSyncHandler,
  type BaseXmlHandler,
  type BaseArchiveManager,
  type BaseFileManager,
  type UpdatesManager,
  type SlugNamesConverter,
  type BaseImageManager,
  type BaseReadReplicaManager,
  type EmailComposer,
};
