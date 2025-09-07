import { get } from 'lodash-es';
import { Pipe, PipeTransform } from '@angular/core';
import { ResourceService } from '@sunbird/shared';

@Pipe({
  name: 'frameworkCatLabelTranslate'
})
export class FrameworkCatLabelTranslatePipe implements PipeTransform {

  private buildMapping() {
    const mapping: Record<string, string> = {};
    const fwCategoryObject = JSON.parse(localStorage.getItem('fwCategoryObject') || '{}');
  
    Object.values(fwCategoryObject).forEach((category: any) => {
      if (category?.code) {
        mapping[category.code] = category.code || category.label || category.name;
      }
    });
  
    mapping['publisher'] = get(this.resourceService, 'frmelmnts.lbl.publishedBy');
    mapping['audience'] = get(this.resourceService, 'frmelmnts.lbl.publishedUserType');
    mapping['class'] = get(this.resourceService, 'frmelmnts.lbl.class');
  
    return mapping;
  }
  private _mapping = this.buildMapping();

  private mappingProxy = new Proxy(this._mapping, {
    get: (target, key: string | symbol) => {
      if (typeof key === 'symbol') return undefined;
      return get(this.resourceService, key) || (key in target ? target[key] : key);
    }
  })

  constructor(private resourceService: ResourceService) { }

  transform(label: string | undefined, ...args: unknown[]): string | undefined {
    return this.mappingProxy[label && label.toLowerCase()];
  }
}