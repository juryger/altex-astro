import { z } from "zod";
import { SyncTypes } from "../const";

export const SyncLogSchema = z.object({
  id: z.number(),
  type: z.number().default(SyncTypes.Catalog).optional(),
  fileName: z.string(),
  createdAt: z.date(),
  isFailed: z.boolean(),
  logMessage: z.string().optional(),
});

export type SyncLog = z.infer<typeof SyncLogSchema>;
