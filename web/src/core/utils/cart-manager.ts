import type { CartItem, ProductColor } from "@/lib/domain";
import { formatCurrency, trimEnd } from "./text-formatter";

const titleProductColor = "Цвет:";
const titleProductQuantity = "Количество:";
const titleProductCode = "Артикул:";
const titleProductPrice = "Цена:";
const titleEdit = "Изменить";
const titleRemove = "Удалить";
const titleColorUnavailable = "---";

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
  console.log(
    "~ cartManager ~ colors: %o, all %o",
    value.availableColors,
    productColors,
  );
  var result = `<option>${titleColorUnavailable}</option>`;
  value.availableColors
    ?.sort((a, b) => a - b)
    .forEach((item: number) => {
      var metadata = productColors.find((x) => x.id === item);
      result = result.concat(
        `<option value="${item}"
          ${value.color !== undefined && value.color === item ? "selected" : ""}>
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
        <figure class="aspect-square lg:aspect-auto min-h-[80px]">
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
        <span class="font-bold text-xs min-h-8">
          ${trimEnd(value.title, 100)}
        </span>
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
