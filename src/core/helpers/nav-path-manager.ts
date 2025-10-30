import { NavPathNames } from "../const";

type NavPathItem = {
  path: string;
  value: string;
  displayOptions: {
    isMainMenu: boolean;
    isFooter: boolean;
    isBreadcrumbs: boolean;
  };
};

type NavPathFilter = {
  isMainMenu: boolean;
  isFooter: boolean;
  isBreadcrumbs: boolean;
};

const _allNavPaths: Array<NavPathItem> = [
  {
    path: `${NavPathNames.Home}`,
    value: "Главная",
    displayOptions: { isMainMenu: true, isFooter: true, isBreadcrumbs: true },
  },
  {
    path: `${NavPathNames.Catalog}`,
    value: "Каталог",
    displayOptions: { isMainMenu: true, isFooter: true, isBreadcrumbs: true },
  },
  {
    path: `${NavPathNames.Categories}`,
    value: "Категории товаров",
    displayOptions: {
      isMainMenu: false,
      isFooter: false,
      isBreadcrumbs: false,
    },
  },
  {
    path: `${NavPathNames.Products}`,
    value: "Товары",
    displayOptions: {
      isMainMenu: false,
      isFooter: false,
      isBreadcrumbs: false,
    },
  },
  {
    path: `${NavPathNames.About}`,
    value: "О Компании",
    displayOptions: { isMainMenu: true, isFooter: true, isBreadcrumbs: true },
  },
  {
    path: `${NavPathNames.Contacts}`,
    value: "Контакты",
    displayOptions: { isMainMenu: true, isFooter: true, isBreadcrumbs: true },
  },
  {
    path: `${NavPathNames.Cart}`,
    value: "Корзина",
    displayOptions: { isMainMenu: false, isFooter: false, isBreadcrumbs: true },
  },
  {
    path: `${NavPathNames.MyProfile}`,
    value: "Мой профиль",
    displayOptions: { isMainMenu: false, isFooter: false, isBreadcrumbs: true },
  },
  {
    path: `${NavPathNames.PageNotFound}`,
    value: "Страница не найдена",
    displayOptions: {
      isMainMenu: false,
      isFooter: false,
      isBreadcrumbs: false,
    },
  },
  {
    path: `${NavPathNames.ServerError}`,
    value: "Техническая неисправность",
    displayOptions: {
      isMainMenu: false,
      isFooter: false,
      isBreadcrumbs: false,
    },
  },
];

interface NavPathManager {
  getAllPaths(filter: NavPathFilter): Array<NavPathItem>;
  resolvePathElement(value: string): NavPathItem | undefined;
}

const getNavPathManager = (): NavPathManager => {
  return {
    getAllPaths: ({
      isMainMenu = false,
      isFooter = false,
      isBreadcrumbs = false,
    }): Array<NavPathItem> => {
      var result = [..._allNavPaths];
      if (isMainMenu)
        return result.filter((x) => x.displayOptions.isMainMenu === isMainMenu);

      if (isFooter)
        return result.filter((x) => x.displayOptions.isFooter === isFooter);

      if (isBreadcrumbs)
        return result.filter(
          (x) => x.displayOptions.isBreadcrumbs === isBreadcrumbs
        );

      return result;
    },
    resolvePathElement: (value: string): NavPathItem | undefined => {
      //const pathValue = value.indexOf("/") === 0 ? value : `/${value}`;
      const index: number = _allNavPaths.findIndex(
        (x: NavPathItem) => x.path === value
      );
      return index != -1 ? _allNavPaths.at(index) : undefined;
    },
  };
};

export { getNavPathManager, type NavPathItem };
