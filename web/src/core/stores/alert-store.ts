import { atom } from "nanostores";
import type { Alert } from "../models/alert";

export const $alerts = atom<Alert[]>([]);

const reset = () => {
  setTimeout(() => $alerts.set([]), 100);
};

export function addAlert(value: Alert) {
  $alerts.set([...$alerts.get(), value]);
  reset();
}
