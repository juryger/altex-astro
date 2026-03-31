import path from "path";
import fs from "fs/promises";
import {
  EnvironmentNames,
  getErrorMessage,
  ReadReplicaTypes,
  regexTrue,
  selectEnvironment,
  SyncTypes,
  type Result,
} from "@/lib/domain";
import { FILE_EXTENSIION_JPG } from "@/lib/domain";
import {
  fetchCurrentReadReplica,
  getCommandManager,
  getQueryManager,
  setVersionTx,
} from "@/lib/cqrs";
import {
  DatabaseType,
  type DatabaseTransaction,
  type DatabaseSchema,
} from "@/lib/dal";
import { type BaseSyncHandler } from "../core";
import type { CatalogUpdatesRoot } from "../models/catalog";
import { getReadReplicaManager } from "../utils/read-replica-manager";
import { FileManager } from "../utils/file-manager";
import { getS3ImageManager } from "../utils/s3-image-manager";
import {
  mapColorsToCommands,
  mapCountriesToCommands,
  mapDiscountsToCommands,
  mapGroupsToCommands,
  mapMakersToCommands,
  mapMeasurementsToCommands,
  mapProductColorsToCommands,
  mapProductsToCommands,
  mapSubgroupsToCommands,
} from "src/models-mapping/catalog";

const withTracing = regexTrue.test(
  selectEnvironment(EnvironmentNames.ENABLE_TRACING),
);
const thumbnailsDirName = selectEnvironment(
  EnvironmentNames.THUMBNAILS_DIRECOTRY_NAME,
);

const fileManager = FileManager.instance(withTracing);
const commandManager = getCommandManager();
const queryManager = getQueryManager();
const readReplicaManager = getReadReplicaManager();
const s3ImageManager = getS3ImageManager();

const getCatalogSyncHandler = (): BaseSyncHandler => {
  return {
    getSyncType: () => SyncTypes.Catalog,
    synchronise: async (
      inputDirPath: string,
      updates: CatalogUpdatesRoot,
      createdAt: Date | undefined,
    ): Promise<void> => {
      let replicaFilePath = "";
      const thumbnailsDirPath = path.join(inputDirPath, thumbnailsDirName);
      withTracing &&
        console.log(
          "🐾 ~ sync-handler ~ sync updates data from direcotry: '%s', thumbnails direcotry: '%s', direcotry name: '%s'",
          inputDirPath,
          thumbnailsDirPath,
          path.basename(inputDirPath),
        );
      try {
        saveToDatabase(
          path.basename(inputDirPath),
          updates,
          createdAt ?? new Date(),
        );
        replicaFilePath = await createReadReplicaDb(inputDirPath);
        //await uploadImages(inputDirPath, false);
        //await uploadImages(thumbnailsDirPath, true);
        await deleteImages([
          ...updates.groups.data
            .filter((x) => x["@_deleted"] === 1)
            .map((x) => x["@_uid"]),
          ...updates.subgroups.data
            .filter((x) => x["@_deleted"] === 1)
            .map((x) => x["@_uid"]),
          ...updates.products.data
            .filter((x) => x["@_deleted"] === 1)
            .map((x) => x["@_uid"]),
        ]);
        return Promise.resolve();
      } catch (error) {
        console.error(
          "❌ ~ sync-handler ~ Failed to sync catalog updates from '%s', see error details below. %s",
          inputDirPath,
          error?.toString(),
        );
        if (replicaFilePath.trim().length > 0) {
          await rollbackReadReplicaDb(replicaFilePath);
        }
        await rollbackMainWithReplicaDb();
        return Promise.reject(
          `Failed to apply changes from '${inputDirPath}', see more details below. ${error?.toString()}`,
        );
      }
    },
  };
};

const saveToDatabase = (
  dirName: string,
  updates: CatalogUpdatesRoot,
  createdAt: Date,
): Result<void> => {
  const commands: Array<
    (tx: DatabaseTransaction<DatabaseSchema>, prevResult?: any) => any
  > = [];
  commands.push(...mapDiscountsToCommands(updates.discounts, createdAt));
  commands.push(...mapMeasurementsToCommands(updates.measurements, createdAt));
  commands.push(...mapColorsToCommands(updates.colors, createdAt));
  commands.push(...mapCountriesToCommands(updates.countries, createdAt));
  commands.push(...mapMakersToCommands(updates.makers, createdAt));
  commands.push(...mapGroupsToCommands(updates.groups, createdAt));
  commands.push(...mapSubgroupsToCommands(updates.subgroups, createdAt));
  commands.push(...mapProductsToCommands(updates.products, createdAt));
  commands.push(
    ...mapProductColorsToCommands(updates.product_colors, createdAt),
  );
  commands.push((tx) => setVersionTx(tx, dirName));
  withTracing &&
    console.log(
      "🐾 ~ sync-handler ~ saving parsed xml data to catalog databse, the number of commands to execute in transaction is %i",
      commands.length,
    );
  return commandManager.mutateTransactional(DatabaseType.Catalog, commands);
};

