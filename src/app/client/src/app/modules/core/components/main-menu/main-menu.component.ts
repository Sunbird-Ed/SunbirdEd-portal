import { ConfigService, ResourceService, IUserData, IUserProfile } from '@sunbird/shared';
import { Component, OnInit } from '@angular/core';
import { UserService, PermissionService, ProgramsService } from '../../services';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
import { CacheService } from 'ng2-cache-service';
import { first, filter, tap } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { environment } from '@sunbird/environment';
import { merge } from 'rxjs';
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
  myLibraryMenuInteractEdata: IInteractEventEdata;
  browseEdata: IInteractEventEdata;
  helpCenterEdata: IInteractEventEdata;
  workspaceMenuIntractEdata: IInteractEventEdata;
  helpMenuIntractEdata: IInteractEventEdata;
  contributeMenuEdata: IInteractEventEdata;
  helpLinkVisibility: string;
  isOffline: boolean = environment.isOffline;
  /**
   * shows/hides contribute tab
   */

  signInIntractEdata: IInteractEventEdata;
  showContributeTab: boolean;
  /*
  * constructor
  */
  constructor(resourceService: ResourceService, userService: UserService, router: Router, public activatedRoute: ActivatedRoute,
    permissionService: PermissionService, config: ConfigService, private cacheService: CacheService,
    private programsService: ProgramsService) {
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
    return [{ id: featureId, type: 'Feature' }, { id: taskId, type: 'Task' }];
  }
}
