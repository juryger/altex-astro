export type WorkerInfo = {
  [key: string]: Worker;
};

export type WorkerFactory = {
  findOrCreateCatalogSyncWorker(
    onMessage: (msg: MessageEvent<any>, workerName: string) => void,
    onError: (err: ErrorEvent, workerName: string) => void
  ): Worker;
  terminateWorker(workers: WorkerInfo, name: string): void;
};

export const getWorkerFactory = (workers: WorkerInfo): WorkerFactory => {
  console.log("🚀 ~ getWorkersactory ~ workers collection:", { ...workers });
  return {
    findOrCreateCatalogSyncWorker: (
      onMessage: (msg: MessageEvent<any>, workerName: string) => void,
      onError: (err: ErrorEvent, workerName: string) => void
    ): Worker => {
      const name: string = "catalog-sync-worker";
      if (name in workers) {
        console.log(
          "🚀 ~ getWorkersFactory ~ findOrCreateCatalogSyncWorker ~ using earlier created worker:",
          name
        );
        return workers[name];
      }
      console.log(
        "🚀 ~ getWorkersFactory ~ findOrCreateCatalogSyncWorker ~ prepare new instance of worker:",
        name
      );
      const worker = new Worker(
        new URL("../workers/catalog-sync-worker.ts", import.meta.url),
        {
          type: "module",
        }
      );
      worker.onmessage = (e) => {
        onMessage(e, name);
      };
      worker.onerror = (e) => {
        onError(e, name);
      };
      workers[name] = worker;

      return worker;
    },
    terminateWorker: (workers: WorkerInfo, name: string) => {
      if (name in workers) {
        console.log("🚀 ~ getWorkersFactory ~ terminateWorker:", name);
        const worker = window.workers[name];
        worker.terminate();
        delete window.workers[name];
      }
    },
  };
};
