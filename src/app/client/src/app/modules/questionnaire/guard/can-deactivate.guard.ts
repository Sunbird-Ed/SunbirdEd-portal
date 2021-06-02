import { Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";
import { ComponentCanDeactivate } from "./component-can-deactivate";
import { ResourceService } from '@sunbird/shared';

@Injectable()
export class CanDeactivateGuard
  implements CanDeactivate<ComponentCanDeactivate>
{
  constructor(public resourceService: ResourceService){}
  canDeactivate(component: ComponentCanDeactivate): boolean {
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
