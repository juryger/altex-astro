import { atom } from 'nanostores'

export const $lastVisitedPage = atom<string | undefined>(undefined);

export function setLatVisitedPage(value: string | undefined) {
  $lastVisitedPage.set(value);
}