const createReadReplicaDb = async (inputDirPath: string): Promise<string> => {
  const replicaName = path.basename(inputDirPath);
  const dbCatalogPath = selectEnvironment(EnvironmentNames.DB_CATALOG_PATH);
  withTracing &&
    console.log(
      "🐾 ~ sync-handler ~ creating read replica '%s' for '%s'.",
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
        "🐾 ~ sync-handler ~ read replica created: '%s'",
        replicaFilePath,
      );
    await readReplicaManager.set(ReadReplicaTypes.Catalog, replicaFilePath);
    withTracing &&
      console.log("🐾 ~ sync-handler ~ new read replica registered.");
  } catch (error) {
    if (replicaFilePath !== undefined) {
      await readReplicaManager.rollback(
        ReadReplicaTypes.Catalog,
        replicaFilePath,
      );
    }
    return Promise.reject(error);
  }
  return replicaFilePath;
};

const rollbackReadReplicaDb = async (
  replicaFilePath: string,
): Promise<void> => {
  withTracing &&
    console.log("🐾 ~ sync-handler ~ roll back replica: '%s'", replicaFilePath);
  await readReplicaManager.rollback(ReadReplicaTypes.Catalog, replicaFilePath);
};

const rollbackMainWithReplicaDb = async (): Promise<void> => {
  const replica = await queryManager.fetch(() =>
    fetchCurrentReadReplica(ReadReplicaTypes.Catalog),
  );
  if (!replica.ok) {
    return Promise.reject(
      `Cannot restore main catalog.db as there is no read replica exist. ${replica.error ?? ""}`,
    );
  }
  const catalogDbFilePath = selectEnvironment(EnvironmentNames.DB_CATALOG_PATH);
  const replicasDirPath = selectEnvironment(
    EnvironmentNames.DB_READ_REPLICAS_PATH,
  );
  const replicaFilePath = path.join(
    replicasDirPath,
    replica.data?.fileName ?? "",
  );
  withTracing &&
    console.log(
      "🐾 ~ sync-handler ~ rolling back main catalog database '%s' with read replica: '%s'",
      catalogDbFilePath,
      replicaFilePath,
    );
  await fileManager.remove({ filePath: catalogDbFilePath });
  await fileManager.copy(replicaFilePath, catalogDbFilePath);
};

const uploadImages = async (
  inputDirPath: string,
  isThumbnails: boolean = false,
): Promise<void> => {
  const files = await fs
    .readdir(inputDirPath, { withFileTypes: true })
    .catch((error) => {
      console.error(getErrorMessage(error), error);
      return null;
    });
  const filtered = files?.filter(
    (file) => path.extname(file.name).toLowerCase() === FILE_EXTENSIION_JPG,
  );
  if (filtered === undefined || filtered.length === 0) {
    return Promise.resolve();
  }
  withTracing &&
    console.log(
      "🐾 ~ sync-handler ~ uploading image files to S3 bucket, isThumbnails: %s, files count: %i",
      isThumbnails,
      filtered.length,
    );
  for (const file of filtered) {
    const fileName = file.name.toLowerCase();
    const filePath = path.join(file.parentPath, fileName);
    if (await s3ImageManager.checkExistance(fileName, isThumbnails)) {
      await s3ImageManager.delete(fileName, isThumbnails);
    }
    await s3ImageManager.upload(filePath, isThumbnails);
  }
  return Promise.resolve();
};

const deleteImages = async (values: string[]): Promise<void> => {
  withTracing &&
    console.log(
      "🐾 ~ sync-handler ~ deleteing image files from S3 bucket, files count: %i",
      values.length,
    );
  for (const uid in values) {
    const fileName = uid.concat(FILE_EXTENSIION_JPG).toLowerCase();
    if (await s3ImageManager.checkExistance(fileName)) {
      await s3ImageManager.delete(fileName);
    }
    // thumbnails
    if (await s3ImageManager.checkExistance(fileName, true)) {
      await s3ImageManager.delete(fileName, true);
    }
  }
};

export { getCatalogSyncHandler };
