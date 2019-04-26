import { animate, AnimationBuilder, AnimationMetadata, AnimationPlayer, style } from '@angular/animations';

import { AfterViewInit, Directive, ElementRef, Inject, OnDestroy, NgZone, ChangeDetectorRef, } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, pairwise, share, throttleTime, takeUntil, tap } from 'rxjs/operators';

enum Direction {
  Up = 'Up',
  Down = 'Down',
  None = 'None'
}

/** @dynamic */
@Directive({
  selector: '[appStickyHeader]'
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

  constructor(private builder: AnimationBuilder, private el: ElementRef, private zone: NgZone,
    private cdr: ChangeDetectorRef) {}

  private fadeIn(): AnimationMetadata[] {
    return [style({ opacity: 0}), animate('400ms ease-in', style({ opacity: 1, transform: 'translateY(0)'}))];
  }

  private fadeOut(): AnimationMetadata[] {
    return [style({ opacity: '*' }), animate('400ms ease-in', style({ opacity: 0, transform: 'translateY(-100%)' }))];
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
    const scroll$ = fromEvent(window, 'scroll').pipe(
      throttleTime(10),
      map( (window1) => window.pageYOffset),
      pairwise(),
      map(([y1, y2]): Direction => {
        return (y2 < y1 ? ((y1 < 160 || y2 < 160) ? Direction.Up : Direction.None) : (y2 > 160 ? Direction.Down : Direction.None));
      }),
      distinctUntilChanged(),
      share(),
    );
    const goingUp$ = scroll$.pipe(filter(direction => direction === Direction.Up));

    const goingDown$ = scroll$.pipe(filter(direction => direction === Direction.Down));

    goingUp$.subscribe(() => {
      this.show = true;
      this.cdr.detectChanges();
    });
    goingDown$.subscribe(() => {
      this.show = false;
      this.cdr.detectChanges();
    });
  });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}


