import { Component, OnInit } from '@angular/core';
import { UserService, PermissionService, SearchService, PlayerService } from '@sunbird/core';
import { ResourceService, ConfigService, ServerResponse, IUserProfile, IUserData, ToasterService } from '../../../../modules/shared';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { MyContributions } from '../../interfaces';
import * as _ from 'lodash';
import { IInteractEventInput, IImpressionEventInput, IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  /**
   * Reference of User Profile interface
   */
  userProfile: IUserProfile;
  /**
   * Contains roles
   */
  workSpaceRole: Array<string>;
  /**
   * Contains loader message to display
   */
  loaderMessage = {
    headerMessage: '',
    loaderMessage: 'Loading profile ...'
  };
  /**
   * Contains list of contributions
   */
  contributions: Array<MyContributions>;
  /**
  * inviewLogs
  */
  inviewLogs = [];
  /**
  * telemetryImpression
  */
  telemetryImpression: IImpressionEventInput;
  missingFieldsInteractEdata: IInteractEventEdata;
  workspaceInteractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  constructor(public resourceService: ResourceService,
    public permissionService: PermissionService, public toasterService: ToasterService,
    public userService: UserService, public configService: ConfigService, public router: Router,
    public searchService: SearchService, private playerService: PlayerService, private activatedRoute: ActivatedRoute) { }
  /**
   * This method is used to fetch user profile details
   */
  ngOnInit() {
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
          this.getMyContent();
        }
      });
    this.workSpaceRole = this.configService.rolesConfig.headerDropdownRoles.workSpaceRole;
    let pageId = '';
    if (this.activatedRoute.snapshot.params.section && this.activatedRoute.snapshot.params.action) {
      pageId = `profile-${this.activatedRoute.snapshot.params.section}-${this.activatedRoute.snapshot.params.action}`;
    } else {
      pageId = 'profile-read';
    }
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: pageId,
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
        uri: this.router.url,
        visits: this.inviewLogs
      }
    };
    this.setInteractEventData();
  }
  /**
   * This method is used to update user actions
   */
  updateAction(field) {
    if (field === 'avatar') {
      $('#iconImageInput').click();
    } else {
      const actions = this.configService.appConfig.PROFILE.profileField;
      this.router.navigate([actions[field]]);
    }
    // this.setInteractEventData(field);
  }
  /**
   * This method is used to get user content
   */
  getMyContent(): void {
    // First check local storage
    const response = this.searchService.searchedContentList;
    if (response && response.count) {
      this.contributions = response.content;
    } else {
      // Make search api call
      const searchParams = {
        status: ['Live'],
        contentType: ['Collection', 'TextBook', 'Course', 'LessonPlan', 'Resource'],
        params: { lastUpdatedOn: 'desc' }
      };
      this.searchService.searchContentByUserId(searchParams).subscribe(
        (data: ServerResponse) => {
          this.contributions = data.result.content;
        },
        (err: ServerResponse) => {
        }
      );
    }
  }
  navigateToWorkspace() {
    const authroles = this.permissionService.getWorkspaceAuthRoles();
    if (authroles) {
      this.router.navigate([authroles.url]);
    }
  }
  onClickOfMyContributions(content) {
    this.playerService.playContent(content);
  }
  /**
  * get inview  Data
  */
  inview(event) {
    _.forEach(event.inview, (inview, key) => {
      const obj = _.find(this.inviewLogs, (o) => {
        return o.objid === inview.data.identifier;
      });
      if (obj === undefined) {
        this.inviewLogs.push({
          objid: inview.data.identifier,
          objtype: inview.data.contentType,
          section: 'contributions',
          index: inview.id
        });
      }
    });
    this.telemetryImpression.edata.visits = this.inviewLogs;
    this.telemetryImpression.edata.subtype = 'pageexit';
    this.telemetryImpression = Object.assign({}, this.telemetryImpression);
  }
  setInteractEventData() {
    // let interactId = '';
    // if (field === 'profileSummary') {
    //   interactId = 'profile-update-summary';
    // } else if (field === 'jobProfile') {
    //   interactId = 'add-experience';
    // } else if (field === 'address') {
    //   interactId = 'profile-address';
    // } else if (field === 'education') {
    //   interactId = 'profile-education';
    // } else if (field === 'location') {
    //   interactId = 'add-location';
    // } else if (field === 'dob') {
    //   interactId = 'add-dob';
    // } else if (field === 'subject') {
    //   interactId = 'add-subject';
    // } else if (field === 'grade') {
    //   interactId = 'add-grade';
    // } else if (field === 'gender') {
    //   interactId = 'add-gender';
    // } else if (field === 'language') {
    //   interactId = 'add-language';
    // } else if (field === 'lastName') {
    //   interactId = 'add-lastName';
    // } else if (field === 'email') {
    //   interactId = 'add-email';
    // } else if (field === 'phone') {
    //   interactId = 'add-phone';
    // }
    this.missingFieldsInteractEdata = {
      id: 'interactId',
      type: 'click',
      pageid: 'profile-read'
    };
    this.workspaceInteractEdata = {
      id: 'profile-workspace',
      type: 'click',
      pageid: 'profile-read'
    };
    this.telemetryInteractObject = {
      id: this.userService.userid,
      type: 'user',
      ver: '1.0'
    };
  }
}
