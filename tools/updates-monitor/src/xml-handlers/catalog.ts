import fs from "fs/promises";
import { type BaseXmlHandler } from "../core";
import { XMLParser } from "fast-xml-parser";

const getCatalogXmlHandler = (withTracing: boolean = false): BaseXmlHandler => {
  return {
    parse: async <T = any>(filePath: string): Promise<T> => {
      const xmlContent = await fs.readFile(filePath);
      const parser = new XMLParser({
        ignoreAttributes: false,
        removeNSPrefix: true,
      });
      const result = parser.parse(xmlContent) as T;
      withTracing &&
        console.log(
          "🐾 ~ xml-handler ~ parsed xml file '%s', result: %o",
          filePath,
          result,
        );
      return result;
    },
  };
};

export { getCatalogXmlHandler };
