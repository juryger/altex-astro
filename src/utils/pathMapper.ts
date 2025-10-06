import { type PathItem } from '../types/common';

class PathMapper {
  private data: Array<PathItem>
  
  constructor() {
    this.data = [
      <PathItem> { path: '/', displayValue: 'Главная'}, 
      <PathItem> { path: '/about', displayValue: 'О компании'},
      <PathItem> { path: '/catalog', displayValue: 'Каталог'},
      <PathItem> { path: '/contacts', displayValue: 'Контакты'}
    ];
  }

  public getAllPaths = (): Array<PathItem> => [...this.data]; 

  public getDispalyValueForPath = ((pathItem: string): string => {
    const index: number = this.data.findIndex((x: PathItem) => x.path === pathItem);
    return index !== -1 ? this.data.at(index)?.displayValue ?? "" : "";
  });  
}

export default PathMapper;