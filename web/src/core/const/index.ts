const NO_IMAGE_FILE_NAME = "noimage.png";

enum LiveCollectionNames {
  Categories = "categories",
  Products = "products",
}

enum SessionNames {
  User = "user",
  ActiveCatalogItem = "activeCatalogItem",
  ProductsView = "productsView",
  OrdersView = "ordersView",
  OrderProductsView = "orderProductsView",
}

enum APIEndpointNames {
  Categories = "categories",
  Products = "products",
  Discounts = "discounts",
  ProductColors = "product-colors",
}

enum APISearchParamNames {
  Category = "category",
  Parent = "parent",
  SkipParentMatch = "skip_parent_match",
  Page = "page",
  PageSize = "page_size",
  SortField = "sort_field",
  SortOrder = "sort_order",
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
  Ascending = 0,
  Descending = 1,
}

enum FilterOperator {
  Equals = 0,
  NotEquals = 1,
  Greater = 2,
  Less = 3,
  GreaterOrEqual = 4,
  LessOrEqual = 5,
  In = 6,
  NotIn = 7,
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
  Title = "title",
  Price = "price",
}

enum DialogSize {
  Small = 0,
  Large = 1,
}

enum DialogActionButtons {
  None = 0,
  OK = 1,
  YesNo = 2,
  YesNoCancel = 3,
}

enum DialogActionResult {
  None = 0,
  OK = 1,
  Yes = 2,
  No = 3,
  Cancel = 4,
}

enum WorkerNames {
  Catalog = "catalog-sync-worker",
}

enum SortFields {
  Id = "id",
  Title = "title",
  Price = "price",
}

enum OrderTypes {
  Store = "STORE",
  Web = "WEB",
}

export {
  NO_IMAGE_FILE_NAME,
  LiveCollectionNames,
  SessionNames,
  NavPathNames,
  APIEndpointNames,
  APISearchParamNames,
  SortOrder,
  FilterOperator,
  TextSeparators,
  ImageContainers,
  CategoriesViewMode,
  ProductsSortFileds,
  DialogActionButtons,
  DialogActionResult,
  DialogSize,
  WorkerNames,
  SortFields,
  OrderTypes,
};
