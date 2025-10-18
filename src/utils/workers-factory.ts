export interface WorkerInfo {
  [indexer: string]: Worker;
}

export interface WorkersList {
  findOrCreateCatalogSyncWorker(
    onMessage: (e: MessageEvent<any>) => void,
    onError: (e: ErrorEvent) => void)
  : Worker;
}

export const getWorkersFactory = (workers: WorkerInfo): WorkersList => {
  return {
    findOrCreateCatalogSyncWorker: (
      onMessage: (e: MessageEvent<any>) => void,
      onError: (e: ErrorEvent) => void
    ): Worker => {
      const name: string = 'catalog-sync-worker';

      if (workers[name]) {
				console.log("🚀 ~ worker-factory ~ using earlier created worker: ", name);
        return workers[name];
      } 

      const worker = new Worker(
        new URL('../workers/catalog-sync-worker.ts', import.meta.url), { 
          type: 'module' 
        }
      );
      console.log("🚀 ~ worker-factory ~ created new instance of worker: ", name);

      worker.onmessage = (e) => {
        onMessage(e);
      };

      worker.onerror = (err) => {
        onError(err);
      };


      workers[name] = worker
      return worker;
    } 
  };
}
// Client-code to interact with worker
//worker.postMessage(input.value);

