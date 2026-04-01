import type { SearchTypes } from "../const/general";

type SearchResult = {
  type: SearchTypes;
  slug: string;
  title: string;
  description?: string | undefined;
  country?: string | undefined;
  price?: number | undefined;
  thumbnailImageUrl: string;
};

export type { SearchResult };
