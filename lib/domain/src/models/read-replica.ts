import { z } from "zod";
import { ReadReplicaTypes } from "../const";

export const ReadReplicaSchema = z.object({
  id: z.number(),
  type: z.string().default(ReadReplicaTypes.Catalog),
  fileName: z.string(),
  createdAt: z.date(),
  hasErrors: z.boolean().default(false),
  syncLog: z.string().optional(),
});

function getInitialReplica(
  type: string = ReadReplicaTypes.Catalog,
): ReadReplica {
  return {
    id: -1, // means not coming from db
    type,
    fileName: `${type}-initial.db`,
    createdAt: new Date(Date.now()),
  } as ReadReplica;
}

export type ReadReplica = z.infer<typeof ReadReplicaSchema>;
export { getInitialReplica };
