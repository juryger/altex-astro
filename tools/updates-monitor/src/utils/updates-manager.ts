import path from "path";
import fs from "fs/promises";
import type { Dirent } from "fs";
import { OkResult, FailedResult, getErrorMessage } from "@/lib/domain";
import { FILE_EXTENSIION_XML, FILE_EXTENSIION_ZIP } from "@/lib/domain";
import { SyncTypes } from "@/lib/domain";
import { getCommandManager } from "@/lib/cqrs";
import { setSyncLog } from "@/lib/cqrs";
import { EmailBody } from "@/lib/email";
import {
  type BaseSyncHandler,
  type BaseXmlHandler,
  type UpdatesManager,
} from "../core";
import { FileManager } from "./file-manager";
import { ZipManager } from "./archive-manager";
import { getCatalogSyncHandler } from "../sync-handlers/catalog.js";
import { getCatalogXmlHandler } from "../xml-handlers/catalog";
import type { CatalogUpdates } from "../models/catalog";
import { getEmailComposer } from "./email-composer";

const archiveManager = ZipManager.instance();
const fileManager = FileManager.instance();
const commandManager = getCommandManager();
const emailComposer = getEmailComposer();

export function getUpdatesManager(
  withTracing: boolean = false,
): UpdatesManager {
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
          withTracing,
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
  withTracing,
}: {
  monitoringDirPath: string;
  poisonedDirName: string;
  withTracing: boolean;
}): Promise<number> => {
  const syncHandlers = initSyncHandlers(withTracing);
  const xmlHandlers = initXmlHandlers(withTracing);

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

  const defaultResult = 0;
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
      withTracing &&
        console.log(
          "🐾 ~ updates-manager ~ start processing of archive '%s'",
          filePath,
        );
      return processArchive(filePath, syncHandler, xmlHandler)
        .then(async () => {
          withTracing &&
            console.log(
              "🐾 ~ updates-manager ~ processing of archive is done '%s'",
              filePath,
            );
          await finalizeArchiveProcessing({
            filePath,
            syncType: syncType,
            withTracing,
          });
          return OkResult(1);
        })
        .catch(async (error) => {
          await finalizeArchiveProcessing({
            filePath,
            poisonedDirName,
            syncType,
            error,
            withTracing,
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
  return await syncHandler.synchronise(extractedPath, data.catalog);
};

const finalizeArchiveProcessing = async ({
  filePath,
  poisonedDirName = null,
  syncType = null,
  logMessage = null,
  error = null,
  withTracing = false,
}: {
  filePath: string;
  poisonedDirName?: string | null;
  syncType?: SyncTypes | null;
  logMessage?: string | null;
  error?: Error | null;
  withTracing?: boolean;
}): Promise<void> => {
  if (error !== null && poisonedDirName !== null) {
    const poisonedFilePath = path.join(
      path.dirname(filePath),
      poisonedDirName,
      path.basename(filePath),
    );
    withTracing &&
      console.log(
        "🐾 ~ updates-manager ~ moving of failed archive to poisoned directory '%s'",
        poisonedFilePath,
      );
    await fileManager.move(filePath, poisonedFilePath);
  }

  withTracing &&
    console.log(
      "🐾 ~ updates-manager ~ clean up of archive file and extracted directory '%s'",
      filePath,
    );
  await fileManager.remove(filePath);
  await fileManager.remove(
    path.join(
      path.dirname(filePath),
      path.basename(filePath, FILE_EXTENSIION_ZIP),
    ),
    true,
  );

  withTracing &&
    console.log(
      "🐾 ~ updates-manager ~ save archive processing log: '%s', error: '%s'",
      logMessage,
      error?.toString(),
    );
  const result = await commandManager.mutate<number>(() =>
    setSyncLog({
      fileName: path.basename(filePath),
      type: syncType,
      isFailed: error !== null,
      logMessage: error !== null ? error.toString() : logMessage,
    }),
  );

  withTracing &&
    console.log(
      "🐾 ~ updates-manager ~ sending email regading archive processing to administrator",
    );
  await emailComposer.sendGeneralEmail(
    error !== null
      ? `${EmailBody.WebsiteUpdateFailure} ${error.message}`
      : EmailBody.WebsiteUpdateSuccess,
    error !== null,
  );

  return Promise.resolve();
};

const initSyncHandlers = (
  withTracing: boolean,
): Record<SyncTypes, BaseSyncHandler | undefined> => {
  return {
    [SyncTypes.Catalog]: getCatalogSyncHandler(withTracing),
    [SyncTypes.CompanyInfo]: undefined,
    [SyncTypes.Order]: undefined,
  };
};

const initXmlHandlers = (
  withTracing: boolean,
): Record<SyncTypes, BaseXmlHandler | undefined> => {
  return {
    [SyncTypes.Catalog]: getCatalogXmlHandler(withTracing),
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
