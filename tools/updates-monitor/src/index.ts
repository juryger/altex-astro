import { EnvironmentNames, selectEnvironment } from "@/lib/domain";
import { getUpdatesManager } from "./utils/updates-manager";
import { getSlugNamesConverter } from "./utils/slug-names-converter";
import { getS3ImageManager } from "./utils/s3-image-manager";

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

/* Slug names conversion tests 
const slugConverter = getSlugNamesConverter();
console.log(
  "'%s' ->: '%s'",
  "Замочная Фурнитура",
  slugConverter.transliterate("Замочная Фурнитура"),
);
console.log(
  "'%s' -> '%s'",
  "Карабины",
  slugConverter.transliterate("Карабины"),
);
console.log("'%s' -> '%s'", "(все)", slugConverter.transliterate("(все)"));
console.log(
  "'%s' -> '%s'",
  "Стекло-држатели",
  slugConverter.transliterate("Стекло-држатели"),
);
console.log(
  "'%s' -> '%s'",
  "Замок Чебоксары ВС- 50 мм ВС2-26",
  slugConverter.transliterate("Замок Чебоксары ВС- 50 мм ВС2-26"),
);
console.log(
  "'%s' -> '%s'",
  "Замок FERRE 1323 межос 80 мм AB\CP\AC\PB",
  slugConverter.transliterate("Замок FERRE 1323 межос 80 мм AB\CP\AC\PB"),
);
console.log(
  "'%s' -> '%s'",
  "Замок эл-механический VEO 042 R L ВИНТАЖ",
  slugConverter.transliterate("Замок эл-механический VEO 042 R L ВИНТАЖ"),
);
console.log(
  "'%s' -> '%s'",
  "Замок ВС 2 -3 А Чебоксары",
  slugConverter.transliterate("Замок ВС 2 -3 А Чебоксары"),
);
console.log(
  "'%s' -> '%s'",
  "Петли мебельные секретные 80*30 золото",
  slugConverter.transliterate("Петли мебельные секретные 80*30_золото"),
);
console.log(
  "'%s' -> '%s'",
  "Хомут (10-16 мм) нерж ЗЕТ",
  slugConverter.transliterate("Хомут (10-16 мм) нерж ЗЕТ"),
);
console.log(
  "'%s' -> '%s'",
  "Горелка газовая с пьезо SF-518",
  slugConverter.transliterate("Горелка газовая с пьезо SF-518"),
);
console.log(
  "'%s' -> '%s'",
  "Шпингалет Тула №6 SL без пруж под замок L=400",
  slugConverter.transliterate("Шпингалет Тула №6 SL без пруж под замок L=400"),
);
*/
