import type { CartItem } from "../models/cart";
import { ColorDictionary } from "../models/color";
import { getTextHandler } from "./text-utils";

const titleProductColor = "Цвет:";
const titleProductQuantity = "Количество:";
const titleProductCode = "Артикул:";
const titleProductPrice = "Цена:";
const titleEdit = "Изменить";
const titleRemove = "Удалить";

const productsBlobStorageUrl = `${
  import.meta.env.PUBLIC_BLOB_STORAGE_PRODUCTS_URL
}`;

const createCartItemMakrup = (
  value: CartItem,
  updateCartCommandName: string,
  removeCarCommandtName: string
): string => {
  const textHandler = getTextHandler();
  const colorsSelectOptions = Object.keys(ColorDictionary).forEach(
    (key: string, index: number) => {
      var item = ColorDictionary[index];
      return `<option ${value.color && value.color === index ? "selected" : ""}>
        ${item.title}
      </option>`;
    }
  );

  return `
    <div class="flex flex-row gap-3 items-start">
      <div class="grow-0">
        <figure class="aspect-square lg:aspect-auto min-h-[80px]">
          <Image 
            src=${productsBlobStorageUrl.concat("/", value.image)} 
            alt=${value.title} 
            width="80" height="80" class="rounded-xl" />
        </figure>
        <div class="flex flex-row justify-start">
          <span class="text-xs italic">
            ${textHandler.trimEnd(titleProductCode, 100)}
          </span>
          <span class="text-xs italic ml-1">${value.productCode}</span>
        </div>
        <div class="flex flex-col mt-1">
          <span class="font-semibold text-xs">${titleProductPrice}</span>
          <span class="text-sm text-info">${value.price}</span>
          <del class="text-sm text-info">${value.whsPrice1}</del>
        </div>
      </div>
      <div id="${value.id}" class="flex flex-col grow">
        <span class="font-bold text-xs min-h-8">
          ${value.title}
        </span>                 
        <div>
          <legend class="fieldset-legend font-semibold text-xs">${titleProductColor}</legend>
          <select id="${value.id.concat("-color")}" 
            class="select input-sm max-w-32">
            ${colorsSelectOptions}
          </select>
        </div>
        <div>
          <legend class="fieldset-legend font-semibold text-xs">${titleProductQuantity}</legend>
          <div class="flex gap-2 flex-row">
            <input id="${value.id.concat("-quantity")}"
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
        <div class="mt-1 flex flex-row gap-3 justify-start">
          <button name="${updateCartCommandName}" type="button" class="cursor-pointer font-medium text-sm text-primary">${titleEdit}</button>
          <button name="${removeCarCommandtName}" type="button" class="cursor-pointer font-medium text-sm text-primary">${titleRemove}</button>
        </div>
      </div>
    </div>
  `;
};

export { createCartItemMakrup };
