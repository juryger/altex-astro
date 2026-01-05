import { type WorkerInfo } from "./core/factories/worker-factory";

export {};

declare global {
  interface Window {
    workers: WorkerInfo;
  }
}
