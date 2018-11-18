
import { first, filter, map, mergeMap, tap } from 'rxjs/operators';
import { environment } from '@sunbird/environment';
import { ITelemetryContext } from '@sunbird/telemetry';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { TelemetryService } from '@sunbird/telemetry';
import { UtilService, ResourceService, ToasterService, IUserData, IUserProfile,
  NavigationHelperService, ConfigService } from '@sunbird/shared';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import {
  UserService, PermissionService, CoursesService, TenantService, OrgDetailsService, DeviceRegisterService
} from '@sunbird/core';
import * as _ from 'lodash';
import { ProfileService } from '@sunbird/profile';
import { Subscription, Observable, of, throwError, combineLatest } from 'rxjs';
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

  private userDataUnsubscribe: Subscription;
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
  constructor(userService: UserService, public navigationHelperService: NavigationHelperService,
    permissionService: PermissionService, resourceService: ResourceService, private deviceRegisterService: DeviceRegisterService,
    courseService: CoursesService, tenantService: TenantService,
    telemetryService: TelemetryService, public router: Router,
    config: ConfigService, public orgDetailsService: OrgDetailsService, public activatedRoute: ActivatedRoute,
    public profileService: ProfileService,  toasterService: ToasterService, public utilService: UtilService) {
    this.resourceService = resourceService;
    this.permissionService = permissionService;
    this.userService = userService;
    this.courseService = courseService;
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
    combineLatest( this.setSlug(), this.setDeviceId()).pipe(
      mergeMap(data => {
        this.navigationHelperService.initialize();
        this.userService.initialize(this.userService.loggedIn);
        if (this.userService.loggedIn) {
          this.permissionService.initialize();
          this.courseService.initialize();
          return this.setUserDetails();
        } else {
          return this.setOrgDetails();
        }
      }))
    .subscribe(data => {
      this.tenantService.getTenantInfo(this.slug);
      this.setPortalTitleLogo();
      this.telemetryService.initialize(this.getTelemetryConfig());
      this.deviceRegisterService.registerDevice(this.channel);
      if (this.userService.loggedIn && _.isEmpty(_.get(this.userProfile, 'framework'))) {
        this.showFrameWorkPopUp = true;
      }
      this.initApp = true;
      console.log('app initialized');
    }, error => {
      this.initApp = true;
      console.log('app initialing failed', error);
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
  private setSlug() {
    return this.router.events.pipe(filter(event => event instanceof NavigationEnd), first(),
    tap(data => this.slug = _.get(this.activatedRoute, 'snapshot.root.firstChild.params.slug')));
  }
  private setUserDetails() {
    return this.userService.userData$.pipe(first(),
      mergeMap((user: IUserData) => {
          if (user.err) {
            return throwError(user.err);
          }
          this.userProfile = user.userProfile;
          this.slug = _.get(this.userProfile, 'userProfile.rootOrg.slug');
          this.channel = this.userService.hashTagId;
          return of(user.userProfile);
    }));
  }
  private setOrgDetails() {
    return this.orgDetailsService.getOrgDetails(this.slug).pipe(
      tap(data =>  {
        this.orgDetails = data;
        this.channel = this.orgDetails.hashTagId;
      })
    );
  }
  private getTelemetryConfig() {
    if (this.userService.loggedIn) {
      return this.getLoggedInUserConfig();
    } else {
      return this.getAnonymousUserConfig();
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
  private setPortalTitleLogo() {
    this.tenantService.tenantData$.subscribe(data => {
        if (!data.err) {
          document.title = this.userService.rootOrgName || data.tenantData.titleName;
          document.querySelector('link[rel*=\'icon\']').setAttribute('href', data.tenantData.favicon);
        }
      });
  }
  public updateFrameWork(event) {
    const req = {
      framework: event
    };
    this.profileService.updateProfile(req).subscribe(res => {
      this.frameWorkPopUp.modal.deny();
      this.showFrameWorkPopUp = false;
      this.utilService.toggleAppPopup();
      this.router.navigate(['/resources']);
    }, err => {
        this.toasterService.error(this.resourceService.messages.fmsg.m0085);
        this.frameWorkPopUp.modal.deny();
    });
  }
}
