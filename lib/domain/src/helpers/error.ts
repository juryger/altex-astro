function getErrorMessage(error: unknown | any): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export { getErrorMessage };
