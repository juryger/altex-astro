const delay = (delayMs: number): Promise<void> => {
  return new Promise((r) => {
    setTimeout(() => r(), delayMs);
  });
};

const delayWithRetry = async (
  delayMs: number,
  retries: number,
  validateFn: () => boolean,
): Promise<boolean> => {
  let retriesCounter = retries;
  let isValidated = false;

  while (!isValidated || retriesCounter-- >= 0) {
    await delay(delayMs);
    isValidated = validateFn();
  }

  if (!isValidated) {
    console.warn(
      "~ delayWithRetry ~ validate function is not fullfiled in %i attemp(s)",
      retries,
    );
  }

  return isValidated;
};

export { delay, delayWithRetry };
