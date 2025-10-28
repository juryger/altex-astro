export interface TextHelperOperations {
  trimEnd(value: string, requiredLen: number, trailingSymbol: string): string;
}

export const getTextHandler = (): TextHelperOperations => {
  return {
    trimEnd: (value: string, requiredLen: number, addingSymbol: string): string => {
      if (!value) return "";
      return value.length > requiredLen ? 
        value.substring(0, requiredLen - 3).padEnd(requiredLen, addingSymbol) : 
        value;
    }
  };
} 