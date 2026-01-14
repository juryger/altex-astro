const trimEnd = (
  value: string,
  requiredLen: number,
  trailingSymbol: string = "."
): string => {
  if (!value) return "";

  const paddinLen = 3;
  return value.length > requiredLen
    ? value
        .substring(0, requiredLen - 2 * paddinLen)
        .padEnd(requiredLen - paddinLen, trailingSymbol)
        .concat(value.substring(value.length - paddinLen))
    : value;
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
  }).format(value);
};

export { trimEnd, formatCurrency };
