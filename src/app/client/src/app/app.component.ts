import { TelemetryService } from '@sunbird/telemetry';
import { ResourceService, IUserData, IUserProfile, NavigationHelperService, ConfigService } from '@sunbird/shared';
import { Component, HostListener, OnInit } from '@angular/core';
import {
  UserService, PermissionService, CoursesService, IUserOrgDetails,
  ITelemetryContext, TenantService, ConceptPickerService
} from '@sunbird/core';

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
  /**
   * constructor
   */
  constructor(userService: UserService, public navigationHelperService: NavigationHelperService,
    permissionService: PermissionService, resourceService: ResourceService,
    courseService: CoursesService, tenantService: TenantService,
    telemetryService: TelemetryService, conceptPickerService: ConceptPickerService,
    config: ConfigService) {
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
    if (this.userService.userid && this.userService.sessionId) {
      this.userService.startSession();
      this.userService.initialize(true);
      this.permissionService.initialize();
      this.courseService.initialize();
      this.initTelemetryService();
      this.userService.userData$.subscribe((user: IUserData) => {
          if (user && !user.err) {
            this.initApp = true;
            const slug = _.get(user, 'userProfile.rootOrg.slug');
            this.initTenantService(slug);
          } else if ( user && user.err) {
            this.initApp = true;
            this.initTenantService();
          }
      });
    } else {
      this.initApp = true;
      this.initTenantService();
      this.userService.initialize(false);
    }
  }

  public initTelemetryService() {
    this.getTelemetryConfig().then((config: ITelemetryContext) => {
      this.telemetryService.initialize(config);
    }).catch((error) => {
      console.log('unable to initialize telemetry service due to: ', error);
    });
  }

  private getTelemetryConfig(): Promise<ITelemetryContext> {
    return new Promise((resolve, reject) => {
      this.getUserOrgDetails().then((userOrg: IUserOrgDetails) => {
        const config: ITelemetryContext = {
          userOrgDetails: userOrg,
          config: {
            pdata: {
              id: this.userService.appId,
              ver: this.config.appConfig.TELEMETRY.VERSION,
              pid: this.config.appConfig.TELEMETRY.PID
            },
            endpoint: this.config.urlConFig.URLS.TELEMETRY.SYNC,
            apislug: this.config.urlConFig.URLS.CONTENT_PREFIX,
            host: '',
            uid: userOrg.userId,
            sid: this.userService.sessionId,
            channel: _.get(userOrg, 'rootOrg.hashTagId') ,
            env: 'home'
           }
        };
        resolve(config);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  private getUserOrgDetails(): Promise<IUserOrgDetails> {
    return new Promise((resolve, reject) => {
      const userService = this.userService.userData$.subscribe(data => {
        if (data && data.userProfile) {
          userService.unsubscribe();
          resolve({
            userId: data.userProfile.userId, rootOrgId: data.userProfile.rootOrgId,
            rootOrg: data.userProfile.rootOrg, organisationIds: _.map(data.userProfile.organisations, (org) => org.organisationId),
          });
        } else if (data && data.err) {
          reject(new Error('unable to get userProfile from userService!'));
        }
      });
    });
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

