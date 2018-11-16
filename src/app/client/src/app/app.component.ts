
import { first, filter } from 'rxjs/operators';
import { environment } from '@sunbird/environment';
import { ITelemetryContext } from '@sunbird/telemetry';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { TelemetryService } from '@sunbird/telemetry';
import { UtilService, ResourceService, ToasterService, IUserData, IUserProfile,
  NavigationHelperService, ConfigService } from '@sunbird/shared';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import {
  UserService, PermissionService, CoursesService, TenantService, ConceptPickerService, OrgDetailsService,
  DeviceRegisterService
} from '@sunbird/core';
import * as _ from 'lodash';
import { ProfileService } from '@sunbird/profile';
import { Subscription, Observable } from 'rxjs';
const fingerPrint2 = new Fingerprint2();

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
  @ViewChild('frameWorkPopUp') frameWorkPopUp;
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
 * To show toaster(error, success etc) after any API calls.
 */
  private toasterService: ToasterService;
  /**
    * To get url, app configs
  */
  public config: ConfigService;

  public initApp = false;

  private orgDetails: any;

  public version: string;
  /** this variable is used to show the FrameWorkPopUp
   */
  showFrameWorkPopUp = false;

  userDataUnsubscribe: Subscription;
  /**
   * constructor
   */
  constructor(userService: UserService, public navigationHelperService: NavigationHelperService,
    permissionService: PermissionService, resourceService: ResourceService, private deviceRegisterService: DeviceRegisterService,
    courseService: CoursesService, tenantService: TenantService,
    telemetryService: TelemetryService, conceptPickerService: ConceptPickerService, public router: Router,
    config: ConfigService, public orgDetailsService: OrgDetailsService, public activatedRoute: ActivatedRoute,
    public profileService: ProfileService,  toasterService: ToasterService, public utilService: UtilService) {
    this.resourceService = resourceService;
    this.permissionService = permissionService;
    this.userService = userService;
    this.courseService = courseService;
    this.conceptPickerService = conceptPickerService;
    this.tenantService = tenantService;
    this.telemetryService = telemetryService;
    this.toasterService = toasterService;
    this.config = config;
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    this.version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
  }
  /**
   * dispatch telemetry window unload event before browser closes
   * @param  event
   */
  @HostListener('window:beforeunload', ['$event'])
  public beforeunloadHandler($event) {
    this.telemetryService.syncEvents();
  }
  ngOnInit() {
    this.resourceService.initialize();
    this.setDeviceId().subscribe(() => {
      this.navigationHelperService.initialize();
      if (this.userService.loggedIn) {
          this.conceptPickerService.initialize();
          this.initializeLoggedInSession();
      } else {
        this.router.events.pipe(filter(event => event instanceof NavigationEnd), first()).subscribe((urlAfterRedirects: NavigationEnd) => {
            this.initializeAnonymousSession(_.get(this.activatedRoute, 'snapshot.root.firstChild.params.slug'));
        });
      }
    });
  }
  public setDeviceId(): Observable<string> {
    return new Observable(observer => {
      fingerPrint2.get((deviceId) => {
        (<HTMLInputElement>document.getElementById('deviceId')).value = deviceId;
        observer.next(deviceId);
        observer.complete();
      });
    });
  }
  private initializeLoggedInSession() {
    this.userService.startSession();
    this.userService.initialize(true);
    this.permissionService.initialize();
    this.courseService.initialize();
    this.userDataUnsubscribe = this.userService.userData$.subscribe((user: IUserData) => {
      if (!user.err) {
        if (this.userDataUnsubscribe) {
          this.userDataUnsubscribe.unsubscribe();
        }
        if (_.isEmpty(user.userProfile.framework)) {
          this.showFrameWorkPopUp = true;
        } else {
          this.showFrameWorkPopUp = false;
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
  private initializeAnonymousSession(slug) {
    this.orgDetailsService.getOrgDetails(slug).pipe(
      first()).subscribe((data) => {
        this.orgDetails = data;
        this.initTelemetryService(false);
        this.initTenantService(slug);
        this.userService.initialize(false);
        this.initApp = true; // this line should be at the end
      }, (err) => {
        this.initApp = true;
        console.log('unable to get organization details');
      });
  }
  private initTelemetryService(loggedIn) {
    let config: ITelemetryContext;
    if (loggedIn) {
      config = this.getLoggedInUserConfig();
      this.deviceRegisterService.registerDevice(this.userService.hashTagId);
      this.telemetryService.initialize(config);
    } else {
      config = this.getAnonymousUserConfig();
      this.deviceRegisterService.registerDevice(this.orgDetails.hashTagId);
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
  private getAnonymousUserConfig() {
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
        sid: this.userService.anonymousSid,
        channel: this.orgDetails.hashTagId,
        env: 'home',
        enableValidation: environment.enableTelemetryValidation
      }
    };
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
  updateFrameWork(event) {
    const req = {
      framework: event
    };
    this.profileService.updateProfile(req).subscribe(res => {
      this.frameWorkPopUp.modal.deny();
      this.showFrameWorkPopUp = false;
      this.utilService.toggleAppPopup();
      this.router.navigate(['/resources']);
    },
      (err) => {
        this.toasterService.error(this.resourceService.messages.fmsg.m0085);
        this.frameWorkPopUp.modal.deny();
      });
  }
}
