import { SearchTypes, type SearchResult } from "@/lib/domain";
import { trimEnd } from "./text-formatter";
import { formatCurrency } from "@/lib/domain";

const titleCategory = "Раздел";
const titleCountryMake = "🌍";
const titleProductPrice = "Цена:";

const getCategoryItemMarkup = (value: SearchResult): string => {
  return `
    <div class="grow-0">
      <!-- Item image -->
      <a href=/catalog/products/${value.slug}>
        <figure class="aspect-square min-h-[50px]">
          <Image 
            src=${value.thumbnailImageUrl} 
            alt=${value.title} 
            width="50" height="50" class="rounded-xl" />
        </figure>
      </a>
    </div>
    <div id="${value.slug}" class="grow flex flex-col gap-1 self-center">
      <!-- Item details (title, description ) -->
      <a href=/catalog/categories/${value.slug}>
        <div class="flex flex-row align-top">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 pt-1">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
          </svg>
          <p class="font-bold text-sm pl-1 text-ellipsis whitespace-nowrap overflow-hidden w-[125px] md:w-[400px]" title="${value.title}">
            ${value.title}
          </p>
        </div>
      </a>
      <span class="text-xs" title="${value.description}">
        ${trimEnd(value.description ?? "", 180)}
      </span>
    </div>
    <div class="grow-0 self-center">
      <!-- Category badge -->
      <div class="badge badge-soft badge-primary">${titleCategory}</div>
    </div>
  `;
};

const getProductItemMarkup = (value: SearchResult): string => {
  return `
    <div class="grow-0">
      <!-- Item image -->
      <a href=/catalog/products/${value.slug}>
        <figure class="aspect-square min-h-[50px]">
          <Image 
            src=${value.thumbnailImageUrl} 
            alt=${value.title} 
            width="50" height="50" class="rounded-xl" />
        </figure>
      </a>
    </div>
    <div id="${value.slug}" class="grow flex flex-col gap-1 self-center">
      <!-- Item details (title, description, country ) -->
      <a href=/catalog/products/${value.slug}>
        <div class="flex flex-row align-top">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 pt-1">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
          </svg>
          <p class="font-bold text-xs pl-1 text-ellipsis whitespace-nowrap overflow-hidden w-[145px] md:w-[450px]" title="${value.title}">
            ${value.title}
          </p>
        </div>
      </a>
      <span class="text-xs" title="${value.description}">
        ${trimEnd(value.description ?? "", 180)}
      </span>
      <span class="text-xs">${value.country !== null ? titleCountryMake + "&nbsp;" + value.country : ""}</span>
    </div>
    <div class="grow-0 flex flex-col items-end">
      <!-- Price -->
      <span class="text-xs">${titleProductPrice}</span>
      <span class="text-xs">${formatCurrency(value.price ?? 0)}</span>
    </div>
  `;
};

const createSearchResultMarkup = (value: SearchResult): string => {
  return value.type === SearchTypes.Category
    ? getCategoryItemMarkup(value)
    : getProductItemMarkup(value);
};

export { createSearchResultMarkup };
