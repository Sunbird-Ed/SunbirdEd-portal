import { Pipe, PipeTransform } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import { get } from 'lodash-es'

@Pipe({
  name: 'frameworkCatLabelTranslate'
})
export class FrameworkCatLabelTranslatePipe implements PipeTransform {

  constructor(private resourceService: ResourceService) { }

  private _mapping = {
    board: get(this.resourceService, 'frmelmnts.lbl.boards'),
    medium: get(this.resourceService, 'frmelmnts.lbl.medium'),
    gradeLevel: get(this.resourceService, 'frmelmnts.lbl.class'),
    publisher: get(this.resourceService, 'frmelmnts.lbl.publishedBy'),
    subject: get(this.resourceService, 'frmelmnts.lbl.subject'),
    audience: get(this.resourceService, 'frmelmnts.lbl.publishedUserType'),
    class: get(this.resourceService, 'frmelmnts.lbl.class')
  }

  private mappingProxy = new Proxy(this._mapping, {
    get(target, key) {
      return get(this.resourceService, key) || (key in target ? target[key] : key);
    }
  })

  transform(label: string | undefined, ...args: unknown[]): string | undefined {
    return this.mappingProxy[label && label.toLowerCase()];
  }
}
