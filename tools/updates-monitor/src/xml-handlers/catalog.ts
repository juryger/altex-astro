import fs from "fs/promises";
import { type BaseXmlHandler } from "../core";
import { XMLParser } from "fast-xml-parser";

const getCatalogXmlHandler = (): BaseXmlHandler => {
  return {
    parse: async <T = any>(filePath: string): Promise<T> => {
      const xmlContent = await fs.readFile(filePath);
      const parser = new XMLParser({
        ignoreAttributes: false,
        removeNSPrefix: true,
      });
      return parser.parse(xmlContent) as T;
    },
  };
};

export { getCatalogXmlHandler };
