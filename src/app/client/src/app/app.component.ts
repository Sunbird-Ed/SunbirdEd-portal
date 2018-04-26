import { ResourceService, IUserData, IUserProfile } from '@sunbird/shared';
import { Component, HostListener, OnInit } from '@angular/core';
import {
  UserService, PermissionService, CoursesService, TelemetryService, IUserOrgDetails,
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
  slug: string;
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
   * constructor
   */
  constructor(userService: UserService,
    permissionService: PermissionService, resourceService: ResourceService,
    courseService: CoursesService, tenantService: TenantService,
    telemetryService: TelemetryService, conceptPickerService: ConceptPickerService) {
    this.resourceService = resourceService;
    this.permissionService = permissionService;
    this.userService = userService;
    this.courseService = courseService;
    this.conceptPickerService = conceptPickerService;
    this.tenantService = tenantService;
    this.telemetryService = telemetryService;
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
    if (this.userService.userid && this.userService.sessionId) {
      this.userService.initialize();
      this.permissionService.initialize();
      this.courseService.initialize();
       this.conceptPickerService.initialize();
      this.initTelemetryService();
    }

    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          const slug = _.get(user, 'userProfile.rootOrg.slug');
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
      });
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
            // TODO: get pdata from document object
            pdata: { id: '', ver: '', pid: '' },
            endpoint: window.location.origin,
            apislug: '/data/v1/telemetry',
            uid: userOrg.userId,
            sid: this.userService.sessionId,
            channel: _.get(userOrg, 'rootOrg.hashTagId') ? userOrg.rootOrg.hashTagId : 'sunbird',
            env: 'home' // default value
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
}
