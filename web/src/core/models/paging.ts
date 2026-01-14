type Paging = {
  offset: number;
  limit: number;
};

type PagingResult = {
  total: number;
  nextOffset: number;
  prevOffset: number;
};

const defaultPaging: Paging = {
  offset: 0,
  limit: import.meta.env.DATA_RECORDS_ON_PAGE,
};

export { type Paging, type PagingResult, defaultPaging };
