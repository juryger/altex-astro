interface NavPathItem {
  path: string,
  value: string,
  __url: string,
  displayOptions: {
    isMainMenu: boolean,
    isFooter: boolean,
    isBreadcrumbs: boolean,
  }
};

export default class NavPathResolver {
  private data: Array<NavPathItem>
  
  constructor() {
    this.data = [
      { path: '/', value: 'Главная', __url: '', 
        displayOptions: { isMainMenu: true, isFooter: true, isBreadcrumbs: true } }, 
        { path: '/catalog', value: 'Каталог', __url: '', 
          displayOptions: { isMainMenu: true, isFooter: true, isBreadcrumbs: true } },
        { path: '/categories', value: 'Категории товаров', __url: '', 
          displayOptions: { isMainMenu: false, isFooter: false, isBreadcrumbs: false } },
        { path: '/products', value: 'Товары', __url: '', 
          displayOptions: { isMainMenu: false, isFooter: false, isBreadcrumbs: false } },
      { path: '/about', value: 'О Компании', __url: '', 
        displayOptions: { isMainMenu: true, isFooter: true, isBreadcrumbs: true } },
      { path: '/contact', value: 'Контакты', __url: '', 
        displayOptions: { isMainMenu: true, isFooter: true, isBreadcrumbs: true } },
      { path: '/cart', value: 'Корзина', __url: '', 
        displayOptions: { isMainMenu: false, isFooter: false, isBreadcrumbs: true } },
      { path: '/profile', value: 'Мой профиль', __url: '', 
        displayOptions: { isMainMenu: false, isFooter: false, isBreadcrumbs: true } },
    ];
  }

  public resolveAllPaths = ({ isMainMenu = false, isFooter = false, isBreadcrumbs = false } = {}): Array<NavPathItem> => {
    var result = [...this.data];
    if (isMainMenu)
      return result.filter(x => x.displayOptions.isMainMenu === isMainMenu);
    
    if (isFooter)
      return result.filter(x => x.displayOptions.isFooter === isFooter);
    
    if (isBreadcrumbs)
      return result.filter(x => x.displayOptions.isBreadcrumbs === isBreadcrumbs);

    return result;
  }

  public resolvePathItem = ((value: string): NavPathItem | undefined => {
    const pathValue = value.indexOf('/') === 0 ? value : `/${value}`;
    const index: number = this.data.findIndex((x: NavPathItem) => x.path === pathValue);
    return index != -1 ? this.data.at(index) : undefined;
  });  
}

export type { NavPathItem };
