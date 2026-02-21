import type { PageResult, Paging } from "@/lib/domain/src";

const defaultPaging: Paging = {
  page: 0,
  pageSize: Number.parseInt(import.meta.env.DATA_RECORDS_ON_PAGE, 10),
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

export { defaultPaging, initEmptyPageResult };
