import type { SyncLog as DBSyncLog } from "@/lib/dal";
import { createOperationsDb, syncLog } from "@/lib/dal";
import { EnvironmentNames, selectEnvironment } from "@/lib/domain";
import type { SyncTypes } from "@/lib/domain";
import type { SyncLog } from "@/lib/domain";

const mapDomainToDatabaseModel = (entity: SyncLog): DBSyncLog => {
  return {
    id: entity.id,
    type: entity.type,
    fileName: entity.fileName,
    isFailed: entity.isFailed ? 1 : 0,
    logMessage: entity.logMessage,
  } as DBSyncLog;
};

export async function setSyncLog({
  fileName,
  type = null,
  isFailed = false,
  logMessage = null,
}: {
  fileName: string;
  type?: SyncTypes | null;
  isFailed?: boolean;
  logMessage?: string | null;
}): Promise<number> {
  const db = createOperationsDb(
    selectEnvironment(EnvironmentNames.DB_OPERATIONS_PATH),
  );
  const result = await db
    .insert(syncLog)
    .values(
      mapDomainToDatabaseModel({
        fileName,
        type,
        isFailed,
        logMessage,
      } as SyncLog),
    )
    .returning({ insertedId: syncLog.id });

  return result.at(0)?.insertedId ?? 0;
}
