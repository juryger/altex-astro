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

function initEmptyPageResult<T = any>(): PageResult<T> {
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

const defaultPaging: Paging = {
  page: 0,
  pageSize: Number.parseInt(import.meta.env.DATA_RECORDS_ON_PAGE, 10),
};

export { type Paging, type PageResult, defaultPaging, initEmptyPageResult };
