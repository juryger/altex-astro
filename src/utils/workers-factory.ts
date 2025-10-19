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
	console.log("🚀 ~ getWorkersFactory ~ workers:", workers);
  return {
    findOrCreateCatalogSyncWorker: (
      onMessage: (e: MessageEvent<any>) => void,
      onError: (e: ErrorEvent) => void
    ): Worker => {
      const name: string = 'catalog-sync-worker';

      console.log("🚀 ~ getWorkersFactory ~ findOrCreateCatalogSyncWorker ~ checking for worker:", (name in workers));
      console.log("🚀 ~ getWorkersFactory ~ findOrCreateCatalogSyncWorker ~ checking for worker:", Object.hasOwn(workers, name));
      console.log("🚀 ~ getWorkersFactory ~ findOrCreateCatalogSyncWorker ~ checking for worker:", workers.hasOwnProperty(name));
      if (Object.hasOwn(workers, name)) {
				console.log("🚀 ~ getWorkersFactory ~ findOrCreateCatalogSyncWorker ~ using earlier created worker: ", name);
        return workers[name];
      } 

      const worker = new Worker(
        new URL('../workers/catalog-sync-worker.ts', import.meta.url), { 
          type: 'module' 
        }
      );
      console.log("🚀 ~ getWorkersFactory ~ findOrCreateCatalogSyncWorker ~ created new instance of worker: ", name);

      worker.onmessage = (e) => {
        onMessage(e);
      };

      worker.onerror = (err) => {
        onError(err);
      };


      workers[name] = worker;
      console.log("🚀 ~ getWorkersFactory ~ findOrCreateCatalogSyncWorker ~ new instance added to window.workers collection:", window.workers);
      
      return worker;
    } 
  };
}
// Client-code to interact with worker
//worker.postMessage(input.value);

