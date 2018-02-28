import { PermissionService } from './../../services';
import { Directive, Renderer2, ElementRef, Input, OnInit } from '@angular/core';
@Directive({
  selector: '[appPermission]'
})
export class PermissionDirective implements OnInit {
  @Input() permission: string;
    constructor(public el: ElementRef,
      public permissionService: PermissionService,
      private renderer: Renderer2) {
    }
    ngOnInit() {
      this.permissionService.permissionAvailable$.subscribe(
        permissionAvailable => {
          if (permissionAvailable) {
            if (!this.permissionService.checkRolesPermissions(this.permission, true)) {
              this.el.nativeElement.remove();
            } else {

            }
          } else {

          }
        }
      );
    }

}
