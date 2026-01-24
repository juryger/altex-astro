enum UnitOfMeasurementKind {
  Piece = 1,
  Box = 2,
  Pakage = 3,
  Ton = 4,
  Kilogram = 5,
  Gram = 6,
  Liter = 7,
  Meter = 8,
  SqMiter = 9,
  QbMiter = 10,
}

type UnitOfMeasurement = {
  id: number;
  code: string;
  title: string;
  uid: string;
};

const UnitOfMeasurementDictionary: {
  [key: number]: { title: string };
} = {
  1: { title: "шт" },
  2: { title: "кор." },
  3: { title: "уп." },
  4: { title: "т" },
  5: { title: "кг" },
  6: { title: "гр" },
  7: { title: "л" },
  8: { title: "м" },
  9: { title: "м2" },
  10: { title: "м3" },
};

export {
  type UnitOfMeasurement,
  UnitOfMeasurementKind,
  UnitOfMeasurementDictionary,
};
