import { get } from 'lodash-es';
import { Pipe, PipeTransform } from '@angular/core';
import { ResourceService } from '@sunbird/shared';

@Pipe({
  name: 'frameworkCatLabelTranslate'
})
export class FrameworkCatLabelTranslatePipe implements PipeTransform {

  private _mapping = {
    board: get(this.resourceService, 'frmelmnts.lbl.board'),
    medium: get(this.resourceService, 'frmelmnts.lbl.medium'),
    gradeLevel: get(this.resourceService, 'frmelmnts.lbl.class'),
    publisher: get(this.resourceService, 'frmelmnts.lbl.publishedBy'),
    subject: get(this.resourceService, 'frmelmnts.lbl.subject'),
    audience: get(this.resourceService, 'frmelmnts.lbl.publishedUserType'),
    class: get(this.resourceService, 'frmelmnts.lbl.class')
  }

  private mappingProxy = new Proxy(this._mapping, {
    get: (target, key) => {
      return get(this.resourceService, key) || (key in target ? target[key] : key);
    }
  })

  constructor(private resourceService: ResourceService) { }

  transform(label: string | undefined, ...args: unknown[]): string | undefined {
    return this.mappingProxy[label && label.toLowerCase()];
  }
}