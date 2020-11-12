import { Directive,  ElementRef, HostListener, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConnectionService } from '@sunbird/shared';

@Directive({
  selector: '[appOnlineOnly]'
})
export class OnlineOnlyDirective implements OnInit, OnDestroy {

  public unsubscribe$ = new Subject<void>();
  private isConnected = true;
  constructor(private el: ElementRef, private connectionService: ConnectionService, public renderer: Renderer2) {
    console.log('construct called');
  }

  @HostListener('click', ['$event']) onClick($event) {
    if (!this.isConnected) {
      $event.preventDefault();
      $event.stopPropagation();
      this.showAlertMessage();
    }
  }

  ngOnInit() {
    this.connectionService.monitor()
    .pipe(takeUntil(this.unsubscribe$)).subscribe(isConnected => {
      this.isConnected = isConnected;
      if (!isConnected) {
        this.disableElement();
      }
    });
  }

  private disableElement() {
    this.renderer.setAttribute(this.el.nativeElement, 'data-name', 'testname');
    this.renderer.addClass(this.el.nativeElement, 'disabled');
  }

  private showAlertMessage() {
    alert('You are offline');
    return false;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
