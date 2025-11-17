import { cartActions } from "./cart";
import { userActions } from "./user";

export const server = {
  userActions,
  cartActions,
};

/* Examples of use server actions:

  import { actions } from "astro:actions";

  // 1 . Get data by calling server action
  const { data, error } = await actions.userActions.getLastVisitDate();
  console.log("🚀 ~ Header ~ user preferred theme from session:", data);
  const value = data;
  if (error) {
    console.error(
      "failed to get lastVisitDate from session:",
      error
    );
  }

  // 2. Set data by calling Server action
  const { data, error } = await actions.userActions.setLastVisitDate({
    value: Date,
  });
  if (error) {
    console.error(
      "failed to save lastVisitDate in user session:",
      error
    );
    return;
  }
*/
