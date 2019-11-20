import { ConfigService, ResourceService, IUserData, IUserProfile } from '@sunbird/shared';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserService, PermissionService } from '../../services';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
import { CacheService } from 'ng2-cache-service';
import { first, filter } from 'rxjs/operators';
import * as _ from 'lodash-es';
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
  public slugValue = (<HTMLInputElement>document.getElementById('defaultTenant')).value;
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
  myLibraryMenuInteractEdata: IInteractEventEdata;
  browseEdata: IInteractEventEdata;
  helpCenterEdata: IInteractEventEdata;
  workspaceMenuIntractEdata: IInteractEventEdata;
  helpMenuIntractEdata: IInteractEventEdata;
  exploreRoutingUrl: string;
  showExploreHeader = false;
  helpLinkVisibility: string;
  isOffline: boolean = environment.isOffline;

  signInIntractEdata: IInteractEventEdata;
  slug: string;
  programId = (<HTMLInputElement>document.getElementById('cbse_programId'))
    ? (<HTMLInputElement>document.getElementById('cbse_programId')).value : undefined;
  /*
  * constructor
  */
  constructor(resourceService: ResourceService, userService: UserService, router: Router, public activatedRoute: ActivatedRoute,
    permissionService: PermissionService, config: ConfigService, private cacheService: CacheService) {
    this.resourceService = resourceService;
    this.userService = userService;
    this.permissionService = permissionService;
    this.router = router;
    this.config = config;
    this.workSpaceRole = this.config.rolesConfig.headerDropdownRoles.workSpaceRole;
  }

  ngOnInit() {
    this.slug = this.activatedRoute.snapshot.params.slug;
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
          this.slugValue = _.get(this.userProfile, 'rootOrg.slug');
        }
      });
    setTimeout(() => {
      let activeRoute = this.router.url.split('/')[3];
      this.activeRoute(activeRoute);
    }, 1000);
    
  }

  getProgramUrl() {
    const programId = (<HTMLInputElement>document.getElementById('cbse_programId'))
      ? (<HTMLInputElement>document.getElementById('cbse_programId')).value : '';
    return '/workspace/program/' + programId;
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
    this.signInIntractEdata = {
      id: ' signin-tab',
      type: 'click',
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
  navigateTo(url) {
    return this.slug ? this.slug + url : url;
  }
  getUrl() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((urlAfterRedirects: NavigationEnd) => {
      this.slug = _.get(this.activatedRoute, 'snapshot.firstChild.firstChild.params.slug');
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
      this.signInIntractEdata['pageid'] = this.exploreRoutingUrl;
    });
  }
  activeRoute(route) {
    if (route === 'curiosity') {
      document.getElementById(route).classList.add('active');
      document.getElementById('workspace').classList.remove('active');
    }
    else {
      document.getElementById('workspace').classList.add('active');
      document.getElementById('curiosity').classList.remove('active');
    }
  }

  navigateToWorkspace() {
    const authroles = this.permissionService.getWorkspaceAuthRoles();
    if (authroles) {
      return authroles.url;
    }
  }
}
