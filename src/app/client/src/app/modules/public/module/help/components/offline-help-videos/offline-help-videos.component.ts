import { ActivatedRoute } from '@angular/router';
import { ResourceService, ConfigService } from '@sunbird/shared';
import { Component, OnInit, Output, EventEmitter, ViewChild, Inject, OnDestroy, ElementRef, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { IInteractEventEdata } from '@sunbird/telemetry';
import { DOCUMENT } from '@angular/common';
import $ from 'jquery';
import * as _ from 'lodash-es';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-offline-help-videos',
  templateUrl: './offline-help-videos.component.html',
  styleUrls: ['./offline-help-videos.component.scss']
})
export class OfflineHelpVideosComponent implements OnInit, OnDestroy, AfterViewInit {



  @Output() closeVideoModal = new EventEmitter<any>();

  @ViewChild('aspectRatio') aspectRatio: ElementRef;
  @ViewChild('playerInfo') playerInfo: ElementRef;
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
  public activatedRoute: ActivatedRoute, private cdr: ChangeDetectorRef ) {
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
          url: 'assets/videos/How_do_I_download_content_from_SUNBIRD_Library.mp4'
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
          url: 'assets/videos/How_do_I_download_content_from_SUNBIRD_Library_joyful_theme.mp4'
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
        },
        {
          id: 'how-to-login',
          name: this.interpolateInstance(this.resourceService.frmelmnts.vidttl.login),
          thumbnail: 'assets/images/play-icon.svg',
          url: 'assets/videos/How_do_I_login_on_sunbird.mp4'
        },
        {
          id: 'recover-account',
          name: this.interpolateInstance(this.resourceService.frmelmnts.vidttl.recovaccnt),
          thumbnail: 'assets/images/play-icon.svg',
          url: 'assets/videos/How_do_I_recover_myaccount.mp4'
        },
        {
          id: 'register-on-sunbird',
          name: this.interpolateInstance(this.resourceService.frmelmnts.vidttl.register),
          thumbnail: 'assets/images/play-icon.svg',
          url: 'assets/videos/How_do_I_register_on_sunbird.mp4'
        },
        {
          id: 'how-to-login-joyful-theme',
          name: this.interpolateInstance(this.resourceService.frmelmnts.vidttl.loginnewtheme),
          thumbnail: 'assets/images/play-icon.svg',
          url: 'assets/videos/How_do_I_login_on_sunbird_joyful_theme.mp4'
        },
        {
          id: 'recover-account-joyful-theme',
          name: this.interpolateInstance(this.resourceService.frmelmnts.vidttl.recovaccntnewtheme),
          thumbnail: 'assets/images/play-icon.svg',
          url: 'assets/videos/How_do_I_recover_myaccount_joyful_theme.mp4'
        },
        {
          id: 'register-on-sunbird-joyful-theme',
          name: this.interpolateInstance(this.resourceService.frmelmnts.vidttl.registernewtheme),
          thumbnail: 'assets/images/play-icon.svg',
          url: 'assets/videos/How_do_I_register_on_sunbird_joyful_theme.mp4'
        },
        {
          id: 'add-managed-user',
          name: this.interpolateInstance(this.resourceService.frmelmnts.vidttl.manageuser),
          thumbnail: 'assets/images/play-icon.svg',
          url: 'assets/videos/How_do_I_add_users_on_SUNBIRD.mp4'
        },
        {
          id: 'add-managed-user-joyful-theme',
          name: this.interpolateInstance(this.resourceService.frmelmnts.vidttl.manageusernewtheme),
          thumbnail: 'assets/images/play-icon.svg',
          url: 'assets/videos/How_do_I_add_users_on_SUNBIRD_joyful_theme.mp4'
        },
        {
          id: 'login-with-sso-joyful-theme',
          name: this.interpolateInstance(this.resourceService.frmelmnts.vidttl.SSologinnewtheme),
          thumbnail: 'assets/images/play-icon.svg',
          url: 'assets/videos/How_do_I_login_using_my_State_ID_joyful_theme.mp4'
        },
        {
          id: 'login-with-sso',
          name: this.interpolateInstance(this.resourceService.frmelmnts.vidttl.loginSSO),
          thumbnail: 'assets/images/play-icon.svg',
          url: 'assets/videos/How_do_I_login_using_my_State_ID.mp4'
        },
        {
          id: 'login-with-google-joyful-theme',
          name: this.interpolateInstance(this.resourceService.frmelmnts.vidttl.newthemegooglelogin),
          thumbnail: 'assets/images/play-icon.svg',
          url: 'assets/videos/How_do_I_login_using_my_Google_ID_joyful_theme.mp4'
        },
        {
          id: 'login-with-google',
          name: this.interpolateInstance(this.resourceService.frmelmnts.vidttl.googlelogin),
          thumbnail: 'assets/images/play-icon.svg',
          url: 'assets/videos/How_do_I_login_using_my_Google_ID.mp4'
        }
      ];
      this.activeVideoObject = this.slideData[0];
    });
  }

  ngAfterViewInit() {
    this.setVideoHeight();
    this.cdr.detectChanges();
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
