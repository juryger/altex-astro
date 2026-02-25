import { cartActions } from "./cart";
import { internalsActions } from "./internals";

export const server = {
  cartActions,
  internalsActions,
};

/* Examples of use server actions:
  import { actions } from "astro:actions";
  const { data, error } = await actions.userActions.getLastVisitDate();
  const value = data;
  if (error) {
    console.error(
      "failed to call action",
      error
    );
  }
*/
