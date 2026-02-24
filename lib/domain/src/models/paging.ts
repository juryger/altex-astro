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

function getEmptyPageResult<T = any>(): PageResult<T> {
  return {
    items: [],
    pageInfo: {
      total: 0,
      page: 0,
      pageSize: 0,
      hasMore: false,
    },
  } as PageResult<T>;
}

export type { Paging, PageResult };
export { getEmptyPageResult };
