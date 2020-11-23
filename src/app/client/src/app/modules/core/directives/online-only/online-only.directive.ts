import { Directive, ElementRef, HostListener, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ConnectionService, ResourceService, ToasterService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[appOnlineOnly]'
})
export class OnlineOnlyDirective implements OnInit, OnDestroy {
  @Input() showWarningMessage = false;
  @Input() appOnlineOnly = true;

  public unsubscribe$ = new Subject<void>();
  private isConnected = true;
  constructor(
    private el: ElementRef,
    private connectionService: ConnectionService,
    public renderer: Renderer2,
    private toastService: ToasterService,
    private resourceService: ResourceService
  ) { }

  @HostListener('click', ['$event']) onClick($event) {
    if (!this.isConnected && this.appOnlineOnly) {
      $event.preventDefault();
      $event.stopPropagation();
      if (this.showWarningMessage) {
        this.showAlertMessage();
      }
    }
  }

  ngOnInit() {
    this.connectionService.monitor()
      .pipe(takeUntil(this.unsubscribe$)).subscribe(isConnected => {
        this.isConnected = isConnected;
        if (!isConnected && this.appOnlineOnly) {
          this.disableElement();
        } else {
          this.enableElement();
        }
      });
  }

  private enableElement() {
    this.renderer.removeAttribute(this.el.nativeElement, 'disabled');
    this.renderer.removeClass(this.el.nativeElement, 'sb-btn-disabled');
    this.renderer.removeClass(this.el.nativeElement, 'disabled');
  }
  private disableElement() {
    this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
    this.renderer.addClass(this.el.nativeElement, 'sb-btn-disabled');
    this.renderer.addClass(this.el.nativeElement, 'disabled');
  }

  private showAlertMessage() {
    this.toastService.error(_.get(this.resourceService, 'frmelmnts.lbl.offline'));
    return false;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
