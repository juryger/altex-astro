const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const delayWithRetry = (
  ms: number,
  validateFn: () => boolean,
  attemps: number
) => {
  let retries = attemps;
  let isValidated = false;

  while (!isValidated || retries-- >= 0) {
    delay(ms);
    isValidated = validateFn();
  }

  if (!isValidated) {
    console.warn(
      "~ delayWithRetry ~ unable to validate function after %i attemps",
      attemps
    );
  } else {
    console.log(
      "~ delayWithRetry ~ provided function has been validated after %i attemps",
      attemps - retries
    );
  }
};
