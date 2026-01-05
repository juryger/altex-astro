enum DiscountKind {
  Default = 0,
  WhsPrice = 1,
  SpecialPrice = 2,
}

type Discount = {
  id: number;
  sum: number;
};

const DiscountMetadata: Array<{ sum: number; title: string }> = [
  { sum: 1, title: "Розница" },
  { sum: 30000, title: "Оптовая" },
  { sum: 100000, title: "Специальная" },
];

export { type Discount, DiscountKind, DiscountMetadata };
