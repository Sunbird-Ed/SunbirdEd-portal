import { ITelemetryContext } from '@sunbird/telemetry';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { TelemetryService } from '@sunbird/telemetry';
import { ResourceService, IUserData, IUserProfile, NavigationHelperService, ConfigService } from '@sunbird/shared';
import { Component, HostListener, OnInit } from '@angular/core';
import {
  UserService, PermissionService, CoursesService, TenantService, ConceptPickerService
} from '@sunbird/core';
import { OrgManagementService } from '@sunbird/public';
import { Ng2IziToastModule } from 'ng2-izitoast';
import * as _ from 'lodash';
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
  /**
   * constructor
   */
  constructor(userService: UserService, public navigationHelperService: NavigationHelperService,
    permissionService: PermissionService, resourceService: ResourceService,
    courseService: CoursesService, tenantService: TenantService,
    telemetryService: TelemetryService, conceptPickerService: ConceptPickerService, public router: Router,
    config: ConfigService, public orgManagementService: OrgManagementService, public activatedRoute: ActivatedRoute) {
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
    document.dispatchEvent(new CustomEvent('TelemetryEvent', { detail: { name: 'window:unload' } }));
  }
  ngOnInit() {
    this.resourceService.initialize();
    this.navigationHelperService.initialize();
    this.conceptPickerService.initialize();
    if (this.userService.loggedIn) {
      this.userService.startSession();
      this.userService.initialize(true);
      this.permissionService.initialize();
      this.courseService.initialize();
      this.userService.userData$.subscribe((user: IUserData) => {
        if (user && !user.err) {
          this.initApp = true;
          this.userProfile = user.userProfile;
          const slug = _.get(user, 'userProfile.rootOrg.slug');
          this.initTelemetryService();
          this.initTenantService(slug);
        } else if (user && user.err) {
          this.initApp = true;
          this.initTenantService();
        }
      });
    } else {
      this.initApp = true;
      this.initTelemetryService();
      this.initTenantService();
      this.userService.initialize(false);
    }
  }

  public initTelemetryService() {
    let config: ITelemetryContext;
    if (this.userService.loggedIn) {
      config = this.getLoggedInUserConfig();
      this.telemetryService.initialize(config);
    } else {
      this.router.events.filter(event => event instanceof NavigationEnd).first().subscribe((urlAfterRedirects: NavigationEnd) => {
        this.orgManagementService.getOrgDetails(_.get(this.activatedRoute, 'snapshot.root.firstChild.params.slug'))
          .first().subscribe((data) => {
            this.orgDetails = data;
            config = this.getAnonymousUserConfig();
            this.telemetryService.initialize(config);
          }, (err) => {
            console.log('unable to get organization details');
          });
      });
    }
  }

  private getLoggedInUserConfig(): ITelemetryContext {
    return {
      userOrgDetails: {
        userId: this.userProfile.userId,
        rootOrgId: this.userProfile.rootOrgId,
        rootOrg: this.userProfile.rootOrg,
        organisationIds: _.map(this.userProfile.organisations, (org) => org.organisationId)
      },
      config: {
        pdata: {
          id: this.userService.appId,
          ver: this.config.appConfig.TELEMETRY.VERSION,
          pid: this.config.appConfig.TELEMETRY.PID
        },
        endpoint: this.config.urlConFig.URLS.TELEMETRY.SYNC,
        apislug: this.config.urlConFig.URLS.CONTENT_PREFIX,
        host: '',
        uid: this.userProfile.userId,
        sid: this.userService.sessionId,
        channel: _.get(this.userService, 'rootOrg.hashTagId'),
        env: 'home'
      }
    };
  }
  getAnonymousUserConfig() {
    return {
      userOrgDetails: {
        userId: 'anonymous',
        rootOrgId: this.orgDetails.rootOrgId,
        organisationIds: [this.orgDetails.rootOrgId]
      },
      config: {
        pdata: {
          id: this.userService.appId,
          ver: this.config.appConfig.TELEMETRY.VERSION,
          pid: this.config.appConfig.TELEMETRY.PID
        },
        endpoint: this.config.urlConFig.URLS.TELEMETRY.SYNC,
        apislug: this.config.urlConFig.URLS.CONTENT_PREFIX,
        host: '',
        uid: 'anonymous',
        sid: this.userService.anonymousSid,
        channel: this.orgDetails.channel,
        env: 'home'
      }
    };
  }

  private initTenantService(slug?: string) {
    this.tenantService.getTenantInfo(slug);
    this.tenantService.tenantData$.subscribe(
      data => {
        if (data && !data.err) {
          document.title = data.tenantData.titleName;
          document.querySelector('link[rel*=\'icon\']').setAttribute('href', data.tenantData.favicon);
        }
      }
    );
  }
}
