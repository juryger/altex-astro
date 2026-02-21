import { atom } from "nanostores";
import type { AlertKind } from "../const";

type Alert = {
  kind: AlertKind;
  message: string;
};

export const $alerts = atom<Alert[]>([]);

const reset = () => {
  setTimeout(() => $alerts.set([]), 100);
};

export function addAlert(value: Alert) {
  $alerts.set([...$alerts.get(), value]);
  reset();
}
