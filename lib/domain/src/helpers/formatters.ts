const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
  }).format(value);
};

const formatDate = (
  value: Date | number,
  options?: Intl.DateTimeFormatOptions,
): string => {
  const defaultOptions = {
    //weekday: "long", // e.g., "Tuesday"
    year: "numeric", // e.g., "2026"
    month: "numeric", // e.g., "March"
    day: "numeric", // e.g., "3"
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    //timeZoneName: "short",
  } as Intl.DateTimeFormatOptions;
  return new Intl.DateTimeFormat("ru-RU", {
    ...defaultOptions,
    ...options,
  }).format(value);
};

export { formatCurrency, formatDate };
