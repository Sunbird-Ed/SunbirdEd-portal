import { environment } from '@sunbird/environment';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { TelemetryService, ITelemetryContext } from '@sunbird/telemetry';
import {
  UtilService, ResourceService, ToasterService, IUserData, IUserProfile, ConnectionService,
  NavigationHelperService, ConfigService, BrowserCacheTtlService, LayoutService, GenericResourceService
} from '@sunbird/shared';
import { Component, HostListener, OnInit, ViewChild, Inject, OnDestroy, ChangeDetectorRef, ElementRef, Renderer2, NgZone } from '@angular/core';
import {
  UserService, PermissionService, CoursesService, TenantService, OrgDetailsService, DeviceRegisterService,
  SessionExpiryInterceptor, FormService, GeneraliseLabelService
} from '@sunbird/core';
import * as _ from 'lodash-es';
import { ProfileService } from '@sunbird/profile';
import { Observable, of, throwError, combineLatest, BehaviorSubject, forkJoin, zip, Subject } from 'rxjs';
import { first, filter, mergeMap, tap, skipWhile, startWith, takeUntil, debounceTime, catchError } from 'rxjs/operators';
import { CacheService } from '../app/modules/shared/services/cache-service/cache.service';
import { DOCUMENT } from '@angular/common';
import { image } from '../assets/images/tara-bot-icon';
import { SBTagModule } from 'sb-tag-manager';
import { CslFrameworkService } from '../app/modules/public/services/csl-framework/csl-framework.service';
import { PopupControlService } from './service/popup-control.service';
/**
 * main app component
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
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
   * this variable is used to show the global consent pop up
   */
  public showGlobalConsentPopUpSection = false;
  /**
   * Used to config telemetry service and device register api. Possible values
   * 1. org hashtag for Anonymous user
   * 2. user profile rootOrg hashtag for logged in
   */
  public channel: string;
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
  sessionExpired = false;
  isglobalConsent = true;
  instance: string;
  resourceDataSubscription: any;
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
  isFullScreenView;
  showUserVerificationPopup = false;
  feedCategory = 'OrgMigrationAction';
  globalConsent = 'global-consent';
  labels: {};
  showUserTypePopup = false;
  deviceId: string;
  dataThemeAttribute: string;
  scrollHeight: number;
  public botObject: any = {};
  isBotEnabled = (<HTMLInputElement>document.getElementById('isBotConfigured'))
    ? (<HTMLInputElement>document.getElementById('isBotConfigured')).value : 'false';
  showNavAccessibility: any = (<HTMLInputElement>document.getElementById('sunbirdNavAccessibility'))
    ? (<HTMLInputElement>document.getElementById('sunbirdNavAccessibility')).value : 'true';
  botServiceURL = (<HTMLInputElement>document.getElementById('botServiceURL'))
    ? (<HTMLInputElement>document.getElementById('botServiceURL')).value : '';
  baseUrl = (<HTMLInputElement>document.getElementById('offlineDesktopAppDownloadUrl'))
    ? (<HTMLInputElement>document.getElementById('offlineDesktopAppDownloadUrl')).value : '';
  layoutConfiguration;
  title = _.get(this.resourceService, 'frmelmnts.btn.botTitle') ? _.get(this.resourceService, 'frmelmnts.btn.botTitle') : 'Ask Tara';
  showJoyThemePopUp = false;
  public unsubscribe$ = new Subject<void>();
  consentConfig: { tncLink: string; tncText: any; };
  isDesktopApp = false;
  // Font Increase Decrease Variables
  fontSize: any;
  defaultFontSize = 16;
  isGuestUser = true;
  guestUserDetails;
  showYearOfBirthPopup = false;
  public isIOS = false;
  loadPopUps = true;
  FORM_CONFIG_ENABLED = false;
  isStepperCompleted = false;
  OnboardingFormConfig: any;
  isStepperEnabled = false;
  isPopupEnabled = false;
  onboardingData: any;
  onboardingDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  onboardingData$ = this.onboardingDataSubject;
  isOnboardingEnabled = true;
  isFWSelectionEnabled = true;
  isUserTypeEnabled = true;
  @ViewChild('increaseFontSize') increaseFontSize: ElementRef;
  @ViewChild('decreaseFontSize') decreaseFontSize: ElementRef;
  @ViewChild('resetFontSize') resetFontSize: ElementRef;
  @ViewChild('darkModeToggle') darkModeToggle: ElementRef;

  constructor(private cacheService: CacheService, private browserCacheTtlService: BrowserCacheTtlService,
    public userService: UserService, private navigationHelperService: NavigationHelperService,
    private permissionService: PermissionService, public resourceService: ResourceService,
    private deviceRegisterService: DeviceRegisterService, private courseService: CoursesService, private tenantService: TenantService,
    private telemetryService: TelemetryService, public router: Router, private configService: ConfigService,
    private orgDetailsService: OrgDetailsService, private activatedRoute: ActivatedRoute,
    private profileService: ProfileService, private toasterService: ToasterService, public utilService: UtilService,
    public formService: FormService, @Inject(DOCUMENT) private _document: any, public sessionExpiryInterceptor: SessionExpiryInterceptor,
    public changeDetectorRef: ChangeDetectorRef, public layoutService: LayoutService,
    public generaliseLabelService: GeneraliseLabelService, private renderer: Renderer2, private zone: NgZone,
    private connectionService: ConnectionService, public genericResourceService: GenericResourceService, public popupControlService: PopupControlService, private cslFrameworkService: CslFrameworkService) {
    this.instance = (<HTMLInputElement>document.getElementById('instance'))
      ? (<HTMLInputElement>document.getElementById('instance')).value : 'sunbird';
    const layoutType = localStorage.getItem('layoutType') || 'base';
    if (layoutType === 'base' || layoutType === 'joy') {
      this.layoutConfiguration = this.configService.appConfig.layoutConfiguration;
      document.documentElement.setAttribute('layout', 'joy');
    } else {
      document.documentElement.setAttribute('layout', 'base');
    }
  }
  
  /**
   * dispatch telemetry window unload event before browser closes
   * @param  event
   */
  @HostListener('window:beforeunload', ['$event'])
  public beforeunloadHandler($event) {
    this.telemetryService.syncEvents(false);
    this.ngOnDestroy();
  }

  handleLogin() {
    window.location.replace('/sessionExpired');
    this.cacheService.removeAll();
  }

  private setDynamicPageTitle() {
    let child = this.activatedRoute.firstChild;
    while (child.firstChild) {
      child = child.firstChild;
    }
    const pageTitle = _.get(child, 'snapshot.data.pageTitle') || _.get(child, 'snapshot.data.telemetry.pageid') || _.get(this.userService, 'rootOrgName');
    if (pageTitle) {
      document.title = pageTitle;
    }
  }

  handleHeaderNFooter() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        tap((event: NavigationEnd) => this._routeData$.next(event))
      ).subscribe(data => {
        this.setDynamicPageTitle();
        this.hideHeaderNFooter = _.get(this.activatedRoute, 'snapshot.firstChild.firstChild.data.hideHeaderNFooter') ||
          _.get(this.activatedRoute, 'snapshot.firstChild.firstChild.firstChild.data.hideHeaderNFooter');
      });
  }

  ngAfterViewInit() {
    // themeing code
    const trans = () => {
      document.documentElement.classList.add('transition');
      window.setTimeout(() => {
        document.documentElement.classList.remove('transition');
      }, 1000);
    };
    const selector = document.querySelectorAll('input[name=selector]');
    for (let i = 0; i < selector.length; i++) {
      selector[i].addEventListener('change', function () {
        if (this.checked) {
          trans();
          document.documentElement.setAttribute('data-theme', this.value);
        }
      });
    }
    this.setTheme();
    // themeing code
    this.getLocalFontSize();
    // dark theme
    this.getLocalTheme();

    this.setTagManager();
    this.userService.userData$.subscribe((user: IUserData) => {
      if (user.err) {
        return throwError(user.err);
      }
      // If User is logged in and dob is missing, initiate consent workflow
      // Skip for managed users - SB-30762
      // Skip for SSO users     - SB-30762
      if (!_.get(user, 'userProfile.dob') &&
        (this.userService.loggedIn && !_.get(user, 'userProfile.managedBy')) &&
        (_.isArray(_.get(user, 'userProfile.externalIds')) && _.get(user, 'userProfile.externalIds').length === 0)
      ) {
        this.router.navigate(['/signup'], { queryParams: { loginMode: 'gmail' } });
      }
    });
  }

  setTagManager() {
    window['TagManager'] = SBTagModule.instance;
    window['TagManager'].init();
    if (this.userService.loggedIn) {
      if (localStorage.getItem('tagManager_' + this.userService.userid)) {
        window['TagManager'].SBTagService.restoreTags(localStorage.getItem('tagManager_' + this.userService.userid));
      }
    } else {
      if (localStorage.getItem('tagManager_' + 'guest')) {
        window['TagManager'].SBTagService.restoreTags(localStorage.getItem('tagManager_' + 'guest'));
      }
    }
  }

  setTheme() {
    const themeColour = localStorage.getItem('layoutColour') || 'default';
    if (this.darkModeToggle && this.darkModeToggle.nativeElement) {
      this.renderer.setAttribute(this.darkModeToggle.nativeElement, 'aria-label', `Selected theme ${themeColour}`);
    }
    this.setSelectedThemeColour(themeColour);
    document.documentElement.setAttribute('data-theme', themeColour);
    this.layoutService.setLayoutConfig(this.layoutConfiguration);
  }
  checkToShowPopups() {
    const formReadInputParams = {
      formType: 'user',
      formAction: 'onboarding',
      contentType: 'exclusion',
      component: 'portal'
    };
    this.formService.getFormConfig(formReadInputParams).subscribe(
      (formResponsedata) => {
        const routesArray = formResponsedata;
        const url = location.href
        routesArray.forEach(element => {
          if (_.includes(url, element)) {
            this.loadPopUps = false;
          }
        });
      }
    );
  }
  checkFormData(): Observable<any> {
    const formReadInputParams = {
      formType: 'newUserOnboarding',
      formAction: 'onboarding',
      contentType: 'global',
      component: 'portal'
    };
    return of(this.formService.getFormConfig(formReadInputParams).subscribe(
      (formResponsedata) => {
        console.log('userOnboarding Form is called and we are trying to get the update', formResponsedata);
        if (_.get(formResponsedata, 'shownewUserOnboarding') === 'false') {
          this.FORM_CONFIG_ENABLED = true;
        }
      }
    ));
  }
  /**
   * @description - get the stepper flag from localstorage to check weather stepper process completes or not
   */
  getStepperInfo() {
    const isStepperCompleted = localStorage.getItem('isStepperCompleted');
    this.isStepperCompleted = isStepperCompleted ? true : false;
  }
  /**
   * @description -  to fetch all form config data list for onboarding stepper flow
   */
  getOnboardingList() {
    // const formReadInputParams = {
    //   formType: 'useronboardingsteps',
    //   formAction: 'onboarding',
    //   contentType: 'global',
    //   component: 'portal'
    // };
    // this.formService.getFormConfig(formReadInputParams).subscribe(
    //   (formResponsedata) => {
    //     if (formResponsedata) {
    //       this.OnboardingFormConfig = formResponsedata;
    //       this.isStepperEnabled = true;
    //     }
    //     else { this.isPopupEnabled = true; }
    //   }, error => { this.isPopupEnabled = true; });;
    this.isPopupEnabled = true;
  }
  
  /**
      * @description - This method enables/disables the onboarding popups based on the isvisible values returned from the form config request
  */
  async getOnboardingSkipStatus(){
    const formReadInputParams = {
      formType: 'onboardingPopupVisibility',
      formAction: 'onboarding',
      contentType: "global",
      component: "portal"
    };
    try {
      const formResponsedata = await this.formService
        .getFormConfig(formReadInputParams)
        .pipe(
          catchError((error) => {
            console.error('Error fetching form config:', error);
            return [];
          })
        )
        .toPromise();
      this.onboardingData = formResponsedata;
      this.onboardingDataSubject.next(this.onboardingData);
    } catch (error) {
      console.log('Cant read the form:', error);
      return null;
    }
    this.popupControlService.setOnboardingData(this.onboardingData);
    this.checkPopupVisiblity(this.onboardingData);
  }
  
  /**
    * @description - This method sets the popup show values to true/false based on values from form config
  */
  checkPopupVisiblity(onboardingData) {
      this.isOnboardingEnabled = onboardingData?.onboardingPopups ? onboardingData?.onboardingPopups?.isVisible : true;
      this.isFWSelectionEnabled = onboardingData?.frameworkPopup ? onboardingData?.frameworkPopup?.isVisible : true;
      this.isUserTypeEnabled = onboardingData?.userTypePopup ? onboardingData?.userTypePopup?.isVisible : true;
      if (!(this.isOnboardingEnabled) || !(this.isFWSelectionEnabled)) {
        this.userService.setGuestUser(true, onboardingData?.frameworkPopup?.defaultFormatedName); //user service method is set to true in case either of onboarding or framework popup is disabled
      }
  }

  ngOnInit() {
    this.getOnboardingList();
    this.getOnboardingSkipStatus();
    this.checkToShowPopups();
    this.getStepperInfo();
    this.isIOS = this.utilService.isIos;
    this.isDesktopApp = this.utilService.isDesktopApp;
    if (this.isDesktopApp) {
      this._document.body.classList.add('desktop-app');
      this.notifyNetworkChange();
    }
    this.checkFullScreenView();
    this.layoutService.switchableLayout().pipe(takeUntil(this.unsubscribe$)).subscribe(layoutConfig => {
      if (layoutConfig != null) {
        this.layoutConfiguration = layoutConfig.layout;
      }
    });
    this.activatedRoute.queryParams.pipe(filter(param => !_.isEmpty(param))).subscribe(params => {
      const utmParams = ['utm_campaign', 'utm_medium', 'utm_source', 'utm_term', 'utm_content', 'channel'];
      if (_.some(_.intersection(utmParams, _.keys(params)))) {
        this.telemetryService.makeUTMSession(params);
      }
    });
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
    this.genericResourceService.initialize();
    combineLatest(queryParams$, this.setDeviceId(), this.checkFormData())
      .pipe(
        mergeMap(data => {
          this.navigationHelperService.initialize();
          this.userService.initialize(this.userService.loggedIn);
          this.getOrgDetails();
          if (this.userService.loggedIn && !this.FORM_CONFIG_ENABLED) {
            this.isGuestUser = false;
            this.permissionService.initialize();
            this.courseService.initialize();
            this.userService.startSession();
            this.checkForCustodianUser();
            return this.setUserDetails();
          } else if (this.userService.loggedIn && this.FORM_CONFIG_ENABLED) {
            this.setUserOptions();
          } else {
            this.isGuestUser = true;
            const onboardingPromise = new Promise((resolve) => {
              this.onboardingData$.subscribe((data) => {
                if (data) {
                  resolve(this.onboardingData);
                }
              });
            });
            onboardingPromise.then((onboardingData) => {
              this.onboardingData = onboardingData;
              this.checkPopupVisiblity(this.onboardingData);
              this.userService.getGuestUser().subscribe(
                (response) => {
                  this.guestUserDetails = response;
                },
                (error) => {
                  console.error('Error while fetching guest user', error);
                }
              );
            });
            return this.setOrgDetails();
          }            
        }))
      .subscribe(data => {
        const channelId = data.hashTagId || data.rootOrgId;
        this.cacheService.set('channelId', channelId);        
        this.cslFrameworkService.setDefaultFWforCsl('',channelId );
        this.tenantService.getTenantInfo(this.userService.slug);
        this.tenantService.initialize();
        this.setPortalTitleLogo();
        this.telemetryService.initialize(this.getTelemetryContext());
        this.logCdnStatus();
        this.setFingerPrintTelemetry();
        this.initApp = true;
        localStorage.setItem('joyThemePopup', 'true');
        this.joyThemePopup();
        this.changeDetectorRef.detectChanges();
        this.cslFrameworkService.setTransFormGlobalFilterConfig(channelId);
      }, error => {
        this.initApp = true;
        this.changeDetectorRef.detectChanges();
      });

    this.changeLanguageAttribute();
    if (this.userService.loggedIn) {
      this.botObject['userId'] = this.userService.userid;
    } else {
      this.botObject['userId'] = this.deviceId;
    }
    this.botObject['appId'] = this.userService.appId;
    this.botObject['chatbotUrl'] = this.baseUrl + this.botServiceURL;

    this.botObject['imageUrl'] = image.imageUrl;
    this.botObject['title'] = this.botObject['header'] = this.title;
    this.generaliseLabelService.getGeneraliseResourceBundle();
    // keyboard accessibility enter key click event
    document.onkeydown = function (e) {
      const element = document.getElementById('overlay-button') as HTMLElement;
      if (e.keyCode === 13 && document.activeElement !== element) { // The Enter/Return key
        (document.activeElement as HTMLElement).click();
      }
    };
  }
  setUserOptions() {
    const userStoredData = JSON.parse(localStorage.getItem('guestUserDetails'));
    if (userStoredData) {
      const userFrameworkData = _.get(userStoredData, 'framework');
      if (userFrameworkData && !(_.get(this.userService.userProfile, 'framework'))) {
        const req = {
          framework: userFrameworkData
        };
        this.profileService.updateProfile(req).subscribe(res => {
          console.log('user data updated---->', req);
        }, err => {
          this.toasterService.warning(this.resourceService.messages.emsg.m0012);
          this.closeFrameworkPopup();
          this.checkLocationStatus();
        });
      }
    }
  }
  onCloseJoyThemePopup() {
    this.showJoyThemePopUp = false;
    this.checkTncAndFrameWorkSelected();
  }

  isBotdisplayforRoute() {
    const url = this.router.url;
    return !!(_.includes(url, 'signup') || _.includes(url, 'recover') || _.includes(url, 'sign-in'));
  }

  checkFullScreenView() {
    this.navigationHelperService.contentFullScreenEvent.pipe(takeUntil(this.unsubscribe$)).subscribe(isFullScreen => {
      this.isFullScreenView = isFullScreen;
    });
  }

  storeThemeColour(value) {
    localStorage.setItem('layoutColour', value);
  }

  setSelectedThemeColour(value) {
    const element = (<HTMLInputElement>document.getElementById(value));
    if (element) {
      element.checked = true;
    }
  }

  isLocationStatusRequired() {
    const url = location.href;
    return !!(_.includes(url, 'signup') || _.includes(url, 'recover') || _.includes(url, 'sign-in'));
  }

  joyThemePopup() {
    const joyThemePopup = localStorage.getItem('joyThemePopup');
    // if (joyThemePopup === 'true') {
    //   this.checkTncAndFrameWorkSelected();
    // } else {
    //   this.showJoyThemePopUp = true;
    // }
    this.checkTncAndFrameWorkSelected();
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
      // TODO: code can be removed in 3.1 release from user-onboarding component as it is handled here.
      zip(this.tenantService.tenantData$, this.getOrgDetails(false)).subscribe((res) => {
        if (_.get(res[0], 'tenantData')) {
          const orgDetailsFromSlug = this.cacheService.get('orgDetailsFromSlug');
          // if (_.get(orgDetailsFromSlug, 'slug') !== this.tenantService.slugForIgot) {

          let userType;
          if (this.isDesktopApp && this.isGuestUser) {
            userType = _.get(this.guestUserDetails, 'role') ? this.guestUserDetails.role : undefined;
            this.showUserTypePopup = userType ? false : true;
          } else if (this.isGuestUser) {
            userType = localStorage.getItem('userType');
            if (!this.showUserTypePopup && this.isLocationConfirmed) {
              this.checkFrameworkSelected();
            }
            if (!this.isLocationConfirmed) {
              this.zone.run(() => {
                this.showUserTypePopup = true
              })
            }
          } else {
            userType = localStorage.getItem('userType');
          }
          this.showUserTypePopup = _.get(this.userService, 'loggedIn') ? (!_.get(this.userService, 'userProfile.profileUserType.type') || !userType) : this.showUserTypePopup;
          // }
        }
      });
    }, (err) => {
      this.isLocationConfirmed = false;
      this.showUserTypePopup = true;
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
    if (_.has(this.userService.userProfile, 'promptTnC') && _.has(this.userService.userProfile, 'tncLatestVersion') &&
      _.has(this.userService.userProfile, 'tncLatestVersion') && this.userService.userProfile.promptTnC === true) {
      this.showTermsAndCondPopUp = true;
    } else {
      if (this.userService.loggedIn) {
        this.orgDetailsService.getCustodianOrgDetails().subscribe((custodianOrg) => {
          if (_.get(this.userService, 'userProfile.rootOrg.rootOrgId') !== _.get(custodianOrg, 'result.response.value')) {
            // Check for non custodian user and show global consent pop up
            this.consentConfig = { tncLink: _.get(this.resourceService, 'frmelmnts.lbl.privacyPolicy'), tncText: _.get(this.resourceService, 'frmelmnts.lbl.nonCustodianTC') };
            this.showGlobalConsentPopUpSection = true;
          } else {
            this.isGuestUser ? this.checkLocationStatus() : this.checkFrameworkSelected();
          }
        });
      } else {
        this.isGuestUser ? this.checkLocationStatus() : this.checkFrameworkSelected();
      }
    }
  }
  public getOrgDetails(storeOrgDetails = true) {
    const slug = this.userService.slug;
    return this.orgDetailsService.getOrgDetails(slug).pipe(
      tap(data => {
        if (slug !== '' && storeOrgDetails) {
          this.cacheService.set('orgDetailsFromSlug', data, {
            maxAge: 86400
          });
        }
      })
    );
  }
  public checkForCustodianUser() {
    this.orgDetailsService.getCustodianOrgDetails().subscribe((custodianOrg) => {
      if (_.get(this.userService, 'userProfile.rootOrg.rootOrgId') === _.get(custodianOrg, 'result.response.value')) {
        this.userService.setIsCustodianUser(true);
      } else {
        this.userService.setIsCustodianUser(false);
      }
    });
  }
  /**
   * checks if user has selected the framework and shows popup if not selected.
   */
  public checkFrameworkSelected() {
    // should not show framework popup for sign up and recover route
    if (this.isLocationStatusRequired()) {
      return;
    }
    this.zone.run(() => {
      const frameWorkPopUp: boolean = this.cacheService.get('showFrameWorkPopUp');
      if (frameWorkPopUp) {
        this.showFrameWorkPopUp = false;
        !this.isGuestUser ? this.checkLocationStatus() : null;
      } else {
        if (this.userService.loggedIn && _.isEmpty(_.get(this.userProfile, 'framework'))) {
          this.showFrameWorkPopUp = true;
        } else if (this.isGuestUser) {
          if (!this.guestUserDetails) {
            this.userService.getGuestUser().subscribe((response) => {
              this.guestUserDetails = response;
              this.showFrameWorkPopUp = false;
            }, error => {
              this.showFrameWorkPopUp = true;
            });
          } else {
            this.checkLocationStatus();
          }
        } else {
          this.checkLocationStatus();
        }
      }
    });
  }

  /**
   * once tnc is accepted from tnc popup on submit this function is triggered
   */
  public onAcceptTnc() {
    this.showTermsAndCondPopUp = false;
    if (this.userService.loggedIn) {
      this.orgDetailsService.getCustodianOrgDetails().subscribe((custodianOrg) => {
        if (_.get(this.userService, 'userProfile.rootOrg.rootOrgId') !== _.get(custodianOrg, 'result.response.value')) {
          // Check for non custodian user and show global consent pop up
          this.consentConfig = { tncLink: _.get(this.resourceService, 'frmelmnts.lbl.privacyPolicy'), tncText: _.get(this.resourceService, 'frmelmnts.lbl.nonCustodianTC') };
          this.showGlobalConsentPopUpSection = true;
        } else {
          this.checkFrameworkSelected();
        }
      });
    } else {
      this.checkFrameworkSelected();
    }
  }

  public closeConsentPopUp() {
    this.showGlobalConsentPopUpSection = false;
    this.isglobalConsent = false;
    this.globalConsent = '';
    this.checkFrameworkSelected();
  }

  /**
   * fetch device id using fingerPrint2 library.
   */
  public setDeviceId(): Observable<string> {
    return new Observable(observer => this.telemetryService.getDeviceId((deviceId, components, version) => {
      if (this.utilService.isDesktopApp) {
        deviceId = (<HTMLInputElement>document.getElementById('deviceId')).value;
      }
      this.fingerprintInfo = { deviceId, components, version };
      (<HTMLInputElement>document.getElementById('deviceId')).value = deviceId;
      this.deviceId = deviceId;
      this.botObject['did'] = deviceId;
      this.deviceRegisterService.setDeviceId();
      observer.next(deviceId);
      observer.complete();
    }));
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
        this.channel = this.userService.hashTagId;
        this.botObject['channel'] = this.channel;
        return of(user.userProfile);
      }));
  }
  /**
   * set org Details for Anonymous user.
   */
  private setOrgDetails(): Observable<any> {
    return this.orgDetailsService.getOrgDetails(this.userService.slug).pipe(
      tap(data => {
        localStorage.setItem('orgHashTagId', _.get(data, 'hashTagId'));
        this.orgDetails = data;
        this.channel = this.orgDetails.hashTagId;
        this.botObject['channel'] = this.channel;
        if (this.userService.slug !== '') {
          this.cacheService.set('orgDetailsFromSlug', data, {
            maxAge: 86400
          });
        }
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
          rootOrgId: this.orgDetails.id,
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
        // document.title = _.get(this.userService, 'rootOrgName') || _.get(data, 'tenantData.titleName');
        document.querySelector('link[rel*=\'icon\']').setAttribute('href', data.tenantData.favicon);
      }
    });
  }

  closeFrameworkPopup() {
    this.frameWorkPopUp && this.frameWorkPopUp.deny();
    this.showFrameWorkPopUp = false;
  }
  /**
   * updates user framework. After update redirects to library
   */
  public updateFrameWork(event) {
    if (this.isGuestUser && !this.guestUserDetails) {
      const user: any = { name: 'guest', formatedName: 'Guest', framework: event };
      const userType = localStorage.getItem('userType');
      if (userType) {
        user.role = userType;
      }
      this.userService.createGuestUser(user).subscribe(data => {
        this.toasterService.success(_.get(this.resourceService, 'messages.smsg.m0058'));
      }, error => {
        this.toasterService.error(_.get(this.resourceService, 'messages.emsg.m0005'));
      });
      this.closeFrameworkPopup();
      this.checkLocationStatus();
    } else {
      const req = {
        framework: event
      };
      this.profileService.updateProfile(req).subscribe(res => {
        this.closeFrameworkPopup();
        this.userService.setUserFramework(event);
        this.checkLocationStatus();
        this.utilService.toggleAppPopup();
        this.showAppPopUp = this.utilService.showAppPopUp;
      }, err => {
        this.toasterService.warning(this.resourceService.messages.emsg.m0012);
        this.closeFrameworkPopup();
        this.checkLocationStatus();
      });
    }
  }
  viewInBrowser() {
    // no action required
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
    if (window['TagManager']) {
      if (this.userService.loggedIn) {
        localStorage.setItem('tagManager_' + this.userService.userid, JSON.stringify(window['TagManager'].SBTagService));
      } else {
        localStorage.setItem('tagManager_' + 'guest', JSON.stringify(window['TagManager'].SBTagService));
      }
    }
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  interpolateInstance(message) {
    return message.replace('{instance}', _.upperCase(this.instance));
  }
  /** will be triggered once location popup gets closed */
  onLocationSubmit() {
    if (this.isGuestUser) {
      this.showUserTypePopup = false;
      this.checkFrameworkSelected();
    }
    this.showYearOfBirthPopup = true;
    if (this.userFeed) {
      this.showUserVerificationPopup = true;
    }
  }

  /** It will fetch user feed data if user is custodian as well as logged in. */
  getUserFeedData() {
    this.orgDetailsService.getCustodianOrgDetails().subscribe(custodianOrg => {
      if (this.userService.loggedIn && !this.userService.userProfile.managedBy &&
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
              let orgId;
              if ((_.get(this.userFeed, 'data.prospectChannelsIds')) && (_.get(this.userFeed, 'data.prospectChannelsIds').length) === 1) {
                orgId = _.get(this.userFeed, 'data.prospectChannelsIds[0].id');
              }
              this.formService.getFormConfig(formReadInputParams, orgId).subscribe(
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

  // Change Font Size (Increase & Decrease)
  getLocalFontSize() {
    const localFontSize = localStorage.getItem('fontSize');
    if (localFontSize) {
      document.documentElement.style.setProperty('font-size', localFontSize + 'px');
      this.fontSize = localFontSize;
      this.isDisableFontSize(localFontSize);
    }
  }
  changeFontSize(value: string) {

    const elFontSize = window.getComputedStyle(document.documentElement).getPropertyValue('font-size');

    const localFontSize = localStorage.getItem('fontSize');
    const currentFontSize = localFontSize ? localFontSize : elFontSize;
    this.fontSize = parseInt(currentFontSize);

    if (value === 'increase') {
      this.renderer.setAttribute(this.increaseFontSize.nativeElement, 'aria-pressed', 'true');
      this.renderer.removeAttribute(this.decreaseFontSize.nativeElement, 'aria-pressed');
      this.renderer.removeAttribute(this.resetFontSize.nativeElement, 'aria-pressed');
      this.fontSize = this.fontSize + 2;
      if (this.fontSize <= 20) {
        this.setLocalFontSize(this.fontSize);
      }
    } else if (value === 'decrease') {
      this.renderer.setAttribute(this.decreaseFontSize.nativeElement, 'aria-pressed', 'true');
      this.renderer.removeAttribute(this.increaseFontSize.nativeElement, 'aria-pressed');
      this.renderer.removeAttribute(this.resetFontSize.nativeElement, 'aria-pressed');
      this.fontSize = this.fontSize - 2;
      if (this.fontSize >= 12) {
        this.setLocalFontSize(this.fontSize);
      }
    } else {
      this.renderer.setAttribute(this.resetFontSize.nativeElement, 'aria-pressed', 'true');
      this.renderer.removeAttribute(this.increaseFontSize.nativeElement, 'aria-pressed');
      this.renderer.removeAttribute(this.decreaseFontSize.nativeElement, 'aria-pressed');
      this.setLocalFontSize(this.defaultFontSize);
    }

  }

  setLocalFontSize(value: any) {
    document.documentElement.style.setProperty('font-size', value + 'px');
    localStorage.setItem('fontSize', value);
    this.isDisableFontSize(value);
  }

  isDisableFontSize(value: any) {
    value = parseInt(value);
    if (value === 20) {
      this.renderer.setAttribute(this.increaseFontSize.nativeElement, 'disabled', 'true');
      this.renderer.removeAttribute(this.decreaseFontSize.nativeElement, 'disabled');
      this.renderer.removeAttribute(this.resetFontSize.nativeElement, 'disabled');
    } else if (value === 12) {
      this.renderer.setAttribute(this.decreaseFontSize.nativeElement, 'disabled', 'true');
      this.renderer.removeAttribute(this.increaseFontSize.nativeElement, 'disabled');
      this.renderer.removeAttribute(this.resetFontSize.nativeElement, 'disabled');
    } else if (value === 16) {
      this.renderer.setAttribute(this.resetFontSize.nativeElement, 'disabled', 'true');
      this.renderer.removeAttribute(this.increaseFontSize.nativeElement, 'disabled');
      this.renderer.removeAttribute(this.decreaseFontSize.nativeElement, 'disabled');
    } else {
      this.renderer.removeAttribute(this.increaseFontSize.nativeElement, 'disabled');
      this.renderer.removeAttribute(this.decreaseFontSize.nativeElement, 'disabled');
      this.renderer.removeAttribute(this.resetFontSize.nativeElement, 'disabled');
    }
  }
  skipToMainContent() {
    const getTheme = document.documentElement.attributes['layout'].value;
    if (getTheme == 'joy') {
      const headerElement = document.getElementsByClassName('sbt-fluid-header-bg');
      if (headerElement.length > 0) {
        const headerHeight = headerElement[headerElement.length - 1].clientHeight;
        if (typeof window.orientation !== 'undefined') {
          this.scrollHeight = headerElement[0].clientHeight + 150;
        } else {
          this.scrollHeight = headerHeight * 2;
        }
        this.scrollTo(this.scrollHeight);
      }
    } else {
      const header = document.getElementsByTagName('app-header');
      const headerElement = header[0].children[0].children[0].clientHeight;
      if (document.getElementsByTagName('app-search-filter').length > 0) {
        const searchFilter = document.getElementsByTagName('app-search-filter')[0]
          .children[0].clientHeight;
        this.scrollTo(searchFilter + headerElement + 48);
      } else if (
        document.getElementsByTagName('app-global-search-filter').length > 0
      ) {
        const searchFilter = document.getElementsByTagName(
          'app-global-search-filter'
        )[0].children[0].clientHeight;
        this.scrollTo(searchFilter + headerElement + 48);
      } else {
        this.scrollTo(headerElement + 48);
      }
    }
  }
  scrollTo(height) {
    window.scroll({
      top: height,
      behavior: 'smooth',
    });
  }
  getLocalTheme() {
    const localDataThemeAttribute = localStorage.getItem('data-mode');
    if (localDataThemeAttribute) {
      this.setLocalTheme(localDataThemeAttribute);
    }
  }
  toggleLightDarkMode() {
    this.dataThemeAttribute = document.documentElement.getAttribute('data-mode');
    this.dataThemeAttribute = this.dataThemeAttribute === 'light' ? 'darkmode' : 'light';
    this.renderer.setAttribute(this.darkModeToggle.nativeElement, 'aria-label', `Selected theme ${this.dataThemeAttribute}`);
    this.setLocalTheme(this.dataThemeAttribute);
    localStorage.setItem('data-mode', this.dataThemeAttribute);
  }
  setLocalTheme(value: string) {
    document.documentElement.setAttribute('data-mode', value);
  }
  notifyNetworkChange() {
    this.connectionService.monitor().pipe(debounceTime(5000)).subscribe((status: boolean) => {
      const message = status ? _.get(this.resourceService, 'messages.stmsg.desktop.onlineStatus') : _.get(this.resourceService, 'messages.emsg.desktop.offlineStatus');
      this.toasterService.info(message);
      if (!status && this.router.url.indexOf('mydownloads') <= 0) {
        this.router.navigate(['mydownloads'], { queryParams: { selectedTab: 'mydownloads' } });
      }
    });
  }
  onActivate(event) {
    this.layoutService.scrollTop();
  }
  /**
   * @param  {boolean} event
   * @description  - set the flag in localstorage when stepper process completes
   */
  isStepper(event) {
    this.isStepperCompleted = event;
    localStorage.setItem('isStepperCompleted', JSON.stringify(this.isStepperCompleted));
  }
}
