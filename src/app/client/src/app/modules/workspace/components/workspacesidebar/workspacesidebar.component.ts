import { Component, OnInit } from '@angular/core';
import { ResourceService, ConfigService } from '@sunbird/shared';
import { PermissionService } from '@sunbird/core';
import {Router, ActivatedRoute} from '@angular/router';
import { WorkSpaceService } from './../../services';
/**
 * The Workspace side  component shows the sidebar for workspace
 */
@Component({
  selector: 'app-workspacesidebar',
  templateUrl: './workspacesidebar.component.html'
})
export class WorkspacesidebarComponent implements OnInit {

  /**
   * To call resource service which helps to use language constant
   */
  public resourceService: ResourceService;
  /**
   * reference of permissionService service.
  */
  public permissionService: PermissionService;
  /**
   * reference of config service.
  */
  public config: ConfigService;

  /*
  roles allowed to create content
  */
  createRole: Array<string>;
  /**
   * Draft  access roles
  */
  draftRole: Array<string>;
  /**
    * inreviewRole   access roles
  */
  inreviewRole: Array<string>;
  /**
 * publishedRole  access roles
 */
  publishedRole: Array<string>;
  /**
  * alluploadsRole  access roles
  */
  alluploadsRole: Array<string>;
  /**
  * upForReviewRole  access roles
  */
  upForReviewRole: Array<string>;
  /**
  * courseBatchRoles  access roles
 */
  courseBatchRoles: Array<string>;
  /**
    * flaggedRole  access roles
  */
  flaggedRole: Array<string>;

  /**
    * limitedPublishingRole  access roles
  */
  limitedPublishingRole: Array<string>;

  /**
    * start  access roles
  */
  startRole: Array<string>;

  /**
  * allContentRole  access roles
  */
  allContentRole: Array<string>;

  /**
  * flagReviewer  access roles
  */
  flagReviewer: Array<string>;
    /**
  * allContentRole  access roles
  */
 collaboratingRole: Array<string>;
 /**
  * roles for which training sub-tab to be shown
  */
 trainingRole: Array<string>;

  /**
  * roles for which admin to be shown
  */
 alltextbookRole: Array<string>;
   /**
   * reference of Router.
   */
  private router: Router;
  
  /**
   * reference of routingUrl.
   */
    public routingUrl: string;

  /**
  * Constructor to create injected service(s) object
     Default method of Draft Component class
     * @param {ResourceService} resourceService Reference of ResourceService
     * @param {PermissionService} permissionService Reference of PermissionService
     * @param {ConfigService} config Reference of ConfigService
  */
  constructor(config: ConfigService, resourceService: ResourceService, permissionService: PermissionService,
   router: Router, public workSpaceService: WorkSpaceService) {
    this.resourceService = resourceService;
    this.permissionService = permissionService;
    this.config = config;
    this.router = router;
  }

  ngOnInit() {
    this.workSpaceService.getQuestionSetCreationStatus();
    this.alltextbookRole = this.config.rolesConfig.workSpaceRole.alltextbookRole;
    this.createRole = this.config.rolesConfig.workSpaceRole.createRole;
    this.draftRole = this.config.rolesConfig.workSpaceRole.draftRole;
    this.inreviewRole = this.config.rolesConfig.workSpaceRole.inreviewRole;
    this.publishedRole = this.config.rolesConfig.workSpaceRole.publishedRole;
    this.alluploadsRole = this.config.rolesConfig.workSpaceRole.alluploadsRole;
    this.upForReviewRole = this.config.rolesConfig.workSpaceRole.upForReviewRole;
    this.courseBatchRoles = this.config.rolesConfig.workSpaceRole.courseBatchRoles;
    this.flaggedRole = this.config.rolesConfig.workSpaceRole.flaggedRole;
    this.limitedPublishingRole = this.config.rolesConfig.workSpaceRole.limitedPublishingRole;
    this.startRole = this.config.rolesConfig.workSpaceRole.startRole;
    this.allContentRole = this.config.rolesConfig.workSpaceRole.allContentRole;
    this.flagReviewer = this.config.rolesConfig.workSpaceRole.flagReviewer;
    this.collaboratingRole = this.config.rolesConfig.workSpaceRole.collaboratingRole;
  }

  setInteractData(id) {
    return {
      id,
      type: 'click',
      pageid: 'workspace'
    };
   }

   redirectToCreatedEvents(){
    this.router.navigate(['workspace/content/allmyevents']);
  }
  redirectToCreatedContent(){
    this.router.navigate(['workspace/content/allcontent/1']);
  }

  redirectToMenu(menu){
    console.log(menu);
    if(menu == 'create'){
      this.routingUrl = '/workspace/content/create';
    }else if(menu == 'alltextbooks'){
      this.routingUrl = 'workspace/content/alltextbooks/1';
    }else if(menu == 'allmyevents')
    {
      this.routingUrl = 'workspace/content/allmyevents';
    }else if(menu == 'allcontent'){
      this.routingUrl = 'workspace/content/allcontent/1';
    }else  if(menu == 'draft'){
      this.routingUrl = '/workspace/content/draft/1';
    }else if(menu == 'review'){
      this.routingUrl = '/workspace/content/review/1';
    }else if(menu == 'published'){
      this.routingUrl = '/workspace/content/published/1';
    }else if(menu == 'uploaded'){
      this.routingUrl = '/workspace/content/uploaded/1';
    }else if(menu == 'upForReview'){
      this.routingUrl = '/workspace/content/upForReview/1';
    }else if(menu == 'flagreviewer'){
      this.routingUrl = '/workspace/content/flagreviewer/1';
    }else if(menu == 'batches'){
      this.routingUrl = '/workspace/content/batches';
    }else if(menu == 'batches/created'){
      this.routingUrl = '/workspace/content/batches/created';
    }else if(menu == 'batches/assigned'){
      this.routingUrl = '/workspace/content/batches/assigned';
    }else if(menu == 'flagged'){
      this.routingUrl = '/workspace/content/flagged/1';
    }else if(menu == 'limited-publish'){
      this.routingUrl = '/workspace/content/limited-publish/1';
    }else if(menu == 'collaborating-on'){
      this.routingUrl = '/workspace/content/collaborating-on/1';
    }
    this.router.navigate([this.routingUrl]);

  }
}
