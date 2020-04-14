import { Component, OnInit, OnDestroy, OnChanges, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd } from '@angular/router';
import {
  ConfigService, NavigationHelperService, PlayerConfig, ContentData, ToasterService, ResourceService,
  UtilService
} from '@sunbird/shared';
import { Subject } from 'rxjs';
import { takeUntil, filter, map } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';

@Component({
  selector: 'app-content-chapterlist',
  templateUrl: './content-chapterlist.component.html',
  styleUrls: ['./content-chapterlist.component.scss']
})
export class ContentChapterlistComponent implements OnInit, OnDestroy, OnChanges {
  public unsubscribe$ = new Subject<void>();
  @Input() contentDetails;
  @Input() activeContent;

  @Output() tocChapterClick: EventEmitter<any> = new EventEmitter();


  constructor(private activatedRoute: ActivatedRoute,
    public router: Router,
    private navigationHelperService: NavigationHelperService,

    public resourceService: ResourceService,

  ) { }

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
