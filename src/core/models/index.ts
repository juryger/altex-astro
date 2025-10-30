export type Pagable = {
  current: number;
  limit: number;
};

export const defaultPaging: Pagable = {
  current: 0,
  limit: 100,
};
