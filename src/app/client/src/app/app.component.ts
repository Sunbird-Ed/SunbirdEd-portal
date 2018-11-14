
import { first, filter } from 'rxjs/operators';
import { environment } from '@sunbird/environment';
import { ITelemetryContext } from '@sunbird/telemetry';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { TelemetryService, IStartEventInput } from '@sunbird/telemetry';
import { ResourceService, IUserData, IUserProfile, NavigationHelperService, ConfigService } from '@sunbird/shared';
import { Component, HostListener, OnInit } from '@angular/core';
import {
  UserService, PermissionService, CoursesService, TenantService, ConceptPickerService, OrgDetailsService
} from '@sunbird/core';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { UUID } from 'angular2-uuid';
import { DeviceDetectorService } from 'ngx-device-detector';
const anonymousSessionDuration = 1;

/**
 * main app component
 *
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  /**
   * user profile details.
   */
  userProfile: IUserProfile;
  /**
   * reference of TenantService.
   */
  public tenantService: TenantService;
  /**
   * reference of UserService service.
   */
  public userService: UserService;
  /**
   * reference of config service.
   */
  public permissionService: PermissionService;
  /**
   * reference of resourceService service.
   */
  public resourceService: ResourceService;
  /**
   * reference of courseService service.
   */
  public courseService: CoursesService;
  /**
   * reference of conceptPickerService service.
    */
  public conceptPickerService: ConceptPickerService;
  /**
   * reference of telemetryService service.
   */
  public telemetryService: TelemetryService;
  /**
    * To get url, app configs
  */
  public config: ConfigService;

  public initApp = false;

  private orgDetails: any;

  public version: string;

  private logAnonymousSessionStartEvent = false;

  userDataUnsubscribe: Subscription;
  /**
   * constructor
   */
  constructor(userService: UserService, public navigationHelperService: NavigationHelperService,
    permissionService: PermissionService, resourceService: ResourceService,
    courseService: CoursesService, tenantService: TenantService, private deviceDetectorService: DeviceDetectorService,
    telemetryService: TelemetryService, conceptPickerService: ConceptPickerService, public router: Router,
    config: ConfigService, public orgDetailsService: OrgDetailsService, public activatedRoute: ActivatedRoute) {
    this.resourceService = resourceService;
    this.permissionService = permissionService;
    this.userService = userService;
    this.courseService = courseService;
    this.conceptPickerService = conceptPickerService;
    this.tenantService = tenantService;
    this.telemetryService = telemetryService;
    this.config = config;
  }
  /**
   * dispatch telemetry window unload event before browser closes
   * @param  event
   */
  @HostListener('window:beforeunload', ['$event'])
  public beforeunloadHandler($event) {
    this.telemetryService.syncEvents();
    if (!this.userService.loggedIn) {
      this.resetAnonymousSessionDetails();
    }
  }
  ngOnInit() {
    const fingerPrint2 = new Fingerprint2();
    this.resourceService.initialize();
    this.navigationHelperService.initialize();
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    this.version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    fingerPrint2.get((deviceId) => {
      (<HTMLInputElement>document.getElementById('deviceId')).value = deviceId;
      this.initializeApp();
    });
  }
  initializeApp() {
    if (this.userService.loggedIn) {
        this.conceptPickerService.initialize();
        this.initializeLoggedInSession();
    } else {
      this.router.events.pipe(filter(event => event instanceof NavigationEnd), first()).subscribe((urlAfterRedirects: NavigationEnd) => {
          this.initializeAnonymousSession(_.get(this.activatedRoute, 'snapshot.root.firstChild.params.slug'));
      });
    }
  }
  initializeLoggedInSession() {
    this.userService.startSession();
    this.userService.initialize(true);
    this.permissionService.initialize();
    this.courseService.initialize();
    this.userDataUnsubscribe = this.userService.userData$.subscribe((user: IUserData) => {
      if (!user.err) {
        if (this.userDataUnsubscribe) {
          this.userDataUnsubscribe.unsubscribe();
        }
        this.initApp = true;
        this.userProfile = user.userProfile;
        const slug = _.get(user, 'userProfile.rootOrg.slug');
        this.initTelemetryService(true);
        this.initTenantService(slug);
      } else if (user.err) {
        if (this.userDataUnsubscribe) {
          this.userDataUnsubscribe.unsubscribe();
        }
        this.initApp = true;
        this.initTenantService();
      }
    });
  }
  initializeAnonymousSession(slug) {
    this.orgDetailsService.getOrgDetails(slug).pipe(
      first()).subscribe((data) => {
        this.orgDetails = data;
        this.initTelemetryService(false);
        this.setAnonymousSessionStartData(); // date should be set after telemetry service initialized
        this.initTenantService(slug);
        this.userService.initialize(false);
        this.initApp = true; // this line should be at the end
      }, (err) => {
        this.userService.anonymousSid = UUID.UUID();
        this.initApp = true;
        console.log('unable to get organization details');
      });
  }
  public initTelemetryService(loggedIn) {
    let config: ITelemetryContext;
    if (loggedIn) {
      config = this.getLoggedInUserConfig();
      this.telemetryService.initialize(config);
    } else {
      config = this.getAnonymousUserConfig();
      this.telemetryService.initialize(config);
    }
  }

  private getLoggedInUserConfig(): ITelemetryContext {
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
          ver: this.version,
          pid: this.config.appConfig.TELEMETRY.PID
        },
        endpoint: this.config.urlConFig.URLS.TELEMETRY.SYNC,
        apislug: this.config.urlConFig.URLS.CONTENT_PREFIX,
        host: '',
        uid: this.userProfile.userId,
        sid: this.userService.sessionId,
        channel: _.get(this.userProfile, 'rootOrg.hashTagId'),
        env: 'home',
        enableValidation: environment.enableTelemetryValidation
      }
    };
  }
  getAnonymousUserConfig() {
    const anonymousSessionId =  this.getAnonymousSessionId();
    return {
      userOrgDetails: {
        userId: 'anonymous',
        rootOrgId: this.orgDetails.rootOrgId,
        organisationIds: [this.orgDetails.hashTagId]
      },
      config: {
        pdata: {
          id: this.userService.appId,
          ver: this.version,
          pid: this.config.appConfig.TELEMETRY.PID
        },
        endpoint: this.config.urlConFig.URLS.TELEMETRY.SYNC,
        apislug: this.config.urlConFig.URLS.CONTENT_PREFIX,
        host: '',
        uid: 'anonymous',
        sid: anonymousSessionId,
        channel: this.orgDetails.hashTagId,
        env: 'home',
        enableValidation: environment.enableTelemetryValidation
      }
    };
  }
  private getAnonymousSessionId() {
    let anonymousSessionDetails;
    try {
      anonymousSessionDetails = JSON.parse(localStorage.getItem('anonymousSessionDetails'));
    } catch {
    }
    if (!_.get(anonymousSessionDetails, 'lastAccessedTime') || !_.get(anonymousSessionDetails, 'sessionId')
    || this.anonymousSessionExpired(anonymousSessionDetails.lastAccessedTime)) {

      if (_.get(anonymousSessionDetails, 'tabCount') && _.get(anonymousSessionDetails, 'tabCount')) {
        anonymousSessionDetails.tabCount = anonymousSessionDetails.tabCount + 1;
      } else {
        anonymousSessionDetails = {
          tabCount: 1,
          sessionId: UUID.UUID(),
          lastAccessedTime: new Date()
        };
        this.logAnonymousSessionStartEvent = true;
      }

      localStorage.setItem('anonymousSessionDetails', JSON.stringify(anonymousSessionDetails));
    } else {
      anonymousSessionDetails.lastAccessedTime = new Date();
      anonymousSessionDetails.tabCount = anonymousSessionDetails.tabCount + 1;
      localStorage.setItem('anonymousSessionDetails', JSON.stringify(anonymousSessionDetails));
    }
    this.userService.anonymousSid = anonymousSessionDetails.sessionId;
    return anonymousSessionDetails.sessionId;
  }
  private anonymousSessionExpired(lastAccessedTime = new Date()) {
    const start = moment();
    const end = moment(lastAccessedTime);
    return (moment.duration(start.diff(end)).asMinutes() > anonymousSessionDuration);
  }
  private resetAnonymousSessionDetails() {
    const anonymousSessionDetails = {
      tabCount: 0,
      sessionId: this.userService.anonymousSid,
      lastAccessedTime: new Date()
    };
    try {
      const localSessionData = JSON.parse(localStorage.getItem('anonymousSessionDetails'));
      if (localSessionData && localSessionData.tabCount) {
        anonymousSessionDetails.tabCount = localSessionData.tabCount - 1;
        anonymousSessionDetails.lastAccessedTime = new Date();
      }
    } catch {
    }
    localStorage.setItem('anonymousSessionDetails', JSON.stringify(anonymousSessionDetails));
  }
  setAnonymousSessionStartData() {
    if (!this.logAnonymousSessionStartEvent) {
      return;
    }
    const deviceInfo = this.deviceDetectorService.getDeviceInfo();
    const telemetryStart = {
      context: {
        env: 'anonymousUser'
      },
      edata: {
        type: 'session',
        pageid: 'public',
        mode: 'anonymous',
        uaspec: {
          agent: deviceInfo.browser,
          ver: deviceInfo.browser_version,
          system: deviceInfo.os_version ,
          platform: deviceInfo.os,
          raw: deviceInfo.userAgent
        }
      }
    };
    setTimeout(() => this.telemetryService.start(telemetryStart), 1000); // to avoid sync issue in telemetry lib
  }
  private initTenantService(slug?: string) {
    this.tenantService.getTenantInfo(slug);
    this.tenantService.tenantData$.subscribe(
      data => {
        if (data && !data.err) {
          document.title = this.userService.rootOrgName || data.tenantData.titleName;
          document.querySelector('link[rel*=\'icon\']').setAttribute('href', data.tenantData.favicon);
        }
      }
    );
  }
}
