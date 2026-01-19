enum DiscountKind {
  Default = 0,
  WhsPrice = 1,
  SpecialPrice = 2,
}

type Discount = {
  id: number;
  code: string;
  fromSum: number;
  title: string;
  uid: string;
};

const DiscountMetadata: Array<{ sum: number; title: string }> = [
  { sum: 0, title: "Розница" },
  { sum: 30000, title: "Оптовая" },
  { sum: 100000, title: "Специальная" },
];

export { type Discount, DiscountKind, DiscountMetadata };
