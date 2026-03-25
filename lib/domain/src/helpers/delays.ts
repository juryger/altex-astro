const delay = (delayMs: number): Promise<NodeJS.Timeout> => {
  return new Promise((res) => {
    const timeoutRef = setTimeout(() => res(timeoutRef), delayMs);
  });
};

const delayWithRetry = async (
  delayMs: number,
  retries: number,
  validateFn: () => boolean,
): Promise<boolean> => {
  let retriesCounter = retries;
  let isValidated = false;

  while (!isValidated && retriesCounter-- > 0) {
    const timeoutRef = await delay(delayMs);
    clearTimeout(timeoutRef);
    isValidated = validateFn();
  }

  if (!isValidated) {
    console.warn(
      "⚠️ ~ delay-with-reply ~ validate function is not fullfiled in %i attemp(s)",
      retries,
    );
  }

  return isValidated;
};

export { delay, delayWithRetry };
