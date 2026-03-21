import {
  FailedResult,
  getErrorMessage,
  OkResult,
  type Result,
} from "@/lib/domain";
import { FILE_EXTENSIION_XML, FILE_EXTENSIION_ZIP } from "../const";
import { type CommandManager, getCommandManager } from "@/lib/cqrs";
import path from "path";
import fs from "fs/promises";
import {
  type BaseSyncHandler,
  type BaseXmlHandler,
  type UpdatesManager,
} from "../core";
import { FileManager } from "./file-manager";
import { ZipManager } from "./archive-manager";
import { getCatalogSyncHandler } from "../sync-handlers/catalog.js";
import { setSyncLog } from "@/lib/cqrs";
import { SyncTypes } from "@/lib/domain";
import type { Dirent } from "fs";
import { getCatalogXmlHandler } from "../xml-handlers/catalog";
import type { CatalogUpdates } from "../models/catalog";

const archiveManager = ZipManager.instance();
const fileManager = FileManager.instance();
const commandManager = getCommandManager();

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
  const defaultResult = 0;
  const syncHandlers = initSyncHandlers();
  const xmlHandlers = initXmlHandlers();

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

  const results = await Promise.all(
    files.map((file) => {
      if (!isFile(file, FILE_EXTENSIION_ZIP)) {
        return OkResult(defaultResult);
      }

      const filePath = path.join(file.parentPath, file.name.toLowerCase());
      const syncType = getSyncType(filePath);
      const syncHandler =
        syncType !== undefined ? syncHandlers[syncType] : undefined;
      const xmlHandler =
        syncType !== undefined ? xmlHandlers[syncType] : undefined;

      if (
        syncType === undefined ||
        syncHandler === undefined ||
        xmlHandler === undefined
      ) {
        return FailedResult(
          new Error(`Could not find sync handler for type ID: ${syncType}`),
          defaultResult,
        );
      }

      return processArchive(filePath, syncHandler, xmlHandler)
        .then(async () => {
          await finalizeArchive({
            commandManager,
            filePath,
            poisonedDirName,
            syncType: syncType,
          });
          return OkResult(1);
        })
        .catch(async (error) => {
          await finalizeArchive({
            commandManager,
            filePath,
            poisonedDirName,
            syncType,
            error,
          });
          return FailedResult(error, defaultResult);
        });
    }),
  );

  const failedIndex = results.findIndex((x) => !x.ok);
  if (failedIndex !== -1) return Promise.reject(results[failedIndex]?.error);

  return results.every((x) => x.ok)
    ? results.reduce(
        (acc, curr) => acc + (curr.data ?? defaultResult),
        defaultResult,
      )
    : defaultResult;
};

const isFile = (file: Dirent<string>, extension: string) => {
  return file.isFile() && file.name.toLowerCase().indexOf(extension) > 0;
};

const processArchive = async (
  filePath: string,
  syncHandler: BaseSyncHandler,
  xmlHandler: BaseXmlHandler,
): Promise<void> => {
  const extractedPath = await archiveManager.extract(filePath);
  if (extractedPath.trim().length === 0) {
    return Promise.reject(`Could not extract ZIP file '${filePath}'`);
  }
  const xmlFilePath = await fileManager.lookupByExtension(
    extractedPath,
    FILE_EXTENSIION_XML,
  );
  if (xmlFilePath === null) {
    return Promise.reject("Could not find XML file in extracted ZIP folder.");
  }
  const data = await xmlHandler.parse<CatalogUpdates>(xmlFilePath);
  return await syncHandler.synchronise(extractedPath, data);
};

const finalizeArchive = async ({
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
    const poisonedFilePath = path.join(
      path.dirname(filePath),
      poisonedDirName,
      path.basename(filePath),
    );
    await fileManager.move(filePath, poisonedFilePath);
  }

  await fileManager.remove(filePath);
  await fileManager.remove(
    path.join(
      path.dirname(filePath),
      path.basename(filePath, FILE_EXTENSIION_ZIP),
    ),
    true,
  );

  var result = await commandManager.mutate<number>(() =>
    setSyncLog({
      fileName: path.basename(filePath),
      type: syncType,
      isFailed: error !== null,
      logMessage: error !== null ? error.toString() : logMessage,
    }),
  );

  return !result.ok
    ? Promise.reject(
        result.error?.message ??
          "Failed to complete sync by adding new SyncLog record.",
      )
    : Promise.resolve();
};

const initSyncHandlers = (): Record<SyncTypes, BaseSyncHandler | undefined> => {
  return {
    [SyncTypes.Catalog]: getCatalogSyncHandler(),
    [SyncTypes.CompanyInfo]: undefined,
    [SyncTypes.Order]: undefined,
  };
};

const initXmlHandlers = (): Record<SyncTypes, BaseXmlHandler | undefined> => {
  return {
    [SyncTypes.Catalog]: getCatalogXmlHandler(),
    [SyncTypes.CompanyInfo]: undefined,
    [SyncTypes.Order]: undefined,
  };
};

const getSyncType = (filePath: string): SyncTypes | undefined => {
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
      console.error("Unsupported XML definition file: ", filePath);
      return undefined;
  }
};
