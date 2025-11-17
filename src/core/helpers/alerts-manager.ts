import { AlertKind, AlertStylesDictionary } from "../models/alert";

const createAlert = (id: string, type: AlertKind, message: string): string => {
  var key: string = "default";
  if (type === AlertKind.Info) {
    key = "info";
  } else if (type === AlertKind.Success) {
    key = "success";
  } else if (type === AlertKind.Warning) {
    key = "warning";
  } else if (type === AlertKind.Error) {
    key = "error";
  }

  const alertConfig =
    AlertStylesDictionary[key] || AlertStylesDictionary.default;

  return `
    <div id="${id}" role="alert" class="${alertConfig.class}">
      ${alertConfig.icon}
      <span>${message}</span>
    </div>
  `;
};

export { createAlert };
