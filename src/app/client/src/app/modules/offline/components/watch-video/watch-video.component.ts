import { ResourceService, ConfigService } from '@sunbird/shared';
import { Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';
import * as $ from 'jquery';

@Component({
  selector: 'app-watch-video',
  templateUrl: './watch-video.component.html',
  styleUrls: ['./watch-video.component.scss']
})
export class WatchVideoComponent implements OnInit {

  @ViewChild('modal') modal;
  @Output() closeVideoModal = new EventEmitter<any>();
  slideConfig: object;
  slideData: object;
  activeVideoObject: object;
  watchModalCloseIntractEdata: IInteractEventEdata;
  downloadPdfInteractEdata: IInteractEventEdata;
  videoModalClose: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  constructor(public resourceService: ResourceService, public configService: ConfigService) { }

  ngOnInit() {
    this.slideConfig = this.configService.offlineConfig.watchVideo;
    this.slideData = [
      {
        id: 1,
        name: this.resourceService.frmelmnts.instn.t0094,
        thumbnail: 'assets/images/play-icon.svg',
        url: 'assets/videos/download-content.mp4'
      },
      {
        id: 2,
        name: this.resourceService.frmelmnts.instn.t0095,
        thumbnail: 'assets/images/play-icon.svg',
        url: 'assets/videos/copy-content.mp4'
      },
      {
        id: 3,
        name: this.resourceService.frmelmnts.instn.t0096,
        thumbnail: 'assets/images/play-icon.svg',
        url: 'assets/videos/browse-content.mp4'
      },
      {
        id: 4,
        name: this.resourceService.frmelmnts.instn.t0097,
        thumbnail: 'assets/images/play-icon.svg',
        url: 'assets/videos/play-content.mp4'
      }
    ];

    this.activeVideoObject = {
      id: 1,
      name: this.resourceService.frmelmnts.instn.t0094,
      thumbnail: 'assets/images/play-icon.svg',
      url: 'assets/videos/download-content.mp4'
    };
  }

  changeVideoAttributes(data: any) {
    this.activeVideoObject = data;
    $('#video').attr('src', data.url);
  }

  closeModal() {
    this.closeVideoModal.emit('success');
  }

  modalClose() {
    this.modal.deny();
  }
}
