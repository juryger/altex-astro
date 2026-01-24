declare namespace App {
  interface SessionData {
    user?: {
      id: number;
      name: string;
    };
    catalog: {
      activeItem: {
        parentCategory?: {
          slug: string;
          title: string;
        };
        category?: {
          slug: string;
          title: string;
        };
        product?: {
          slug: string;
          title: string;
        };
      };
    };
  }
}
