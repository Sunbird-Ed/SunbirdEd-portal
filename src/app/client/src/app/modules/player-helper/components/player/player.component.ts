import { ConfigService } from '@sunbird/shared';
import { Component, AfterViewInit, ViewChild, ElementRef, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import * as _ from 'lodash-es';
import { PlayerConfig } from '@sunbird/shared';
import { environment } from '@sunbird/environment';
import { Router } from '@angular/router';
import { ToasterService, ResourceService } from '@sunbird/shared';
const CONTENT_MIME_TYPE = ['application/vnd.ekstep.h5p-archive', 'application/vnd.ekstep.html-archive'];
@Component({
  selector: 'app-player',
  templateUrl: './player.component.html'
})
export class PlayerComponent implements AfterViewInit, OnChanges {
  @Input() playerConfig: PlayerConfig;
  @Output() contentProgressEvent = new EventEmitter<any>();
  @ViewChild('contentIframe') contentIframe: ElementRef;
  @Output() playerOnDestroyEvent = new EventEmitter<any>();
  @Output() sceneChangeEvent = new EventEmitter<any>();
  buildNumber: string;
  @Input() playerOption: any ;
  contentRatingModal = false;
  playerCdnUrl: string;
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
  ngAfterViewInit() {
    if (this.playerConfig) {
      this.showPlayer();
    }
  }

  ngOnChanges() {
    this.contentRatingModal = false;
    if (this.playerConfig) {
      this.showPlayer();
    }
  }
  loadCdnPlayer() {
    document.domain = window.location.hostname; // to enable player to load from cdn;
    const iFrameSrc = this.playerCdnUrl + '&build_number=' + this.buildNumber;
    setTimeout(() => {
      const playerElement = this.contentIframe.nativeElement;
      playerElement.src = iFrameSrc;
      playerElement.onload = (event) => {
        try {
          playerElement.contentWindow.initializePreview(this.playerConfig);
          this.adjustPlayerHeight();
          playerElement.addEventListener('renderer:telemetry:event', telemetryEvent => this.generateContentReadEvent(telemetryEvent));
        } catch (err) {
          console.log('loading cdn player failed');
          this.loadDefaultPlayer();
        }
      };
    }, 0);
  }
  loadDefaultPlayer(url = this.configService.appConfig.PLAYER_CONFIG.baseURL) {
    const iFrameSrc = url + '&build_number=' + this.buildNumber;
    setTimeout(() => {
      const playerElement = this.contentIframe.nativeElement;
      playerElement.src = iFrameSrc;
      playerElement.onload = (event) => {
        try {
          this.adjustPlayerHeight();
          playerElement.addEventListener('renderer:telemetry:event', telemetryEvent => this.generateContentReadEvent(telemetryEvent));
          playerElement.contentWindow.initializePreview(this.playerConfig);
        } catch (err) {
          console.log('loading default player failed');
        }
      };
    }, 0);
  }
  /**
   * Initializes player with given config and emits player telemetry events
   * Emits event when content starts playing and end event when content was played/read completely
   */
  showPlayer() {
    if (environment.isOffline) {
      this.loadDefaultPlayer(this.configService.appConfig.PLAYER_CONFIG.localBaseUrl);
      return;
    }
    if (this.playerCdnUrl && !CONTENT_MIME_TYPE.includes(_.get(this.playerConfig, 'metadata.mimeType'))) {
      this.loadCdnPlayer();
      return;
    }
    this.loadDefaultPlayer();
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
