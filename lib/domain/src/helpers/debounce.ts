import { EnvironmentNames } from "../const/environment";
import { selectEnvironment } from "./environment";
import { regexTrue } from "./regex";

const withTracing = regexTrue.test(
  selectEnvironment(EnvironmentNames.ENABLE_TRACING),
);

const debounce = (
  fn: (...args: any[]) => void,
  delay: number,
): ((...args: any[]) => void) => {
  let timeoutRef: NodeJS.Timeout | undefined;
  return (...args: any[]) => {
    withTracing &&
      console.log("🐾 ~ debounce ~ function register with delay: %i ms", delay);
    clearTimeout(timeoutRef);
    timeoutRef = setTimeout(() => {
      withTracing &&
        console.log("🐾 ~ debounce ~ call fn after debounce of %i ms", delay);
      fn(...args);
    }, delay);
  };
};

export { debounce };
