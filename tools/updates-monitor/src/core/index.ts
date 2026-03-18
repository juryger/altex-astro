import type { Result } from "@/lib/domain/src";
import type { SyncTypes } from "@/lib/domain/src/const";

interface BaseSyncHandler {
  getType: () => SyncTypes;
  synchronise: () => Promise<Result>;
}

interface UpdatesManager {
  run: ({
    monitoringDirPath,
    poisonedDirName,
  }: {
    monitoringDirPath: string;
    poisonedDirName: string;
  }) => Promise<number>;
}

export { type BaseSyncHandler, type UpdatesManager };
