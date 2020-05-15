import { ProfileService } from '../../services';
import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { UserService, SearchService, PlayerService, CoursesService, OrgDetailsService, CertRegService } from '@sunbird/core';
import {
  ResourceService, ConfigService, ServerResponse, IUserProfile, IUserData, ToasterService, UtilService,
  NavigationHelperService
} from '@sunbird/shared';
import { first } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { Subscription } from 'rxjs';
import { IImpressionEventInput, IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';
import { ActivatedRoute, Router } from '@angular/router';
import { CacheService } from 'ng2-cache-service';
@Component({
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('profileModal') profileModal;
  @ViewChild('slickModal') slickModal;
  userProfile: any;
  contributions = [];
  attendedTraining: Array<object>;
  roles: Array<string>;
  showMoreRoles = true;
  showMoreTrainings = true;
  isCustodianOrgUser = true; // set to true to avoid showing icon before api return value
  showMoreRolesLimit = this.configService.appConfig.PROFILE.defaultShowMoreLimit;
  courseLimit = this.configService.appConfig.PROFILE.defaultViewMoreLimit;
  showEdit = false;
  userSubscription: Subscription;
  orgDetails = [];
  showContactPopup = false;
  showEditUserDetailsPopup = false;
  state: string;
  district: string;
  userFrameWork: any;
  telemetryImpression: IImpressionEventInput;
  myFrameworkEditEdata: IInteractEventEdata;
  editProfileInteractEdata: IInteractEventEdata;
  editMobileInteractEdata: IInteractEventEdata;
  editEmailInteractEdata: IInteractEventEdata;
  downloadCertificateEData: IInteractEventEdata;
  editRecoveryIdInteractEdata: IInteractEventEdata;
  addRecoveryIdInteractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  showRecoveryId = false;
  otherCertificates: Array<object>;
  downloadOthersCertificateEData: IInteractEventEdata;
  constructor(private cacheService: CacheService, public resourceService: ResourceService, public coursesService: CoursesService,
    public toasterService: ToasterService, public profileService: ProfileService, public userService: UserService,
    public configService: ConfigService, public router: Router, public utilService: UtilService, public searchService: SearchService,
    private playerService: PlayerService, private activatedRoute: ActivatedRoute, public orgDetailsService: OrgDetailsService,
    public navigationhelperService: NavigationHelperService, public certRegService: CertRegService) {
  }

  ngOnInit() {
    this.getCustodianOrgUser();
    this.userSubscription = this.userService.userData$.subscribe((user: IUserData) => {
      if (user.userProfile) {
        this.userProfile = user.userProfile;
        this.state = _.get(_.find(this.userProfile.userLocations, { type: 'state' }), 'name');
        this.district = _.get(_.find(this.userProfile.userLocations, { type: 'district' }), 'name');
        this.userFrameWork = this.userProfile.framework ? _.cloneDeep(this.userProfile.framework) : {};
        this.getOrgDetails();
      }
    });
    this.getOtherCertificates(_.get(this.userProfile, 'userId'), 'quiz');
    this.getContribution();
    this.getTrainingAttended();
    this.setInteractEventData();
  }

  getOrgDetails() {
    let orgList = [];
    this.roles = [];
    _.forEach(this.userProfile.organisations, (org, index) => {
      if (this.userProfile.rootOrgId !== org.organisationId) {
        if (org.locations && org.locations.length === 0) {
          if (this.userProfile.organisations[0].locationIds && this.userProfile.organisations[0].locations) {
            org.locationIds = this.userProfile.organisations[0].locationIds;
            org.locations = this.userProfile.organisations[0].locations;
          }
        }
        orgList.push(org);
      } else {
        if (org.locations && org.locations.length !== 0) {
          orgList.push(org);
        }
      }
      _.forEach(org.roles, (value, key) => {
        if (value !== 'PUBLIC') {
          const roleName = _.find(this.userProfile.roleList, { id: value });
          if (roleName) {
            this.roles.push(roleName['name']);
          }
        }
      });
    });
    this.roles = _.uniq(this.roles);
    orgList = _.sortBy(orgList, ['orgjoindate']);
    this.orgDetails = orgList[0];
  }

  convertToString(value) {
    return _.isArray(value) ? _.join(value, ', ') : undefined;
  }

  getLocationDetails(locations, type) {
    const location: any = _.find(locations, { type: type });
    return location ? location.name : false;
  }

  getContribution(): void {
    const response = this.searchService.searchedContentList;
    const { constantData, metaData, dynamicFields } = this.configService.appConfig.Course.otherCourse;
    if (response) {
      this.contributions = this.utilService.getDataForCard(response.content, constantData, dynamicFields, metaData);
    } else {
      const searchParams = {
        status: ['Live'],
        contentType: this.configService.appConfig.WORKSPACE.contentType,
        params: { lastUpdatedOn: 'desc' }
      };
      const inputParams = { params: this.configService.appConfig.PROFILE.contentApiQueryParams };
      this.searchService.searchContentByUserId(searchParams, inputParams).subscribe((data: ServerResponse) => {
        this.contributions = this.utilService.getDataForCard(data.result.content, constantData, dynamicFields, metaData);
      });
    }
  }

  getTrainingAttended() {
    this.coursesService.enrolledCourseData$.pipe(first()).subscribe(data => {
      this.attendedTraining = _.reverse(_.sortBy(_.filter(data.enrolledCourses, { status: 2 }), val => {
        return _.isNumber(_.get(val, 'completedOn')) ? _.get(val, 'completedOn') : Date.parse(val.completedOn);
      })) || [];
    });
  }

/**
 * @param userId
 *It will fetch certificates of user, other than courses
 */
  getOtherCertificates(userId, certType) {
    this.certRegService.fetchCertificates(userId, certType).subscribe((data) => {
      this.otherCertificates = _.map(_.get(data, 'result.response.content'), val => {
        return {
          pdfUrls: [{
            url: _.get(val, '_source.pdfUrl')
          }],
          issuingAuthority: _.get(val, '_source.data.badge.issuer.name'),
          issuedOn: _.get(val, '_source.data.issuedOn'),
          certName: _.get(val, '_source.data.badge.name')
        };
      });
    });
  }

  downloadCert(certificates) {
    _.forEach(certificates, (value, key) => {
      if (key === 0) {
        const request = {
          request: {
            pdfUrl: _.get(value, 'url')
          }
        };
        this.profileService.downloadCertificates(request).subscribe((apiResponse) => {
          const signedPdfUrl = _.get(apiResponse, 'result.signedUrl');
          if (signedPdfUrl) {
            window.open(signedPdfUrl, '_blank');
          } else {
            this.toasterService.error(this.resourceService.messages.emsg.m0076);
          }
        }, (err) => {
          this.toasterService.error(this.resourceService.messages.emsg.m0076);
        });
      }
    });
  }

  toggle(showMore) {
    if (showMore === true) {
      this.showMoreRolesLimit = this.roles.length;
      this.showMoreRoles = false;
    } else {
      this.showMoreRoles = true;
      this.showMoreRolesLimit = this.configService.appConfig.PROFILE.defaultShowMoreLimit;
    }
  }

  toggleCourse(showMoreCourse, courseLimit) {
    if (showMoreCourse === true) {
      this.courseLimit = courseLimit;
      this.showMoreTrainings = false;
    } else {
      this.showMoreTrainings = true;
      this.courseLimit = 3;
    }
  }

  updateProfile(data) {
    this.profileService.updateProfile({ framework: data }).subscribe(res => {
      this.userProfile.framework = data;
      this.toasterService.success(this.resourceService.messages.smsg.m0046);
      this.profileModal.modal.deny();
      this.showEdit = false;
    }, err => {
      this.showEdit = false;
      this.toasterService.warning(this.resourceService.messages.emsg.m0012);
      this.profileModal.modal.deny();
      this.cacheService.set('showFrameWorkPopUp', 'installApp');
    });
  }

  openContent(content) {
    this.playerService.playContent(content.data.metaData);
  }

  public prepareVisits(event) {
    const inViewLogs = _.map(event, (content, index) => ({
      objid: content.metaData.courseId ? content.metaData.courseId : content.metaData.identifier,
      objtype: 'course', index: index,
      section: content.section,
    }));
    if (this.telemetryImpression) {
      this.telemetryImpression.edata.visits = inViewLogs;
      this.telemetryImpression.edata.subtype = 'pageexit';
      this.telemetryImpression = Object.assign({}, this.telemetryImpression);
    }
  }
  private getCustodianOrgUser() {
    this.orgDetailsService.getCustodianOrgDetails().subscribe(custodianOrg => {
      if (_.get(this.userService, 'userProfile.rootOrg.rootOrgId') === _.get(custodianOrg, 'result.response.value')) {
        this.isCustodianOrgUser = true;
      } else {
        this.isCustodianOrgUser = false;
      }
    });
  }

  setInteractEventData() {
    this.myFrameworkEditEdata = {
      id: 'profile-edit-framework',
      type: 'click',
      pageid: 'profile-read'
    };
    this.editProfileInteractEdata = {
      id: 'profile-edit',
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
      type: 'User',
      ver: '1.0'
    };
    this.downloadCertificateEData = {
      id: 'profile-download-certificate',
      type: 'click',
      pageid: 'profile-read'
    };
    this.editRecoveryIdInteractEdata = {
      id: 'profile-edit-recoveryId',
      type: 'click',
      pageid: 'profile-read'
    };
    this.addRecoveryIdInteractEdata = {
      id: 'profile-add-recoveryId',
      type: 'click',
      pageid: 'profile-read'
    };
    this.downloadOthersCertificateEData = {
      id: 'profile-download-others-certificate',
      type: 'click',
      pageid: 'profile-read'
    };
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env
        },
        object: {
          id: this.userService.userid,
          type: 'User',
          ver: '1.0'
        },
        edata: {
          type: this.activatedRoute.snapshot.data.telemetry.type,
          pageid: 'profile-read',
          subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
          uri: this.router.url,
          duration: this.navigationhelperService.getPageLoadTime()
        }
      };
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
