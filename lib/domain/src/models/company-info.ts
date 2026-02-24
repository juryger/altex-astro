import { z } from "zod";
import { CompanyInfoKeys } from "../const/company-info";

const CompanyInfoSchema = z.object({
  id: z.number(),
  name: z.string(),
  value: z.string(),
  createdAt: z.date(),
});

export type CompanyInfo = z.infer<typeof CompanyInfoSchema>;
