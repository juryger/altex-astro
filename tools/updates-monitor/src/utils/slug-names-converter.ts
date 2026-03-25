import { EnvironmentNames, regexTrue, selectEnvironment } from "@/lib/domain";
import type { SlugNamesConverter } from "../core";

const cyrillicToLatinMap: Record<string, string> = {
  a: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "yo",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "kh",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
};

const withTracing = regexTrue.test(
  selectEnvironment(EnvironmentNames.ENABLE_TRACING),
);

export const getSlugNamesConverter = (): SlugNamesConverter => {
  return {
    transliterate: (value: string): string => {
      let result: Array<string> = [];
      const normalizedValue = value
        .toLowerCase()
        .replace(/[^a-z0-9а-яё+]/g, "")
        .toLowerCase();
      for (const chr of normalizedValue) {
        result.push(cyrillicToLatinMap[chr] ?? chr);
      }
      const transformedResult = result.join("");
      withTracing &&
        console.log(
          "🐾 ~ slug-names-converter ~ original: '%s', transformed: '%s'",
          value,
          transformedResult,
        );
      return transformedResult;
    },
  };
};
