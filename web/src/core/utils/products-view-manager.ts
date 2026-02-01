import { navigate } from "astro:transitions/client";
import { DialogActionResult, ProductsSortFileds, SortOrder } from "../const";
import { regexSortParams } from "./regex";
import { constructNavigationPaths } from "./url-builder";

interface ProductsViewManager {
  apply: (signal: AbortSignal) => void;
}

type ProductsViewComponents = {
  selectSortEl: Element | null;
  sortOrderEl: Element | null;
  sortDialogEl: Element | null;
};

const assertInputElements = (inputElements: ProductsViewComponents) => {
  const assertMessage = "⚠️ ~ products-view-manager ~ '%s' is not defined";

  console.assert(
    inputElements.selectSortEl !== null,
    assertMessage,
    Object.keys(inputElements)[0],
  );

  console.assert(
    inputElements.sortOrderEl !== null,
    assertMessage,
    Object.keys(inputElements)[1],
  );

  console.assert(
    inputElements.sortDialogEl !== null,
    assertMessage,
    Object.keys(inputElements)[2],
  );
};

const getSelectedSortField = (
  inputElements: ProductsViewComponents,
): string => {
  const selectEl = inputElements.selectSortEl
    ? (inputElements.selectSortEl as HTMLSelectElement)
    : undefined;
  if (!selectEl) return ProductsSortFileds.Title;
  return selectEl.value;
};

const handleSortFieldChange = (inputElements: ProductsViewComponents): void => {
  const dialogEl = inputElements.sortDialogEl as HTMLDialogElement;
  dialogEl.showModal();
};

const handleSortOrderChange = (
  isAscending: boolean,
  inputElements: ProductsViewComponents,
): void => {
  const sortField = getSelectedSortField(inputElements);
  console.log(
    "~ products-view-manager ~ new sort order %s for field %s",
    isAscending,
    sortField,
  );

  const sortQuery = isAscending
    ? `sort:${sortField}:${SortOrder.Ascending}`
    : `sort:${sortField}:${SortOrder.Descending}`;

  let url = window.location.toString();
  url =
    url.indexOf("/sort:") !== -1
      ? url.replace(regexSortParams, sortQuery)
      : constructNavigationPaths(url, sortQuery);
  navigate(url);
};

const handleDialogClose = (
  initialSortField: string,
  inputElements: ProductsViewComponents,
): void => {
  const sortField = getSelectedSortField(inputElements);
  console.log(
    "~ products-view-manager ~ new sort field %s, initial %s",
    sortField,
    initialSortField,
  );

  let url = window.location.toString();
  const dialog = inputElements.sortDialogEl as HTMLDialogElement;
  switch (Number.parseInt(dialog.returnValue, 10)) {
    case DialogActionResult.Yes:
      const sortQueryAsc = `sort:${sortField}:${SortOrder.Ascending}`;
      url =
        url.indexOf("/sort:") !== -1
          ? url.replace(regexSortParams, sortQueryAsc)
          : constructNavigationPaths(url, sortQueryAsc);
      navigate(url);
      break;
    case DialogActionResult.No:
      const sortQueryDesc = `sort:${sortField}:${SortOrder.Descending}`;
      url =
        url.indexOf("/sort:") !== -1
          ? url.replace(regexSortParams, sortQueryDesc)
          : constructNavigationPaths(url, sortQueryDesc);
      navigate(url);
      break;
    case DialogActionResult.None:
      // Restore initial sort field
      const selectEl = inputElements.selectSortEl as HTMLSelectElement;
      selectEl.value = initialSortField;
      break;
    default:
      console.error("Unsupported dialog result", dialog.returnValue);
      break;
  }
};

// Handle products view and sort change
const getProductsViewManager = (
  inputElements: ProductsViewComponents,
): ProductsViewManager => {
  assertInputElements(inputElements);
  return {
    apply: (signal: AbortSignal) => {
      const selectEl = inputElements.selectSortEl as HTMLSelectElement;
      const initialSortField = selectEl.value;

      inputElements.selectSortEl?.addEventListener(
        "change",
        (e) =>
          initialSortField !== (e.target as HTMLSelectElement).value &&
          handleSortFieldChange(inputElements),
        { signal },
      );

      inputElements.sortDialogEl?.addEventListener(
        "close",
        (e) => handleDialogClose(initialSortField, inputElements),
        { signal },
      );

      inputElements.sortOrderEl?.addEventListener(
        "change",
        (e) =>
          handleSortOrderChange(
            (e.target as HTMLInputElement).checked,
            inputElements,
          ),
        { signal },
      );
    },
  };
};

export {
  type ProductsViewComponents,
  type ProductsViewManager,
  getProductsViewManager,
};
