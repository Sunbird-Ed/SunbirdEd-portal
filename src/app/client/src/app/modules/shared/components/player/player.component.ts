import { WindowScrollService, ConfigService } from './../../services';

import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import * as $ from 'jquery';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  @Input() playerConfig: any;
  @Output() contentProgressEvent = new EventEmitter<any>();
  @ViewChild('contentIframe') contentIframe: ElementRef;
  constructor(public configService: ConfigService) { }

  ngOnInit() {
    this.showPlayer();
  }
  showPlayer () {
    const iFrameSrc = this.configService.appConfig.PLAYER_CONFIG.baseURL;
    setTimeout(() => {
      this.contentIframe.nativeElement.src = iFrameSrc;
      this.contentIframe.nativeElement.onload = () => {
        this.adjustPlayerHeight();
        this.contentIframe.nativeElement.contentWindow.initializePreview(this.playerConfig);
      };
    }, 0);
    this.contentIframe.nativeElement.addEventListener('renderer:telemetry:event', (event: any) => {
      console.log('-------renderer:telemetry:event--------', event.detail.telemetryData);
      this.contentProgressEvent.emit(event);
    });
    // document.getElementById('contentPlayer').addEventListener('renderer:telemetry:event', (event: any) => {
    //   console.log('-------renderer:telemetry:event--------', event.detail.telemetryData);
    //   this.contentProgressEvent.emit(event);
    // });
  }
  adjustPlayerHeight () {
    const playerWidth = $('#contentPlayer').width();
    if (playerWidth) {
      const height = playerWidth * (9 / 16);
      $('#contentPlayer').css('height', height + 'px');
    }
  }
}
