const trimEnd = (
  value: string,
  requiredLen: number,
  trailingSymbol: string = ".",
): string => {
  if (!value) return "";

  const paddingLength = 3;
  return value.length > requiredLen
    ? value
        .substring(0, requiredLen - paddingLength * 2)
        .padEnd(requiredLen - paddingLength, trailingSymbol)
    : value;
};

export { trimEnd };
