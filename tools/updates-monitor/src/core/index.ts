import type { ReadReplicaTypes, SyncTypes, Result } from "@/lib/domain";
import type { CatalogUpdates } from "../models/catalog";

interface BaseSyncHandler {
  getSyncType: () => SyncTypes;
  synchronise: (inputDirPath: string, data: CatalogUpdates) => Promise<void>;
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
  createDbCopy: (
    srcPath: string,
    replicaDirName: string,
    replicaName: string,
  ) => Promise<string>;
  setActive: (type: ReadReplicaTypes, filePath: string) => Promise<void>;
}

interface BaseFileManager {
  lookupByExtension: (
    dirPath: string,
    fileExt: string,
  ) => Promise<string | null>;
  copy: (srcPath: string, dstPath: string) => Promise<void>;
  move: (srcPath: string, dstPath: string) => Promise<void>;
  remove: (filePath: string, isDirectory?: boolean) => Promise<void>;
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
