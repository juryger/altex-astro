import { getLocalStorageManager } from "./local-storage-manager";

// Handle theme toggle logic with support of localStorage
export const applyThemeToggle = (
  themeSelector: Element | null,
  darkThemeSelector: Element | null,
  lightThemeSelector: Element | null
): void => {
  const lightThemeName = "light";
  const darkThemeName = "dark";
  const localStorageManager = getLocalStorageManager();

  console.assert(
    themeSelector !== null,
    "applyThemeToggle ~ '%s' is not defined",
    Object.keys({ themeSelector })[0]
  );

  console.assert(
    darkThemeSelector !== null,
    "applyThemeToggle ~ '%s' is not defined",
    Object.keys({ darkThemeSelector })[0]
  );

  console.assert(
    lightThemeSelector !== null,
    "applyThemeToggle ~ '%s' is not defined",
    Object.keys({ lightThemeSelector })[0]
  );

  // On theme switch, saves user preference to localStorage
  const themeSelectorInput = themeSelector as HTMLInputElement;
  themeSelectorInput?.addEventListener("click", () => {
    const currentTheme = localStorageManager.getUserThemPreference();
    const newTheme =
      currentTheme === lightThemeName ? darkThemeName : lightThemeName;
    localStorageManager.setUserThemePreference(newTheme);
  });

  const syncUIBasedOnClientOSTheme = (theme: string): void => {
    if (theme === darkThemeName) {
      themeSelector?.setAttribute("value", lightThemeName);
      darkThemeSelector?.classList.replace("swap-on", "swap-off");
      lightThemeSelector?.classList.replace("swap-off", "swap-on");
    } else {
      themeSelector?.setAttribute("value", darkThemeName);
      darkThemeSelector?.classList.replace("swap-off", "swap-on");
      lightThemeSelector?.classList.replace("swap-on", "swap-off");
    }
  };

  const toggleDarkTheme = (): void => {
    themeSelectorInput?.click();
    localStorageManager.setUserThemePreference("dark");
  };

  const toggleLightTheme = (): void => {
    themeSelectorInput?.click();
    localStorageManager.setUserThemePreference("light");
  };

  const savedTheme = localStorageManager.getUserThemPreference();
  const isClientOSDarkThemeOn = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  if (isClientOSDarkThemeOn) {
    syncUIBasedOnClientOSTheme(darkThemeName);

    if (savedTheme && savedTheme === lightThemeName) {
      toggleLightTheme();
    } else {
      localStorageManager.setUserThemePreference(darkThemeName);
    }
  } else {
    syncUIBasedOnClientOSTheme(lightThemeName);

    if (savedTheme && savedTheme === darkThemeName) {
      toggleDarkTheme();
    } else {
      localStorageManager.setUserThemePreference(lightThemeName);
    }
  }
};
