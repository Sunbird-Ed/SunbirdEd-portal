import { ConfigService } from '@sunbird/shared';
import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, OnChanges, AfterViewInit } from '@angular/core';
import * as _ from 'lodash-es';
import { PlayerConfig } from '@sunbird/shared';
import { environment } from '@sunbird/environment';
import { Router } from '@angular/router';
import { ToasterService, ResourceService } from '@sunbird/shared';
@Component({
  selector: 'app-player',
  templateUrl: './player.component.html'
})
export class PlayerComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() playerConfig: PlayerConfig;
  @Output() contentProgressEvent = new EventEmitter<any>();
  @ViewChild('contentIframe') contentIframe: ElementRef;
  @Output() playerOnDestroyEvent = new EventEmitter<any>();
  @Output() sceneChangeEvent = new EventEmitter<any>();
  buildNumber: string;
  @Input() playerOption: any;
  contentRatingModal = false;
  playerCdnUrl: string;
  rendererRunning: boolean;
  playerElement: any;
  /**
 * Dom element reference of contentRatingModal
 */
  @ViewChild('modal') modal;
  constructor(public configService: ConfigService, public router: Router, private toasterService: ToasterService,
    public resourceService: ResourceService) {
    this.buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'))
      ? (<HTMLInputElement>document.getElementById('buildNumber')).value : '1.0';
    this.playerCdnUrl = (<HTMLInputElement>document.getElementById('PlayerCdnUrl'))
      ? (<HTMLInputElement>document.getElementById('PlayerCdnUrl')).value : undefined;
  }
  /**
   * showPlayer method will be called
   */
  ngOnInit() {
    this.showPlayer();
  }

  ngOnChanges() {
    this.contentRatingModal = false;
    this.showPlayer();
  }

  ngAfterViewInit() {
    this.playerElement = this.contentIframe.nativeElement;
  }

  /**
   * Initializes player with given config and emits player telemetry events
   * Emits event when content starts playing and end event when content was played/read completely
   */
  showPlayer(loadCdn = true) {
    console.log("rendererRunning: ", this.rendererRunning)
    if (this.rendererRunning === true) {
      this.playerElement.contentWindow.initializePreview(this.playerConfig);
    } else {
      let src;
      if (environment.isOffline) {
        src = this.configService.appConfig.PLAYER_CONFIG.localBaseUrl;
      } else {
        src = this.playerCdnUrl && loadCdn ? this.playerCdnUrl : this.configService.appConfig.PLAYER_CONFIG.baseURL;
      }
      const iFrameSrc = src + '&build_number=' + this.buildNumber;
      setTimeout(() => {
        this.playerElement.src = iFrameSrc;
        this.playerElement.onload = (event) => {
          if (!_.get(this.playerElement, 'contentWindow.initializePreview') && loadCdn) {
            console.log('cdn player load failed, loading local player');
            this.showPlayer(false);
          } else if (_.get(this.playerElement, 'contentWindow.initializePreview')) {
            this.adjustPlayerHeight();
            this.playerElement.addEventListener('renderer:telemetry:event', telemetryEvent => this.generateContentReadEvent(telemetryEvent));
            this.playerElement.contentWindow.initializePreview(this.playerConfig);
            this.rendererRunning = true;
          } else {
            console.log('loading player failed');
          }
        };

      }, 0);
    }
  }
  /**
   * Adjust player height after load
   */
  adjustPlayerHeight() {
    const playerWidth = $('#contentPlayer').width();
    if (playerWidth) {
      const height = playerWidth * (9 / 16);
      $('#contentPlayer').css('height', height + 'px');
    }
  }
  generateContentReadEvent(event: any) {
    if (event.detail.telemetryData.eid && (event.detail.telemetryData.eid === 'START' ||
      event.detail.telemetryData.eid === 'END')) {
      this.showRatingPopup(event);
      this.contentProgressEvent.emit(event);

    } else if (event.detail.telemetryData.eid && (event.detail.telemetryData.eid === 'IMPRESSION')) {
      this.emitSceneChangeEvent();
    }
  }
  emitSceneChangeEvent(timer = 0) {
    setTimeout(() => {
      const stageId = this.contentIframe.nativeElement.contentWindow.EkstepRendererAPI.getCurrentStageId();
      const eventData = { stageId };
      this.sceneChangeEvent.emit(eventData);
    }, timer); // waiting for player to load, then fetching stageId (if we dont wait stageId will be undefined)
  }

  showRatingPopup(event) {
    let contentProgress;
    const playerSummary: Array<any> = _.get(event, 'detail.telemetryData.edata.summary');
    if (playerSummary) {
      contentProgress = _.find(event.detail.telemetryData.edata.summary, 'progress');
    }
    if (event.detail.telemetryData.eid === 'END' && contentProgress.progress === 100) {
      this.contentRatingModal = true;
      if (this.modal) {
        this.modal.showContentRatingModal = true;
      }
    }
  }
}
