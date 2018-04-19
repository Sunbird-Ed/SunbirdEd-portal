import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class BreadcrumbsService {

  constructor() { }
  /**
   * An event emitter to emit dynamic data passed from a component.
   */
  dynamicBreadcrumbs: EventEmitter<any> = new EventEmitter();
  /**
   * This method emits dynamicBreadcrumbs event with the data passed from
   * the component.
   * @param data Breadcrumbs data passed from a component.
   */
  public setBreadcrumbs(data) {
    this.dynamicBreadcrumbs.emit(data);
  }

}
