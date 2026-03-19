import { EnvironmentNames, selectEnvironment } from "@/lib/domain";
import { getUpdatesManager } from "./updates-manager";

getUpdatesManager()
  .run({
    monitoringDirPath: selectEnvironment(
      EnvironmentNames.UPDATES_MONITORING_PATH,
    ),
    poisonedDirName: selectEnvironment(
      EnvironmentNames.POISONED_DIRECOTRY_NAME,
    ),
  })
  .then((result) => {
    console.log(`Processed '${result}' zip files.`);
  });
