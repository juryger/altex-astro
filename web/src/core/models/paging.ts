type Paging = {
  page: number;
  pageSize: number;
};

type PageResult<T = any> = {
  items: T[];
  pageInfo: {
    total: number;
    page: number;
    hasMore: boolean;
  };
};

const defaultPaging: Paging = {
  page: 0,
  pageSize: import.meta.env.DATA_RECORDS_ON_PAGE,
};

export { type Paging, type PageResult, defaultPaging };
