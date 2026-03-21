type discount_item = {
  "@_id": number;
  "@_uid": string;
  "@_start_summ": number;
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
  "@_cost_whs1": number;
  "@_cost_whs2": number;
  "@_cost_whs3": number;
  "@_dim_length": number;
  "@_dim_width": number;
  "@_dim_height": number;
  "@_dim_diameter": number;
  "@_weight": number;
  "@_has_image": number;
  "@_deleted": number;
};

type product_color_item = {
  "@_color_uid": string;
  "@_product_uid": string;
  "@_deleted": number;
};

type CatalogUpdates = {
  catalog: {
    discounts: {
      data: discount_item[];
    };
    measurements: {
      data: measurement_item[];
    };
    colors: {
      data: color_item[];
    };
    countries: {
      data: country_item[];
    };
    makers: {
      data: maker_item[];
    };
    groups: {
      data: group_item[];
    };
    subgroups: {
      data: subgroup_item[];
    };
    products: {
      data: product_item[];
    };
    product_colors: {
      data: product_color_item[];
    };
  };
};

export type { CatalogUpdates };
