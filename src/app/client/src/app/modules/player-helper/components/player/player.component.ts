import { ConfigService } from '@sunbird/shared';
import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import * as _ from 'lodash-es';
import { PlayerConfig } from '@sunbird/shared';
import { environment } from '@sunbird/environment';
import { Router } from '@angular/router';
import { ToasterService, ResourceService } from '@sunbird/shared';
@Component({
  selector: 'app-player',
  templateUrl: './player.component.html'
})
export class PlayerComponent implements OnInit, OnChanges {
  @Input() playerConfig: PlayerConfig;
  @Output() contentProgressEvent = new EventEmitter<any>();
  @ViewChild('contentIframe') contentIframe: ElementRef;
  @Output() playerOnDestroyEvent = new EventEmitter<any>();
  @Output() sceneChangeEvent = new EventEmitter<any>();
  buildNumber: string;
  viewFullscreenBtn = false;
  viewFullScreenIntractEdata;
  viewFullScreenIntractObject;
  constructor(public configService: ConfigService, public router: Router, private toasterService: ToasterService,
    public resourceService: ResourceService) {
    try {
      this.buildNumber = (<HTMLInputElement>document.getElementById('buildNumber')).value;
    } catch (error) {
      this.buildNumber = '1.0';
    }
  }
  /**
   * showPlayer method will be called
   */
  ngOnInit() {
    this.showPlayer();
    this.viewFullScreenIntractEdata = {
      id: 'view-full-screen-button',
      type: 'click',
      pageid: this.router.url.split('/')[1]
    };
    this.viewFullScreenIntractObject = {
      id: this.playerConfig.metadata.identifier,
      type: this.playerConfig.metadata.contentType,
      ver: this.playerConfig.metadata.pkgVersion ? this.playerConfig.metadata.pkgVersion.toString() : '1.0'
    };
  }

  ngOnChanges() {
    this.showPlayer();
  }
  /**
   * Initializes player with given config and emits player telemetry events
   * Emits event when content starts playing and end event when content was played/read completely
   */
  showPlayer() {
    const src = environment.isOffline ? this.configService.appConfig.PLAYER_CONFIG.localBaseUrl :
      this.configService.appConfig.PLAYER_CONFIG.baseURL;
    const iFrameSrc = src + '&build_number=' + this.buildNumber;
    setTimeout(() => {
      this.contentIframe.nativeElement.src = iFrameSrc;
      this.contentIframe.nativeElement.onload = () => {
        this.adjustPlayerHeight();
        this.contentIframe.nativeElement.contentWindow.initializePreview(this.playerConfig);
      };
    }, 0);
    this.contentIframe.nativeElement.addEventListener('renderer:telemetry:event', (event: any) => {
      this.generateContentReadEvent(event);
    });

    if (this.playerConfig.metadata.mimeType !== 'video/x-youtube' && this.playerConfig.metadata.mimeType !== 'video/mp4') {
      this.viewFullscreenBtn = true;
    }

    if (window.innerWidth <= 768) {
      this.viewInFullscreen();
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
    if (event.detail.telemetryData.eid && (event.detail.telemetryData.eid === 'START' || event.detail.telemetryData.eid === 'END')) {
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

  viewInFullscreen() {
    if (document.fullscreenEnabled) {
      const iframe = document.querySelector('#contentPlayer');
      // Do fullscreen
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else {
        this.toasterService.warning(this.resourceService.messages.fmsg.m0004);
      }
    }
  }
}
