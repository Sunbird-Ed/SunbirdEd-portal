import { ProfileService } from '../../services';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { UserService, PermissionService, SearchService, PlayerService, CoursesService, OrgDetailsService } from '@sunbird/core';
import {
  ResourceService, ConfigService, ServerResponse, IUserProfile, IUserData, ToasterService,
  UtilService
} from '../../../../modules/shared';
import { Subscription } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MyContributions } from '../../interfaces';
import * as _ from 'lodash';
import { SubscriptionLike as ISubscription } from 'rxjs';
import { IInteractEventInput, IImpressionEventInput, IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';
import { ActivatedRoute } from '@angular/router';
import { CacheService } from 'ng2-cache-service';
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  /**
  * Reference of User Profile interface
  */
  userProfile: any;

  @ViewChild('profileModal') profileModal;
  @ViewChild('slickModal') slickModal;
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
  isCustodianOrgUser = false;
  /**
   * Contains default limit to show awards
   */
  defaultShowMoreRolesLimit = this.configService.appConfig.PROFILE.defaultShowMoreLimit;
  /**
   * Used to store limit to show/hide awards
   */
  showMoreRolesLimit = this.defaultShowMoreRolesLimit;
  courseLimit = this.configService.appConfig.PROFILE.defaultViewMoreLimit;
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
  adminActionDropDownOptions: Array<string> = [this.resourceService.frmelmnts.instn.t0015, this.resourceService.frmelmnts.instn.t0016,
  this.resourceService.frmelmnts.lbl.chkuploadsts];
  courseDataSubscription: Subscription;
  orgDetails = [];
  customStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #fff',
    boxShadow: '0 0 6px 0 rgba(0,0,0,0.38)',
    borderRadius: '50%',
    color: '#9017FF',
    fontWeight: 'bold',
    fontFamily: 'inherit'
  };
  showContactPopup = false;
  showEditUserDetailsPopup = false;
  state: string;
  district: string;
   /**
  /**
    * Slider setting to display number of cards on the slider.
    */
  slideConfig = {
    'slidesToShow': 4,
    'slidesToScroll': 4,
    'responsive': [
      {
        'breakpoint': 2800,
        'settings': {
          'slidesToShow': 6,
          'slidesToScroll': 6
        }
      },
      {
        'breakpoint': 2200,
        'settings': {
          'slidesToShow': 5,
          'slidesToScroll': 5
        }
      },
      {
        'breakpoint': 1920,
        'settings': {
          'slidesToShow': 4,
          'slidesToScroll': 3
        }
      },
      {
        'breakpoint': 1440,
        'settings': {
          'slidesToShow': 3.5,
          'slidesToScroll': 3
        }
      },
      {
        'breakpoint': 1200,
        'settings': {
          'slidesToShow': 3,
          'slidesToScroll': 3
        }
      },
      {
        'breakpoint': 992,
        'settings': {
          'slidesToShow': 2.25,
          'slidesToScroll': 2
        }
      },
      {
        'breakpoint': 750,
        'settings': {
          'slidesToShow': 2,
          'slidesToScroll': 2
        }
      },
      {
        'breakpoint': 660,
        'settings': {
          'slidesToShow': 1.75,
          'slidesToScroll': 1
        }
      },
      {
        'breakpoint': 600,
        'settings': {
          'slidesToShow': 1.5,
          'slidesToScroll': 1
        }
      },
      {
        'breakpoint': 530,
        'settings': {
          'slidesToShow': 1.33,
          'slidesToScroll': 1
        }
      },
      {
        'breakpoint': 498,
        'settings': {
          'slidesToShow': 1.25,
          'slidesToScroll': 1
        }
      },
      {
        'breakpoint': 450,
        'settings': {
          'slidesToShow': 1.15,
          'slidesToScroll': 1
        }
      },
      {
        'breakpoint': 390,
        'settings': {
          'slidesToShow': 1,
          'slidesToScroll': 1
        }
      }
    ],
    'infinite': false,
    'rtl': false
  };
  inputData: any;
  /**
  * telemetryImpression
  */
  telemetryImpression: IImpressionEventInput;
  myFrameworkEditEdata: IInteractEventEdata;
  editProfileInteractEdata: IInteractEventEdata;
  editMobileInteractEdata: IInteractEventEdata;
  editEmailInteractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  constructor( private cacheService: CacheService, public resourceService: ResourceService, public coursesService: CoursesService,
    public permissionService: PermissionService, public toasterService: ToasterService, public profileService: ProfileService,
    public userService: UserService, public configService: ConfigService, public router: Router, public utilService: UtilService,
    public searchService: SearchService, private playerService: PlayerService, private activatedRoute: ActivatedRoute,
  public orgDetailsService: OrgDetailsService) {
    this.btnArrow = 'prev-button';
  }

  ngOnInit() {
    this.getCustodianOrgUser().subscribe(custodianOrgUser => {
      this.isCustodianOrgUser = custodianOrgUser;
    },
    err => {
      this.toasterService.warning(this.resourceService.messages.emsg.m0012);
    });

    this.userSubscription = this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;

          const state = _.find(this.userProfile.userLocations, (locations) => {
            return locations.type === 'state';
          });
          this.state = _.get(state, 'name') || '';

          const district = _.find(this.userProfile.userLocations, (locations) => {
            return locations.type === 'district';
          });
          this.district = _.get(district, 'name') || '';

          this.inputData =  _.get(this.userProfile, 'framework') ? _.cloneDeep(_.get(this.userProfile, 'framework')) : {};
          this.getOrgDetails();
          this.getMyContent();
          this.getAttendedTraining();
        }
      });
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      object: {
        id: this.userService.userid,
        type: 'user',
        ver: '1.0'
      },
        edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: 'profile-read',
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
        uri: this.router.url,
        visits: this.telemetryLogs
      }
    };
    this.setInteractEventData();
    this.addSlideConfig();
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
          const roleName = _.find(this.userProfile.roleList, {id: value});
          if (roleName) {
            this.roles.push(roleName['name']);
          }
        }
      });
    });
    orgList = _.sortBy(orgList, ['orgjoindate']);
    this.orgDetails = orgList[0];
  }

  convertToString(value) {
    if (_.isArray(value)) {
      return _.join(value, ', ');
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
      const inputParams = {params: this.configService.appConfig.PROFILE.contentApiQueryParams};
      this.searchService.searchContentByUserId(searchParams, inputParams).subscribe(
        (data: ServerResponse) => {
          this.formatMyContributionData(data.result.content);
        },
        (err: ServerResponse) => {
        }
      );
    }
  }
  addSlideConfig() {
    this.resourceService.languageSelected$
        .subscribe(item => {
          if (item.value === 'ur') {
            this.slideConfig['rtl'] = true;
          } else {
            this.slideConfig['rtl'] = false;
          }
          if (this.slickModal) {
            this.slickModal.unslick();
            this.slickModal.initSlick(this.slideConfig);
          }
    });
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
      framework: data
    };
    this.profileService.updateProfile(request).subscribe(res => {
      this.userProfile.framework = data;
      this.toasterService.success(this.resourceService.messages.smsg.m0046);
      this.profileModal.modal.deny();
      this.showEdit = false;
    },
      err => {
        this.showEdit = false;
        this.toasterService.warning(this.resourceService.messages.emsg.m0012);
        this.profileModal.modal.deny();
        this.router.navigate(['/resources']);
        this.cacheService.set('showFrameWorkPopUp', 'installApp' );
      });
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
        return o.objid === slide.metaData.identifier;
      });
      if (obj === undefined) {
        this.telemetryLogs.push({
          objid: slide.metaData.identifier || '',
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

  private getCustodianOrgUser() {
    return this.orgDetailsService.getCustodianOrg().pipe(map((custodianOrg) => {
      if (_.get(this.userService, 'userProfile.rootOrg.rootOrgId') === _.get(custodianOrg, 'result.response.value')) {
        return true;
      }
      return false;
    }));
  }

  setInteractEventData() {
    this.myFrameworkEditEdata = {
      id: 'profile-edit-framework',
      type: 'click',
      pageid: 'profile-read'
    };
    this.editProfileInteractEdata = {
      id: 'profile-edit-address',
      type: 'click',
      pageid: 'profile-read'
    };
    this.editMobileInteractEdata = {
      id: 'profile-edit-mobile',
      type: 'click',
      pageid: 'profile-read'
    };
    this.editEmailInteractEdata = {
      id: 'profile-edit-emailId',
      type: 'click',
      pageid: 'profile-read'
    };
    this.telemetryInteractObject = {
      id: this.userService.userid,
      type: 'user',
      ver: '1.0'
    };
  }

  /**
   *ngOnDestroy unsubscribe the subscription
   */
  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

}
