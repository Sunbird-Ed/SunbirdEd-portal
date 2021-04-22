import { IFetchForumId } from './../../../groups/interfaces/group';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService, ResourceService, NavigationHelperService } from '../../../shared/services';
import { DiscussionTelemetryService } from '../../../shared/services/discussion-telemetry/discussion-telemetry.service';
import * as _ from 'lodash-es';
import { UserService } from '../../../core/services';
import { CsLibInitializerService } from '../../../../service/CsLibInitializer/cs-lib-initializer.service';
import { CsModule } from '@project-sunbird/client-services';

@Component({
  selector: 'app-access-discussion',
  templateUrl: './access-discussion.component.html',
  styleUrls: ['./access-discussion.component.scss']
})

export class AccessDiscussionComponent implements OnInit {
  // TODO : Publishing as a independent npm module by taking the below properties as input
  // icon, name, context data, output event (click)
  @Input() fetchForumIdReq: IFetchForumId;
  @Input() forumIds: Array<number>;
  @Output() routerData = new EventEmitter();
  showLoader = false;
  private discussionCsService: any;

  constructor(
    private resourceService: ResourceService,
    private router: Router,
    private toasterService: ToasterService,
    private discussionTelemetryService: DiscussionTelemetryService,
    private navigationHelperService: NavigationHelperService,
    private userService: UserService,
    private csLibInitializerService: CsLibInitializerService
  ) {
    if (!CsModule.instance.isInitialised) {
      this.csLibInitializerService.initializeCs();
    }
    this.discussionCsService = CsModule.instance.discussionService;
  }

  /**
   * @description - It will first check for the forum IDs coming as an input param or not,
   *                If it is not coming then it will make an api call to get the forum IDs
   */
  ngOnInit() {
    if (!this.forumIds) {
    this.fetchForumIds();
    }
  }
  /**
   * @description - fetch all the forumIds attached to a course/group/batch
   * @param - req as  {identifier: "" , type: ""}
   */
  fetchForumIds() {
    this.discussionCsService.getForumIds(this.fetchForumIdReq).subscribe(forumDetails => {
      this.forumIds = _.map(_.get(forumDetails, 'result'), 'cid');
    }, error => {
      this.toasterService.error(this.resourceService.messages.emsg.m0005);
    });
  }

  /**
   * @description - register/create the user in nodebb while navigating to discussionForum
   */
  navigateToDiscussionForum() {
    this.showLoader = true;
    const createUserReq = {
      username: _.get(this.userService.userProfile, 'userName'),
      identifier: _.get(this.userService.userProfile, 'userId'),
    };
    this.discussionTelemetryService.contextCdata = [
      {
        id: this.fetchForumIdReq.identifier.toString(),
        type: this.fetchForumIdReq.type
      }
    ];
    this.navigationHelperService.setNavigationUrl({ url: this.router.url });
    this.discussionCsService.createUser(createUserReq).subscribe((response) => {
      const routerData = {
        userName: _.get(response, 'result.userSlug'),
        forumIds: this.forumIds
      };
      this.routerData.emit(routerData);
    }, (error) => {
      this.showLoader = false;
      this.toasterService.error(this.resourceService.messages.emsg.m0005);
    });
  }
}
