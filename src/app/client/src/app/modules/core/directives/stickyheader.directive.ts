import { animate, AnimationBuilder, AnimationMetadata, AnimationPlayer, style } from '@angular/animations';

import { AfterViewInit, Directive, ElementRef, Inject, OnDestroy } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, pairwise, share, throttleTime, takeUntil } from 'rxjs/operators';

enum Direction {
  Up = 'Up',
  Down = 'Down',
  None = 'None'
}

/** @dynamic */
@Directive({
  selector: '[appStickyHeader]',
})
export class StickyHeaderDirective implements AfterViewInit, OnDestroy {
  player: AnimationPlayer;
  public unsubscribe = new Subject<void>();

  set show(show: boolean) {
    if (this.player) {
      this.player.destroy();
    }

    const metadata = show ? this.fadeIn() : this.fadeOut();

    const factory = this.builder.build(metadata);
    const player = factory.create(this.el.nativeElement);

    player.play();
  }

  constructor(private builder: AnimationBuilder, private el: ElementRef) {}

  private fadeIn(): AnimationMetadata[] {
    return [style({ opacity: 0 }), animate('400ms ease-in', style({ opacity: 1 }))];
  }

  private fadeOut(): AnimationMetadata[] {
    return [style({ opacity: '*' }), animate('400ms ease-in', style({ opacity: 0 }))];
  }

  private fadeUp(): AnimationMetadata[] {
    return [style({ opacity: 0 }), animate('200ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))];
  }

  private fadeDown(): AnimationMetadata[] {
    return [style({ opacity: '*' }), animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-100%)' }))];
  }

  ngAfterViewInit() {
    const scroll$ = fromEvent(window, 'scroll').pipe(
      throttleTime(10),
      map( (window1) => window.pageYOffset),
      pairwise(),
      map(([y1, y2]): Direction => {
        return (y2 < y1 ? (y1 < 130 ? Direction.Up : Direction.None) : (y2 > 130 ? Direction.Down : Direction.None));
      }),
      distinctUntilChanged(),
      share(),
    );
    const goingUp$ = scroll$.pipe(filter(direction => direction === Direction.Up));

    const goingDown$ = scroll$.pipe(filter(direction => direction === Direction.Down));

    goingUp$.pipe(
      takeUntil(this.unsubscribe))
      .subscribe(() => (this.show = true));
    goingDown$.pipe(
      takeUntil(this.unsubscribe))
      .subscribe(() => (this.show = false));

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}


