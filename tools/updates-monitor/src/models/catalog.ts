type discount_item = {
  "@_id": number;
  "@_uid": string;
  "@_start_summ": number;
  "@_title": string;
  "@_deleted": number;
};

type measurement_item = {
  "@_id": number;
  "@_uid": string;
  "@_code": string;
  "@_title": string;
  "@_deleted": number;
};

type color_item = {
  "@_id": number;
  "@_uid": string;
  "@_code": string;
  "@_title": string;
  "@_fill_color": string;
  "@_border_color": string;
  "@_deleted": number;
};

type country_item = {
  "@_id": number;
  "@_uid": string;
  "@_code": string;
  "@_title": string;
  "@_deleted": number;
};

type maker_item = {
  "@_id": number;
  "@_uid": string;
  "@_title": string;
  "@_deleted": number;
};

type group_item = {
  "@_id": number;
  "@_uid": string;
  "@_title": string;
  "@_description": string;
  "@_has_image": number;
  "@_deleted": number;
};

type subgroup_item = {
  "@_id": number;
  "@_uid": string;
  "@_parent_uid": string;
  "@_title": string;
  "@_description": string;
  "@_has_image": number;
  "@_deleted": number;
};

type product_item = {
  "@_id": number;
  "@_uid": string;
  "@_title": string;
  "@_description": string;
  "@_measurement_uid": string;
  "@_make_country_uid": string;
  "@_maker_uid": string;
  "@_pack": number;
  "@_pack_min": number;
  "@_cost_whs1": string;
  "@_cost_whs2": string;
  "@_cost_whs3": string;
  "@_dim_length": string;
  "@_dim_width": string;
  "@_dim_height": string;
  "@_dim_diameter": string;
  "@_weight": string;
  "@_parent_uid": string;
  "@_has_image": number;
  "@_deleted": number;
};

type product_color_item = {
  "@_id": number;
  "@_uid": string;
  "@_color_uid": string;
  "@_product_uid": string;
  "@_deleted": number;
};

type CatalogUpdates = {
  catalog: CatalogUpdatesRoot;
};

type CatalogUpdatesRoot = {
  discounts: CatalogUpdatesDiscounts;
  measurements: CatalogUpdatesMeasurements;
  colors: CatalogUpdatesColors;
  countries: CatalogUpdatesCountries;
  makers: CatalogUpdatesMakers;
  groups: CatalogUpdatesGroups;
  subgroups: CatalogUpdatesSubgroups;
  products: CatalogUpdatesProducts;
  product_colors: CatalogUpdatesProductColors;
};

type CatalogUpdatesDiscounts = {
  data: discount_item[];
};

type CatalogUpdatesMeasurements = {
  data: measurement_item[];
};

type CatalogUpdatesColors = {
  data: color_item[];
};

type CatalogUpdatesCountries = {
  data: country_item[];
};

type CatalogUpdatesMakers = {
  data: maker_item[];
};

type CatalogUpdatesGroups = {
  data: group_item[];
};

type CatalogUpdatesSubgroups = {
  data: subgroup_item[];
};

type CatalogUpdatesProducts = {
  data: product_item[];
};

type CatalogUpdatesProductColors = {
  data: product_color_item[];
};

export type {
  CatalogUpdates,
  CatalogUpdatesRoot,
  CatalogUpdatesDiscounts,
  CatalogUpdatesMeasurements,
  CatalogUpdatesColors,
  CatalogUpdatesCountries,
  CatalogUpdatesMakers,
  CatalogUpdatesGroups,
  CatalogUpdatesSubgroups,
  CatalogUpdatesProducts,
  CatalogUpdatesProductColors,
};
