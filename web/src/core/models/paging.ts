type Pagable = {
  current: number;
  limit: number;
};

const defaultPaging: Pagable = {
  current: 0,
  limit: 100,
};

export { type Pagable, defaultPaging };
