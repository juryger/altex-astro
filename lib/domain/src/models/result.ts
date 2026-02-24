type Result<T = any> = {
  status: "Ok" | "Failed";
  data?: T | undefined;
  error?: Error | undefined;
};

export type { Result };
