interface NavPathItem {
  path: string,
  value: string,
  displayOptions: {
    isMainMenu: boolean,
    isFooter: boolean,
    isBreadcrumbs: boolean,
  }
};

interface NavPathFilter {
  isMainMenu: boolean,
  isFooter: boolean,
  isBreadcrumbs: boolean,
}

const _allNavPaths: Array<NavPathItem> = [
  { 
    path: '/', value: 'Главная', 
    displayOptions: { isMainMenu: true, isFooter: true, isBreadcrumbs: true } 
  }, 
  { 
    path: '/catalog', value: 'Каталог',
    displayOptions: { isMainMenu: true, isFooter: true, isBreadcrumbs: true } 
  },
  { 
    path: '/categories', value: 'Категории товаров',
    displayOptions: { isMainMenu: false, isFooter: false, isBreadcrumbs: false } 
  },
  {
    path: '/products', value: 'Товары',
    displayOptions: { isMainMenu: false, isFooter: false, isBreadcrumbs: false } 
  },
  { 
    path: '/about', value: 'О Компании', 
    displayOptions: { isMainMenu: true, isFooter: true, isBreadcrumbs: true } 
  },
  { 
    path: '/contact', value: 'Контакты', 
    displayOptions: { isMainMenu: true, isFooter: true, isBreadcrumbs: true } 
  },
  { 
    path: '/cart', value: 'Корзина', 
    displayOptions: { isMainMenu: false, isFooter: false, isBreadcrumbs: true } 
  },
  { 
    path: '/profile', value: 'Мой профиль', 
    displayOptions: { isMainMenu: false, isFooter: false, isBreadcrumbs: true } 
  },
  { 
    path: '/404', value: 'Страница не найдена', 
    displayOptions: { isMainMenu: false, isFooter: false, isBreadcrumbs: false } 
  },
  { 
    path: '/500', value: 'Техническая неисправность', 
    displayOptions: { isMainMenu: false, isFooter: false, isBreadcrumbs: false } 
  },
];

interface NavPathResolver {
  getAllPaths(filter: NavPathFilter): Array<NavPathItem>,
  resolvePathItem(value: string): NavPathItem | undefined,
}

const getNavPathResolver = (): NavPathResolver => {
  return {
    getAllPaths: ({ isMainMenu = false, isFooter = false, isBreadcrumbs = false }): Array<NavPathItem> => {
      var result = [..._allNavPaths];
      if (isMainMenu)
        return result.filter(x => x.displayOptions.isMainMenu === isMainMenu);
      
      if (isFooter)
        return result.filter(x => x.displayOptions.isFooter === isFooter);
      
      if (isBreadcrumbs)
        return result.filter(x => x.displayOptions.isBreadcrumbs === isBreadcrumbs);

      return result;
    },
    resolvePathItem: (value: string): NavPathItem | undefined => {
      const pathValue = value.indexOf('/') === 0 ? value : `/${value}`;
      const index: number = _allNavPaths.findIndex((x: NavPathItem) => x.path === pathValue);
      return index != -1 ? _allNavPaths.at(index) : undefined;  
    },
  }
}

export { getNavPathResolver, type NavPathItem };