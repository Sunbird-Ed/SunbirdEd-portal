import { IBreadcrumb } from '../../interfaces';
import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class BreadcrumbsService {

  dynamicData: IBreadcrumb;
  /**
   * An event emitter to emit dynamic data passed from a component.
   */
  dynamicBreadcrumbs: EventEmitter<any> = new EventEmitter();
  /**
   * This method emits dynamicBreadcrumbs event with the data passed from
   * the component.
   * @param data Breadcrumbs data passed from a component.
   * The data passed should be of the following format,
   * {label: 'Breadcrumb Label', url: '/redirectUrl'}
   */
  public setBreadcrumbs(data: IBreadcrumb[]) {
    this.dynamicBreadcrumbs.emit(data);
  }

}
