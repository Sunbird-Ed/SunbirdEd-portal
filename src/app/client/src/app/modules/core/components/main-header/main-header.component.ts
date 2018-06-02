import { UserService, PermissionService, TenantService } from './../../services';
import { Component, OnInit } from '@angular/core';
import { ConfigService, ResourceService, IUserProfile, IUserData } from '@sunbird/shared';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import * as _ from 'lodash';
/**
 * Main header component
 */
@Component({
  selector: 'app-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.css']
})
export class MainHeaderComponent implements OnInit {
  /**
   * reference of tenant service.
   */
  public tenantService: TenantService;
  /**
   * organization log
   */
  logo: string;
  key: string;
  queryParam: any = {};
  selectedLanguage: string;
  showExploreHeader = false;
  showQrmodal = false;
  languages = [{ 'id': 'en', 'name': 'English' }, { 'id': 'ta', 'name': 'Tamil' }, { 'id': 'te', 'name': 'Telugu' }];
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
  /*
  * constructor
  */
  constructor(config: ConfigService, resourceService: ResourceService, public router: Router,
    permissionService: PermissionService, userService: UserService, tenantService: TenantService,
    public activatedRoute: ActivatedRoute) {
    this.config = config;
    this.resourceService = resourceService;
    this.permissionService = permissionService;
    this.userService = userService;
    this.tenantService = tenantService;
  }

  ngOnInit() {
    this.getUrl();
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.queryParam = { ...queryParams };
      this.key = this.queryParam['key'];
      this.selectedLanguage = this.queryParam['language'] || 'en';
      this.resourceService.getResource(this.selectedLanguage);
    });
    this.workSpaceRole = this.config.rolesConfig.headerDropdownRoles.workSpaceRole;
    this.adminDashboard = this.config.rolesConfig.headerDropdownRoles.adminDashboard;
    this.announcementRole = this.config.rolesConfig.headerDropdownRoles.announcementRole;
    this.myActivityRole = this.config.rolesConfig.headerDropdownRoles.myActivityRole;
    this.orgSetupRole = this.config.rolesConfig.headerDropdownRoles.orgSetupRole;
    this.tenantService.tenantData$.subscribe(
      data => {
        if (data && !data.err) {
          this.logo = data.tenantData.logo;
          this.tenantName = data.tenantData.titleName;
        }
      }
    );
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
        }
      });
  }
  navigateToWorkspace() {
    const authroles = this.permissionService.getWorkspaceAuthRoles();
    if (authroles) {
      this.router.navigate([authroles.url]);
    }
  }

  onLanguageChange(event) {
    this.queryParam['language'] = event;
    this.router.navigate(['explore', 1], {
      queryParams: this.queryParam
    });
  }

  onEnter(key) {
    this.key = key;
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
    this.router.events.filter(event => event instanceof NavigationEnd).subscribe((urlAfterRedirects: NavigationEnd) => {
      const urlSegment = urlAfterRedirects.url.split('/');
      if (_.includes(urlSegment, 'explore')) {
        this.showExploreHeader = true;
      } else {
        this.showExploreHeader = false;
      }
    });
  }

  closeQrModalEvent(event) {
    this.showQrmodal = false;
  }
}
