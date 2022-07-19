
import {takeUntil} from 'rxjs/operators';
import {  Subject } from 'rxjs';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ContentBadgeService } from './../../services';
@Component({
  selector: 'app-content-badge',
  templateUrl: './content-badge.component.html'
})
export class ContentBadgeComponent implements OnInit, OnDestroy {
  @Input() data: Array<object>;
  public unsubscribe = new Subject<void>();
  constructor(public contentBadgeService: ContentBadgeService) { }

  ngOnInit() {
    this.contentBadgeService.badges.pipe(
      takeUntil(this.unsubscribe))
      .subscribe((data) => {
        if (this.data === undefined) {
          this.data = [];
        }
        this.data.push(data);
    });
  }
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
