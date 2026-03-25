import path from "path";
import fs from "fs/promises";
import {
  EnvironmentNames,
  regexTrue,
  selectEnvironment,
  type ReadReplicaTypes,
} from "@/lib/domain";
import { getCommandManager, setReadReplica } from "@/lib/cqrs";
import type { BaseReadReplicaManager } from "../core";
import { FileManager } from "./file-manager";

const withTracing = regexTrue.test(
  selectEnvironment(EnvironmentNames.ENABLE_TRACING),
);

export const getReadReplicaManager = (): BaseReadReplicaManager => {
  const fileManager = FileManager.instance();
  const commandManager = getCommandManager();
  return {
    createDbCopy: async (
      srcPath: string,
      replicaDirPath: string,
      replicaName: string,
    ): Promise<string> => {
      withTracing &&
        console.log(
          "🐾 ~ read-replica-manager ~ create copy of db from '%s' to '%s'",
          srcPath,
          replicaDirPath,
        );
      const dstFilePath = path.join(
        path.dirname(srcPath),
        replicaDirPath,
        replicaName + path.extname(srcPath),
      );
      return fileManager.copy(srcPath, dstFilePath).then(() => dstFilePath);
    },
    set: async (type: ReadReplicaTypes, filePath: string): Promise<void> => {
      const isFileExist = await fs
        .access(filePath, fs.constants.F_OK)
        .then(() => true)
        .catch(() => false);
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
      const isFileExist = await fs
        .access(filePath, fs.constants.F_OK)
        .then(() => true)
        .catch(() => false);
      if (!isFileExist) {
        return Promise.reject(`Specified path is not exist '${filePath}'`);
      }
      withTracing &&
        console.log(
          "🐾 ~ read-replica-manager ~ rollback replica of type %i with file '%s'",
          type,
          filePath,
        );
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
