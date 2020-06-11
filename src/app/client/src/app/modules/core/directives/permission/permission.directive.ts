import { PermissionService } from './../../services';
import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

/**
 * Permission validator Directive
 */
@Directive({
  selector: '[appPermission]'
})
export class PermissionDirective implements OnInit {
  parentNode;

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
  constructor(elementRef: ElementRef, permissionService: PermissionService, private renderer2: Renderer2) {
  this.elementRef = elementRef;
  this.permissionService = permissionService;
  }
  ngOnInit() {
    this.parentNode = this.elementRef.nativeElement.parentNode;
    this.permissionService.permissionAvailable$.subscribe(
      (permissionAvailable: string) => {
        if (permissionAvailable && permissionAvailable === 'success') {
          if (!this.permissionService.checkRolesPermissions(this.permission)) {
            this.elementRef.nativeElement.remove();
          } else {
            this.renderer2.appendChild(this.parentNode, this.elementRef.nativeElement);
          }
        } else if (permissionAvailable && permissionAvailable === 'error') {
          this.elementRef.nativeElement.remove();
        }
      });
  }
}
