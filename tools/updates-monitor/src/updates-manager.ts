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
import { type BaseSyncHandler, type UpdatesManager } from "./core/index.js";
import { getCatalogSyncHandler } from "./sync-handlers/catalog.js";
import { setSyncLog } from "@/lib/cqrs";
import { SyncTypes } from "@/lib/domain";
import type { Dirent } from "fs";

export function getUpdatesManager(): UpdatesManager {
  return {
    run: async ({
      monitoringDirPath,
      poisonedDirName,
    }: {
      monitoringDirPath: string;
      poisonedDirName: string;
    }) => {
      if (
        monitoringDirPath === undefined ||
        monitoringDirPath.trimEnd() === ""
      ) {
        console.error(
          "Monitoring directory path is not defined in the .env file.",
        );
        return 0;
      }
      if (poisonedDirName === undefined || poisonedDirName.trimEnd() === "") {
        console.error(
          "Poisoned directory name is not defined in the .env file",
        );
        return 0;
      }
      try {
        const result = await runInternal({
          monitoringDirPath,
          poisonedDirName,
        });
        if (result.error !== undefined) console.error(result.error);
        return result.ok ? (result.data ?? 0) : 0;
      } catch (error) {
        console.error(error);
        return 0;
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
}): Promise<Result<number>> => {
  const allHandlers = initHandlers(monitoringDirPath);
  const commandManager = getCommandManager();

  const files = await fs
    .readdir(monitoringDirPath, {
      withFileTypes: true,
    })
    .catch((error) => {
      console.error(error);
      return null;
    });

  if (!files) {
    return FailedResult(
      new Error(`Failed to obtained content of '${monitoringDirPath}'`),
    );
  }

  const results = await Promise.all(
    files.map((file) => {
      if (!isValideZipFile(file)) return OkResult(0);

      const filePath = path.join(file.parentPath, file.name.toLowerCase());
      return processZipFile(filePath, allHandlers)
        .then((result) =>
          finaliseSynchronisation({
            commandManager,
            filePath,
            poisonedDirName,
            syncType: result.data ?? null,
            logMessage:
              result.ok && result.error === undefined
                ? `Synchronisation has done for the following file: '${file.name}'`
                : null,
            error: !result.ok && result.error ? result.error : null,
          }),
        )
        .then((result) => {
          return result.ok
            ? OkResult(1)
            : FailedResult(
                result.error ??
                  new Error(`Failed to process zip file:" ${file.name}`),
                0,
              );
        })
        .catch(async (error) => {
          await finaliseSynchronisation({
            commandManager,
            filePath,
            poisonedDirName,
            error,
          });
          return FailedResult(error, 0);
        });
    }),
  ).catch((error) => {
    console.error("👇");
    console.error(getErrorMessage(error));
    return undefined;
  });

  return results !== undefined && results.every((x) => x.ok)
    ? OkResult(results.reduce((acc, curr) => acc + (curr.data ?? 0), 0))
    : FailedResult<number>(
        new Error(
          `Failed to proces some of zip files from '${monitoringDirPath}.'`,
        ),
      );
};

const isValideZipFile = (file: Dirent<string>): boolean => {
  return (
    file.isFile() && file.name.toLowerCase().indexOf(FILE_EXTENSIION_ZIP) > 0
  );
};

const finaliseSynchronisation = async ({
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
}): Promise<Result> => {
  if (error) {
    console.error(error);
    await moveToPoisoned(filePath, poisonedDirName);
  }

  await deleteZipFileAndFolder(filePath);
  const result = await saveSyncLog({
    commandManager,
    fileName: path.basename(filePath),
    type: syncType,
    isFailed: error !== null,
    logMessage:
      error !== null ? (error?.toString() ?? null) : (logMessage ?? null),
  });
  return result.ok
    ? OkResult()
    : FailedResult(
        new Error("Failed to complete sync by adding new SyncLog record."),
      );
};

const moveToPoisoned = async (filePath: string, poisonedName: string) => {
  const destDir = path.join(path.dirname(filePath), poisonedName);
  await fs.mkdir(destDir, { recursive: true });
  await fs.copyFile(filePath, path.join(destDir, path.basename(filePath)));
  await fs.unlink(filePath);
};

const deleteZipFileAndFolder = async (filePath: string) => {
  console.log("🧪 ~ deleteZipFileAndFolder, filePath:", filePath);
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

const getSyncHandlerBasedOnInputDir = (
  monitorDirPath: string,
  allHandlers: Record<SyncTypes, BaseSyncHandler | undefined>,
): BaseSyncHandler | undefined => {
  if (monitorDirPath.toLowerCase().indexOf("catalog"))
    return allHandlers[SyncTypes.Catalog];
  return undefined;
};

const unzipFile = async (filePath: string): Promise<string> => {
  const dirPath = path.dirname(filePath);
  const fileName = path.basename(filePath, FILE_EXTENSIION_ZIP);
  const extractedPath = path.join(dirPath, fileName);

  const directory = await unzipper.Open.file(filePath);
  await directory.extract({ path: extractedPath });

  return extractedPath;
};

const lookupFileByExtension = async (
  dirPath: string,
  fileExt: string,
): Promise<string | undefined> => {
  const files = await fs.readdir(dirPath);
  const filtered = files.filter((file) => path.extname(file) === fileExt);
  return filtered.length > 0 ? filtered[0] : undefined;
};

const getFileSyncType = (filePath: string): SyncTypes | null => {
  const fileName = path.basename(filePath, FILE_EXTENSIION_XML);
  switch (fileName.toLowerCase()) {
    case "catalog":
      return SyncTypes.Catalog;
    case "companyinfo":
      return SyncTypes.CompanyInfo;
    case "order":
      return SyncTypes.Order;
    default:
      console.error("Unsupported xml definition file: ", filePath);
      break;
  }

  return null;
};

const processZipFile = async (
  filePath: string,
  allHandlers: Record<SyncTypes, BaseSyncHandler | undefined>,
): Promise<Result<SyncTypes>> => {
  let syncType: SyncTypes | null = null;
  const extractedPath = await unzipFile(filePath);

  const xmlFile = await lookupFileByExtension(
    extractedPath,
    FILE_EXTENSIION_XML,
  );
  if (xmlFile === undefined)
    return FailedResult(
      new Error("Could not find xml file from extracted zip-file."),
    );

  syncType = getFileSyncType(xmlFile);
  if (syncType === null)
    return FailedResult(
      new Error(
        `Failed to derive sync type based on the name of xml file: '${xmlFile}'`,
      ),
    );

  const handler = getSyncHandlerBasedOnInputDir(extractedPath, allHandlers);
  if (!handler)
    return FailedResult(
      new Error(
        `Could not find registered handler for processing of the xml file: '${xmlFile}'`,
      ),
    );

  var result = await handler.synchronise();
  return result.ok
    ? OkResult(syncType)
    : FailedResult(
        result.error ?? new Error(`Failed to process zip file: ${filePath}`),
        syncType,
      );
};
