import type { Paging } from "@/lib/domain";

const defaultPaging: Paging = {
  page: 0,
  pageSize: Number.parseInt(import.meta.env.DATA_RECORDS_ON_PAGE, 10),
};

export { defaultPaging };
