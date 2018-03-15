import { PermissionService } from './../../services';
import { Directive, ElementRef, Input, OnInit } from '@angular/core';

/**
 * Permission validator Directive
 */
@Directive({
  selector: '[appPermission]'
})
export class PermissionDirective implements OnInit {
  /**
   * Permission to validate
   */
  @Input() permission: Array<string>;
  /**
   * reference of permissionService service.
   */
  public permissionService: PermissionService;
  /**
   * reference of permissionService service.
   */
  public elementRef: ElementRef;
  /**
   * constructor
   */
  constructor(elementRef: ElementRef, permissionService: PermissionService) {
      this.elementRef = elementRef;
      this.permissionService = permissionService;
  }
  ngOnInit() {
    this.permissionService.permissionAvailable$.subscribe(
      (permissionAvailable: string) => {
        if (permissionAvailable && permissionAvailable === 'success') {
          if (!this.permissionService.checkRolesPermissions(this.permission)) {
            this.elementRef.nativeElement.remove();
          }
        } else if (permissionAvailable && permissionAvailable === 'error') {
          this.elementRef.nativeElement.remove();
        }
      });
  }
}
