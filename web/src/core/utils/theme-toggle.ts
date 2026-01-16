import {
  type StateManagerFeatures,
  getLocalStorageManager,
} from "./local-storage-manager";

const lightThemeName = "light";
const darkThemeName = "dark";

type ThemToggleComponents = {
  coreEl: Element | null;
  darkThemeEl: Element | null;
  lightThemeEl: Element | null;
};

interface ThemeToggleManager {
  apply: (signal: AbortSignal) => void;
  getCurrentTheme: () => string | undefined;
}

const assertInputElements = (inputElements: ThemToggleComponents) => {
  console.assert(
    inputElements.coreEl !== null,
    "⚠️ ~ applyThemeToggle ~ '%s' is not defined",
    Object.keys(inputElements)[0]
  );

  console.assert(
    inputElements.darkThemeEl !== null,
    "⚠️ ~ applyThemeToggle ~ '%s' is not defined",
    Object.keys(inputElements)[1]
  );

  console.assert(
    inputElements.lightThemeEl !== null,
    "⚠️ ~ applyThemeToggle ~ '%s' is not defined",
    Object.keys(inputElements)[2]
  );
};

const setTheme = (value: string) => {
  document.documentElement.setAttribute("data-theme", value);
};

const syncThemeToggleControls = (
  theme: string,
  inputElements: ThemToggleComponents
): void => {
  setTheme(theme);
  if (theme === darkThemeName) {
    inputElements.coreEl?.setAttribute("value", lightThemeName);
    inputElements.darkThemeEl?.classList.replace("swap-on", "swap-off");
    inputElements.lightThemeEl?.classList.replace("swap-off", "swap-on");
  } else {
    inputElements.coreEl?.setAttribute("value", darkThemeName);
    inputElements.darkThemeEl?.classList.replace("swap-off", "swap-on");
    inputElements.lightThemeEl?.classList.replace("swap-on", "swap-off");
  }
};

const saveThemeToLocalStorage = (
  theme: string,
  localStorageManager: StateManagerFeatures
) => {
  // Saves user preference to localStorage
  localStorageManager.setUserThemePreference(theme);
  localStorageManager.setUserThemeChangeDate(new Date());
};

const handleThemeToggle = (
  newTheme: string | undefined,
  currentTheme: string | undefined,
  localStorageManager: StateManagerFeatures,
  themeToggled: (value: string) => void
) => {
  if (newTheme === undefined || currentTheme === undefined) {
    console.warn("🌎 ~ theme-toggler ~ new and current are undefined");
    return;
  }

  if (newTheme === currentTheme) {
    console.warn(
      "🌎 ~ theme-toggler ~ new theme %s is the same as current '%s'",
      newTheme,
      currentTheme
    );
    return;
  }

  saveThemeToLocalStorage(newTheme, localStorageManager);

  console.log(
    "🌎 ~ theme-toggler ~ current theme switched to new theme:",
    newTheme
  );

  setTheme(newTheme);
  themeToggled(newTheme);
};

// Handle theme toggle logic with support of localStorage
const getThemeToggleManager = (
  inputElements: ThemToggleComponents
): ThemeToggleManager => {
  assertInputElements(inputElements);

  let newTheme: string | undefined;
  const localStorageManager = getLocalStorageManager();
  let currentTheme = localStorageManager.getUserThemePreference();
  if (currentTheme !== undefined)
    syncThemeToggleControls(currentTheme, inputElements);

  return {
    apply: (signal: AbortSignal) => {
      const isClientOSDarkThemeOn = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      if (currentTheme === undefined) {
        // Apply OS theme
        currentTheme = isClientOSDarkThemeOn ? darkThemeName : lightThemeName;
        if (isClientOSDarkThemeOn) {
          newTheme = lightThemeName;
          syncThemeToggleControls(darkThemeName, inputElements);
          saveThemeToLocalStorage(darkThemeName, localStorageManager);
        } else {
          newTheme = darkThemeName;
          syncThemeToggleControls(lightThemeName, inputElements);
          saveThemeToLocalStorage(lightThemeName, localStorageManager);
        }
      } else {
        newTheme =
          currentTheme === darkThemeName ? lightThemeName : darkThemeName;
      }

      const themeSelectorInput = inputElements.coreEl as HTMLInputElement;
      themeSelectorInput?.addEventListener(
        "click",
        () =>
          handleThemeToggle(
            newTheme,
            currentTheme,
            localStorageManager,
            (value: string) => {
              newTheme = currentTheme;
              currentTheme = value;
            }
          ),
        {
          signal,
        }
      );
    },
    getCurrentTheme: (): string | undefined => {
      return currentTheme;
    },
  };
};

export {
  type ThemToggleComponents,
  type ThemeToggleManager,
  getThemeToggleManager,
};
