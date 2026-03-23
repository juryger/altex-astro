import path from "path";
import fs from "fs/promises";
import type { ReadReplicaTypes } from "@/lib/domain";
import type { BaseReadReplicaManager } from "../core";
import { FileManager } from "./file-manager";
import { getCommandManager, setReadReplica } from "@/lib/cqrs";

export const getReadReplicaManager = (): BaseReadReplicaManager => {
  const fileManager = FileManager.instance();
  const commandManager = getCommandManager();
  return {
    createDbCopy: async (
      srcPath: string,
      replicaDirName: string,
      replicaName: string,
    ): Promise<string> => {
      const dstFilePath = path.join(
        path.dirname(srcPath),
        replicaDirName,
        replicaName + path.extname(srcPath),
      );
      return fileManager.copy(srcPath, dstFilePath).then(() => dstFilePath);
    },
    setActive: async (
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
  };
};
