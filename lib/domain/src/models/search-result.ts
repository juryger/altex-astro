import type { SearchTypes } from "../const";

type SearchResult = {
  type: SearchTypes;
  slug: string;
  title: string;
  description?: string;
  country?: string;
  price?: number;
  thumbnailImageUrl: string;
};

export type { SearchResult };
