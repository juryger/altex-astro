type Paging = {
  offset: number;
  limit: number;
};

type PageResult<T = any> = {
  items: T[];
  pageInfo: {
    total: number;
    hasMore: boolean;
    offset: number;
    limit: number;
  };
};

const defaultPaging: Paging = {
  offset: 0,
  limit: import.meta.env.DATA_RECORDS_ON_PAGE,
};

export { type Paging, type PageResult, defaultPaging };
