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

export {
  LiveCollectionNames,
  NavPathNames,
  APIEndpointNames,
  APISearchParamNames,
};
