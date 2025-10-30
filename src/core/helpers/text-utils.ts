export interface TextHelperOperations {
  trimEnd(value: string, requiredLen: number, trailingSymbol?: string): string;
}

const paddinLen = 3;

export const getTextHandler = (): TextHelperOperations => {
  return {
    trimEnd: (
      value: string,
      requiredLen: number,
      trailingSymbol: string = "."
    ): string => {
      if (!value) return "";
      return value.length > requiredLen
        ? value
            .substring(0, requiredLen - 2 * paddinLen)
            .padEnd(requiredLen - paddinLen, trailingSymbol)
            .concat(value.substring(value.length - paddinLen))
        : value;
    },
  };
};
