import { z } from "astro/zod";

const ColorSchema = z.object({
  id: z.number(),
  code: z.string(),
  title: z.string(),
});

// TODO: title should not be hardcoded and resolved based on lookup in the IndexedDB
const ColorDictionary: {
  [key: number]: { color: string; border: string; title: string };
} = {
  1: { color: "bg-amber-600", border: "border-gray-400", title: "Бронза" },
  2: { color: "bg-orange-800", border: "border-gray-400", title: "Медь" },
  3: { color: "bg-slate-200", border: "border-gray-600", title: "Хром" },
  4: { color: "bg-yellow-400", border: "border-gray-400", title: "Латунь" },
  5: { color: "bg-gray-300", border: "border-gray-600", title: "Матовый хром" },
  6: { color: "bg-white", border: "border-gray-400", title: "Белый" },
  7: { color: "bg-black", border: "border-gray-600", title: "Черный" },
};

export { ColorDictionary };
export type Color = z.infer<typeof ColorSchema>;
