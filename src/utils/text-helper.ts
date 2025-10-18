export interface TextHelperOperations {
  trimEnd(requiredLen: number, trailingSymbol: string): string;
}

export const createTextHelper = (value: string | undefined): TextHelperOperations => {
  return {
    trimEnd: (requiredLen: number, addingSymbol: string): string => {
      if (!value) return "";
      return value.length > requiredLen ? 
        value.substring(0, requiredLen - 3).padEnd(requiredLen, addingSymbol) : 
        value;
    }
  };
} 