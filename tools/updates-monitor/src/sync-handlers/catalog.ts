import path from "path";
import fs from "fs/promises";
import {
  EnvironmentNames,
  getErrorMessage,
  ImageContainers,
  ReadReplicaTypes,
  selectEnvironment,
  SyncTypes,
  type Result,
} from "@/lib/domain";
import { FILE_EXTENSIION_JPG } from "@/lib/domain";
import { getCommandManager } from "@/lib/cqrs";
import { DatabaseType, type DbTransaction } from "@/lib/dal";
import { type BaseSyncHandler } from "../core";
import type { CatalogUpdatesRoot } from "../models/catalog";
import { getReadReplicaManager } from "../utils/read-replica-manager";
import { FileManager } from "../utils/file-manager";
import { getS3ImageManager } from "../utils/s3-image-manager";

const fileManager = FileManager.instance();
const commandManager = getCommandManager();
const readReplicaManager = getReadReplicaManager();
const s3ImageManager = getS3ImageManager();

const getCatalogSyncHandler = (
  withTracing: boolean = false,
): BaseSyncHandler => {
  return {
    getSyncType: () => SyncTypes.Catalog,
    synchronise: async (
      inputDirPath: string,
      updates: CatalogUpdatesRoot,
    ): Promise<void> => {
      let replicaFilePath = "";
      const thumbnailsDirPath = path.join(
        inputDirPath,
        ImageContainers.Thumbnails,
      );
      withTracing &&
        console.log(
          "🐾 ~ sync-handler ~ sync data from direcotry '%s'",
          inputDirPath,
        );
      try {
        saveToDatabase(updates, withTracing);
        replicaFilePath = await createReadReplica(inputDirPath);
        await uploadImages(inputDirPath, false, withTracing);
        await uploadImages(thumbnailsDirPath, true, withTracing);
        await deleteImages(
          [
            ...updates.groups.data
              .filter((x) => x["@_deleted"] === 1)
              .map((x) => x["@_uid"]),
            ...updates.subgroups.data
              .filter((x) => x["@_deleted"] === 1)
              .map((x) => x["@_uid"]),
            ...updates.products.data
              .filter((x) => x["@_deleted"] === 1)
              .map((x) => x["@_uid"]),
          ],
          withTracing,
        );
        return Promise.resolve();
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error(errorMessage);
        if (replicaFilePath.trim().length > 0) {
          await rollbackReadReaplica(replicaFilePath, true);
        }
        return Promise.reject(errorMessage);
      }
    },
  };
};

const saveToDatabase = (
  value: CatalogUpdatesRoot,
  withTracing: boolean = false,
): Result<void> => {
  const commands: Array<(tx: DbTransaction, prevResult: any) => Promise<any>> =
    [];
  if (value.discounts.data.length > 0) {
    commands.push();
  }
  withTracing &&
    console.log(
      "🐾 ~ sync-handler ~ saving parsed xml data to catalog databse",
    );
  return commandManager.mutateTransactional(DatabaseType.Catalog, commands);
};

const createReadReplica = async (
  inputDirPath: string,
  withTracing: boolean = false,
): Promise<string> => {
  const catalogDbFilePath = selectEnvironment(EnvironmentNames.DB_CATALOG_PATH);
  const replicasDirPath = selectEnvironment(
    EnvironmentNames.DB_READ_REPLICAS_PATH,
  );
  const replicaDbFilePath = await readReplicaManager.createDbCopy(
    catalogDbFilePath,
    replicasDirPath,
    path.basename(inputDirPath),
  );
  withTracing &&
    console.log(
      "🐾 ~ sync-handler ~ created read replica of catalog.db, replica file: '%s'",
      replicaDbFilePath,
    );
  await readReplicaManager.set(ReadReplicaTypes.Catalog, replicaDbFilePath);
  withTracing &&
    console.log(
      "🐾 ~ sync-handler ~ new read replica registered in operations.db",
    );
  return Promise.resolve(replicaDbFilePath);
};

const rollbackReadReaplica = async (
  replicaFilePath: string,
  withTracing: boolean = false,
): Promise<void> => {
  withTracing &&
    console.log(
      "🐾 ~ sync-handler ~ rolling back replica: '%s'",
      replicaFilePath,
    );
  await fileManager.remove(replicaFilePath);
  await readReplicaManager.rollback(ReadReplicaTypes.Catalog, replicaFilePath);
  return Promise.resolve();
};

const uploadImages = async (
  inputDirPath: string,
  isThumbnails: boolean = false,
  withTracing: boolean = false,
): Promise<void> => {
  const files = await fs.readdir(inputDirPath).catch((error) => {
    console.error(getErrorMessage(error), error);
    return null;
  });
  const filtered = files?.filter(
    (file) => path.extname(file) === FILE_EXTENSIION_JPG,
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
    await s3ImageManager.upload(file, isThumbnails);
  }
  return Promise.resolve();
};

const deleteImages = async (
  values: string[],
  withTracing: boolean = false,
): Promise<void> => {
  withTracing &&
    console.log(
      "🐾 ~ sync-handler ~ deleteing image files from S3 bucket, files count: %i",
      values.length,
    );
  for (const uid in values) {
    await s3ImageManager.delete(uid.concat(FILE_EXTENSIION_JPG));
    await s3ImageManager.delete(uid.concat(FILE_EXTENSIION_JPG), true); // thumbnails
  }
  return Promise.resolve();
};

export { getCatalogSyncHandler };
