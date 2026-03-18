const NO_IMAGE_FILE_NAME = "noimage.png";
const NO_VALUE_ASSIGNED = "---";
const INPUT_DEBOUNCE_DELAY_MS = 500;
const SEARCH_RESULTS_LIMIT: number = 50;
const SEARCH_RECORDS_LIMIT: number = 1000;

enum ImageContainers {
  Categories = "categories",
  Products = "products",
  Thumbnails = "thumbnails",
}

enum ReadReplicaTypes {
  Catalog = 0,
}

enum SyncTypes {
  Catalog = 0,
  CompanyInfo = 1,
  Order = 2,
}

enum SearchTypes {
  Category = 0,
  Product = 1,
}

export {
  NO_IMAGE_FILE_NAME,
  NO_VALUE_ASSIGNED,
  INPUT_DEBOUNCE_DELAY_MS,
  SEARCH_RESULTS_LIMIT,
  SEARCH_RECORDS_LIMIT,
  ImageContainers,
  ReadReplicaTypes,
  SyncTypes,
  SearchTypes,
};
