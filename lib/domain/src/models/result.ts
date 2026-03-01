type Result<T = any> = {
  ok: boolean;
  data?: T | undefined;
  error?: Error | undefined;
};

const OkResult = <T = any>(value?: T | undefined): Result<T> => ({
  ok: true,
  data: value,
});

const FailedResult = <T = any>(error: Error): Result<T> => ({
  ok: false,
  error,
});

export type { Result };
export { OkResult, FailedResult };
