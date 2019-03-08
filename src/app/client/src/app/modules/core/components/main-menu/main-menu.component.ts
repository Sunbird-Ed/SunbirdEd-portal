import { ConfigService, ResourceService, IUserData, IUserProfile } from '@sunbird/shared';
import { Component, OnInit } from '@angular/core';
import { UserService, PermissionService } from '../../services';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
import { CacheService } from 'ng2-cache-service';
import { first, filter } from 'rxjs/operators';
import * as _ from 'lodash';
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
  homeMenuIntractEdata: IInteractEventEdata;
  learnMenuIntractEdata: IInteractEventEdata;
  libraryMenuIntractEdata: IInteractEventEdata;
  workspaceMenuIntractEdata: IInteractEventEdata;
  helpMenuIntractEdata: IInteractEventEdata;
  exploreRoutingUrl: string;
  showExploreHeader = false;
  helpLinkVisibility: string;
  isOffline: boolean = environment.isOffline;

  /*
  * constructor
  */
  constructor(resourceService: ResourceService, userService: UserService, router: Router,
    permissionService: PermissionService, config: ConfigService, private cacheService: CacheService) {
    this.resourceService = resourceService;
    this.userService = userService;
    this.permissionService = permissionService;
    this.router = router;
    this.config = config;
    this.workSpaceRole = this.config.rolesConfig.headerDropdownRoles.workSpaceRole;
  }

  ngOnInit() {
    try {
      this.helpLinkVisibility = (<HTMLInputElement>document.getElementById('helpLinkVisibility')).value;
    } catch (error) {
      this.helpLinkVisibility = 'false';
    }
    this.setInteractData();
    this.getUrl();
    this.userService.userData$.pipe(first()).subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
        }
      });
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
    this.learnMenuIntractEdata = {
      id: 'learn-tab',
      type: 'click',
      pageid: 'learn'
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
  }

  logout() {
    window.location.replace('/logoff');
    this.cacheService.removeAll();
  }

  showSideBar() {
    jQuery('.ui.sidebar').sidebar('setting', 'transition', 'overlay').sidebar('toggle');
  }

  getUrl() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((urlAfterRedirects: NavigationEnd) => {
      if (_.includes(urlAfterRedirects.url, '/explore')) {
        this.showExploreHeader = true;
        const url = urlAfterRedirects.url.split('?')[0].split('/');
        if (url.indexOf('explore') === 2) {
          this.exploreRoutingUrl = url[1] + '/' + url[2];
        } else {
          this.exploreRoutingUrl = url[1];
        }
      } else if (_.includes(urlAfterRedirects.url, '/explore-course')) {
        this.showExploreHeader = true;
        const url = urlAfterRedirects.url.split('?')[0].split('/');
        if (url.indexOf('explore-course') === 2) {
          this.exploreRoutingUrl = url[1] + '/' + url[2];
        } else {
          this.exploreRoutingUrl = url[1];
        }
      } else {
        this.showExploreHeader = false;
      }
    });
  }

  navigateToWorkspace() {
    const authroles = this.permissionService.getWorkspaceAuthRoles();
    if (authroles) {
      this.router.navigate([authroles.url]);
    }
  }
}
