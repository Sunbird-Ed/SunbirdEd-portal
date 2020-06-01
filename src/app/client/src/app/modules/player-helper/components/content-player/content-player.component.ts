import { Component, AfterViewInit, ViewChild, ElementRef, Input, Output, EventEmitter, OnChanges, OnInit, OnDestroy } from '@angular/core';
import * as _ from 'lodash-es';
import { PlayerConfig } from '@sunbird/shared';
import { Router } from '@angular/router';

const OFFLINE_ARTIFACT_MIME_TYPES = ['application/epub', 'video/webm', 'video/mp4', 'application/pdf'];
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-content-player',
  templateUrl: './content-player.component.html',
  styleUrls: ['./content-player.component.scss']
})
export class ContentPlayerComponent implements AfterViewInit, OnChanges, OnInit, OnDestroy {
  @Input() playerConfig: PlayerConfig;
  @Output() assessmentEvents = new EventEmitter<any>();
  @Output() questionScoreSubmitEvents = new EventEmitter<any>();
  @ViewChild('contentIframe') contentIframe: ElementRef;
  @Output() playerOnDestroyEvent = new EventEmitter<any>();
  @Output() sceneChangeEvent = new EventEmitter<any>();
  @Input() contentProgressEvents$: Subject<any>;
  @Output() deletedContent = new EventEmitter();
  buildNumber: string;
  @Input() playerOption: any;
  contentRatingModal = false;
  previewCdnUrl: string;
  isCdnWorking: string;
  @Input() isContentDeleted: Subject<any>;
  contentDeleted = false;
  @Input() isContentPresent = true;
  @Input() objectRollUp: {} = {};
  isConnected: any;
  youTubeContentStatus: any;
  public unsubscribe$ = new Subject<void>();
  CONSTANT = {
    ACCESSEVENT: 'renderer:question:submitscore'
  };
  /**
 * Dom element reference of contentRatingModal
 */
  @ViewChild('modal') modal;
  @Input() contentData;
  isLoading: Boolean = false; // To restrict player loading multiple times
  constructor(public router: Router) {
    this.buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'))
      ? (<HTMLInputElement>document.getElementById('buildNumber')).value : '1.0';
    this.previewCdnUrl = (<HTMLInputElement>document.getElementById('previewCdnUrl'))
      ? (<HTMLInputElement>document.getElementById('previewCdnUrl')).value : undefined;
    this.isCdnWorking = (<HTMLInputElement>document.getElementById('cdnWorking'))
      ? (<HTMLInputElement>document.getElementById('cdnWorking')).value : 'no';
  }
  /**
   * loadPlayer method will be called
   */

  ngAfterViewInit() {}

  ngOnChanges() {
    if (this.isContentDeleted) {
      this.isContentDeleted.subscribe(data => {
        this.contentDeleted = data.value && !this.router.url.includes('browse');
      });
    }
    this.contentRatingModal = false;
    if (!_.isEmpty(this.playerConfig)) {
      this.objectRollUp = _.get(this.playerConfig, 'context.objectRollup') || {};
    }

  }

  ngOnInit() {
    if (this.contentProgressEvents$) {
      this.contentProgressEvents$.subscribe(data => {
        this.contentProgressEvents$.next(data);
      });
    }
  }

  generateScoreSubmitEvent(event: any) {
    if (_.toLower(event.data) === (_.toLower(this.CONSTANT.ACCESSEVENT))) {
      this.questionScoreSubmitEvents.emit(event);
    }
  }

  onAssessmentEvents(event) {
    this.assessmentEvents.emit(event);
  }

  onQuestionScoreSubmitEvents(event) {
    this.questionScoreSubmitEvents.emit(event);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

