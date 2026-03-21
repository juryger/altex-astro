import type { BaseReadReplicaManager } from "../core";

export const getReadReplicaManager = (): BaseReadReplicaManager => {
  return {
    createDbCopy: async (srcPath: string, dstPath: string): Promise<void> => {
      Promise.reject("createDbCopy is not impelemented");
    },
    setActive: async (filePath: string): Promise<void> => {
      Promise.reject("setActive is not impelemented");
    },
  };
};
