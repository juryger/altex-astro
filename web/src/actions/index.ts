import { cartActions } from "./cart";

export const server = {
  cartActions,
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
