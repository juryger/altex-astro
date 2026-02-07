import { WorkerNames } from "../const";

const createWorker = (
  name: string,
  onMessage: (msg: MessageEvent<any>) => void,
  onError: (err: ErrorEvent) => void,
): Worker => {
  let result: Worker | undefined;
  switch (name) {
    case WorkerNames.Catalog:
      result = new Worker(
        new URL("../workers/catalog-sync-worker.ts", import.meta.url),
        {
          name,
          type: "module",
        },
      );
      break;
    default:
      throw new Error(`Unsupproted worker ${name}.`);
  }

  result.onmessage = (e) => {
    console.log("~ worker-factory ~ onmessage", e);
    onMessage(e);
  };

  result.onerror = (e) => {
    console.log("~ worker-factory ~ onerror", e);
    onError(e);
  };

  return result;
};

export { createWorker };
