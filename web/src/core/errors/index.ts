class NotFoundError extends Error {
  constructor(m: string) {
    super(m);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

class ServerError extends Error {
  constructor(m: string) {
    super(m);
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

export { NotFoundError, ServerError };
