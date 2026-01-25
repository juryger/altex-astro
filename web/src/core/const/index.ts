const NO_IMAGE_FILE_NAME = "noimage.png";

enum LiveCollectionNames {
  Categories = "categories",
  Products = "products",
}

enum SessionNames {
  Catalog = "catalog",
  User = "user",
}

enum APIEndpointNames {
  Categories = "categories",
  Products = "products",
}

enum APISearchParamNames {
  Category = "category",
  Parent = "parent",
  SkipParentMatch = "skipParentMatch",
  Page = "page",
  PageSize = "pageSize",
  SortField = "sortFiled",
  SortOrder = "sortOrder",
  Filter = "filter",
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

enum SortOrder {
  Ascending = "asc",
  Descending = "desc",
}

enum TextSeparators {
  Comma = ",",
  Dot = ".",
  Colon = ":",
  Semicolon = ";",
}

enum ImageContainers {
  Thumbnails = "thumbnails",
}

enum CategoriesViewMode {
  Compact = 0,
  Full = 1,
}

enum ProductsSortFileds {
  Title = 0,
  Price = 1,
}

export {
  NO_IMAGE_FILE_NAME,
  LiveCollectionNames,
  SessionNames,
  NavPathNames,
  APIEndpointNames,
  APISearchParamNames,
  SortOrder,
  TextSeparators,
  ImageContainers,
  CategoriesViewMode,
  ProductsSortFileds,
};
