// Handle theme toggle logic with support of localStorage 
export const applyThemeToggle = (themeSelector: Element | null, darkThemeSelector: Element | null, lightThemeSelector: Element | null): void => {  
  const localStorageKey = 'theme-toggle';
  //console.log("🚀 ~ applyThemeToggle ~ themeSelector:", themeSelector)
  //console.log("🚀 ~ applyThemeToggle ~ darkThemeSelector:", darkThemeSelector)
  //console.log("🚀 ~ applyThemeToggle ~ lightThemeSelector:", lightThemeSelector)

  // On theme switch, saves user preference to localStorage
  const themeSelectorInput = (themeSelector as HTMLInputElement);
  themeSelectorInput?.addEventListener('click', () => {
    const currentTheme = localStorage.getItem(localStorageKey) ?? 'light';
    const newTheme = (currentTheme === 'light') ? 'dark' : 'light';
    localStorage.setItem(localStorageKey, newTheme);
    console.log(`🚀 ~ applyThemeToggle ~ User changed theme to ${newTheme}, saving preferences.`);
  });

  const syncUIBasedOnClientOSTheme = (theme: string): void => {
    if (theme === 'dark') {
      themeSelector?.setAttribute('value', 'light'); 
      darkThemeSelector?.classList.replace('swap-on', 'swap-off');    
      lightThemeSelector?.classList.replace('swap-off', 'swap-on');
    } else {
      themeSelector?.setAttribute('value', 'dark');
      darkThemeSelector?.classList.replace('swap-off', 'swap-on');
      lightThemeSelector?.classList.replace('swap-on', 'swap-off');
    }
  }

  const toggleDarkTheme = (): void => {
    themeSelectorInput?.click();
    localStorage.setItem(localStorageKey, 'dark');
  }

  const toggleLightTheme = (): void => {
    themeSelectorInput?.click();
    localStorage.setItem(localStorageKey, 'light');
  }
  
  const savedTheme = localStorage.getItem(localStorageKey);
  const isClientOSDarkThemeOn = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  if (isClientOSDarkThemeOn) {
    console.log("🚀 ~ applyThemeToggle ~ Client OS theme is set to Dark.");
    syncUIBasedOnClientOSTheme('dark');
    
    if (savedTheme && savedTheme === 'light') {
      console.log("🚀 ~ applyThemeToggle ~ User have earlier saved theme, switching to Light theme.");
      toggleLightTheme();
    }
    else {
      console.log("🚀 ~ applyThemeToggle ~ Saving current theme 'Dark' as preferred.");
      localStorage.setItem(localStorageKey, 'dark');
    }
  } else {
    console.log("🚀 ~ applyThemeToggle ~ Client OS theme is set to Light (or no specific preference).");
    syncUIBasedOnClientOSTheme('light');
    
    if (savedTheme && savedTheme === 'dark') {
      console.log("🚀 ~ applyThemeToggle ~ User have earlier saved theme, switching to Dark theme.");
      toggleDarkTheme();
    } else {
      console.log("🚀 ~ applyThemeToggle ~ Saving current theme 'Light' as preferred.");
      localStorage.setItem(localStorageKey, 'light');
    }
  }
}