import type { SyncTypes } from "@/lib/domain";

interface BaseSyncHandler {
  getSyncType: () => SyncTypes;
  synchronise: () => Promise<void>;
}

interface BaseXmlHandler {
  parse: <T = any>(filePath: string) => Promise<T>;
}

interface BaseArchiveManager {
  extract: (filePath: string) => Promise<string>;
  cleanUp: (filePath: string) => Promise<void>;
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
};
export { FileManager } from "./file-manager";
export { ZipManager } from "./archive-manager";
export { getUpdatesManager } from "./updates-manager";
