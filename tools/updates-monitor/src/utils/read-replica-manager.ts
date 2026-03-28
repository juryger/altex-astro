import path from "path";
import fs from "fs/promises";
import {
  EnvironmentNames,
  regexTrue,
  selectEnvironment,
  type ReadReplicaTypes,
} from "@/lib/domain";
import { getCommandManager, getQueryManager, setReadReplica } from "@/lib/cqrs";
import type { BaseReadReplicaManager } from "../core";
import { FileManager } from "./file-manager";
import { fetchCurrentReadReplica } from "@/lib/cqrs";

const withTracing = regexTrue.test(
  selectEnvironment(EnvironmentNames.ENABLE_TRACING),
);
const replicasDirPath = selectEnvironment(
  EnvironmentNames.DB_READ_REPLICAS_PATH,
);

export const getReadReplicaManager = (): BaseReadReplicaManager => {
  const fileManager = FileManager.instance();
  const commandManager = getCommandManager();
  const queryManager = getQueryManager();
  return {
    validate: async (type: ReadReplicaTypes): Promise<void> => {
      const replica = await queryManager.fetch(() =>
        fetchCurrentReadReplica(type),
      );
      return !replica.ok && replica.error !== undefined
        ? Promise.reject(replica.error)
        : replica.data !== undefined
          ? Promise.resolve()
          : Promise.reject(`There is no read replicas with type ${type}.`);
    },
    createDbCopy: async (
      srcPath: string,
      replicaName: string,
    ): Promise<string> => {
      withTracing &&
        console.log(
          "🐾 ~ read-replica-manager ~ create copy of db from '%s' to '%s'",
          srcPath,
          replicasDirPath,
        );
      const dstFilePath = path.join(
        replicasDirPath,
        replicaName + path.extname(srcPath),
      );
      return fileManager.copy(srcPath, dstFilePath).then(() => dstFilePath);
    },
    set: async (type: ReadReplicaTypes, filePath: string): Promise<void> => {
      const isFileExist = await fileManager.checkExistence(filePath);
      if (!isFileExist) {
        return Promise.reject(`Specified path is not exist '${filePath}'`);
      }
      withTracing &&
        console.log(
          "🐾 ~ read-replica-manager ~ set replica of type %i with file '%s'",
          type,
          filePath,
        );
      const result = await commandManager.mutate<number>(() =>
        setReadReplica({
          type,
          fileName: path.basename(filePath),
        }),
      );
      return !result.ok
        ? Promise.reject(
            result.error?.message ??
              `Failed to set active replica for file '${filePath}'.`,
          )
        : Promise.resolve();
    },
    rollback: async (
      type: ReadReplicaTypes,
      filePath: string,
    ): Promise<void> => {
      withTracing &&
        console.log(
          "🐾 ~ read-replica-manager ~ rollback replica of type %i with file '%s'",
          type,
          filePath,
        );
      if (await fileManager.checkExistence(filePath)) {
        await fileManager.remove({ filePath });
      }
      const result = await commandManager.mutate<number>(() =>
        setReadReplica({
          type,
          fileName: path.basename(filePath),
          deletedAt: new Date(),
        }),
      );
      return !result.ok
        ? Promise.reject(
            result.error?.message ??
              `Failed to set active replica for file '${filePath}'.`,
          )
        : Promise.resolve();
    },
  };
};
