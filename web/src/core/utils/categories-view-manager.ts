import { CategoriesViewMode } from "../const";

const SLIDE_WIDTH = 300;

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
): void => {
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
      break;
    default:
      console.error("Unsupported categories view mode", viewMode);
      return;
  }
};

const handleSlide = (
  sliderEl: Element | null,
  slideWidth: number = SLIDE_WIDTH,
) => {
  sliderEl?.scrollBy({ left: slideWidth, behavior: "smooth" });
};

// Handle categories view mode
const getCategoriesViewManager = (
  inputElements: CategoriesViewComponents,
  cardWidth: number = 300,
): CategoriesViewManager => {
  assertInputElements(inputElements);
  return {
    apply: (signal: AbortSignal) => {
      const viewModeInput = inputElements.selectModeEl as HTMLInputElement;
      viewModeInput?.addEventListener(
        "change",
        (e) =>
          handleViewModeChange(
            (e.target as HTMLInputElement).value,
            inputElements,
          ),
        { signal },
      );

      const sliderEl = inputElements.sliderEl as HTMLDivElement;

      const btnSlideNext = inputElements.slideNextEl as HTMLButtonElement;
      btnSlideNext.addEventListener(
        "click",
        () => handleSlide(sliderEl, SLIDE_WIDTH),
        { signal },
      );

      const btnSlidePrev = inputElements.slidePrevEl as HTMLButtonElement;
      btnSlidePrev.addEventListener(
        "click",
        () => handleSlide(sliderEl, -1 * SLIDE_WIDTH),
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
