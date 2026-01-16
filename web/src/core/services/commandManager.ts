export interface CommandManager<T = any> {
  exec: (key: string, mutateFn: () => Promise<T>) => void;
}

export function commandManager<T = any>(): CommandManager<T> {
  return {
    exec: (key: string, mutateFn: () => Promise<T>) => {
      const result = {
        data: undefined,
        error: undefined,
        isExecuting: false,
      };

      // TODO: After executing mutateFn we need to clear cache value - becomes invalid
      // var mutateResult = await mutateFn();

      return result;
    },
  };
}
