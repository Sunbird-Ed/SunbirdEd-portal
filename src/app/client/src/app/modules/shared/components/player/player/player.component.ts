import { WindowScrollService, ConfigService } from './../../../services';

import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import * as $ from 'jquery';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, OnDestroy {
  @Input() playerConfig: any;
  @ViewChild('contentIframe') contentIframe: ElementRef;
  constructor(public windowScrollService: WindowScrollService, public configService: ConfigService) { }

  ngOnInit() {
    this.showPlayer();
  }
  ngOnDestroy() {
    if (document.getElementById('contentPlayer')) {
      document.getElementById('contentPlayer').removeEventListener('renderer:telemetry:event', (event) => {
        // org.sunbird.portal.eventManager.dispatchEvent('sunbird:player:telemetry',
        //   event.detail.telemetryData)
        // }, false)
      });
    }
  }
  showPlayer () {
    const iFrameSrc = this.configService.appConfig.PLAYER_CONFIG.baseURL;
    setTimeout(() => {
      this.contentIframe.nativeElement.src = iFrameSrc;
      this.contentIframe.nativeElement.onload = () => {
        this.adjustPlayerHeight();
        // const configuration = this.getContentPlayerConfig();
        this.contentIframe.nativeElement.contentWindow.initializePreview(this.playerConfig);
        this.windowScrollService.smoothScroll('contentPlayer');
      };
    }, 0);
    document.getElementById('contentPlayer').addEventListener('renderer:telemetry:event', (event) => {
      console.log('---------------------------------------------------', event);
      // org.sunbird.portal.eventManager.dispatchEvent('sunbird:player:telemetry',
      //   event.detail.telemetryData)
    });
  }
  adjustPlayerHeight () {
    const playerWidth = $('#contentViewerIframe').width();
    if (playerWidth) {
      const height = playerWidth * (9 / 16);
      $('#contentViewerIframe').css('height', height + 'px');
    }
  }
}
