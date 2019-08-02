import { environment } from '@sunbird/environment';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { TelemetryService, ITelemetryContext } from '@sunbird/telemetry';
import {
  UtilService, ResourceService, ToasterService, IUserData, IUserProfile,
  NavigationHelperService, ConfigService, BrowserCacheTtlService
} from '@sunbird/shared';
import { Component, HostListener, OnInit, ViewChild, Inject, OnDestroy, AfterViewInit } from '@angular/core';
import { UserService, PermissionService, CoursesService, TenantService, OrgDetailsService, DeviceRegisterService,
  SessionExpiryInterceptor } from '@sunbird/core';
import * as _ from 'lodash-es';
import { ProfileService } from '@sunbird/profile';
import { Observable, of, throwError, combineLatest } from 'rxjs';
import { first, filter, mergeMap, tap, map } from 'rxjs/operators';
import { CacheService } from 'ng2-cache-service';
import { DOCUMENT } from '@angular/platform-browser';
import { ShepherdService } from 'angular-shepherd';
import {builtInButtons, defaultStepOptions} from './shepherd-data';




/**
 * main app component
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('frameWorkPopUp') frameWorkPopUp;
  /**
   * user profile details.
   */
  private userProfile: IUserProfile;
  /**
   * user to load app after fetching user/org details.
   */
  public initApp = false;
  /**
   * stores organization details for Anonymous user.
   */
  private orgDetails: any;
  /**
   * this variable is used to show the FrameWorkPopUp
   */
  public showFrameWorkPopUp = false;

  /**
   * this variable is used to show the terms and conditions popup
   */
  public showTermsAndCondPopUp = false;

  /**
   * Used to fetch tenant details and org details for Anonymous user. Possible values
   * 1. url slug param will be slug for Anonymous user
   * 2. user profile rootOrg slug for logged in
   */
  private slug: string;
  /**
   * Used to config telemetry service and device register api. Possible values
   * 1. org hashtag for Anonymous user
   * 2. user profile rootOrg hashtag for logged in
   */
  private channel: string;
  /**
   * constructor
   */
  /**
  * Variable to show popup to install the app
  */
  showAppPopUp = false;
  viewinBrowser = false;
  isOffline: boolean = environment.isOffline;
  sessionExpired = false;
  instance: string;
  resourceDataSubscription: any;
  shepherdData: Array<any>;
  constructor(private cacheService: CacheService, private browserCacheTtlService: BrowserCacheTtlService,
    public userService: UserService, private navigationHelperService: NavigationHelperService,
    private permissionService: PermissionService, public resourceService: ResourceService,
    private deviceRegisterService: DeviceRegisterService, private courseService: CoursesService, private tenantService: TenantService,
    private telemetryService: TelemetryService, public router: Router, private configService: ConfigService,
    private orgDetailsService: OrgDetailsService, private activatedRoute: ActivatedRoute,
    private profileService: ProfileService, private toasterService: ToasterService, public utilService: UtilService,
    @Inject(DOCUMENT) private _document: any, public sessionExpiryInterceptor: SessionExpiryInterceptor,
    private shepherdService: ShepherdService) {
      this.instance = (<HTMLInputElement>document.getElementById('instance'))
        ? (<HTMLInputElement>document.getElementById('instance')).value : 'sunbird';
  }
  /**
   * dispatch telemetry window unload event before browser closes
   * @param  event
   */
  @HostListener('window:beforeunload', ['$event'])
  public beforeunloadHandler($event) {
    this.telemetryService.syncEvents();
  }
  handleLogin() {
    window.location.reload();
  }
  ngOnInit() {
    this.resourceService.initialize();
    combineLatest(this.setSlug(), this.setDeviceId()).pipe(
      mergeMap(data => {
        this.navigationHelperService.initialize();
        this.userService.initialize(this.userService.loggedIn);
        if (this.userService.loggedIn) {
          this.permissionService.initialize();
          this.courseService.initialize();
          this.userService.startSession();
          return this.setUserDetails();
        } else {
          return this.setOrgDetails();
        }
      }))
      .subscribe(data => {
        this.tenantService.getTenantInfo(this.slug);
        this.setPortalTitleLogo();
        this.telemetryService.initialize(this.getTelemetryContext());
        this.logCdnStatus();
        this.checkTncAndFrameWorkSelected();
        this.initApp = true;
      }, error => {
        this.initApp = true;
      });

    this.changeLanguageAttribute();
    if (this.isOffline) {
      document.body.classList.add('sb-offline');
     }
}
  logCdnStatus() {
    const isCdnWorking  = (<HTMLInputElement>document.getElementById('cdnWorking'))
    ? (<HTMLInputElement>document.getElementById('cdnWorking')).value : 'no';
    if (isCdnWorking !== 'no') {
      return;
    }
    const event = {
      context: {
        env: 'app'
      },
      edata: {
        type: 'cdn_failed',
        level: 'ERROR',
        message: 'cdn failed, loading files from portal',
        pageid: this.router.url.split('?')[0]
      }
    };
    this.telemetryService.log(event);
  }
  /**
   * checks if user has accepted the tnc and show tnc popup.
   */
  public checkTncAndFrameWorkSelected() {
    if (_.has(this.userProfile, 'promptTnC') && _.has(this.userProfile, 'tncLatestVersion') &&
      _.has(this.userProfile, 'tncLatestVersion') && this.userProfile.promptTnC === true) {
      this.showTermsAndCondPopUp = true;
    } else {
      this.checkFrameworkSelected();
    }
  }

  /**
   * checks if user has selected the framework and shows popup if not selected.
   */
  public checkFrameworkSelected() {
    const frameWorkPopUp: boolean = this.cacheService.get('showFrameWorkPopUp');
    if (frameWorkPopUp) {
      this.showFrameWorkPopUp = false;
    } else {
      if (this.userService.loggedIn && _.isEmpty(_.get(this.userProfile, 'framework'))) {
        this.showFrameWorkPopUp = true;
      }
    }
  }

  /**
   * once tnc is accepted from tnc popup on submit this function is triggered
   */
  public onAcceptTnc() {
    this.showTermsAndCondPopUp = false;
    this.checkFrameworkSelected();
  }

  /**
   * fetch device id using fingerPrint2 library.
   */
  public setDeviceId(): Observable<string> {
    return new Observable(observer => this.telemetryService.getDeviceId(deviceId => {
        (<HTMLInputElement>document.getElementById('deviceId')).value = deviceId;
        this.deviceRegisterService.initialize();
        observer.next(deviceId);
        observer.complete();
      }));
  }
  /**
   * set slug from url only for Anonymous user.
   */
  private setSlug(): Observable<string> {
    if (this.userService.loggedIn) {
      return of(undefined);
    } else {
      return this.router.events.pipe(filter(event => event instanceof NavigationEnd), first(),
        map(data => this.slug = _.get(this.activatedRoute, 'snapshot.firstChild.firstChild.params.slug')));
    }
  }
  /**
   * set user details for loggedIn user.
   */
  private setUserDetails(): Observable<any> {
    return this.userService.userData$.pipe(first(),
      mergeMap((user: IUserData) => {
        if (user.err) {
          return throwError(user.err);
        }
        this.userProfile = user.userProfile;
        this.slug = _.get(this.userProfile, 'rootOrg.slug');
        this.channel = this.userService.hashTagId;
        return of(user.userProfile);
      }));
  }
  /**
   * set org Details for Anonymous user.
   */
  private setOrgDetails(): Observable<any> {
    return this.orgDetailsService.getOrgDetails(this.slug).pipe(
      tap(data => {
        this.orgDetails = data;
        this.channel = this.orgDetails.hashTagId;
      })
    );
  }
  /**
   * returns telemetry context based on user loggedIn
   */
  private getTelemetryContext(): ITelemetryContext {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    if (this.userService.loggedIn) {
      return {
        userOrgDetails: {
          userId: this.userProfile.userId,
          rootOrgId: this.userProfile.rootOrgId,
          rootOrg: this.userProfile.rootOrg,
          organisationIds: this.userProfile.hashTagIds
        },
        config: {
          pdata: {
            id: this.userService.appId,
            ver: version,
            pid: this.configService.appConfig.TELEMETRY.PID
          },
          endpoint: this.configService.urlConFig.URLS.TELEMETRY.SYNC,
          apislug: this.configService.urlConFig.URLS.CONTENT_PREFIX,
          host: '',
          uid: this.userProfile.userId,
          sid: this.userService.sessionId,
          channel: _.get(this.userProfile, 'rootOrg.hashTagId'),
          env: 'home',
          enableValidation: environment.enableTelemetryValidation,
          timeDiff: this.userService.getServerTimeDiff
        }
      };
    } else {
      return {
        userOrgDetails: {
          userId: 'anonymous',
          rootOrgId: this.orgDetails.rootOrgId,
          organisationIds: [this.orgDetails.hashTagId]
        },
        config: {
          pdata: {
            id: this.userService.appId,
            ver: version,
            pid: this.configService.appConfig.TELEMETRY.PID
          },
          batchsize: 10,
          endpoint: this.configService.urlConFig.URLS.TELEMETRY.SYNC,
          apislug: this.configService.urlConFig.URLS.CONTENT_PREFIX,
          host: '',
          sid: this.userService.anonymousSid,
          channel: this.orgDetails.hashTagId,
          env: 'home',
          enableValidation: environment.enableTelemetryValidation,
          timeDiff: this.orgDetailsService.getServerTimeDiff
        }
      };
    }
  }
  /**
   * set app title and favicon after getting tenant data
   */
  private setPortalTitleLogo(): void {
    this.tenantService.tenantData$.subscribe(data => {
      if (!data.err) {
        document.title = this.userService.rootOrgName || data.tenantData.titleName;
        document.querySelector('link[rel*=\'icon\']').setAttribute('href', data.tenantData.favicon);
      }
    });
  }
  /**
   * updates user framework. After update redirects to library
   */
  public updateFrameWork(event) {
    const req = {
      framework: event
    };
    this.profileService.updateProfile(req).subscribe(res => {
      this.frameWorkPopUp.modal.deny();
      this.showFrameWorkPopUp = false;
      this.utilService.toggleAppPopup();
      this.showAppPopUp = this.utilService.showAppPopUp;
    }, err => {
      this.toasterService.warning(this.resourceService.messages.emsg.m0012);
      this.frameWorkPopUp.modal.deny();
      this.router.navigate(['/resources']);
      this.cacheService.set('showFrameWorkPopUp', 'installApp');
    });
  }
  viewInBrowser() {
    this.router.navigate(['/resources']);
  }
  closeIcon() {
    this.showFrameWorkPopUp = false;
    this.cacheService.set('showFrameWorkPopUp', 'installApp');
  }
  changeLanguageAttribute() {
    this.resourceDataSubscription = this.resourceService.languageSelected$.subscribe(item => {
      if (item.value && item.dir) {
          this._document.documentElement.lang = item.value;
          this._document.documentElement.dir = item.dir;
        } else {
          this._document.documentElement.lang = 'en';
          this._document.documentElement.dir = 'ltr';
        }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeShepherdData();
      if (this.isOffline) {
        this.shepherdService.defaultStepOptions = defaultStepOptions;
        this.shepherdService.disableScroll = true;
        this.shepherdService.modal = true;
        this.shepherdService.confirmCancel = false;
        this.shepherdService.addSteps(this.shepherdData);
        if ((localStorage.getItem('TakeOfflineTour') !== 'show')) {
          localStorage.setItem('TakeOfflineTour', 'show');
          this.shepherdService.start();
        }
      }
    }, 1000);
  }

  initializeShepherdData() {
    this.shepherdData = [
      {
      id: this.resourceService.frmelmnts.instn.t0086,
      useModalOverlay: true,
      options: {
          attachTo: '.tour-1 bottom',
          buttons: [
              builtInButtons.skip,
              builtInButtons.next],
          classes: 'sb-guide-text-area',
          title: this.resourceService.frmelmnts.instn.t0086,
          text: [ this.interpolateInstance(this.resourceService.frmelmnts.instn.t0090)]
      }
    },
    {
      id: this.resourceService.frmelmnts.instn.t0087,
      useModalOverlay: true,
      options: {
          attachTo: '.tour-2 bottom',
          buttons: [
              builtInButtons.skip,
              builtInButtons.back,
              builtInButtons.next
          ],
          classes: 'sb-guide-text-area',
          title: this.resourceService.frmelmnts.instn.t0087,
          text: [this.resourceService.frmelmnts.instn.t0091]
      }
    },
    {
      id:  this.interpolateInstance(this.resourceService.frmelmnts.instn.t0088),
      useModalOverlay: true,
      options: {
          attachTo: '.tour-3 bottom',
          buttons: [
              builtInButtons.skip,
              builtInButtons.back,
              builtInButtons.next,
          ],
          classes: 'sb-guide-text-area',
          title:  this.interpolateInstance(this.resourceService.frmelmnts.instn.t0088),
          text: [this.interpolateInstance(this.resourceService.frmelmnts.instn.t0092)]
      }
    },
    {
      id:  this.interpolateInstance(this.resourceService.frmelmnts.instn.t0089),
      useModalOverlay: true,
      options: {
          attachTo: '.tour-4 bottom',
          buttons: [
              builtInButtons.back,
              builtInButtons.cancel,
          ],
          classes: 'sb-guide-text-area',
          title: this.interpolateInstance(this.resourceService.frmelmnts.instn.t0089),
          text: [ this.interpolateInstance(this.resourceService.frmelmnts.instn.t0093)]
      }
    }];
  }
  ngOnDestroy() {
    if (this.resourceDataSubscription) {
      this.resourceDataSubscription.unsubscribe();
    }
  }
  interpolateInstance(message) {
    return message.replace('{instance}', _.upperCase(this.instance));
  }
}
