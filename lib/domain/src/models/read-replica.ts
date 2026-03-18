import { z } from "zod";
import { ReadReplicaTypes } from "../const";

export const ReadReplicaSchema = z.object({
  id: z.number(),
  type: z.number().default(ReadReplicaTypes.Catalog),
  fileName: z.string(),
  createdAt: z.date(),
});

function getInitialReplica(type: number): ReadReplica {
  let name: string;
  switch (type) {
    case ReadReplicaTypes.Catalog:
      name = "catalog";
      break;
    default:
      console.error("Unsupported read replica type:", type);
      name = "unsupported";
      break;
  }
  return {
    id: -1, // means not coming from db
    type,
    fileName: `${name}-initial.db`,
    createdAt: new Date(Date.now()),
  } as ReadReplica;
}

export type ReadReplica = z.infer<typeof ReadReplicaSchema>;
export { getInitialReplica };
