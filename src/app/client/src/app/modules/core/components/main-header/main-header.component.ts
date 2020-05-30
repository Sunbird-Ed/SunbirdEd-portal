import {first} from 'rxjs/operators';
import {
  UserService,
  PermissionService,
  TenantService,
  OrgDetailsService,
  FormService,
  ManagedUserService
} from './../../services';
import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import {
  ConfigService,
  ResourceService,
  IUserProfile,
  ServerResponse,
  ToasterService,
  IUserData,
  InterpolatePipe
} from '@sunbird/shared';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import * as _ from 'lodash-es';
import {IInteractEventObject, IInteractEventEdata, TelemetryService} from '@sunbird/telemetry';
import { CacheService } from 'ng2-cache-service';
import {environment} from '@sunbird/environment';
import {forkJoin} from 'rxjs';
declare var jQuery: any;

@Component({
  selector: 'app-header',
  templateUrl: './main-header.component.html',
styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {
  @Input() routerEvents;
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
  public signUpInteractEdata: IInteractEventEdata;
  public enterDialCodeInteractEdata: IInteractEventEdata;
  public telemetryInteractObject: IInteractEventObject;
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
  totalUsersCount: number;

  constructor(public config: ConfigService, public resourceService: ResourceService, public router: Router,
    public permissionService: PermissionService, public userService: UserService, public tenantService: TenantService,
    public orgDetailsService: OrgDetailsService, public formService: FormService,
    private managedUserService: ManagedUserService, public toasterService: ToasterService,
    private telemetryService: TelemetryService,
    public activatedRoute: ActivatedRoute, private cacheService: CacheService, private cdr: ChangeDetectorRef) {
      try {
        this.exploreButtonVisibility = (<HTMLInputElement>document.getElementById('exploreButtonVisibility')).value;
      } catch (error) {
        this.exploreButtonVisibility = 'false';
      }
      this.adminDashboard = this.config.rolesConfig.headerDropdownRoles.adminDashboard;
      this.myActivityRole = this.config.rolesConfig.headerDropdownRoles.myActivityRole;
      this.orgSetupRole = this.config.rolesConfig.headerDropdownRoles.orgSetupRole;
      this.orgAdminRole = this.config.rolesConfig.headerDropdownRoles.orgAdminRole;
      this.instance = (<HTMLInputElement>document.getElementById('instance'))
      ? (<HTMLInputElement>document.getElementById('instance')).value.toUpperCase() : 'SUNBIRD';
  }
  ngOnInit() {
    if (this.userService.loggedIn) {
      this.userService.userData$.subscribe((user: any) => {
        if (user && !user.err) {
          this.fetchManagedUsers();
          this.userProfile = user.userProfile;
          this.getLanguage(this.userService.channel);
          this.isCustodianOrgUser();
          document.title = _.get(user, 'userProfile.rootOrgName');
        }
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


  fetchManagedUsers() {
    const fetchManagedUserRequest = {
      request: {
        filters: {managedBy: this.managedUserService.getUserId()}
      }
    };
    const requests = [this.managedUserService.fetchManagedUserList(fetchManagedUserRequest)];
    if (this.userService.userProfile.managedBy) {
      requests.push(this.managedUserService.getParentProfile());
    }
    forkJoin(requests).subscribe((data) => {
      let userListToProcess = _.get(data[0], 'result.response.content');
      if (data && data[1]) {
        userListToProcess = [data[1]].concat(userListToProcess);
      }
      this.userListToShow = this.managedUserService.processUserList(userListToProcess.slice(0, 2), this.userService.userid);
      this.totalUsersCount = userListToProcess && Array.isArray(userListToProcess) && userListToProcess.length - 1;
      }, (err) => {
      this.toasterService.error(_.get(this.resourceService, 'messages.emsg.m0005'));
      }
    );
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
    this.enterDialCodeInteractEdata = {
      id: 'click-dial-code',
      type: 'click',
      pageid: 'explore'
    };
  }

  getLogoutInteractEdata() {
    return {
      id: 'logout',
      type: 'click',
      pageid: this.router.url.split('/')[1]
    };
  }

  toggleSideMenu(value: boolean) {
    this.showSideMenu = value;
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
    jQuery('.ui.sidebar').sidebar('setting', 'transition', 'overlay').sidebar('toggle');
  }

  switchUser(event) {
    const selectedUser = _.get(event, 'data.data');
    const initiatorUserId = this.userService.userid;
    this.telemetryService.start(this.getStartEventData(selectedUser, initiatorUserId));
    const userId = selectedUser.identifier;
    this.managedUserService.initiateSwitchUser(userId).subscribe((data: any) => {
      this.managedUserService.setSwitchUserData(userId, _.get(data, 'result.userSid'));
        const userSubscription = this.userService.userData$.subscribe((user: IUserData) => {
          if (user && !user.err && user.userProfile.userId === userId) {
            this.telemetryService.setInitialization(false);
            this.telemetryService.initialize(this.getTelemetryContext());
            this.router.navigate(['/resources']);
            this.toasterService.custom({
              message: this.managedUserService.getMessage(_.get(this.resourceService, 'messages.imsg.m0095'),
                selectedUser.firstName),
              class: 'sb-toaster sb-toast-success sb-toast-normal'
            });
            this.toggleSideMenu(false);
            this.telemetryService.end(this.getEndEventData(selectedUser, initiatorUserId));
            userSubscription.unsubscribe();
          }
        });
      }, (err) => {
        this.toasterService.error(_.get(this.resourceService, 'messages.emsg.m0005'));
      }
    );
  }

  getStartEventData(selectedUser, initiatorUserId) {
    return {
      context: {
        env: 'main-header',
        cdata: [{
          id: 'initiator-id',
          type: initiatorUserId
        }, {
          id: 'managed-user-id',
          type: selectedUser.identifier
        }]
      },
      edata: {
        type: 'view',
        pageid: this.router.url.split('/')[1],
        mode: 'switch-user'
      }
    };
  }

  getEndEventData(selectedUser, initiatorUserId) {
    return {
      context: {
        env: 'main-header',
        cdata: [{
          id: 'initiator-id',
          type: initiatorUserId
        }, {
          id: 'managed-user-id',
          type: selectedUser.identifier
        }]
      },
      edata: {
        type: 'view',
        pageid: this.router.url.split('/')[1],
        mode: 'switch-user'
      }
    };
  }
}
