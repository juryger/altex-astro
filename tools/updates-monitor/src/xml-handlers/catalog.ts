import fs from "fs/promises";
import { type BaseXmlHandler } from "../core";
import { XMLParser } from "fast-xml-parser";
import { EnvironmentNames, regexTrue, selectEnvironment } from "@/lib/domain";

const withTracing = regexTrue.test(
  selectEnvironment(EnvironmentNames.ENABLE_TRACING),
);

const getCatalogXmlHandler = (): BaseXmlHandler => {
  return {
    parse: async <T = any>(filePath: string): Promise<T> => {
      const xmlContent = await fs.readFile(filePath);
      const parser = new XMLParser({
        ignoreAttributes: false,
        removeNSPrefix: true,
      });
      const result = parser.parse(xmlContent) as T;
      withTracing &&
        console.log("🐾 ~ xml-handler ~ parsed xml file '%s'", filePath);
      return result;
    },
  };
};

export { getCatalogXmlHandler };
