enum LiveCollectionNames {
  Categories = "categories",
  Products = "products",
}

enum APIEndpointNames {
  Categories = "categories",
  Products = "products",
}

enum APISearchParamNames {
  Category = "category",
  Parent = "parent",
  IgnoreParent = "ingoreParent",
  Page = "page",
  PageSize = "pageSize",
}

enum NavPathNames {
  Home = "",
  Catalog = "catalog",
  Categories = "categories",
  Products = "products",
  About = "about",
  Contacts = "contacts",
  ShoppingCart = "shopping-cart",
  MyProfile = "my-profile",
  PageNotFound = "404",
  ServerError = "500",
}

enum ProductColor {
  // AB: bronze, AC: copper, CP: chromium, PB: brass, SN: mat chromium, WW: white, BB: black
  AB = 0,
  AC = 1,
  CP = 2,
  PB = 3,
  SN = 4,
  WW = 5,
  BB = 6,
}

enum ProductUnitOfMeasurement {
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

export {
  LiveCollectionNames,
  NavPathNames,
  APIEndpointNames,
  APISearchParamNames,
  ProductColor,
  ProductUnitOfMeasurement,
};
