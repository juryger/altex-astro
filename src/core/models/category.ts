export type CategoryCache = {
  id: string;
  title: string;
  slug: string;
  parentSlug?: number;
};

export type Category = {
  id: string;
  title: string;
  description?: string;
  image: string;
  slug: string;
  parentId?: string;
  parentSlug?: string;
};
