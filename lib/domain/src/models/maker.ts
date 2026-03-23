import { z } from "zod";

const MakerSchema = z.object({
  id: z.number(),
  uid: z.string(),
  title: z.string(),
  deletedAt: z.date().optional(),
});

export type Maker = z.infer<typeof MakerSchema>;
