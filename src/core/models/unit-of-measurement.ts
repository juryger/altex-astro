enum UnitOfMeasurementKind {
  Piece = 0,
  Pack = 1,
  Set = 2,
  Ton = 3,
  Kilogram = 4,
  Gram = 5,
  Liter = 6,
  Meter = 7,
  SqMiter = 8,
  QbMiter = 9,
}

type UnitOfMeasurement = {
  id: number;
  name: string;
};

const UnitOfMeasurementMetadata: {
  [key: number]: { title: string };
} = {
  0: { title: "шт" },
  1: { title: "кор." },
  2: { title: "уп." },
  3: { title: "т" },
  4: { title: "кг" },
  5: { title: "гр" },
  6: { title: "л" },
  7: { title: "м" },
  8: { title: "м2" },
  9: { title: "м3" },
};

export {
  type UnitOfMeasurement,
  UnitOfMeasurementKind,
  UnitOfMeasurementMetadata,
};
