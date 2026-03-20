import {
  FailedResult,
  getErrorMessage,
  OkResult,
  type Result,
} from "@/lib/domain";
import { FILE_EXTENSIION_XML, FILE_EXTENSIION_ZIP } from "@/lib/domain";
import { type CommandManager, getCommandManager } from "@/lib/cqrs";
import path from "path";
import fs from "fs/promises";
import unzipper from "unzipper";
import { type BaseSyncHandler, type UpdatesManager } from "./index.js";
import { ZipManager, FileManager } from "./index.js";
import { getCatalogSyncHandler } from "../sync-handlers/catalog.js";
import { setSyncLog } from "@/lib/cqrs";
import { SyncTypes } from "@/lib/domain";
import type { Dirent } from "fs";

const archiveManager = ZipManager.instance();
const fileManager = FileManager.instance();

export function getUpdatesManager(): UpdatesManager {
  return {
    run: async ({
      monitoringDirPath,
      poisonedDirName,
    }: {
      monitoringDirPath: string;
      poisonedDirName: string;
    }) => {
      if (!monitoringDirPath || monitoringDirPath.trim() === "") {
        return Promise.reject(
          "Monitoring directory path is not defined in the .env file.",
        );
      }
      if (!poisonedDirName || poisonedDirName.trim() === "") {
        return Promise.reject(
          "Poisoned directory name is not defined in the .env file",
        );
      }
      try {
        return await runInternal({
          monitoringDirPath,
          poisonedDirName,
        }).catch((error) => {
          return Promise.reject(getErrorMessage(error));
        });
      } catch (error) {
        return Promise.reject(getErrorMessage(error));
      }
    },
  };
}

const runInternal = async ({
  monitoringDirPath,
  poisonedDirName,
}: {
  monitoringDirPath: string;
  poisonedDirName: string;
}): Promise<number> => {
  const files = await fs
    .readdir(monitoringDirPath, {
      withFileTypes: true,
    })
    .catch((error) => {
      console.error(getErrorMessage(error), error);
      return null;
    });

  if (!files) {
    return Promise.reject(
      `Failed to obtained content of '${monitoringDirPath}'`,
    );
  }

  const allHandlers = initHandlers(monitoringDirPath);
  //const key = SyncTypes.Catalog;
  //console.log("handler 0: ", allHandlers[key]);

  const commandManager = getCommandManager();
  const results = await Promise.all(
    files.map((file) => {
      if (!isFile(file, FILE_EXTENSIION_ZIP)) return OkResult(0);
      const filePath = path.join(file.parentPath, file.name.toLowerCase());
      const syncType = getFileSyncType(filePath);
      const syncHandler = syncType !== undefined ? allHandlers[0] : undefined;
      if (syncType === undefined || syncHandler === undefined) {
        return FailedResult(
          new Error(`Could not find sync handler for type ID: ${syncType}`),
        );
      }

      return processZipFile(filePath, syncHandler)
        .then(async () => {
          await finaliseSync({
            commandManager,
            filePath,
            poisonedDirName,
            syncType: syncType,
          });
          return OkResult(1);
        })
        .catch(async (error) => {
          await finaliseSync({
            commandManager,
            filePath,
            poisonedDirName,
            syncType,
            error,
          });
          return FailedResult(error, 0);
        });
    }),
  );

  const failedIndex = results.findIndex((x) => !x.ok);
  if (failedIndex !== -1) return Promise.reject(results[failedIndex]?.error);

  const defaultValue = 0;
  return results.every((x) => x.ok)
    ? results.reduce(
        (acc, curr) => acc + (curr.data ?? defaultValue),
        defaultValue,
      )
    : defaultValue;
};

const isFile = (file: Dirent<string>, extension: string) => {
  return file.isFile() && file.name.toLowerCase().indexOf(extension) > 0;
};

const finaliseSync = async ({
  commandManager,
  filePath,
  poisonedDirName,
  syncType = null,
  logMessage = null,
  error = null,
}: {
  commandManager: CommandManager;
  filePath: string;
  poisonedDirName: string;
  syncType?: SyncTypes | null;
  logMessage?: string | null;
  error?: Error | null;
}): Promise<void> => {
  if (error !== null) {
    await moveToPoisoned(filePath, poisonedDirName);
  }

  await deleteZipFileAndFolder(filePath);
  const result = await saveSyncLog({
    commandManager,
    fileName: path.basename(filePath),
    type: syncType,
    isFailed: error !== null,
    logMessage: error !== null ? error.toString() : logMessage,
  });

  return !result.ok
    ? Promise.reject(
        result.error?.message ??
          "Failed to complete sync by adding new SyncLog record.",
      )
    : Promise.resolve();
};

const moveToPoisoned = async (filePath: string, poisonedName: string) => {
  const destDir = path.join(path.dirname(filePath), poisonedName);
  await fs.mkdir(destDir, { recursive: true });
  await fs.copyFile(filePath, path.join(destDir, path.basename(filePath)));
  await fs.unlink(filePath);
};

const deleteZipFileAndFolder = async (filePath: string) => {
  const dirPath = path.dirname(filePath);
  await fs.rm(
    path.join(dirPath, path.basename(filePath, FILE_EXTENSIION_ZIP)),
    {
      recursive: true,
      force: true,
    },
  );
  await fs.rm(filePath, { force: true });
};

const saveSyncLog = async ({
  commandManager,
  fileName,
  type = null,
  isFailed = false,
  logMessage = null,
}: {
  commandManager: CommandManager;
  fileName: string;
  type?: SyncTypes | null;
  isFailed: boolean;
  logMessage: string | null;
}): Promise<Result<number>> => {
  return await commandManager.mutate<number>(() =>
    setSyncLog({ fileName, type, isFailed, logMessage }),
  );
};

const initHandlers = (
  monitorDirPath: string,
): Record<SyncTypes, BaseSyncHandler | undefined> => {
  return {
    [SyncTypes.Catalog]: getCatalogSyncHandler(monitorDirPath),
    [SyncTypes.CompanyInfo]: undefined,
    [SyncTypes.Order]: undefined,
  };
};

const getFileSyncType = (filePath: string): SyncTypes | undefined => {
  const fileName = path.basename(filePath, FILE_EXTENSIION_ZIP);
  const delimeterIndex = fileName.indexOf("_");
  if (delimeterIndex === -1) return undefined;
  switch (fileName.substring(0, delimeterIndex).toLowerCase()) {
    case "catalog":
      return SyncTypes.Catalog;
    case "companyinfo":
      return SyncTypes.CompanyInfo;
    case "order":
      return SyncTypes.Order;
    default:
      console.error("Unsupported xml definition file: ", filePath);
      return undefined;
  }
};

const processZipFile = async (
  filePath: string,
  handler: BaseSyncHandler,
): Promise<void> => {
  const extractedPath = await archiveManager.extract(filePath);
  if (extractedPath.trim().length === 0) {
    return Promise.reject(
      `Could not extract content of zip file '${filePath}'`,
    );
  }
  const xmlFilePath = await fileManager.lookupByExtension(
    extractedPath,
    FILE_EXTENSIION_XML,
  );
  if (!xmlFilePath) {
    return Promise.reject("Could not find xml file from extracted zip file.");
  }
  return await handler.synchronise();
};
