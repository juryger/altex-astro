enum ColorKind {
  // AB: bronze, AC: copper, CP: chromium, PB: brass, SN: mat chromium, WW: white, BB: black
  AB = 1,
  AC = 2,
  CP = 3,
  PB = 4,
  SN = 5,
  WW = 6,
  BB = 7,
}

type Color = {
  id: number;
  code: string;
  title: string;
  uid: string;
};

// TODO: title should not be hardcoded and resolved based lookup in the IndexedDB
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

export { type Color, ColorKind, ColorDictionary };
