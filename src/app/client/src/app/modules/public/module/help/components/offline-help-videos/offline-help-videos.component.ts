import { ActivatedRoute } from '@angular/router';
import { ResourceService, ConfigService } from '@sunbird/shared';
import { Component, OnInit, Output, EventEmitter, ViewChild, Inject, OnDestroy } from '@angular/core';
import { IInteractEventEdata } from '@sunbird/telemetry';
import { DOCUMENT } from '@angular/common';
import * as $ from 'jquery';
import * as _ from 'lodash-es';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-offline-help-videos',
  templateUrl: './offline-help-videos.component.html',
  styleUrls: ['./offline-help-videos.component.scss']
})
export class OfflineHelpVideosComponent implements OnInit, OnDestroy {



  @Output() closeVideoModal = new EventEmitter<any>();

  @ViewChild('aspectRatio', {static: false}) aspectRatio;
  @ViewChild('playerInfo', {static: false}) playerInfo;
  videoContainerHeight: number;
  aspectRatioHeight: number;
  playerInfoHeight: number;
  public unsubscribe$ = new Subject<void>();

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
    this.resourceService.languageSelected$.pipe(takeUntil(this.unsubscribe$)).subscribe(item => {
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
        {
          id: 'add-content-online-joyful-theme',
          name: this.interpolateInstance(this.resourceService.frmelmnts.vidttl.loadcontent),
          thumbnail: 'assets/images/play-icon.svg',
          url: 'assets/videos/How_do_I_load_content_to_the_desktop_app_joyful_theme.mp4'
        },
        {
          id: 'add-content-offline-joyful-theme',
          name: this.interpolateInstance(this.resourceService.frmelmnts.vidttl.downloadcontent),
          thumbnail: 'assets/images/play-icon.svg',
          url: 'assets/videos/How_do_I_download_content_from_DIKSHA_Library_joyful_theme.mp4'
        },
        {
          id: 'find-content-offline-joyful-theme',
          name: this.interpolateInstance(this.resourceService.frmelmnts.vidttl.playcontent),
          thumbnail: 'assets/images/play-icon.svg',
          url: 'assets/videos/How_do_I_play_content_joyful_theme.mp4' 
        },
        {
          id: 'copy-content-joyful-theme',
          name: this.interpolateInstance(this.resourceService.frmelmnts.vidttl.copycontent),
          thumbnail: 'assets/images/play-icon.svg',
          url: 'assets/videos/How_do_I_copy_content_to_my_pen_drive_joyful_theme.mp4'
        }
      ];
      this.activeVideoObject = this.slideData[0];
    });
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

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
