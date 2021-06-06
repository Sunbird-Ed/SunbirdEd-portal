import { HostListener, Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";
import { ResourceService } from '@sunbird/shared';

@Injectable()
export class CanDeactivateGuard
  implements CanDeactivate<ComponentDeactivate>
{
  constructor(public resourceService: ResourceService){}
  canDeactivate(component: ComponentDeactivate): boolean {
    if (!component.canDeactivate()) {
      if (
        confirm(this.resourceService.frmelmnts.alert.confirmBackClick)
      ) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }
}

export abstract class ComponentDeactivate {
  abstract canDeactivate(): boolean;

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (!this.canDeactivate()) {
      $event.returnValue = true;
    }
  }
}