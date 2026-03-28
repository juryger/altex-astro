import { z } from "zod";

const VersionSchema = z.object({
  id: z.number(),
  name: z.string(),
  createdAt: z.date(),
});

export type Version = z.infer<typeof VersionSchema>;
