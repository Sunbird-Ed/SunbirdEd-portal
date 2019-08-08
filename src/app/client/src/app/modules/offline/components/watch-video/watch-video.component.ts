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
        id: 'add-content-online',
        name: this.resourceService.frmelmnts.instn.t0094,
        thumbnail: 'assets/images/play-icon.svg',
        url: 'assets/videos/How_do_I_add_content_to_the_DIKSHA_desktop_app_when_I_am_connected_to_the_Internet.mp4'
      },
      {
        id: 'add-content-offline',
        name: this.resourceService.frmelmnts.instn.t0095,
        thumbnail: 'assets/images/play-icon.svg',
        url: 'assets/videos/How_do_I_add_content_to_the_DIKSHA_desktop_app_when_I_am_offline_or_using_a_pen_drive.mp4'
      },
      {
        id: 'find-content-offline',
        name: this.resourceService.frmelmnts.instn.t0096,
        thumbnail: 'assets/images/play-icon.svg',
        url: 'assets/videos/How_and_where_can_I_find_content_in_My_Library.mp4'
      },
      {
        id: 'copy-content',
        name: this.resourceService.frmelmnts.instn.t0097,
        thumbnail: 'assets/images/play-icon.svg',
        url: 'assets/videos/How_do_I_copy_content_to_my_pen_drive.mp4'
      }
    ];

    this.activeVideoObject = {
      id: 'add-content-online',
      name: this.resourceService.frmelmnts.instn.t0094,
      thumbnail: 'assets/images/play-icon.svg',
      url: 'assets/videos/How_do_I_add_content_to_the_DIKSHA_desktop_app_when_I_am_connected_to_the_Internet.mp4'
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
