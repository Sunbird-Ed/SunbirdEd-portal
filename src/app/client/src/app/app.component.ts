import { environment } from '@sunbird/environment';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { TelemetryService, ITelemetryContext } from '@sunbird/telemetry';
import {
  UtilService, ResourceService, ToasterService, IUserData, IUserProfile,
  NavigationHelperService, ConfigService, BrowserCacheTtlService
} from '@sunbird/shared';
import { Component, HostListener, OnInit, ViewChild, Inject, OnDestroy, AfterViewInit } from '@angular/core';
import {
  UserService, PermissionService, CoursesService, TenantService, OrgDetailsService, DeviceRegisterService,
  SessionExpiryInterceptor, FormService, ProgramsService
} from '@sunbird/core';
import * as _ from 'lodash-es';
import { ProfileService } from '@sunbird/profile';
import { Observable, of, throwError, combineLatest, BehaviorSubject, forkJoin } from 'rxjs';
import { first, filter, mergeMap, tap, map, skipWhile, startWith, takeUntil } from 'rxjs/operators';
import { CacheService } from 'ng2-cache-service';
import { DOCUMENT } from '@angular/platform-browser';
import { ShepherdService } from 'angular-shepherd';

/**
 * main app component
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
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
  private _routeData$ = new BehaviorSubject(undefined);
  public readonly routeData$ = this._routeData$.asObservable()
    .pipe(skipWhile(data => data === undefined || data === null));

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
  private fingerprintInfo: any;
  hideHeaderNFooter = true;
  queryParams: any;
  telemetryContextData: any;
  didV2: boolean;
  flag = false;
  deviceProfile: any;
  isCustodianOrgUser: any;
  usersProfile: any;
  isLocationConfirmed = true;
  userFeed: any;
  showUserVerificationPopup = false;
  feedCategory = 'OrgMigrationAction';
  labels: {};
  constructor(private cacheService: CacheService, private browserCacheTtlService: BrowserCacheTtlService,
    public userService: UserService, private navigationHelperService: NavigationHelperService,
    private permissionService: PermissionService, public resourceService: ResourceService,
    private deviceRegisterService: DeviceRegisterService, private courseService: CoursesService, private tenantService: TenantService,
    private telemetryService: TelemetryService, public router: Router, private configService: ConfigService,
    private orgDetailsService: OrgDetailsService, private activatedRoute: ActivatedRoute,
    private profileService: ProfileService, private toasterService: ToasterService, public utilService: UtilService,
    public formService: FormService, private programsService: ProgramsService,
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
    this.telemetryService.syncEvents(false);
  }
  handleLogin() {
    window.location.reload();
  }
  handleHeaderNFooter() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        tap((event: NavigationEnd) => this._routeData$.next(event))
      ).subscribe(data => {
        this.hideHeaderNFooter = _.get(this.activatedRoute, 'snapshot.firstChild.firstChild.data.hideHeaderNFooter') ||
          _.get(this.activatedRoute, 'snapshot.firstChild.firstChild.firstChild.data.hideHeaderNFooter');
      });
  }
  ngOnInit() {
    this.didV2 = (localStorage && localStorage.getItem('fpDetails_v2')) ? true : false;
    const queryParams$ = this.activatedRoute.queryParams.pipe(
      filter(queryParams => queryParams && queryParams.clientId === 'android' && queryParams.context),
      tap(queryParams => {
        this.telemetryContextData = JSON.parse(decodeURIComponent(queryParams.context));
      }),
      startWith(null)
    );
    this.handleHeaderNFooter();
    this.resourceService.initialize();
    combineLatest(queryParams$, this.setSlug(), this.setDeviceId())
      .pipe(
        mergeMap(data => {
          this.navigationHelperService.initialize();
          this.userService.initialize(this.userService.loggedIn);
          if (this.userService.loggedIn) {
            this.permissionService.initialize();
            this.courseService.initialize();
            this.programsService.initialize();
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
        this.setFingerPrintTelemetry();
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

  isLocationStatusRequired() {
    const url = this.router.url;
    return !!(_.includes(url, 'signup') || _.includes(url, 'recover') || _.includes(url, 'sign-in'));
  }

  checkLocationStatus() {
    // should not show location popup for sign up and recover route
    if (this.isLocationStatusRequired()) {
      return;
    }
    this.usersProfile = this.userService.userProfile;
    const deviceRegister = this.deviceRegisterService.getDeviceProfile();
    const custodianOrgDetails = this.orgDetailsService.getCustodianOrgDetails();
    forkJoin([deviceRegister, custodianOrgDetails]).subscribe((res) => {
      const deviceProfile = res[0];
      this.deviceProfile = deviceProfile;
      if (_.get(this.userService, 'userProfile.rootOrg.rootOrgId') === _.get(res[1], 'result.response.value')) {
        // non state user
        this.isCustodianOrgUser = true;
        this.deviceProfile = deviceProfile;
        if (this.userService.loggedIn) {
          if (!deviceProfile.userDeclaredLocation ||
            !(this.usersProfile && this.usersProfile.userLocations && this.usersProfile.userLocations.length >= 1)) {
            this.isLocationConfirmed = false;
          }
        } else {
          if (!deviceProfile.userDeclaredLocation) {
            this.isLocationConfirmed = false;
          }
        }
      } else {
        // state user
        this.isCustodianOrgUser = false;
        if (this.userService.loggedIn) {
          if (!deviceProfile.userDeclaredLocation) {
            this.isLocationConfirmed = false;
          }
        } else {
          if (!deviceProfile.userDeclaredLocation) {
            this.isLocationConfirmed = false;
          }
        }
      }
    }, (err) => {
      this.isLocationConfirmed = true;
    });
    this.getUserFeedData();
  }

  setFingerPrintTelemetry() {
    const printFingerprintDetails = (<HTMLInputElement>document.getElementById('logFingerprintDetails'))
      ? (<HTMLInputElement>document.getElementById('logFingerprintDetails')).value : 'false';
    if (printFingerprintDetails !== 'true') {
      return;
    }

    if (this.fingerprintInfo && !this.didV2) {
      this.logExData('fingerprint_info', this.fingerprintInfo);
    }

    if (localStorage && localStorage.getItem('fpDetails_v1')) {
      const fpDetails = JSON.parse(localStorage.getItem('fpDetails_v1'));
      const fingerprintInfoV1 = {
        deviceId: fpDetails.result,
        components: fpDetails.components,
        version: 'v1'
      };
      this.logExData('fingerprint_info', fingerprintInfoV1);
      if (localStorage.getItem('fpDetails_v2')) {
        localStorage.removeItem('fpDetails_v1');
      }
    }
  }

  logExData(type: string, data: object) {
    const event = {
      context: {
        env: 'portal'
      },
      edata: {
        type: type,
        data: JSON.stringify(data)
      }
    };
    this.telemetryService.exData(event);
  }

  logCdnStatus() {
    const isCdnWorking = (<HTMLInputElement>document.getElementById('cdnWorking'))
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
      this.checkLocationStatus();
    } else {
      if (this.userService.loggedIn && _.isEmpty(_.get(this.userProfile, 'framework'))) {
        this.showFrameWorkPopUp = true;
      } else {
        this.checkLocationStatus();
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
      return new Observable(observer => this.telemetryService.getDeviceId((deviceId, components, version) => {
          this.fingerprintInfo = {deviceId, components, version};
          if (this.isOffline) {
            deviceId = <HTMLInputElement>document.getElementById('deviceId') ?
                        (<HTMLInputElement>document.getElementById('deviceId')).value : deviceId;
          }
          (<HTMLInputElement>document.getElementById('deviceId')).value = deviceId;
        this.deviceRegisterService.setDeviceId();
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
      const anonymousTelemetryContextData = {
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
      if (this.telemetryContextData) {
        anonymousTelemetryContextData['config']['did'] = _.get(this.telemetryContextData, 'did');
        anonymousTelemetryContextData['config']['pdata'] = _.get(this.telemetryContextData, 'pdata');
        anonymousTelemetryContextData['config']['channel'] = _.get(this.telemetryContextData, 'channel');
        anonymousTelemetryContextData['config']['sid'] = _.get(this.telemetryContextData, 'sid');
      }
      return anonymousTelemetryContextData;
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
      this.checkLocationStatus();
      this.utilService.toggleAppPopup();
      this.showAppPopUp = this.utilService.showAppPopUp;
    }, err => {
      this.toasterService.warning(this.resourceService.messages.emsg.m0012);
      this.frameWorkPopUp.modal.deny();
      this.checkLocationStatus();
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

  ngOnDestroy() {
    if (this.resourceDataSubscription) {
      this.resourceDataSubscription.unsubscribe();
    }
  }
  interpolateInstance(message) {
    return message.replace('{instance}', _.upperCase(this.instance));
  }
  /** will be triggered once location popup gets closed */
  onLocationSubmit() {
    if (this.userFeed) {
      this.showUserVerificationPopup = true;
    }
  }

  /** It will fetch user feed data if user is custodian as well as logged in. */
  getUserFeedData() {
    this.orgDetailsService.getCustodianOrg().subscribe(custodianOrg => {
      if (this.userService.loggedIn &&
        (_.get(this.userService, 'userProfile.rootOrg.rootOrgId') === _.get(custodianOrg, 'result.response.value'))) {
          this.userService.getFeedData().subscribe(
            (data) => {
              this.userFeed = _.get(data, 'result.response.userFeed[0]');
              if (this.userFeed && _.get(this.userFeed, 'category').toLowerCase() === this.feedCategory.toLowerCase()) {
                const formReadInputParams = {
                  formType: 'user',
                  formAction: 'onboarding',
                  contentType: 'externalIdVerification'
                };
                this.formService.getFormConfig(formReadInputParams).subscribe(
                  (formResponsedata) => {
                    this.labels = _.get(formResponsedata[0], ('range[0]'));
                  }
                );
                // if location popup isn't opened on the very first time.
                if (this.isLocationConfirmed) {
                  this.showUserVerificationPopup = true;
                }
              }
            },
            (error) => {
            });
      }
    });
  }
}
