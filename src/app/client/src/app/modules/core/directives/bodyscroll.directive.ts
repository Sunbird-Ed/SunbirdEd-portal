import {Directive, AfterViewInit, OnDestroy, Input} from '@angular/core';

@Directive({
  selector: '[appBodyScroll]'
})
export class BodyScrollDirective implements AfterViewInit, OnDestroy {

  ngAfterViewInit(): void {
    document.getElementsByTagName('body')[0].classList.add('o-y-hide');
  }
  ngOnDestroy(): void {
    document.getElementsByTagName('body')[0].classList.remove('o-y-hide');
  }

}
