import {
  CACHE_ITEMS_LIMIT,
  CACHE_LOAD_RETRY_ATTEMPS,
  CACHE_LOAD_RETRY_DELAY_MS,
  CACHE_ITEM_LOCK_TIMEOUT_1MN,
} from "@/lib/domain/src/index.js";
import { POISONED_FOLDER_NAME } from "./consts/index.js";

interface UpdatesManager {
  run: () => Promise<void>;
}

const getUpdatesManager = (monitorDirPath: string): UpdatesManager => {
  console.log("Updates manager init");
  console.log("Cache items number limit:", CACHE_ITEMS_LIMIT);
  console.log("Poisoned folder name:", POISONED_FOLDER_NAME);
  return {
    run: async () => {
      console.log(
        "Updates manager has started monitoring over: ",
        monitorDirPath,
      );
    },
  };
};

const updatesManager = getUpdatesManager("/Users/iuriig/Temp/altex");
updatesManager.run();
