import Breadcrumbs from "../components/Breadcrumbs.astro";

interface NavPathItem {
  path: string,
  value: string,
  url: string,
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
      { path: '', value: 'Главная', url: '', 
        displayOptions: { isMainMenu: true, isFooter: true, isBreadcrumbs: true } }, 
      { path: 'about', value: 'О Компании', url: '', 
        displayOptions: { isMainMenu: true, isFooter: true, isBreadcrumbs: true } },
      { path: 'contact', value: 'Контакты', url: '', 
        displayOptions: { isMainMenu: true, isFooter: true, isBreadcrumbs: true } },
      { path: 'catalog', value: 'Каталог', url: '', 
        displayOptions: { isMainMenu: true, isFooter: true, isBreadcrumbs: true } },
      { path: 'categories', value: 'Категории товаров', url: '', 
        displayOptions: { isMainMenu: false, isFooter: false, isBreadcrumbs: false } },
      { path: 'products', value: 'Товары', url: '', 
        displayOptions: { isMainMenu: false, isFooter: false, isBreadcrumbs: false } },
      { path: 'cart', value: 'Корзина', url: '', 
        displayOptions: { isMainMenu: false, isFooter: false, isBreadcrumbs: true } },
      { path: 'profile', value: 'Мой профиль', url: '', 
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
    const index: number = this.data.findIndex((x: NavPathItem) => x.path === value);
    return index != -1 ? this.data.at(index) : undefined;
  });  
}

export type { NavPathItem };
