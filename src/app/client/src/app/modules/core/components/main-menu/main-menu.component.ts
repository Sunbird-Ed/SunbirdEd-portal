import { EXPLORE_GROUPS, MY_GROUPS } from '../../../public/module/group/components/routerLinks';
import { ConfigService, ResourceService, IUserData, IUserProfile, LayoutService } from '@sunbird/shared';
import { Component, OnInit, Input } from '@angular/core';
import { UserService, PermissionService, ProgramsService } from '../../services';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import {IInteractEventObject, IInteractEventEdata, TelemetryService} from '@sunbird/telemetry';
import { CacheService } from 'ng2-cache-service';
import { first, filter, tap } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { merge } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@sunbird/environment';

declare var jQuery: any;

/**
 * Main menu component
 */
@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {
  /**
   * Workspace access roles
   */
  workSpaceRole: Array<string>;
  /**
   * reference of resourceService service.
   */
  public resourceService: ResourceService;
  /**
   * reference of UserService service.
   */
  public userService: UserService;
  /**
   * reference of permissionService service.
   */
  public permissionService: PermissionService;
  /**
   * reference of config service.
   */
  public config: ConfigService;
  /**
 * user profile details.
 */
  userProfile: IUserProfile;
  /**
   * reference of Router.
   */
  private router: Router;

  @Input()
  public layoutConfiguration: any;
  homeMenuIntractEdata: IInteractEventEdata;
  learnMenuIntractEdata: IInteractEventEdata;
  libraryMenuIntractEdata: IInteractEventEdata;
  myLibraryMenuInteractEdata: IInteractEventEdata;
  browseEdata: IInteractEventEdata;
  helpCenterEdata: IInteractEventEdata;
  workspaceMenuIntractEdata: IInteractEventEdata;
  helpMenuIntractEdata: IInteractEventEdata;
  contributeMenuEdata: IInteractEventEdata;
  groupsMenuIntractEdata: IInteractEventEdata;
  helpLinkVisibility: string;
  /**
   * shows/hides contribute tab
   */

  signInIntractEdata: IInteractEventEdata;
  showContributeTab: boolean;
  hrefPath = '/resources';
  routerLinks = {explore: `/${EXPLORE_GROUPS}`, groups: `/${MY_GROUPS}`};
  /*
  * constructor
  */
  constructor(resourceService: ResourceService, userService: UserService, router: Router, public activatedRoute: ActivatedRoute,
    permissionService: PermissionService, config: ConfigService, private cacheService: CacheService,
    private programsService: ProgramsService, public layoutService: LayoutService,
    public telemetryService: TelemetryService, private http: HttpClient) {
    this.resourceService = resourceService;
    this.userService = userService;
    this.permissionService = permissionService;
    this.router = router;
    this.config = config;
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
      } else if (url.indexOf('explore') >= 0) {
        this.hrefPath = url.replace('explore', 'resources');
      } else if (url.indexOf('play') >= 0) {
        this.hrefPath = '/resources' + url;
      } else {
        this.hrefPath = '/resources';
      }
  }
  ngOnInit() {
    try {
      this.helpLinkVisibility = (<HTMLInputElement>document.getElementById('helpLinkVisibility')).value;
    } catch (error) {
      this.helpLinkVisibility = 'false';
    }
    this.setInteractData();
    merge(this.programsService.allowToContribute$.pipe(
      tap((showTab: boolean) => {
        this.showContributeTab = showTab;
      })
    ), this.userService.userData$.pipe(
      tap((user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = _.get(user, 'userProfile');
        }
      }),
      first()
    )).subscribe();
  }
  setInteractData() {
    this.homeMenuIntractEdata = {
      id: 'home-tab',
      type: 'click',
      pageid: 'home'
    };
    this.libraryMenuIntractEdata = {
      id: 'library-tab',
      type: 'click',
      pageid: 'library'
    };
    this.myLibraryMenuInteractEdata = {
      id: 'myLibrary-tab',
      type: 'click',
      pageid: 'library'
    };
    this.browseEdata = {
      id: 'browse-tab',
      type: 'click',
      pageid: 'browse'
    };
    this.helpCenterEdata = {
      id: 'help-center-tab',
      type: 'click',
      pageid: 'help-center'
    };
    this.learnMenuIntractEdata = {
      id: 'learn-tab',
      type: 'click',
      pageid: 'learn'
    };
    this.groupsMenuIntractEdata = {
      id: 'groups-tab',
      type: 'click',
      pageid: _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid') || 'groups'
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
    this.contributeMenuEdata = {
      id: 'contribute-tab',
      type: 'click',
      pageid: 'contribute'
    };
    this.signInIntractEdata = {
      id: ' signin-tab',
      type: 'click',
      pageid: this.router.url
    };
  }

  getLogoutInteractEdata() {
    return {
      id: 'logout',
      type: 'click',
      pageid: this.router.url.split('/')[1]
    };
  }

  logout() {
    window.location.replace('/logoff');
    this.cacheService.removeAll();
  }

  showSideBar() {
    jQuery('.ui.sidebar').sidebar('setting', 'transition', 'overlay').sidebar('toggle');
  }

  navigateToWorkspace() {
    const authroles = this.permissionService.getWorkspaceAuthRoles();
    if (authroles) {
      return authroles.url;
    }
  }

  getFeatureId(featureId, taskId) {
    return [{id: featureId, type: 'Feature'}, {id: taskId, type: 'Task'}];
  }

  navigateToGroups() {
    return !this.userService.loggedIn ? EXPLORE_GROUPS : MY_GROUPS ;
  }
  isLayoutAvailable() {
    return this.layoutService.isLayoutAvailable(this.layoutConfiguration);
  }

  switchLayout() {
    this.layoutService.initiateSwitchLayout();
    this.generateInteractTelemetry();
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

  openWorkspace() {
    const userName = _.get(this.userService.userProfile, 'userName');
    this.userService.getUserSessionId(userName).subscribe((data: any) => {
      const workspaceUrl = `${environment.vdnWorkspace}/v1/sso/login${data.id}&returnTo=/sourcing`;
      window.open(workspaceUrl);
    });
  }
}
