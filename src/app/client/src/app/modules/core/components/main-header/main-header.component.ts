
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { UserService, PermissionService, TenantService } from './../../services';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfigService, ResourceService, IUserProfile, IUserData } from '@sunbird/shared';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import * as _ from 'lodash';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
import { CacheService } from 'ng2-cache-service';
/**
 * Main header component
 */
@Component({
  selector: 'app-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.css']
})
export class MainHeaderComponent implements OnInit, OnDestroy {
  /**
   * reference of tenant service.
   */
  public tenantService: TenantService;
  /**
   * organization log
   */
  exploreButtonVisibility: string;
  logo: string;
  key: string;
  queryParam: any = {};
  showExploreHeader = false;
  showQrmodal = false;
  /**
   * tenant name
   */
  tenantName: string;
  /**
   * user profile details.
   */
  userProfile: IUserProfile;
  /**
   * Sui dropdown initiator
   */
  isOpen: boolean;
  /**
   * Workspace access roles
   */
  workSpaceRole: Array<string>;
  /**
   * Admin Dashboard access roles
   */
  adminDashboard: Array<string>;
  /**
   * Announcement access roles
   */
  announcementRole: Array<string>;
  /**
   * MyActivity access roles
   */
  myActivityRole: Array<string>;
  /**
   * Organization Setup access roles
   */
  orgSetupRole: Array<string>;
  /**
   * reference of UserService service.
   */
  public userService: UserService;
  /**
   * reference of config service.
   */
  public config: ConfigService;
  /**
   * reference of resourceService service.
   */
  public resourceService: ResourceService;
  /**
   * reference of permissionService service.
   */
  public permissionService: PermissionService;
  public signUpInteractEdata: IInteractEventEdata;
  public telemetryInteractObject: IInteractEventObject;
  tenantDataSubscription: Subscription;
  userDataSubscription: Subscription;

  /**
  * value to enable and disable signUp button
  */
  enableSignup = true;

  /*
  * constructor
  */
  constructor(config: ConfigService, resourceService: ResourceService, public router: Router,
    permissionService: PermissionService, userService: UserService, tenantService: TenantService,
    public activatedRoute: ActivatedRoute, private cacheService: CacheService) {
    this.config = config;
    this.resourceService = resourceService;
    this.permissionService = permissionService;
    this.userService = userService;
    this.tenantService = tenantService;
  }

  ngOnInit() {
    try {
      this.exploreButtonVisibility = (<HTMLInputElement>document.getElementById('exploreButtonVisibility')).value;
    } catch (error) {
      this.exploreButtonVisibility = 'false';
    }
    this.getUrl();
    if (!this.userService.loggedIn) {
      this.getCacheLanguage();
    }
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.queryParam = { ...queryParams };
      this.key = this.queryParam['key'];
    });
    this.workSpaceRole = this.config.rolesConfig.headerDropdownRoles.workSpaceRole;
    this.adminDashboard = this.config.rolesConfig.headerDropdownRoles.adminDashboard;
    this.announcementRole = this.config.rolesConfig.headerDropdownRoles.announcementRole;
    this.myActivityRole = this.config.rolesConfig.headerDropdownRoles.myActivityRole;
    this.orgSetupRole = this.config.rolesConfig.headerDropdownRoles.orgSetupRole;
    this.tenantDataSubscription = this.tenantService.tenantData$.subscribe(
      data => {
        if (data && !data.err) {
          this.logo = data.tenantData.logo;
          this.tenantName = data.tenantData.titleName;
        }
      }
    );
    this.userDataSubscription = this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
        }
      });
    this.setInteractEventData();
    try {
      const enableSignupButton: string = (<HTMLInputElement>document.getElementById('enableSignup')) ?
        (<HTMLInputElement>document.getElementById('enableSignup')).value : 'true';
      this.enableSignup = (enableSignupButton.toLowerCase() === 'true');
    } catch {
      console.log('error while fetching enableSignup');
    }
  }

  getCacheLanguage() {
    const isCachedDataExists = this.cacheService.exists('portalLanguage');
    if (isCachedDataExists) {
      const data: any | null = this.cacheService.get('portalLanguage');
      this.resourceService.getResource(data);
    }
  }
  navigateToWorkspace() {
    const authroles = this.permissionService.getWorkspaceAuthRoles();
    if (authroles) {
      this.router.navigate([authroles.url]);
    }
  }
  navigateToHome() {
    if (this.userService.loggedIn) {
      this.router.navigate(['home']);
    } else {
      this.router.navigate(['']);
    }
  }
  onEnter(key) {
    this.key = key;
    this.queryParam = {};
    this.queryParam['key'] = this.key;
    if (this.key && this.key.length > 0) {
      this.queryParam['key'] = this.key;
    } else {
      delete this.queryParam['key'];
    }
    this.router.navigate(['explore', 1], {
      queryParams: this.queryParam
    });
  }

  getUrl() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((urlAfterRedirects: NavigationEnd) => {
      if (_.includes(urlAfterRedirects.url, '/explore')) {
        this.showExploreHeader = true;
      } else {
        this.showExploreHeader = false;
      }
    });
  }

  closeQrModalEvent(event) {
    this.showQrmodal = false;
  }
  setInteractEventData() {
    this.signUpInteractEdata = {
      id: 'signup',
      type: 'click',
      pageid: 'public'
    };
    this.telemetryInteractObject = {
      id: '',
      type: 'signup',
      ver: '1.0'
    };
  }

  logout() {
    window.location.replace('/logoff');
    this.cacheService.removeAll();
  }

  ngOnDestroy() {
    this.tenantDataSubscription.unsubscribe();
    this.userDataSubscription.unsubscribe();
  }
}
