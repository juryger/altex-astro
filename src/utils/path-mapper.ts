import { type NavPathItem } from '../types/common';

class NavPathMapper {
  private data: Array<NavPathItem>
  
  constructor() {
    this.data = [
      <NavPathItem> { path: '/', displayValue: 'Главная'}, 
      <NavPathItem> { path: '/about', displayValue: 'О Компании'},
      <NavPathItem> { path: '/catalog', displayValue: 'Каталог'},
      <NavPathItem> { path: '/contact', displayValue: 'Контакты'}
    ];
  }

  public getAllPaths = (): Array<NavPathItem> => [...this.data]; 

  public getDispalyValueForPath = ((pathItem: string): string => {
    const index: number = this.data.findIndex((x: NavPathItem) => x.path === pathItem);
    return index !== -1 ? this.data.at(index)?.displayValue ?? "" : "";
  });  
}

export default NavPathMapper;