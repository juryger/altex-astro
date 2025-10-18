import { type WorkerInfo } from "../utils/workers-factory";

export {}

declare global {
  interface Window {
    workers: WorkerInfo;
  }
}