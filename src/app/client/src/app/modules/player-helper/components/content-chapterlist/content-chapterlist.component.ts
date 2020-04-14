import { Component, OnInit, OnDestroy, OnChanges, Input, EventEmitter, Output } from '@angular/core';
import * as _ from 'lodash-es';


@Component({
  selector: 'app-content-chapterlist',
  templateUrl: './content-chapterlist.component.html',
  styleUrls: ['./content-chapterlist.component.scss']
})
export class ContentChapterlistComponent implements OnInit, OnDestroy, OnChanges {
  @Input() contentDetails;
  @Input() activeContent;

  @Output() tocChapterClick: EventEmitter<any> = new EventEmitter();
  constructor() { }
  ngOnInit() {
  }

  public async onTocChapterClick(event, content) {
    if (this.activeContent && this.activeContent.sbUniqueIdentifier !== content.sbUniqueIdentifier) {
      this.tocChapterClick.emit({ event: event, data: { ...content } });
    }
  }

  ngOnChanges() {
  }

  ngOnDestroy() {
  }
}
