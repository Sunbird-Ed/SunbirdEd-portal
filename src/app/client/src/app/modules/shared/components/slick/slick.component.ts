import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription, fromEvent, timer } from 'rxjs';
import { debounceTime, throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-slick',
  templateUrl: './slick.component.html',
  styleUrls: ['./slick.component.scss']
})
export class SlickComponent implements OnInit {

  @Input() loadStatus = 'none';
  @Input() onHover = false;
  @Input() viewType = 'arrow';
  @Output() loadNext = new EventEmitter();
  @ViewChild('horizontalScrollElem', { static: true })
  horizontalScrollElem: ElementRef | null = null;

  enablePrev = false;
  enableNext = false;
  private scrollObserver: Subscription | null = null;
  dotViewCount: number;
  selectedDot: number = 0;

  constructor() { }

  ngOnInit() {
    if (this.horizontalScrollElem) {
      const horizontalScrollElem = this.horizontalScrollElem;
      this.scrollObserver = fromEvent(
        horizontalScrollElem.nativeElement,
        'scroll'
      )
        .pipe(debounceTime(100), throttleTime(100))
        .subscribe((_) => {
          this.updateNavigationBtnStatus(
            horizontalScrollElem.nativeElement as HTMLElement
          );
        });
    }
    const scroller = document.getElementById('ngxScroller');
    scroller.onmouseover = () => {
      scroller.style.overflowX = 'hidden'
    };
  }

  ngOnChanges() {
    timer(100).subscribe(() => {
      if (this.horizontalScrollElem) {
        this.updateNavigationBtnStatus(
          this.horizontalScrollElem?.nativeElement as HTMLElement
        );
      }
    });
  }

  ngOnDestroy() {
    if (this.scrollObserver) {
      this.scrollObserver?.unsubscribe();
    }
  }

  showPrev() {
    if (this.horizontalScrollElem) {
      if (this.horizontalScrollElem) {
        const clientWidth = this.horizontalScrollElem?.nativeElement?.clientWidth;
        this.horizontalScrollElem?.nativeElement?.scrollTo({
          left:
            this.horizontalScrollElem?.nativeElement?.scrollLeft - clientWidth
        });
      }
    }
  }

  showNext() {
    if (this.horizontalScrollElem) {
      if (this.horizontalScrollElem) {
        const clientWidth = this.horizontalScrollElem?.nativeElement?.clientWidth;
        this.horizontalScrollElem?.nativeElement?.scrollTo({
          left:
            this.horizontalScrollElem?.nativeElement?.scrollLeft + clientWidth
        });
      }
    }
  }

  private updateNavigationBtnStatus(elem: HTMLElement) {
    this.enablePrev = true;
    this.enableNext = true;
    if (elem.scrollLeft === 0) {
      this.enablePrev = false;
    }
    this.dotViewCount = Math.ceil(elem.scrollWidth / elem.clientWidth);
    if (elem.scrollWidth === elem.clientWidth + elem.scrollLeft) {
      if (this.loadStatus === 'hasMore') {
        this.loadNext.emit(elem);
      } else if ((elem.scrollWidth - (elem.clientWidth + elem.scrollLeft)) < 1) {
        this.enableNext = false;
      } else {
        this.enableNext = false;
      }
    }
    if ((elem.scrollWidth - (elem.clientWidth + elem.scrollLeft)) < 1) {
      this.enableNext = false;
    }
  }

  computeDotSlide(index) {
    this.selectedDot = index;
    const clientWidth = this.horizontalScrollElem?.nativeElement?.clientWidth;
    this.horizontalScrollElem?.nativeElement?.scrollTo({
      left: (index) * clientWidth,
    });
  }

}
