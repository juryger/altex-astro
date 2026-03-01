type Paging = {
  page: number;
  pageSize: number;
};

type PagingResult<T = any> = {
  items: T[];
  pageInfo: {
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  };
};

function EmptyPagingResult<T = any>(): PagingResult<T> {
  return {
    items: [],
    pageInfo: {
      total: 0,
      page: 0,
      pageSize: 0,
      hasMore: false,
    },
  } as PagingResult<T>;
}

export type { Paging, PagingResult };
export { EmptyPagingResult };
