import { HostListener, Injectable, Directive } from '@angular/core';
import { ResourceService } from '@sunbird/shared';

@Injectable()
export class CanDeactivateGuard {
  constructor(public resourceService: ResourceService) { }
  canDeactivate(component: ComponentDeactivate): boolean {
    if (!component.canDeactivate()) {
      if (
        confirm(this.resourceService.frmelmnts.lbl.confirmBackClick)
      ) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }
}

@Directive()
export abstract class ComponentDeactivate {
  abstract canDeactivate(): boolean;

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (!this.canDeactivate()) {
      $event.returnValue = true;
    }
  }
}
