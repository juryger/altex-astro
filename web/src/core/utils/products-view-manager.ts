import { navigate } from "astro:transitions/client";
import { DialogActionResult, ProductsSortFileds, SortOrder } from "../const";
import { regexPageParams, regexSortParams } from "./regex";
import { constructNavigationPaths } from "./url-builder";

interface ProductsViewManager {
  apply: (signal: AbortSignal) => void;
}

type ProductsViewComponents = {
  selectSortEl: Element | null;
  sortOrderEl: Element | null;
  sortDialogEl: Element | null;
  pageActionPrevEl: Element | null;
  pageActionNextEl: Element | null;
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
  pageSize: number,
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

  // reset paging on sort change
  if (url.indexOf("/page:") !== -1)
    url = url.replace(regexPageParams, `page:${0}:${pageSize}`);

  navigate(url);
};

const handleDialogClose = (
  initialSortField: string,
  pageSize: number,
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

      // reset paging on sort change
      if (url.indexOf("/page:") !== -1)
        url = url.replace(regexPageParams, `page:${0}:${pageSize}`);

      navigate(url);
      break;
    case DialogActionResult.No:
      const sortQueryDesc = `sort:${sortField}:${SortOrder.Descending}`;
      url =
        url.indexOf("/sort:") !== -1
          ? url.replace(regexSortParams, sortQueryDesc)
          : constructNavigationPaths(url, sortQueryDesc);

      // reset paging on sort change
      if (url.indexOf("/page:") !== -1)
        url = url.replace(regexPageParams, `page:${0}:${pageSize}`);

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

const handlePageNavigation = (pageQuery: string) => {
  let url = window.location.toString();
  url =
    url.indexOf("/page:") !== -1
      ? url.replace(regexPageParams, pageQuery)
      : constructNavigationPaths(url, pageQuery);
  navigate(url);
};

const handlePreviousPageNavigation = (pagePrev: number, pageSize: number) => {
  if (pagePrev === -1) return;
  const pageQuery = `page:${pagePrev}:${pageSize}`;
  handlePageNavigation(pageQuery);
};

const handleNextPageNavigation = (pageNext: number, pageSize: number) => {
  if (pageNext === -1) return;
  const pageQuery = `page:${pageNext}:${pageSize}`;
  handlePageNavigation(pageQuery);
};

// Handle products view and sort change
const getProductsViewManager = (
  inputElements: ProductsViewComponents,
  pagePrev: number = -1,
  pageNext: number = -1,
  pageSize: number = 0,
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
        (e) => handleDialogClose(initialSortField, pageSize, inputElements),
        { signal },
      );

      inputElements.sortOrderEl?.addEventListener(
        "change",
        (e) =>
          handleSortOrderChange(
            (e.target as HTMLInputElement).checked,
            pageSize,
            inputElements,
          ),
        { signal },
      );

      inputElements.pageActionPrevEl?.addEventListener(
        "click",
        (e) => handlePreviousPageNavigation(pagePrev, pageSize),
        { signal },
      );

      inputElements.pageActionNextEl?.addEventListener(
        "click",
        (e) => handleNextPageNavigation(pageNext, pageSize),
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
