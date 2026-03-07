import { persistentAtom } from "@nanostores/persistent";
import type { SearchResult } from "@/lib/domain";

export const $search = persistentAtom<SearchResult[]>("search", [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export function saveSearch(values?: SearchResult[]): void {
  $search.set(values ?? []);
}
