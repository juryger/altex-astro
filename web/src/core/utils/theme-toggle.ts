import {
  type LocalStorageManager,
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
  apply: (signal?: AbortSignal) => void;
}

const assertInputElements = (inputElements: ThemToggleComponents) => {
  const assertMessage = "⚠️ ~ theme-toggle ~ '%s' is not defined";

  console.assert(
    inputElements.coreEl !== null,
    assertMessage,
    Object.keys(inputElements)[0],
  );

  console.assert(
    inputElements.darkThemeEl !== null,
    assertMessage,
    Object.keys(inputElements)[1],
  );

  console.assert(
    inputElements.lightThemeEl !== null,
    assertMessage,
    Object.keys(inputElements)[2],
  );
};

const setDocumentTheme = (theme: string) => {
  console.log("🧪 ~ theme-toggle ~ setDocumentTheme:", theme);
  document.documentElement.setAttribute("data-theme", theme);
};

const syncThemeToggleControls = (
  theme: string,
  inputElements: ThemToggleComponents,
): void => {
  console.log("🧪 ~ theme-toggle ~ syncThemeToggleControls:", theme);
  setDocumentTheme(theme);
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
  value: string,
  localStorageManager: LocalStorageManager,
) => {
  // Saves user preference to localStorage
  localStorageManager.setUserThemePreference(value);
  localStorageManager.setUserThemeChangeDate(new Date());
};

const getThemeToggleManager = (
  inputElements: ThemToggleComponents,
): ThemeToggleManager => {
  assertInputElements(inputElements);

  let currentTheme: string = lightThemeName;
  let nextTheme: string = darkThemeName;
  const localStorageManager = getLocalStorageManager();

  const swapThemeVariables = () => {
    const value = currentTheme;
    currentTheme = nextTheme;
    nextTheme = value;
  };

  const onThemeToggle = () => {
    console.log("🧪 ~ theme-toggle ~ toggle handler:", nextTheme);
    setDocumentTheme(nextTheme);
    saveThemeToLocalStorage(nextTheme, localStorageManager);
    swapThemeVariables();
    console.log(
      "🧪 ~ theme-toggle ~ theme has change, current: '%s', next: '%s'",
      currentTheme,
      nextTheme,
    );
  };

  return {
    apply: (signal?: AbortSignal) => {
      currentTheme =
        localStorageManager.getUserThemePreference() ?? lightThemeName;
      if (currentTheme === undefined) {
        // Apply OS theme
        const isDeviceOSDarkTheme = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        currentTheme = isDeviceOSDarkTheme ? darkThemeName : lightThemeName;
        saveThemeToLocalStorage(currentTheme, localStorageManager);
      }
      syncThemeToggleControls(currentTheme, inputElements);

      nextTheme =
        currentTheme === darkThemeName ? lightThemeName : darkThemeName;

      inputElements.coreEl?.removeEventListener("click", onThemeToggle);
      inputElements.coreEl?.addEventListener("click", onThemeToggle, {
        signal,
      });
    },
  };
};

export {
  type ThemToggleComponents,
  type ThemeToggleManager,
  getThemeToggleManager,
};
