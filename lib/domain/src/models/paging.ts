type Paging = {
  page: number;
  pageSize: number;
};

type PageResult<T = any> = {
  items: T[];
  pageInfo: {
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  };
};

export { type Paging, type PageResult };
