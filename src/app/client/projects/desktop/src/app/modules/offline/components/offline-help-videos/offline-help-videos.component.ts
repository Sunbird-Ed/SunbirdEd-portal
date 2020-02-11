import { ActivatedRoute } from '@angular/router';
import { ResourceService, ConfigService } from '@sunbird/shared';
import { Component, OnInit, Output, EventEmitter, ViewChild, Inject } from '@angular/core';
import { IInteractEventEdata } from '@sunbird/telemetry';
import { DOCUMENT } from '@angular/common';
import * as $ from 'jquery';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-offline-help-videos',
  templateUrl: './offline-help-videos.component.html',
  styleUrls: ['./offline-help-videos.component.scss']
})
export class OfflineHelpVideosComponent implements OnInit {



  @Output() closeVideoModal = new EventEmitter<any>();

  @ViewChild('aspectRatio') aspectRatio;
  @ViewChild('playerInfo') playerInfo;
  videoContainerHeight: number;
  aspectRatioHeight: number;
  playerInfoHeight: number;

  slideConfig: object;
  slideData: object;
  activeVideoObject;
  instance: string;
  selectVideoInteractEdata: IInteractEventEdata;
  constructor(@Inject(DOCUMENT) private document: Document, public resourceService: ResourceService, public configService: ConfigService,
  public activatedRoute: ActivatedRoute) {
    this.instance = (<HTMLInputElement>document.getElementById('instance'))
      ? (<HTMLInputElement>document.getElementById('instance')).value : 'sunbird';

  }

  ngOnInit() {

    this.slideConfig = this.configService.offlineConfig.watchVideo;
    this.slideData = [
      {
        id: 'add-content-offline',
        name: this.interpolateInstance(this.resourceService.frmelmnts.instn.t0095),
        thumbnail: 'assets/images/play-icon.svg',
        url: 'assets/videos/How_do_I_download_content_from_DIKSHA_Library.mp4'
      },
      {
        id: 'add-content-online',
        name: this.interpolateInstance(this.resourceService.frmelmnts.instn.t0094),
        thumbnail: 'assets/images/play-icon.svg',
        url: 'assets/videos/How_do_I_load_content_to_the_desktop_app.mp4'
      },
      {
        id: 'copy-content',
        name: this.interpolateInstance(this.resourceService.frmelmnts.instn.t0097),
        thumbnail: 'assets/images/play-icon.svg',
        url: 'assets/videos/How_do_I_copy_content_to_my_pen_drive.mp4'
      },
      {
        id: 'find-content-offline',
        name: this.interpolateInstance(this.resourceService.frmelmnts.instn.t0096),
        thumbnail: 'assets/images/play-icon.svg',
        url: 'assets/videos/How_do_I_play_content.mp4'
      },
    ];

    this.activeVideoObject = this.slideData[0];
    this.setVideoHeight();

  }

  setVideoHeight() {
    console.log('aspect ratio value', this.aspectRatio);
    this.aspectRatioHeight = this.aspectRatio.nativeElement.offsetHeight;
    this.playerInfoHeight = this.playerInfo.nativeElement.offsetHeight;
    this.videoContainerHeight = this.aspectRatioHeight + this.playerInfoHeight;
  }

  interpolateInstance(message) {
    return message.replace('{instance}', _.upperCase(this.instance));
  }

  changeVideoAttributes(data: any) {
    this.activeVideoObject = data;
    $('#video').attr('src', data.url);
  }

  closeModal() {
    this.closeVideoModal.emit('success');
  }

  setInteractData(data) {
    return {
      id: data.id,
      type: 'click',
      pageid: _.get(this.activatedRoute.snapshot.data.telemetry, 'pageid') || 'help'
    };
  }


}
