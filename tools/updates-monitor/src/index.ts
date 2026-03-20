import { EnvironmentNames, selectEnvironment } from "@/lib/domain";
import { getUpdatesManager } from "./core";

const monitoringDirPath = selectEnvironment(
  EnvironmentNames.UPDATES_MONITORING_PATH,
);
const poisonedDirName = selectEnvironment(
  EnvironmentNames.POISONED_DIRECOTRY_NAME,
);

getUpdatesManager()
  .run({
    monitoringDirPath,
    poisonedDirName,
  })
  .then((result) => {
    console.log(`Processed '${result}' zip files.`);
  })
  .catch((error) => {
    console.error(error);
  });
