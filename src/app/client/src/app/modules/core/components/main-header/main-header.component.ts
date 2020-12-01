import { filter, first, takeUntil } from 'rxjs/operators';
import {
  UserService,
  PermissionService,
  TenantService,
  OrgDetailsService,
  FormService,
  ManagedUserService, ProgramsService, CoursesService, DeviceRegisterService
} from './../../services';
import { Component, OnInit, ChangeDetectorRef, Input, OnDestroy } from '@angular/core';
import {
  ConfigService,
  ResourceService,
  IUserProfile,
  UtilService,
  ToasterService,
  IUserData, LayoutService,
  NavigationHelperService
} from '@sunbird/shared';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import * as _ from 'lodash-es';
import { IInteractEventObject, IInteractEventEdata, TelemetryService } from '@sunbird/telemetry';
import { CacheService } from 'ng2-cache-service';
import { environment } from '@sunbird/environment';
import { Subject, zip, forkJoin } from 'rxjs';
import { EXPLORE_GROUPS, MY_GROUPS } from '../../../public/module/group/components/routerLinks';
import { ConnectionService } from '@sunbird/shared';

declare var jQuery: any;
type reportsListVersionType = 'v1' | 'v2';

@Component({
  selector: 'app-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit, OnDestroy {
  @Input() routerEvents;
  @Input() layoutConfiguration;
  languageFormQuery = {
    formType: 'content',
    formAction: 'search',
    filterEnv: 'resourcebundle'
  };
  exploreButtonVisibility: string;
  queryParam: any = {};
  showExploreHeader = false;
  showQrmodal = false;
  showAccountMergemodal = false;
  isValidCustodianOrgUser = true;
  tenantInfo: any = {};
  userProfile: IUserProfile;
  adminDashboard: Array<string>;
  myActivityRole: Array<string>;
  orgAdminRole: Array<string>;
  orgSetupRole: Array<string>;
  avtarMobileStyle = {
    backgroundColor: 'transparent',
    color: '#AAAAAA',
    fontFamily: 'inherit',
    fontSize: '17px',
    lineHeight: '38px',
    border: '1px solid #e8e8e8',
    borderRadius: '50%',
    height: '38px',
    width: '38px'
  };
  avtarDesktopStyle = {
    backgroundColor: '#ffffff',
    color: '#333333',
    fontFamily: 'inherit',
    fontSize: '17px',
    lineHeight: '38px',
    border: '1px solid #E8E8E8',
    borderRadius: '50%',
    height: '38px',
    width: '38px'
  };
  SbtavtarDesktopStyle = {
    backgroundColor: '#ffffff',
    color: '#333333',
    fontFamily: 'inherit',
    fontSize: '24px',
    lineHeight: '48px',
    border: '1px solid #E8E8E8',
    borderRadius: '50%',
    height: '48px',
    width: '48px'
  };
  public signUpInteractEdata: IInteractEventEdata;
  public enterDialCodeInteractEdata: IInteractEventEdata;
  pageId: string;
  searchBox = {
    'center': false,
    'smallBox': false,
    'mediumBox': false,
    'largeBox': false
  };
  languages: Array<any>;
  showOfflineHelpCentre = false;
  contributeTabActive: boolean;
  showExploreComponent: boolean;
  showSideMenu = false;
  instance: string;
  userListToShow = [];
  memberCardConfig = {
    size: this.config.constants.SIZE.SMALL,
    isSelectable: true,
    view: this.config.constants.VIEW.VERTICAL,
    isBold: false
  };
  cardConfig = {
    size: this.config.constants.SIZE.SMALL,
    isSelectable: false,
    view: this.config.constants.VIEW.HORIZONTAL,
    isBold: true
  };
  totalUsersCount: number;
  libraryMenuIntractEdata: IInteractEventEdata;
  learnMenuIntractEdata: IInteractEventEdata;
  contributeMenuEdata: IInteractEventEdata;
  myGroupIntractEData: IInteractEventEdata;
  showContributeTab: boolean;
  hideHeader = false;
  ShowStudentDropdown = false;
  routerLinks = {explore: `/${EXPLORE_GROUPS}`, groups: `/${MY_GROUPS}`};
  public unsubscribe = new Subject<void>();
  selected = [];
  userTypes = [{id: 1, type: 'Teacher'}, {id: 2, type: 'Student'}];
  groupsMenuIntractEdata: IInteractEventEdata;
  workspaceMenuIntractEdata: IInteractEventEdata;
  helpMenuIntractEdata: IInteractEventEdata;
  themeSwitchInteractEdata: IInteractEventEdata;
  signInIntractEdata: IInteractEventEdata;
  hrefPath = '/resources';
  helpLinkVisibility: string;
  isFullScreenView;
  public unsubscribe$ = new Subject<void>();
  /**
   * Workspace access roles
   */
  workSpaceRole: Array<string>;
  reportsListVersion: reportsListVersionType;
  showLocationPopup: boolean = false;
  locationTenantInfo: any = {};
  deviceProfile: any;
  isCustodianUser: boolean;
  isConnected = false;
  
  constructor(public config: ConfigService, public resourceService: ResourceService, public router: Router,
    public permissionService: PermissionService, public userService: UserService, public tenantService: TenantService,
    public orgDetailsService: OrgDetailsService, public formService: FormService,
    private managedUserService: ManagedUserService, public toasterService: ToasterService,
    private telemetryService: TelemetryService, private programsService: ProgramsService,
    private courseService: CoursesService, private utilService: UtilService, public layoutService: LayoutService,
    public activatedRoute: ActivatedRoute, private cacheService: CacheService, private cdr: ChangeDetectorRef,
    public navigationHelperService: NavigationHelperService, private deviceRegisterService: DeviceRegisterService,
    private connectionService: ConnectionService) {
    try {
      this.exploreButtonVisibility = (<HTMLInputElement>document.getElementById('exploreButtonVisibility')).value;
      this.reportsListVersion = (<HTMLInputElement>document.getElementById('reportsListVersion')).value as reportsListVersionType;
    } catch (error) {
      this.exploreButtonVisibility = 'false';
      this.reportsListVersion = 'v1';
    }
    this.adminDashboard = this.config.rolesConfig.headerDropdownRoles.adminDashboard;
    this.myActivityRole = this.config.rolesConfig.headerDropdownRoles.myActivityRole;
    this.orgSetupRole = this.config.rolesConfig.headerDropdownRoles.orgSetupRole;
    this.orgAdminRole = this.config.rolesConfig.headerDropdownRoles.orgAdminRole;
    this.instance = (<HTMLInputElement>document.getElementById('instance'))
      ? (<HTMLInputElement>document.getElementById('instance')).value.toUpperCase() : 'SUNBIRD';
    this.workSpaceRole = this.config.rolesConfig.headerDropdownRoles.workSpaceRole;
    this.updateHrefPath(this.router.url);
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateHrefPath(event.url);
    });
  }

  updateHrefPath(url) {
    if (url.indexOf('explore-course') >= 0) {
      this.hrefPath = url.replace('explore-course', 'learn');
    } else if (url.indexOf('explore-groups') >= 0) {
      this.hrefPath = url.replace('explore-groups', MY_GROUPS);
    } else if (url.indexOf('explore') >= 0) {
      if (url.indexOf('explore/') >= 0) {
        this.hrefPath = url.replace('explore', 'search/Library');
      } else {
        this.hrefPath = url.replace('explore', 'resources');
      }
    } else if (url.indexOf('play') >= 0) {
      this.hrefPath = '/resources' + url;
    } else {
      this.hrefPath = '/resources';
    }
  }
  getTelemetryContext() {
    const userProfile = this.userService.userProfile;
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    return {
      userOrgDetails: {
        userId: userProfile.userId,
        rootOrgId: userProfile.rootOrgId,
        rootOrg: userProfile.rootOrg,
        organisationIds: userProfile.hashTagIds
      },
      config: {
        pdata: {
          id: this.userService.appId,
          ver: version,
          pid: this.config.appConfig.TELEMETRY.PID
        },
        endpoint: this.config.urlConFig.URLS.TELEMETRY.SYNC,
        apislug: this.config.urlConFig.URLS.CONTENT_PREFIX,
        host: '',
        uid: userProfile.userId,
        sid: this.userService.sessionId,
        channel: _.get(userProfile, 'rootOrg.hashTagId'),
        env: 'home',
        enableValidation: environment.enableTelemetryValidation,
        timeDiff: this.userService.getServerTimeDiff
      }
    };
  }

  navigate(navigationUrl) {
    this.router.navigate([navigationUrl]);
  }

  private isCustodianOrgUser() {
    this.orgDetailsService.getCustodianOrgDetails().subscribe((custodianOrg) => {
      if (_.get(this.userService, 'userProfile.rootOrg.rootOrgId') === _.get(custodianOrg, 'result.response.value')) {
        this.isValidCustodianOrgUser = true;
      } else {
        this.isValidCustodianOrgUser = false;
      }
    });
  }
  getLanguage(channelId) {
    const formServiceInputParams = {
      formType: this.languageFormQuery.formType,
      formAction: this.languageFormQuery.formAction,
      contentType: this.languageFormQuery.filterEnv
    };
    this.formService.getFormConfig(formServiceInputParams, channelId).subscribe((data: any) => {
      this.languages = data[0].range;
    }, (err: any) => {
      this.languages = [{ 'value': 'en', 'label': 'English', 'dir': 'ltr' }];
    });
  }
  navigateToHome() {
    if (this.userService.loggedIn) {
      this.router.navigate(['resources']);
    } else {
      window.location.href = this.userService.slug ? this.userService.slug + '/explore'  : '/explore';
    }
  }
  onEnter(key) {
    this.queryParam = {};
    if (key && key.length) {
      this.queryParam.key = key;
    }
    const url = this.router.url.split('?')[0];
    let redirectUrl;
    if (url.indexOf('/explore-course') !== -1) {
      redirectUrl = url.substring(0, url.indexOf('explore-course')) + 'explore-course';
    } else {
      redirectUrl = url.substring(0, url.indexOf('explore')) + 'explore';
    }
    this.router.navigate([redirectUrl, 1], { queryParams: this.queryParam });
  }

  /* This method searches only for offline module*/
  routeToOffline() {
    if (_.includes(this.router.url, 'browse')) {
      this.router.navigate(['browse', 1], { queryParams: this.queryParam });
    } else {
      this.router.navigate(['search', 1], { queryParams: this.queryParam });
    }
  }

  getSearchButtonInteractEdata(key) {
    const searchInteractEdata = {
      id: `search-button`,
      type: 'click',
      pageid: this.router.url.split('/')[1]
    };
    if (key) {
      searchInteractEdata['extra'] = {
        query: key
      };
    }
    return searchInteractEdata;
  }

  getUrl() {
    this.showExploreHeader = true;
    this.routerEvents.subscribe((urlAfterRedirects: NavigationEnd) => {
      let currentRoute = this.activatedRoute.root;
      this.showAccountMergemodal = false; // to remove popup on browser back button click
      this.contributeTabActive = this.router.isActive('/contribute', true);
      this.hideHeader = (_.includes(this.router.url, 'explore-groups') || _.includes(this.router.url, 'my-groups'));
      if (currentRoute.children) {
        while (currentRoute.children.length > 0) {
          const child: ActivatedRoute[] = currentRoute.children;
          child.forEach(route => {
            currentRoute = route;
            if (route.snapshot.data.telemetry) {
              if (route.snapshot.data.telemetry.pageid) {
                this.pageId = route.snapshot.data.telemetry.pageid;
              } else {
                this.pageId = route.snapshot.data.telemetry.env;
              }
            }
          });
        }
      }
      if (_.includes(urlAfterRedirects.url, '/explore-course') || _.includes(urlAfterRedirects.url, '/explore')) {
        this.showExploreComponent = true;
      } else {
        this.showExploreComponent = false;
      }
    });
  }

  setInteractEventData() {
    this.groupsMenuIntractEdata = {
      id: 'groups-tab',
      type: 'click',
      pageid: _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid') || 'groups'
    };
    this.signInIntractEdata = {
      id: ' signin-tab',
      type: 'click',
      pageid: this.router.url
    };
    this.workspaceMenuIntractEdata = {
      id: 'workspace-menu-button',
      type: 'click',
      pageid: 'workspace'
    };
    this.helpMenuIntractEdata = {
      id: 'help-menu-tab',
      type: 'click',
      pageid: 'help'
    };
    this.signUpInteractEdata = {
      id: 'signup',
      type: 'click',
      pageid: 'public'
    };
    this.enterDialCodeInteractEdata = {
      id: 'click-dial-code',
      type: 'click',
      pageid: 'explore'
    };
    this.libraryMenuIntractEdata = {
      id: 'library-tab',
      type: 'click',
      pageid: 'library'
    };
    this.learnMenuIntractEdata = {
      id: 'learn-tab',
      type: 'click',
      pageid: 'learn'
    };
    this.contributeMenuEdata = {
      id: 'contribute-tab',
      type: 'click',
      pageid: 'contribute'
    };
    this.myGroupIntractEData = {
      id: 'groups-tab',
      type: 'click',
      pageid: _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid') || 'groups'
    };
  }

  getFeatureId(featureId, taskId) {
    return [{id: featureId, type: 'Feature'}, {id: taskId, type: 'Task'}];
  }

  fetchManagedUsers() {
    const requests = [this.managedUserService.managedUserList$];
    if (this.userService.userProfile.managedBy) {
      requests.push(this.managedUserService.getParentProfile());
    }
    zip(...requests).subscribe((data) => {
      let userListToProcess = _.get(data[0], 'result.response.content');
      if (data && data[1]) {
        userListToProcess = [data[1]].concat(userListToProcess);
      }
      const processedUserList = this.managedUserService.processUserList(userListToProcess, this.userService.userid);
      this.userListToShow = processedUserList.slice(0, 2);
      this.totalUsersCount = processedUserList && Array.isArray(processedUserList) && processedUserList.length;
    }, (err) => {
      this.toasterService.error(_.get(this.resourceService, 'messages.emsg.m0005'));
    }
    );
  }

  getLogoutInteractEdata() {
    return {
      id: 'logout',
      type: 'click',
      pageid: this.router.url.split('/')[1]
    };
  }

  toggleSideMenu(value: boolean) {
    this.showSideMenu = !this.showSideMenu;
    if (this.userService.loggedIn) {
      if (this.showSideMenu) {
        this.fetchManagedUsers();
      }
    }
  }

  logout() {
    window.location.replace('/logoff');
    this.cacheService.removeAll();
  }
  setWindowConfig() {
    if (window.innerWidth <= 1023 && window.innerWidth > 548) {
      this.searchBox.center = true;
      this.searchBox.largeBox = false;
      this.searchBox.smallBox = false;
      this.searchBox.mediumBox = true;
    } else if (window.innerWidth <= 548) {
      this.searchBox.smallBox = true;
      this.searchBox.largeBox = false;
      this.searchBox.mediumBox = false;
    } else {
      this.searchBox.center = false;
      this.searchBox.smallBox = false;
      this.searchBox.largeBox = true;
      this.searchBox.mediumBox = false;
    }
    window.onresize = (e) => {
      if (window.innerWidth <= 1023 && window.innerWidth > 548) {
        this.searchBox.center = true;
        this.searchBox.largeBox = false;
        this.searchBox.smallBox = false;
        this.searchBox.mediumBox = true;
      } else if (window.innerWidth <= 548) {
        this.searchBox.largeBox = false;
        this.searchBox.mediumBox = false;
        this.searchBox.smallBox = true;
      } else {
        this.searchBox.center = false;
        this.searchBox.smallBox = false;
        this.searchBox.largeBox = true;
        this.searchBox.mediumBox = false;
      }
    };
  }
  showSideBar() {
    if (this.userService.loggedIn) {
      this.toggleSideMenu(true);
    } else {
      jQuery('.ui.sidebar').sidebar('setting', 'transition', 'overlay').sidebar('toggle');
    }
  }

  switchUser(event) {
    let userSubscription;
    const selectedUser = _.get(event, 'data.data');
    const userId = selectedUser.identifier;
    const switchUserRequest = {
      userId: selectedUser.identifier,
      isManagedUser: selectedUser.managedBy ? true : false
    };
    this.managedUserService.initiateSwitchUser(switchUserRequest).subscribe((data: any) => {
      this.managedUserService.setSwitchUserData(userId, _.get(data, 'result.userSid'));
      userSubscription = this.userService.userData$.subscribe((user: IUserData) => {
        if (user && !user.err && user.userProfile.userId === userId) {
          this.courseService.getEnrolledCourses().subscribe((enrolledCourse) => {
            this.telemetryService.setInitialization(false);
            this.telemetryService.initialize(this.getTelemetryContext());
            this.toasterService.custom({
              message: this.managedUserService.getMessage(_.get(this.resourceService, 'messages.imsg.m0095'),
                selectedUser.firstName),
              class: 'sb-toaster sb-toast-success sb-toast-normal'
            });
            this.toggleSideMenu(false);
            if (userSubscription) {
              userSubscription.unsubscribe();
            }
            setTimeout(() => {
              this.utilService.redirect('/resources');
            }, 5100);
          });
        }
      });
    }, (err) => {
      this.toasterService.error(_.get(this.resourceService, 'messages.emsg.m0005'));
    }
    );
  }

  ngOnInit() {
    this.connectionService.monitor()
    .pipe(takeUntil(this.unsubscribe$)).subscribe(isConnected => {
      this.isConnected = isConnected;
    });
    this.checkFullScreenView();
    try {
      this.helpLinkVisibility = (<HTMLInputElement>document.getElementById('helpLinkVisibility')).value;
    } catch (error) {
      this.helpLinkVisibility = 'false';
    }
    if (this.userService.loggedIn) {
      this.userService.userData$.subscribe((user: any) => {
        if (user && !user.err) {
          this.managedUserService.fetchManagedUserList();
          this.fetchManagedUsers();
          this.userProfile = user.userProfile;
          this.getLanguage(this.userService.channel);
          this.isCustodianOrgUser();
          document.title = _.get(user, 'userProfile.rootOrgName');
        }
      });
      this.programsService.allowToContribute$.subscribe((showTab: boolean) => {
        this.showContributeTab = showTab;
      });
    } else {
      this.orgDetailsService.orgDetails$.pipe(first()).subscribe((data) => {
        if (data && !data.err) {
          this.getLanguage(data.orgDetails.hashTagId);
        }
      });
    }
    this.getUrl();
    this.activatedRoute.queryParams.subscribe(queryParams => this.queryParam = { ...queryParams });
    this.tenantService.tenantData$.subscribe(({tenantData}) => {
      this.tenantInfo.logo = tenantData ? tenantData.logo : undefined;
      this.tenantInfo.titleName = (tenantData && tenantData.titleName) ? tenantData.titleName.toUpperCase() : undefined;
    });
    this.setInteractEventData();
    this.cdr.detectChanges();
    this.setWindowConfig();
  }

  checkFullScreenView() {
    this.navigationHelperService.contentFullScreenEvent.pipe(takeUntil(this.unsubscribe$)).subscribe(isFullScreen => {
      this.isFullScreenView = isFullScreen;
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


  /**
   * Used to hide language change dropdown for specific route
   * restrictedRoutes[] => routes where do not require language change dropdown
   */
  showLanguageDropdown() {
    const restrictedRoutes = ['workspace', 'manage'];
    let showLanguageChangeDropdown = true;
    for (const route of restrictedRoutes) {
      if (this.router.isActive(route, false)) {
        showLanguageChangeDropdown = false;
        break;
      }
    }
    return showLanguageChangeDropdown;
  }

  navigateToGroups() {
    return !this.userService.loggedIn ? EXPLORE_GROUPS : MY_GROUPS ;
  }

  isLayoutAvailable() {
    return this.layoutService.isLayoutAvailable(this.layoutConfiguration);
  }

  navigateToWorkspace() {
    const authroles = this.permissionService.getWorkspaceAuthRoles();
    if (authroles) {
      return authroles.url;
    }
  }

  switchLayout() {
    this.layoutService.initiateSwitchLayout();
    this.generateInteractTelemetry();
  }
  switchToAccessibleLayout(){
    this.layoutService.switchToAccessibleLayout();
    // this.generateInteractTelemetry();
  }

  generateInteractTelemetry() {
    const interactData = {
      context: {
        env: _.get(this.activatedRoute, 'snapshot.data.telemetry.env') || 'main-header',
        cdata: []
      },
      edata: {
        id: 'switch-theme',
        type: 'click',
        pageid: this.router.url,
        subtype: this.layoutConfiguration ? 'joy' : 'classic'
      }
    };
    this.telemetryService.interact(interactData);
  }

  manageLocation() {
    this.showLocationPopup = false;
    this.tenantService.tenantData$.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      /* istanbul ignore else*/
      if (_.get(data, 'tenantData')) {
        this.locationTenantInfo = data.tenantData;
        this.locationTenantInfo.titleName = data.tenantData.titleName || this.resourceService.instance;
      }
    });
    const deviceRegister = this.deviceRegisterService.fetchDeviceProfile();
    const custodianOrgDetails = this.orgDetailsService.getCustodianOrgDetails();
    forkJoin([deviceRegister, custodianOrgDetails]).subscribe((res) => {
      const deviceProfile = res[0];
      this.deviceProfile = deviceProfile;
      if (_.get(this.userService, 'userProfile.rootOrg.rootOrgId') === _.get(res[1], 'result.response.value')) {
        // non state user
        this.isCustodianUser = true;
        this.deviceProfile = deviceProfile;
      } else {
        // state user
        this.isCustodianUser = false;
      }
      this.deviceProfile = _.get(deviceProfile, 'result');
      this.showLocationPopup = true;
    }, (err) => { 
      this.toasterService.error(_.get(this.resourceService, 'messages.emsg.m0005'));
    });
  }

  locationSubmit() {
    this.showLocationPopup = false;
  }

}
