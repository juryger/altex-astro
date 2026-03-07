const NO_IMAGE_FILE_NAME = "noimage.png";
const NO_VALUE_ASSIGNED = "---";
const INPUT_DEBOUNCE_DELAY_MS = 500;

enum ImageContainers {
  Categories = "categories",
  Products = "products",
  Thumbnails = "thumbnails",
}

enum ReadReplicaTypes {
  Catalog = "catalog",
}

enum SearchTypes {
  Category = "category",
  Product = "product",
}

export {
  NO_IMAGE_FILE_NAME,
  NO_VALUE_ASSIGNED,
  INPUT_DEBOUNCE_DELAY_MS,
  ImageContainers,
  ReadReplicaTypes,
  SearchTypes,
};
