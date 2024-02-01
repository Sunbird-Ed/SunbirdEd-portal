import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, PlayerService, CopyContentService, PermissionService } from '@sunbird/core';
import * as _ from 'lodash-es';
import {
  ConfigService, ResourceService, ToasterService, WindowScrollService, NavigationHelperService,
  PlayerConfig, ContentData, ContentUtilsServiceService, ITelemetryShare, LayoutService
} from '@sunbird/shared';
import { IInteractEventObject, IInteractEventEdata, IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import { PopupControlService } from '../../../../service/popup-control.service';
import { takeUntil, mergeMap } from 'rxjs/operators';
import { Subject, of, throwError } from 'rxjs';
import { PublicPlayerService, ComponentCanDeactivate } from '@sunbird/public';
import { CsGroupAddableBloc } from '@project-sunbird/client-services/blocs';

@Component({
  selector: 'app-content-player',
  templateUrl: './content-player.component.html',
  styleUrls: ['./content-player.component.scss']
})

export class ContentPlayerComponent implements OnInit, AfterViewInit, OnDestroy, ComponentCanDeactivate {
  telemetryImpression: IImpressionEventInput;
  objectInteract: IInteractEventObject;
  copyContentInteractEdata: IInteractEventEdata;
  sharelinkModal: boolean;
  shareLink: string;
  contentId: string;
  contentStatus: string;
  playerConfig: PlayerConfig;
  showPlayer = false;
  showError = false;
  errorMessage: string;
  contentData: ContentData;
  telemetryShareData: Array<ITelemetryShare>;
  public pageLoadDuration: Number;
  playerOption: any;
  showLoader = true;
  isFullScreenView = false;
  layoutConfiguration;
  public unsubscribe = new Subject<void>();
  public dialCode: string;
  public unsubscribe$ = new Subject<void>();
  public objectRollup = {};
  isGroupAdmin: boolean;
  groupId: string;
  isQuestionSet = false;
  isDesktopApp = false;
  isTypeCopyQuestionset:boolean = false;

  @HostListener('window:beforeunload')
    canDeactivate() {
      // returning true will navigate without confirmation
      // returning false will show a confirm dialog before navigating away
      const deviceType = this.telemetryService.getDeviceType();
      return deviceType === 'Desktop' && this.isQuestionSet && !this.isTypeCopyQuestionset ? false : true;
    }

  constructor(public activatedRoute: ActivatedRoute, public navigationHelperService: NavigationHelperService,
    public userService: UserService, public resourceService: ResourceService, public router: Router,
    public toasterService: ToasterService, public windowScrollService: WindowScrollService,
    public playerService: PlayerService, public publicPlayerService: PublicPlayerService,
    public copyContentService: CopyContentService, public permissionService: PermissionService,
    public contentUtilsServiceService: ContentUtilsServiceService, public popupControlService: PopupControlService,
    private configService: ConfigService,
    public layoutService: LayoutService, public telemetryService: TelemetryService) {
    this.playerOption = {
      showContentRating: true
    };
  }

  ngOnInit() {
    console.log('content');
    this.isQuestionSet = _.includes(this.router.url, 'questionset');
    this.isDesktopApp = this.userService.isDesktopApp;
    this.initLayout();
    this.activatedRoute.params.subscribe((params) => {
      this.showPlayer = false;
      this.contentId = params.contentId;
      this.contentStatus = params.contentStatus;
      this.dialCode = _.get(this.activatedRoute, 'snapshot.queryParams.dialCode');
      if (_.get(this.activatedRoute, 'snapshot.queryParams.l1Parent')) {
        this.objectRollup = {
          l1: _.get(this.activatedRoute, 'snapshot.queryParams.l1Parent')
        };
      }
      CsGroupAddableBloc.instance.state$.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
        this.groupId = _.get(data, 'groupId') || _.get(this.activatedRoute.snapshot, 'queryParams.groupId');
      });
      this.getContent();
      CsGroupAddableBloc.instance.state$.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
        this.isGroupAdmin = !_.isEmpty(_.get(this.activatedRoute.snapshot, 'queryParams.groupId'))
        && _.get(data.params, 'groupData.isAdmin');
      });
    });

    this.navigationHelperService.contentFullScreenEvent.
      pipe(takeUntil(this.unsubscribe)).subscribe(isFullScreen => {
        this.isFullScreenView = isFullScreen;
      });
  }

  initLayout() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.layoutService.switchableLayout().
      pipe(takeUntil(this.unsubscribe)).subscribe(layoutConfig => {
        if (layoutConfig != null) {
          this.layoutConfiguration = layoutConfig.layout;
        }
      });
  }

  setTelemetryData() {
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: this.groupId ? [{id: this.groupId, type: 'Group'}] : [],
      },
      object: {
        id: this.contentId,
        type: this.contentData.contentType,
        ver: this.contentData.pkgVersion ? this.contentData.pkgVersion.toString() : '1.0'
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.router.url,
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
        duration: this.pageLoadDuration
      }
    };
    this.objectInteract = {
      id: this.contentId,
      type: this.contentData.contentType,
      ver: this.contentData.pkgVersion ? this.contentData.pkgVersion.toString() : '1.0'
    };
    this.copyContentInteractEdata = {
      id: 'copy-content-button',
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };
  }

  goBack() {
    this.navigationHelperService.goBack();
  }

  getContent() {
    if (this.isQuestionSet) {
      this.getQuestionSetHierarchy();
    } else if (this.userService.loggedIn) {
      const option = { params: this.configService.appConfig.ContentPlayer.contentApiQueryParams };
      if (this.contentStatus && this.contentStatus === 'Unlisted') {
        option.params = { mode: 'edit' };
      }
      this.playerService.getContent(this.contentId, option).subscribe(
        (response) => {
          this.showLoader = false;
          if (response.result.content.status === 'Live' || response.result.content.status === 'Unlisted') {
            this.showPlayer = true;
            const contentDetails = {
              contentId: this.contentId,
              contentData: response.result.content
            };
            this.playerConfig = this.playerService.getConfig(contentDetails);
            this.contentData = response.result.content;
            this.setTelemetryData();
            this.windowScrollService.smoothScroll('content-player');
          } else {
            this.toasterService.warning(this.resourceService.messages.imsg.m0027);
          }
        },
        (err) => {
          this.showLoader = false;
          this.showError = true;
          this.errorMessage = this.resourceService.messages.stmsg.m0009;
        });
    } else {
      this.getPublicContent();
    }
  }

  getQuestionSetHierarchy() {
    const serveiceRef =  this.userService.loggedIn ? this.playerService : this.publicPlayerService;
    this.publicPlayerService.getQuestionSetHierarchy(this.contentId).pipe(
      takeUntil(this.unsubscribe$))
      .subscribe((response) => {
        this.showLoader = false;
        const contentDetails = {
          contentId: this.contentId,
          contentData: response?.questionset || response?.questionSet
        };
        this.playerConfig = serveiceRef.getConfig(contentDetails);
        this.playerConfig.context.objectRollup = this.objectRollup;
        this.contentData = response?.questionset || response?.questionSet;
        this.showPlayer = true;
      }, (err) => {
        this.showLoader = false;
        this.showError = true;
        this.errorMessage = this.resourceService.messages.stmsg.m0009;
      });
  }

  getPublicContent() {
    const options: any = { dialCode: this.dialCode };
    const params = { params: this.configService.appConfig.PublicPlayer.contentApiQueryParams };
    this.publicPlayerService.getContent(this.contentId, params).pipe(
      mergeMap((response) => {
        if (_.get(response, 'result.content.status') === 'Unlisted') {
          return throwError({
            code: 'UNLISTED_CONTENT'
          });
        }
        return of(response);
      }),
      takeUntil(this.unsubscribe$))
      .subscribe((response) => {
        this.showLoader = false;
        const contentDetails = {
          contentId: this.contentId,
          contentData: response.result.content
        };
        this.playerConfig = this.publicPlayerService.getConfig(contentDetails, options);
        this.playerConfig.context.objectRollup = this.objectRollup;
        this.contentData = response.result.content;
        this.showPlayer = true;
      }, (err) => {
        this.showLoader = false;
        this.showError = true;
        this.errorMessage = this.resourceService.messages.stmsg.m0009;
      });
  }

  copyContent(contentData: ContentData) {
    let successMsg = '';
    let errorMsg = '';
    this.isTypeCopyQuestionset = _.get(contentData, 'mimeType') === 'application/vnd.sunbird.questionset';
    this.isTypeCopyQuestionset ? (successMsg = this.resourceService.messages.smsg.m0067, errorMsg = this.resourceService.messages.emsg.m0067) : (successMsg = this.resourceService.messages.smsg.m0042, errorMsg = this.resourceService.messages.emsg.m0008);
    this.copyContentService.copyContent(contentData).subscribe(
      (response) => {
        this.toasterService.success(successMsg);
      },
      (err) => {
        this.toasterService.error(errorMsg);
      });
  }

  onShareLink() {
    this.shareLink = this.contentUtilsServiceService.getPublicShareUrl(this.contentId, this.contentData.mimeType);
    this.setTelemetryShareData(this.contentData);
  }

  ngAfterViewInit() {
    this.pageLoadDuration = this.navigationHelperService.getPageLoadTime();
  }

  setTelemetryShareData(param) {
    this.telemetryShareData = [{
      id: param.identifier,
      type: param.contentType,
      ver: param.pkgVersion ? param.pkgVersion.toString() : '1.0'
    }];
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
