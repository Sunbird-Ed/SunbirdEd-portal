import { environment } from '@sunbird/environment';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { TelemetryService, ITelemetryContext } from '@sunbird/telemetry';
import {
  UtilService, ResourceService, ToasterService,
  NavigationHelperService, ConfigService, BrowserCacheTtlService
} from '@sunbird/shared';
import { Component, HostListener, OnInit, Inject, OnDestroy } from '@angular/core';
import { UserService, PermissionService, CoursesService, TenantService, OrgDetailsService, DeviceRegisterService,
  SessionExpiryInterceptor } from '@sunbird/core';
import * as _ from 'lodash-es';
import { ProfileService } from '@sunbird/profile';
import { Observable, of, combineLatest, BehaviorSubject } from 'rxjs';
import { first, filter, mergeMap, tap, map, skipWhile, startWith, catchError } from 'rxjs/operators';
import { CacheService } from 'ng2-cache-service';
import { DOCUMENT } from '@angular/platform-browser';
import { ShepherdService } from 'angular-shepherd';
import {builtInButtons, defaultStepOptions} from './shepherd-data';
import { OnboardingService , ConnectionService} from '@sunbird/offline';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';



/**
 * main app component
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  /**
   * user to load app after fetching user/org details.
   */
  public initApp = false;
  /**
   * stores organization details for Anonymous user.
   */
  private orgDetails: any;

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
  hideHeaderNFooter = true;
  queryParams: any;
  telemetryContextData: any ;
  showOnboardingPopup = false;
  isConnected: any;
  public unsubscribe$ = new Subject<void>();

  constructor(private cacheService: CacheService, private browserCacheTtlService: BrowserCacheTtlService,
    public userService: UserService, private navigationHelperService: NavigationHelperService,
    private permissionService: PermissionService, public resourceService: ResourceService,
    private deviceRegisterService: DeviceRegisterService, private courseService: CoursesService, private tenantService: TenantService,
    private telemetryService: TelemetryService, public router: Router, private configService: ConfigService,
    private orgDetailsService: OrgDetailsService, private activatedRoute: ActivatedRoute,
    private connectionService: ConnectionService,
    private profileService: ProfileService, private toasterService: ToasterService, public utilService: UtilService,
    @Inject(DOCUMENT) private _document: any, public sessionExpiryInterceptor: SessionExpiryInterceptor,
    private shepherdService: ShepherdService, public onboardingService: OnboardingService) {
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
  getUserData() {
    return combineLatest(this.setOrgDetails(), this.getDesktopUserData());
  }
  ngOnInit() {

    const queryParams$ = this.activatedRoute.queryParams.pipe(
      filter( queryParams => queryParams && queryParams.clientId === 'android' && queryParams.context),
      first(),
      tap(queryParams => {
        this.telemetryContextData = JSON.parse(decodeURIComponent(queryParams.context));
      }),
      startWith(null)
    );
    this.handleHeaderNFooter();
    this.resourceService.initialize();
    combineLatest(this.setSlug())
    .pipe(
      mergeMap(data => {
        return this.getUserData();
      }))
      .subscribe(data => {
        this.telemetryService.initialize(this.getTelemetryContext());
        this.navigationHelperService.initialize();
        _.isEmpty(data[1]) ? this.showOnboardingPopup = true : this.initializeTourTravel();
        this.onboardingService.onboardCompletion.subscribe(event => {
          event !== 'SUCCESS' ? this.showOnboardingPopup = true : this.initializeTourTravel();
        });
        this.tenantService.getTenantInfo(this.slug);
        this.setPortalTitleLogo();
        this.initApp = true;
      }, error => {
        this.initApp = true;
      });

    this.changeLanguageAttribute();
    document.body.classList.add('sb-offline');

    this.handleOnlineStatus();

}
handleOnlineStatus() {
  this.connectionService.monitor().pipe(takeUntil(this.unsubscribe$)).subscribe(isConnected => {
    if (this.resourceService.messages.emsg) {
      this.isConnected = isConnected;
      this.isConnected === true ? this.toasterService.success(this.resourceService.messages.stmsg.desktop.onlineStatus) :
      this.toasterService.error(this.resourceService.messages.emsg.desktop.offlineStatus);
    }
  });
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
      const version = (<HTMLInputElement>document.getElementById('buildNumber')).value;
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
  initializeTourTravel() {
    this.showOnboardingPopup = false;
    //   setTimeout(() => {
    //     this.initializeShepherdData();
    //       this.shepherdService.defaultStepOptions = defaultStepOptions;
    //       this.shepherdService.disableScroll = true;
    //       this.shepherdService.modal = true;
    //       this.shepherdService.confirmCancel = false;
    //       this.shepherdService.addSteps(this.shepherdData);
    //       if ((localStorage.getItem('TakeOfflineTour') !== 'show')) {
    //         localStorage.setItem('TakeOfflineTour', 'show');
    //         this.shepherdService.start();
    //       }
    //   }, 1000);
  }

  getDesktopUserData() {
    return this.onboardingService.getUser().pipe(
    tap(data => {
    }), catchError(error => {
      return of(undefined);
    }));
  }
}
