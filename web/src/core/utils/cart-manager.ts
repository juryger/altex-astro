import {
  NO_VALUE_ASSIGNED,
  type CartItem,
  type ProductColor,
} from "@/lib/domain";
import { trimEnd } from "./text-formatter";
import { formatCurrency } from "@/lib/domain";

const titleProductColor = "Цвет:";
const titleProductQuantity = "Количество:";
const titleProductCode = "Артикул:";
const titleProductPrice = "Цена:";
const titleEdit = "Изменить";
const titleRemove = "Удалить";

const getPriceWithDiscount = (
  value: CartItem,
  discountIndex: number,
): string => {
  if (discountIndex === 2) {
    return `<span class="text-xs text-info">${formatCurrency(
      value.whsPrice2,
    )}</span>
      <del class="text-xs text-info">${formatCurrency(value.price)}</del>`;
  } else if (discountIndex === 1) {
    return `<span class="text-xs text-info">${formatCurrency(
      value.whsPrice1,
    )}</span>
      <del class="text-xs text-info">${formatCurrency(value.price)}</del>`;
  }
  return `<span class="text-xs text-info">${formatCurrency(value.price)}</span>
      <del class="text-xs text-info"></del>`;
};

const getColorSelectOptions = (
  value: CartItem,
  productColors: ProductColor[],
): string => {
  //console.log("~ cartManager ~ colors: %o, all %o", value.availableColors, productColors);
  var result = `<option>${NO_VALUE_ASSIGNED}</option>`;
  value.availableColors
    ?.sort((a, b) => a - b)
    .forEach((item: number) => {
      var metadata = productColors.find((x) => x.id === item);
      result = result.concat(
        `<option value="${item}"
          ${value.colorId !== undefined && value.colorId === item ? "selected" : ""}>
          ${metadata?.title}
        </option>`,
      );
    });
  return result;
};

const createCartItemMarkup = (
  value: CartItem,
  discountIndex: number,
  productColors: ProductColor[],
  updateCartCommandName: string,
  removeCarCommandtName: string,
): string => {
  return `
    <div class="flex flex-row gap-3 items-start">
      <!-- Item image and code -->
      <div class="grow-0">
        <figure class="aspect-square min-h-[80px]">
          <Image 
            src=${value.image} 
            alt=${value.title} 
            width="80" height="80" class="rounded-xl" />
        </figure>
        <div class="flex flex-col items-center">
          <span class="text-xs italic">
            ${titleProductCode}
          </span>
          <span class="text-xs italic ml-1">${value.productCode}</span>
        </div>
      </div>
      <!-- Item details (title, price, color, quantity) -->
      <div id="${value.id}" class="flex flex-col grow">
        <a href=/catalog/products/${value.slug}>
          <div class="flex flex-row align-top">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 pt-1">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
            <span class="font-bold text-xs min-h-8 pl-1">
              ${trimEnd(value.title, 100)}
            </span>
          </div>
        </a>        
        <!-- Prices -->
        <div class="flex gap-2 justify-start text-base">
          <span class="font-semibold text-xs">${titleProductPrice}</span>
          <div class="flex flex-row gap-1">
            ${getPriceWithDiscount(value, discountIndex)}
          </div>
        </div>
        <div class="mt-1 flex flex-row gap-2 justify-start">
          <!-- Color select -->
          <div class="w-26">
            <legend class="fieldset-legend font-semibold text-xs">${titleProductColor}</legend>
            <select id="${value.id}-color" name="${value.id}-color"
              ${
                value.availableColors === undefined ||
                value.availableColors.length === 0
                  ? "disabled"
                  : ""
              }
              class="select input-sm max-w-26">
              ${getColorSelectOptions(value, productColors)}
            </select>
          </div>
          <!-- Quantity -->
          <div class="w-16">
            <legend class="fieldset-legend font-semibold text-xs">${titleProductQuantity}</legend>
            <div class="flex gap-2 flex-row">
              <input id="${value.id}-quantity" name="${value.id}-quantity"
                type="number"
                class="input validator input-sm w-14"
                required
                min="1"
                max="3000"
                title="Must be between be 1 to 3000"
                value="${value.quantity}"
              />
            </div>
          </div>
        </div>
        <!-- Command buttons -->
        <div class="mt-1 flex flex-row gap-3 justify-start">
          <button name="${updateCartCommandName}" type="button" class="cursor-pointer font-medium text-sm text-primary">${titleEdit}</button>
          <button name="${removeCarCommandtName}" type="button" class="cursor-pointer font-medium text-sm text-primary">${titleRemove}</button>
        </div>
      </div>
    </div>
  `;
};

export { createCartItemMarkup };
