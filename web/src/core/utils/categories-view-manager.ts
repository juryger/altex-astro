import { regexTrue } from "@/lib/domain";
import { CategoriesViewMode } from "../const";
import {
  getLocalStorageManager,
  type LocalStorageManager,
} from "./local-storage-manager";

const SCROLL_SHIFT_PX = 300;

interface CategoriesViewManager {
  apply: (signal: AbortSignal) => void;
}

type CategoriesViewComponents = {
  selectModeEl: Element | null;
  containerEl: Element | null;
  sliderEl: Element | null;
  slidePrevEl: Element | null;
  slideNextEl: Element | null;
};

const withTracing = regexTrue.test(import.meta.env.PUBLIC_ENABLE_TRACING);

const assertInputElements = (inputElements: CategoriesViewComponents) => {
  const assertMessage = "⚠️ ~ categories-view-manager ~ '%s' is not defined";

  console.assert(
    inputElements.selectModeEl !== null,
    assertMessage,
    Object.keys(inputElements)[0],
  );

  console.assert(
    inputElements.containerEl !== null,
    assertMessage,
    Object.keys(inputElements)[1],
  );

  console.assert(
    inputElements.sliderEl !== null,
    assertMessage,
    Object.keys(inputElements)[2],
  );

  console.assert(
    inputElements.slidePrevEl !== null,
    assertMessage,
    Object.keys(inputElements)[3],
  );

  console.assert(
    inputElements.slideNextEl !== null,
    assertMessage,
    Object.keys(inputElements)[4],
  );
};

const handleViewModeChange = (
  viewMode: string,
  inputElements: CategoriesViewComponents,
  localStorageManager: LocalStorageManager,
): void => {
  withTracing &&
    console.log(
      "🐾 ~ categories-view-manager ~ change view mode to '%s'",
      viewMode,
    );
  const currentViewMode = localStorageManager.getCategoriesViewMode();
  switch (Number.parseInt(viewMode, 10)) {
    case CategoriesViewMode.Compact:
      inputElements.containerEl?.classList.replace(
        "non-slider-container",
        "slider-container",
      );
      inputElements.sliderEl?.classList.replace("non-slider", "slider");
      inputElements.sliderEl?.classList.add("hide-scroll-bar");
      inputElements.slideNextEl?.classList.remove("btn-disabled");
      inputElements.slidePrevEl?.classList.remove("btn-disabled");
      if (currentViewMode !== CategoriesViewMode.Compact) {
        localStorageManager.setCategoriesViewMode(CategoriesViewMode.Compact);
      }
      break;
    case CategoriesViewMode.Full:
      inputElements.containerEl?.classList.replace(
        "slider-container",
        "non-slider-container",
      );
      inputElements.sliderEl?.classList.replace("slider", "non-slider");
      inputElements.sliderEl?.classList.remove("hide-scroll-bar");
      inputElements.slideNextEl?.classList.add("btn-disabled");
      inputElements.slidePrevEl?.classList.add("btn-disabled");
      if (currentViewMode !== CategoriesViewMode.Full) {
        localStorageManager.setCategoriesViewMode(CategoriesViewMode.Full);
      }
      break;
    default:
      console.error("Unsupported categories view mode", viewMode);
      return;
  }
};

const handleScrollAction = (sliderEl: Element | null, scrollShift: number) => {
  sliderEl?.scrollBy({ left: scrollShift, behavior: "smooth" });
};

const syncViewModeWithLocalStorage = (
  localStorageManager: LocalStorageManager,
  inputElements: CategoriesViewComponents,
) => {
  const viewMode = localStorageManager.getCategoriesViewMode().toString();
  const select = inputElements.selectModeEl as HTMLSelectElement;
  if (select.value !== viewMode) {
    withTracing &&
      console.log(
        "🐾 ~ categories-view-manager ~ apply earlier saved view mode '%s'",
        viewMode,
      );
    handleViewModeChange(viewMode, inputElements, localStorageManager);
    select.value = viewMode;
    select.dispatchEvent(new Event("change"));
  }
};

// Handle categories view mode change
const getCategoriesViewManager = (
  inputElements: CategoriesViewComponents,
): CategoriesViewManager => {
  assertInputElements(inputElements);

  // Set view mode based on earlier saved settings or default "Compact"
  const localStorageManager = getLocalStorageManager();
  syncViewModeWithLocalStorage(localStorageManager, inputElements);

  return {
    apply: (signal: AbortSignal) => {
      inputElements.selectModeEl?.addEventListener(
        "change",
        (e) =>
          handleViewModeChange(
            (e.target as HTMLInputElement).value,
            inputElements,
            localStorageManager,
          ),
        { signal },
      );

      const sliderEl = inputElements.sliderEl as HTMLDivElement;

      inputElements.slideNextEl?.addEventListener(
        "click",
        () => handleScrollAction(sliderEl, SCROLL_SHIFT_PX),
        { signal },
      );

      inputElements.slidePrevEl?.addEventListener(
        "click",
        () => handleScrollAction(sliderEl, -1 * SCROLL_SHIFT_PX),
        { signal },
      );
    },
  };
};

export {
  type CategoriesViewComponents,
  type CategoriesViewManager,
  getCategoriesViewManager,
};
