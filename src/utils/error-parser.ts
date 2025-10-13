export const parseApiError = (error: unknown, featureName: string): Error => {
  if (typeof error === "string") {
    return new Error(`Failed to load ${featureName}: ${error}`);
  } else if (error instanceof Error) {
    return new Error(`Failed to load ${featureName}: ${error.message}`);
  }
  return new Error(`Unknown error occurred while loading ${featureName}.`);
};