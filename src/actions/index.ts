import { userActions } from "./user";

export const server = {
  userActions,
};

/* Examples of use server actions:

  import { actions } from "astro:actions";

  // 1 . Get data by calling server action
  const { data, error } = await actions.userActions.getPreferredTheme();
  console.log("🚀 ~ Header ~ user preferred theme from session:", data);
  currentTheme = data;
  if (error) {
    console.error(
      "applyThemeToggle ~ failed to save new theme value in user session:",
      error
    );
  }

  // 2. Set data by calling Server action
  const { data, error } = await actions.userActions.setPreferredTheme({
    value: newTheme,
  });
  if (error) {
    console.error(
      "applyThemeToggle ~ failed to save new theme value in user session:",
      error
    );
    return;
  }
*/
