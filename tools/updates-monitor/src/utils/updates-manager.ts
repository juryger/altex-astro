import path from "path";
import fs from "fs/promises";
import type { Dirent } from "fs";
import {
  OkResult,
  FailedResult,
  getErrorMessage,
  selectEnvironment,
  EnvironmentNames,
  regexTrue,
  ReadReplicaTypes,
} from "@/lib/domain";
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
import { getReadReplicaManager } from "./read-replica-manager";

const withTracing = regexTrue.test(
  selectEnvironment(EnvironmentNames.ENABLE_TRACING),
);

const archiveManager = ZipManager.instance(withTracing);
const fileManager = FileManager.instance(withTracing);
const commandManager = getCommandManager();
const emailComposer = getEmailComposer();
const readReplicaManager = getReadReplicaManager();

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
        const isReplicaValid = await validateReadReplica();
        if (!isReplicaValid) await createReadReplica();
        return await runInternal({
          monitoringDirPath,
          poisonedDirName,
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

  const filesWithStats = await Promise.all(
    files.map(async (file: Dirent<string>) => {
      const fileName = file.name;
      const fullPath = path.join(file.parentPath, fileName);
      const stats = await fs.stat(fullPath);
      return {
        name: fileName,
        path: fullPath,
        isArchiveFile:
          file.isFile() && fileName.indexOf(FILE_EXTENSIION_ZIP) > 0,
        creationTimeMs: stats.birthtimeMs,
      };
    }),
  );

  const filesByCreationTime = filesWithStats.sort(
    (a, b) => a.creationTimeMs - b.creationTimeMs,
  );
  withTracing &&
    console.log(
      "🐾 ~ updates-manager ~ files discovered in the following order: %o",
      filesByCreationTime.filter((x) => x.isArchiveFile),
    );

  let result = 0;
  for (const file of filesByCreationTime) {
    if (!file.isArchiveFile) continue;

    const syncType = getSyncType(file.path);
    if (syncType === undefined) {
      console.warn(
        "⚠️ ~ update-manager ~ could not obtain SyncType for the file '%s'",
        file.path,
      );
      continue;
    }

    const syncHandler =
      syncType !== undefined ? syncHandlers[syncType] : undefined;
    const xmlHandler =
      syncType !== undefined ? xmlHandlers[syncType] : undefined;
    if (syncHandler === undefined || xmlHandler === undefined) {
      console.warn(
        "⚠️ ~ update-manager ~ could not find sync handler by type '%i' for '%s'",
        syncType,
        file.path,
      );
      continue;
    }
    try {
      withTracing &&
        console.log(
          "🐾 ~ updates-manager ~ start processing of archive '%s'",
          file.name,
        );
      await processArchive({
        filePath: file.path,
        syncHandler,
        xmlHandler,
        withTracing,
      });
      withTracing &&
        console.log(
          "🐾 ~ updates-manager ~ processing of archive is done '%s'",
          file.path,
        );
      await finalizeArchiveProcessing({
        filePath: file.path,
        syncType,
        withTracing,
      });
      result += 1;
    } catch (error) {
      console.error(
        "❌ ~ updates-manager ~ failed to process archive file '%s', see error details below. %s",
        file.path,
        error,
      );
      await finalizeArchiveProcessing({
        filePath: file.path,
        poisonedDirName,
        syncType,
        error: new Error(getErrorMessage(error)),
        withTracing,
      });
    }
  }
  return result;
};

const validateReadReplica = async (): Promise<boolean> => {
  return await readReplicaManager
    .validate(ReadReplicaTypes.Catalog)
    .then(() => true)
    .catch((reason) => {
      console.warn(
        "⚠️ ~ updates-manager ~ Could not validate that catalog read replica exists, see more details below. %s",
        reason,
      );
      return false;
    });
};

const createReadReplica = async (): Promise<string> => {
  const replicaName = `catalog-initial`;
  const dbCatalogPath =
    (selectEnvironment(EnvironmentNames.DB_CATALOG_PATH) as string) ?? "";
  withTracing &&
    console.log(
      "🐾 ~ updates-manager ~ creating read replica '%s' for '%s'.",
      replicaName,
      dbCatalogPath,
    );
  let replicaFilePath: string | undefined;
  try {
    replicaFilePath = await readReplicaManager.createDbCopy(
      dbCatalogPath,
      replicaName,
    );
    withTracing &&
      console.log(
        "🐾 ~ updates-manager ~ Initial read replica created: '%s'",
        replicaFilePath,
      );
    await readReplicaManager.set(ReadReplicaTypes.Catalog, replicaFilePath);
    withTracing &&
      console.log("🐾 ~ updates-manager ~ new read replica registered.");
  } catch (error) {
    if (replicaFilePath !== undefined) {
      await fileManager.remove({ filePath: replicaFilePath });
    }
    return Promise.reject(error);
  }
  return replicaFilePath;
};

const processArchive = async ({
  filePath,
  syncHandler,
  xmlHandler,
  withTracing = false,
}: {
  filePath: string;
  syncHandler: BaseSyncHandler;
  xmlHandler: BaseXmlHandler;
  withTracing?: boolean;
}): Promise<void> => {
  const createdAt = await fileManager.getCreatedDate(filePath);
  const extractedPath = await archiveManager.extract(filePath);
  if (extractedPath.trim().length === 0) {
    return Promise.reject(`Could not extract ZIP file '${filePath}'`);
  }
  const xmlFiles = await fileManager.lookupByExtension(
    extractedPath,
    FILE_EXTENSIION_XML,
  );
  const defaultFile = xmlFiles[0];
  if (xmlFiles.length === 0 || defaultFile === undefined) {
    return Promise.reject(
      "Could not find any XML files in extracted ZIP folder.",
    );
  }
  withTracing &&
    console.log(
      "🐾 ~ updates-manager ~ extracted path: '%s', xml file: '%s'",
      extractedPath,
      defaultFile,
    );
  const data = await xmlHandler.parse<CatalogUpdates>(defaultFile);
  return await syncHandler.synchronise(extractedPath, data.catalog, createdAt);
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
        "🐾 ~ updates-manager ~ moving failed archive to poisoned directory '%s'",
        poisonedFilePath,
      );
    await fileManager.move(filePath, poisonedFilePath);
  } else {
    withTracing &&
      console.log(
        "🐾 ~ updates-manager ~ clean up of archive file '%s'",
        filePath,
      );
    await fileManager.remove({ filePath });
  }

  const extractedDirPath = path.join(
    path.dirname(filePath),
    path.basename(filePath, FILE_EXTENSIION_ZIP),
  );
  withTracing &&
    console.log(
      "🐾 ~ updates-manager ~ clean up of extracted directory '%s'",
      extractedDirPath,
    );
  await fileManager.remove({
    filePath: extractedDirPath,
    isDirectory: true,
  });

  withTracing &&
    console.log(
      "🐾 ~ updates-manager ~ save archive processing log (message: '%s' or error: '%s')",
      logMessage,
      error?.toString(),
    );
  await commandManager.mutate<number>(() =>
    setSyncLog({
      fileName: path.basename(filePath),
      type: syncType,
      isFailed: error !== null,
      logMessage: error !== null ? error.toString() : logMessage,
    }),
  );

  // withTracing &&
  //   console.log(
  //     "🐾 ~ updates-manager ~ sending email regading archive processing to administrator",
  //   );
  // await emailComposer.sendGeneralEmail(
  //   error !== null
  //     ? `${EmailBody.WebsiteUpdateFailure} ${error.message}`
  //     : EmailBody.WebsiteUpdateSuccess,
  //   error !== null,
  // );

  return Promise.resolve();
};

const initSyncHandlers = (
  withTracing: boolean,
): Record<SyncTypes, BaseSyncHandler | undefined> => {
  return {
    [SyncTypes.Catalog]: getCatalogSyncHandler(),
    [SyncTypes.CompanyInfo]: undefined,
    [SyncTypes.Order]: undefined,
  };
};

const initXmlHandlers = (
  withTracing: boolean,
): Record<SyncTypes, BaseXmlHandler | undefined> => {
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
