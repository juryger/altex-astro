const selectEnvironment = (name: string) => {
  if (import.meta && Object.keys(import.meta).includes("env")) {
    // console.log(
    //   "🧪 ~ selectEnvironment ~ name %s, import-meta %o",
    //   name,
    //   (import.meta as any).env,
    // );
    const env = (import.meta as any).env;
    return env?.[name];
  }
  return process?.env?.[name];
};

export { selectEnvironment };
