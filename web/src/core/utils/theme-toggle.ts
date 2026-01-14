import { getLocalStorageManager } from "./local-storage-manager";

const assertInputs = (
  themeSelector: Element | null,
  darkThemeSelector: Element | null,
  lightThemeSelector: Element | null
) => {
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
};

// Handle theme toggle logic with support of localStorage
export const applyThemeToggle = async (
  themeSelector: Element | null,
  darkThemeSelector: Element | null,
  lightThemeSelector: Element | null
): Promise<void> => {
  const lightThemeName = "light";
  const darkThemeName = "dark";
  const localStorageManager = getLocalStorageManager();

  assertInputs(themeSelector, darkThemeSelector, lightThemeSelector);

  var newTheme: string | undefined;
  var currentTheme = localStorageManager.getUserThemePreference();
  console.log(
    "🌎 ~ Header ~ user preferred theme from localStorage:",
    currentTheme
  );

  const themeSelectorInput = themeSelector as HTMLInputElement;
  themeSelectorInput?.addEventListener("click", async () => {
    // On theme switch, saves user preference to localStorage
    if (!newTheme || newTheme === currentTheme) {
      console.warn(
        "🌎 ~ Header ~ userPreferredTheme ~ theme change will not be saved as new theme '%s' is either not set or same as current '%s'",
        newTheme,
        currentTheme
      );
      return;
    }

    localStorageManager.setUserThemePreference(newTheme);
    localStorageManager.setUserThemeChangeDate(new Date());
    currentTheme = newTheme;

    console.log(
      "🌎 ~ Header ~ userPreferredTheme ~ current theme switched to new theme:",
      newTheme
    );
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
  };

  const toggleLightTheme = (): void => {
    themeSelectorInput?.click();
  };

  const isClientOSDarkThemeOn = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  if (isClientOSDarkThemeOn) {
    syncUIBasedOnClientOSTheme(darkThemeName);
    if (currentTheme && currentTheme === lightThemeName) {
      toggleLightTheme();
      newTheme = darkThemeName;
    } else {
      newTheme = lightThemeName;
    }
  } else {
    syncUIBasedOnClientOSTheme(lightThemeName);
    if (currentTheme && currentTheme === darkThemeName) {
      toggleDarkTheme();
      newTheme = lightThemeName;
    } else {
      newTheme = darkThemeName;
    }
  }
};
