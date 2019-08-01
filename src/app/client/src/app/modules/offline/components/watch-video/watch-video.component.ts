import { ResourceService, ConfigService } from '@sunbird/shared';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IInteractEventEdata } from '@sunbird/telemetry';
import * as $ from 'jquery';

@Component({
  selector: 'app-watch-video',
  templateUrl: './watch-video.component.html',
  styleUrls: ['./watch-video.component.scss']
})
export class WatchVideoComponent implements OnInit {

  @Output() closeVideoModal = new EventEmitter<any>();
  slideConfig: object;
  slideData: object;
  activeVideoObject;
  selectVideoInteractEdata: IInteractEventEdata;
  constructor(public resourceService: ResourceService, public configService: ConfigService) { }

  ngOnInit() {
    this.slideConfig = this.configService.offlineConfig.watchVideo;
    this.slideData = [
      {
        id: 'download-content-video',
        name: this.resourceService.frmelmnts.instn.t0094,
        thumbnail: 'assets/images/play-icon.svg',
        url: 'assets/videos/download-content.mp4'
      },
      {
        id: 'copy-content-video',
        name: this.resourceService.frmelmnts.instn.t0095,
        thumbnail: 'assets/images/play-icon.svg',
        url: 'assets/videos/copy-content.mp4'
      },
      {
        id: 'browse-content-video',
        name: this.resourceService.frmelmnts.instn.t0096,
        thumbnail: 'assets/images/play-icon.svg',
        url: 'assets/videos/browse-content.mp4'
      },
      {
        id: 'play-content-video',
        name: this.resourceService.frmelmnts.instn.t0097,
        thumbnail: 'assets/images/play-icon.svg',
        url: 'assets/videos/play-content.mp4'
      }
    ];

    this.activeVideoObject = {
      id: 'download-content-video',
      name: this.resourceService.frmelmnts.instn.t0094,
      thumbnail: 'assets/images/play-icon.svg',
      url: 'assets/videos/download-content.mp4'
    };

    this.setInteractData();
  }

  changeVideoAttributes(data: any) {
    this.activeVideoObject = data;
    $('#video').attr('src', data.url);
  }

  closeModal() {
    this.closeVideoModal.emit('success');
  }

  setInteractData() {
    this.selectVideoInteractEdata = {
      id: this.activeVideoObject.id,
      type: 'click',
      pageid: 'library'
    };
  }
}
