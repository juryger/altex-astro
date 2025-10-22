import { type WorkerInfo } from "../factories/workers-factory";

export {}

declare global {
  interface Window {
    workers: WorkerInfo;
  }
}