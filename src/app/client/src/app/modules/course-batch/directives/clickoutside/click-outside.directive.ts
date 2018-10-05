import { Directive, EventEmitter, ElementRef, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {
  @Output() clickOff = new EventEmitter<MouseEvent>();
  constructor(private elementRef: ElementRef) {
 }
   @HostListener('window:mouseup', ['$event', '$event.target'])
   onClick(event: MouseEvent, targetElement: HTMLElement): void {
        if (!targetElement) {
            return;
        }
        const clickedInside = this.elementRef.nativeElement.contains(targetElement);
        if (!clickedInside) {
           this.clickOff.emit(event);
        }
    }
}
