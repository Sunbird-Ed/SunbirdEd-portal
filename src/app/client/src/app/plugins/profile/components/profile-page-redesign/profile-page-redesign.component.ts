import { ProfileService } from './../../services';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { UserService, PermissionService, SearchService, PlayerService, CoursesService } from '@sunbird/core';
import {
  ResourceService, ConfigService, ServerResponse, IUserProfile, IUserData, ToasterService,
  UtilService
} from '../../../../modules/shared';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MyContributions } from '../../interfaces';
import * as _ from 'lodash';
import { SubscriptionLike as ISubscription } from 'rxjs';
import { IInteractEventInput, IImpressionEventInput, IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile-page-redesign',
  templateUrl: './profile-page-redesign.component.html',
  styleUrls: ['./profile-page-redesign.component.scss']
})
export class ProfilePageRedesignComponent implements OnInit, OnDestroy {
  /**
   * Reference of User Profile interface
   */
  userProfile: any;

  @ViewChild('profileModal') profileModal;

  /**
   * Contains list of contributions
   */
  contributions = [];

  attendedTraining: Array<object>;

  /**
   * telemetryLogs
   */
  telemetryLogs = [];

  roles: Array<string>;

  showMoreRoles = true;
  showMoreTrainings = true;

  /**
   * Contains default limit to show more roles
   */
  defaultShowMoreRolesLimit = this.configService.appConfig.PROFILE.defaultShowMoreLimit;

  /**
   * Used to store limit to show more awards
   */
  showMoreRolesLimit = this.defaultShowMoreRolesLimit;

  courseLimit = this.configService.appConfig.PROFILE.defaultViewMoreLimit;
  /**
   * Admin Dashboard access roles
   */
  adminActions: Array<string>;

  /**
   * Bulk upload URL
   */
  uploadUrl: object = this.configService.dropDownConfig.ORG.UPLOAD;

  /**
   * Contains loader message to display
   */
  loaderMessage = {
    headerMessage: '',
    loaderMessage: 'Loading profile ...'
  };

  showEdit = false;
  userSubscription: ISubscription;

  /** The button clicked value for interact telemetry event */
  btnArrow: string;

  /**
   * Admin action option selected on dropdown
   */
  adminActionSelectedOption: string;
  adminActionDropDownOptions: Array<string> = [this.resourceService.frmelmnts.instn.t0015, this.resourceService.frmelmnts.instn.t0016,
  this.resourceService.frmelmnts.lbl.chkuploadsts];

  courseDataSubscription: Subscription;

  orgDetails = [];

  customStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #fff',
    boxShadow: '0 0 6px 0 rgba(0,0,0,0.38)',
    borderRadius: '50%',
    color: '#9017FF'
  };

  /**
   * Slider setting to display number of cards on the slider.
   */
  slideConfig = {
    'slidesToShow': 2,
    'slidesToScroll': 2,
    'variableWidth': true,
    'responsive': [
      {
        'breakpoint': 2800,
        'settings': {
          'slidesToShow': 8,
          'slidesToScroll': 2,
          'variableWidth': true
        }
      },
      {
        'breakpoint': 2200,
        'settings': {
          'slidesToShow': 6,
          'slidesToScroll': 2,
          'variableWidth': true
        }
      },
      {
        'breakpoint': 2000,
        'settings': {
          'slidesToShow': 5,
          'slidesToScroll': 2,
          'variableWidth': true
        }
      },
      {
        'breakpoint': 1400,
        'settings': {
          'slidesToShow': 3.5,
          'slidesToScroll': 2,
          'variableWidth': true
        }
      },
      {
        'breakpoint': 1200,
        'settings': {
          'slidesToShow': 3.5,
          'slidesToScroll': 2,
          'variableWidth': true
        }
      },
      {
        'breakpoint': 800,
        'settings': {
          'slidesToShow': 3,
          'slidesToScroll': 1,
          'variableWidth': true
        }
      },
      {
        'breakpoint': 600,
        'settings': {
          'slidesToShow': 2,
          'slidesToScroll': 1,
          'variableWidth': true
        }
      },
      {
        'breakpoint': 425,
        'settings': {
          'slidesToShow': 1,
          'slidesToScroll': 1,
          'variableWidth': true
        }
      }
    ],
    infinite: false,
  };

  inputData: any;
  /**
   * telemetryImpression
   */
  telemetryImpression: IImpressionEventInput;
  myContributionsInteractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;

  constructor(public resourceService: ResourceService, public coursesService: CoursesService,
    public permissionService: PermissionService, public toasterService: ToasterService, public profileService: ProfileService,
    public userService: UserService, public configService: ConfigService, public router: Router, public utilService: UtilService,
    public searchService: SearchService, private playerService: PlayerService, private activatedRoute: ActivatedRoute) {
    this.btnArrow = 'prev-button';
  }

  ngOnInit() {
    this.adminActions = this.configService.rolesConfig.headerDropdownRoles.adminDashboard;
    this.userSubscription = this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
          this.inputData = {
            board: _.get(this.userProfile, 'framework.board'),
            medium: _.get(this.userProfile, 'framework.medium'),
            subject: _.get(this.userProfile.framework, 'framework.subject'),
            gradeLevel: _.get(this.userProfile.framework, 'framework.class')
          };
          this.getOrgDetails();
          this.getMyContent();
          this.getAttendedTraining();
        }
      });
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.activatedRoute.snapshot.data.telemetry.uri,
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype
      }
    };
  }

  getOrgDetails() {
    let orgList = [];
    this.roles = [];
    _.forEach(this.userProfile.organisations, (org, index) => {
      if (this.userProfile.rootOrgId !== org.organisationId) {
        orgList.push(org);
      }
      _.forEach(org.roles, (value, key) => {
        if (value !== 'PUBLIC') {
          this.roles.push(value);
        }
      });
    });
    orgList = _.sortBy(orgList, ['orgjoindate']);
    this.orgDetails = orgList[0];
  }

  convertToString(value) {
    if (_.isArray(value)) {
      return _.join(value, ',');
    }
  }

  getLocationDetails(locations, type) {
    const data = _.find(locations, { type: type });
    if (data) {
      return data['name'];
    } else {
      return false;
    }
  }

  /**
   * This method is used to get user content
   */
  getMyContent(): void {
    // First check local storage
    const response = this.searchService.searchedContentList;
    if (response && response.count) {
      this.formatMyContributionData(response.content);
    } else if (response && response.count === 0) {
      this.contributions = [];
    } else {
      // Make search api call
      const searchParams = {
        status: ['Live'],
        contentType: ['Collection', 'TextBook', 'Course', 'LessonPlan', 'Resource'],
        params: { lastUpdatedOn: 'desc' }
      };
      this.searchService.searchContentByUserId(searchParams).subscribe(
        (data: ServerResponse) => {
          this.formatMyContributionData(data.result.content);
        },
        (err: ServerResponse) => {
        }
      );
    }
  }

  private formatMyContributionData(contents) {
    _.forEach(contents, (content, key) => {
      const constantData = this.configService.appConfig.Course.otherCourse.constantData;
      const metaData = this.configService.appConfig.Course.otherCourse.metaData;
      const dynamicFields = {};
      this.contributions[key] = this.utilService.processContent(content,
        constantData, dynamicFields, metaData);
    });
  }

  getAttendedTraining() {
    this.courseDataSubscription = this.coursesService.enrolledCourseData$.subscribe(
      data => {
        if (data && !data.err) {
          this.attendedTraining = [];
          _.forEach(data.enrolledCourses, (course, key) => {
            if (course['status'] === 2) {
              this.attendedTraining.push(course);
            }
          });
        } else if (data && data.err) {
          this.toasterService.error(this.resourceService.messages.fmsg.m0001);
        }
      }
    );
  }

  /**
   * This method is used to show/hide ViewMore based on the limit
   */
  toggle(showMore) {
    if (showMore === true) {
      this.showMoreRolesLimit = this.roles.length;
      this.showMoreRoles = false;
    } else {
      this.showMoreRoles = true;
      this.showMoreRolesLimit = this.defaultShowMoreRolesLimit;
    }
  }

  toggleCourse(showMoreCourse) {
    if (showMoreCourse === true) {
      this.courseLimit = this.attendedTraining.length;
      this.showMoreTrainings = false;
    } else {
      this.showMoreTrainings = true;
      this.courseLimit = 3;
    }
  }

  updateProfile(data) {
    const request = {
      framework: {
        board: _.get(data, 'board'),
        class: _.get(data, 'gradeLevel'),
        medium: _.get(data, 'medium'),
        subject: _.get(data, 'subject') ? _.get(data, 'subject') : []
      }
    };
    this.profileService.updateProfile(request).subscribe(res => {
      this.toasterService.success(this.resourceService.messages.smsg.m0046);
      this.profileModal.modal.deny();
      this.showEdit = false;
    },
      err => {
        this.toasterService.error(this.resourceService.messages.fmsg.m0085);
        this.profileModal.modal.deny();
        this.showEdit = false;
      });
  }

  /**
     * on changing dropdown option
     * it navigate
     */
  onChange() {
    this.router.navigate([this.uploadUrl[this.adminActionSelectedOption]]);
  }

  onClickOfMyContributions(content) {
    this.playerService.playContent(content.data.metaData);
  }

  /**
   * get onTelemetryEvent
   */
  onTelemetryEvent(contribution, event) {
    const CONTRIBUTION_SLIDE_COUNT_FIRST = 1;
    const CONTRIBUTION_SLIDE_COUNT_LAST = 5;
    const slideData = contribution.slice(event.currentSlide + CONTRIBUTION_SLIDE_COUNT_FIRST,
      event.currentSlide + CONTRIBUTION_SLIDE_COUNT_LAST);
    _.forEach(slideData, (slide, key) => {
      const obj = _.find(this.telemetryLogs, (o) => {
        return o.objid === slide.courseId;
      });
      if (obj === undefined) {
        this.telemetryLogs.push({
          objid: slide.courseId,
          objtype: 'profile',
          index: event.currentSlide + key,
          section: 'Contribution'
        });
      }
    });
    this.telemetryImpression.edata.visits = this.telemetryLogs;
    this.telemetryImpression.edata.subtype = 'pageexit';
    this.telemetryImpression = Object.assign({}, this.telemetryImpression);
  }

  beforeContributionSlideChange(event) {
    if (event.currentSlide === 0 && event.nextSlide === 0) {
      this.btnArrow = 'prev-button';
    } else if (event.currentSlide < event.nextSlide) {
      this.btnArrow = 'next-button';
    } else if (event.currentSlide > event.nextSlide) {
      this.btnArrow = 'prev-button';
    }
  }

  /**
   * ngOnDestroy unsubscribe the subscription
   */
  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

}
