import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResourceService } from '@sunbird/shared';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable()
export class PendingchangesGuard implements CanDeactivate<ComponentCanDeactivate> {
  constructor(public resourceService: ResourceService) { }
  canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
    return component.canDeactivate() ?
      true :
      confirm(this.resourceService.frmelmnts.lbl.leavePage);
  }
}

