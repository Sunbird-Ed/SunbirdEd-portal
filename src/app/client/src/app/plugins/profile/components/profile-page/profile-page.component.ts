import {ProfileService} from '../../services';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Inject } from '@angular/core';
import {
  CertRegService,
  CoursesService,
  OrgDetailsService,
  PlayerService,
  SearchService,
  UserService
} from '@sunbird/core';
import {
  ConfigService,
  IUserData, LayoutService,
  NavigationHelperService,
  ResourceService,
  ServerResponse,
  ToasterService,
  UtilService
} from '@sunbird/shared';
import * as _ from 'lodash-es';
import {Subject, Subscription} from 'rxjs';
import {IImpressionEventInput, IInteractEventEdata, IInteractEventObject, TelemetryService} from '@sunbird/telemetry';
import {ActivatedRoute, Router} from '@angular/router';
import {CacheService} from 'ng2-cache-service';
import {takeUntil} from 'rxjs/operators';
import { CertificateDownloadAsPdfService } from 'sb-svg2pdf';
import { CsCourseService } from '@project-sunbird/client-services/services/course/interface';
import { FieldConfig } from 'common-form-elements';

@Component({
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
  providers: [CertificateDownloadAsPdfService]
})
export class ProfilePageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('profileModal') profileModal;
  @ViewChild('slickModal') slickModal;
  userProfile: any;
  contributions = [];
  totalContributions: Number;
  attendedTraining: Array<object>;
  roles: Array<string>;
  showMoreRoles = true;
  showMoreTrainings = true;
  showMoreCertificates = true;
  isCustodianOrgUser = true; // set to true to avoid showing icon before api return value
  showMoreRolesLimit = this.configService.appConfig.PROFILE.defaultShowMoreLimit;
  courseLimit = this.configService.appConfig.PROFILE.defaultViewMoreLimit;
  otherCertificateLimit = this.configService.appConfig.PROFILE.defaultViewMoreLimit;
  showEdit = false;
  userSubscription: Subscription;
  orgDetails: any = [];
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
  submitTeacherDetailsInteractEdata: IInteractEventEdata;
  updateTeacherDetailsInteractEdata: IInteractEventEdata;
  showRecoveryId = false;
  otherCertificates: Array<object>;
  otherCertificatesCounts: number;
  downloadOthersCertificateEData: IInteractEventEdata;
  udiseObj: { idType: string, provider: string, id: string };
  phoneObj: { idType: string, provider: string, id: string };
  emailObj: { idType: string, provider: string, id: string };
  teacherObj: { idType: string, provider: string, id: string };
  stateObj;
  districtObj;
  externalIds: {};
  schoolObj: { idType: string, provider: string, id: string };
  instance: string;
  layoutConfiguration: any;
  public unsubscribe$ = new Subject<void>();
  nonCustodianUserLocation : object = {};
  declarationDetails;
  tenantInfo;
  selfDeclaredInfo = [];
  selfDeclaredErrorTypes = [];
  scrollToId;

  constructor(@Inject('CS_COURSE_SERVICE') private courseCService: CsCourseService, private cacheService: CacheService, 
  public resourceService: ResourceService, public coursesService: CoursesService,
    public toasterService: ToasterService, public profileService: ProfileService, public userService: UserService,
    public configService: ConfigService, public router: Router, public utilService: UtilService, public searchService: SearchService,
    private playerService: PlayerService, private activatedRoute: ActivatedRoute, public orgDetailsService: OrgDetailsService,
    public navigationhelperService: NavigationHelperService, public certRegService: CertRegService,
    private telemetryService: TelemetryService, public layoutService: LayoutService,
    private certDownloadAsPdf: CertificateDownloadAsPdfService) {
    this.getNavParams();
  }

  getNavParams() {
    this.scrollToId = _.get(this.router.getCurrentNavigation(), 'extras.state.scrollToId');
  }

  ngOnInit() {
    this.initLayout();
    this.instance = _.upperFirst(_.toLower(this.resourceService.instance || 'SUNBIRD'));
    this.getCustodianOrgUser();
    this.userSubscription = this.userService.userData$.subscribe((user: IUserData) => {
      /* istanbul ignore else */
      if (user.userProfile) {
        this.userProfile = user.userProfile;
        this.state = _.get(_.find(this.userProfile.userLocations, { type: 'state' }), 'name');
        this.district = _.get(_.find(this.userProfile.userLocations, { type: 'district' }), 'name');
        this.userFrameWork = this.userProfile.framework ? _.cloneDeep(this.userProfile.framework) : {};
        this.getOrgDetails();
        this.getContribution();
        this.getOtherCertificates(_.get(this.userProfile, 'userId'), 'all');
        this.getTrainingAttended();
        this.setNonCustodianUserLocation();
        /* istanbul ignore else */
        if (_.get(this.userProfile, 'declarations') && this.userProfile.declarations.length > 0) {
          this.declarationDetails = _.get(this.userProfile, 'declarations')[0];
          if (this.declarationDetails.errorType) {
            this.selfDeclaredErrorTypes = this.declarationDetails.errorType.split(',');
          }
          this.getSelfDeclaredDetails();
        }
      }
    });
    this.setInteractEventData();
  }

  initLayout() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.layoutService.switchableLayout().pipe(takeUntil(this.unsubscribe$)).subscribe(layoutConfig => {
      /* istanbul ignore else */
      if (layoutConfig != null) {
        this.layoutConfiguration = layoutConfig.layout;
      }
    });
  }

  setNonCustodianUserLocation() {
    const subOrgs = _.filter(this.userProfile.organisations, (org) => {
      /*istanbul ignore else */
      if (this.userProfile.rootOrgId !== org.organisationId) {
        return org;
      }
    });
    /*istanbul ignore else */
    if (!_.isEmpty(subOrgs)) {
      const sortedSubOrgs = _.reverse(_.sortBy(subOrgs, 'orgjoindate'));
      /*istanbul ignore else */
      if (!_.isEmpty(sortedSubOrgs[0]) && !_.isEmpty(sortedSubOrgs[0].locations)) {
        _.forEach(sortedSubOrgs[0].locations, (location) => {
          this.nonCustodianUserLocation[location.type] = location.name;
        });
      }
    }
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
        if (org.orgjoindate) {
          org.modifiedJoinDate = new Date(org.orgjoindate).getTime();
        }
        orgList.push(org);
      } else {
        if (org.locations && org.locations.length !== 0) {
          if (org.orgjoindate) {
            org.modifiedJoinDate = new Date(org.orgjoindate).getTime();
          }
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
    this.roles = _.uniq(this.roles).sort();
    orgList = _.sortBy(orgList, ['modifiedJoinDate']);
    this.orgDetails = _.last(orgList);
  }

  convertToString(value) {
    return _.isArray(value) ? _.join(value, ', ') : undefined;
  }

  getLocationDetails(locations, type) {
    const location: any = _.find(locations, { type: type });
    return location ? location.name : false;
  }

  getContribution(): void {
    const { constantData, metaData, dynamicFields } = this.configService.appConfig.Course.otherCourse;
      const searchParams = {
        status: ['Live'],
        contentType: this.configService.appConfig.WORKSPACE.contentType,
        params: { lastUpdatedOn: 'desc' }
      };
      const inputParams = { params: this.configService.appConfig.PROFILE.contentApiQueryParams };
      this.searchService.searchContentByUserId(searchParams, inputParams).subscribe((data: ServerResponse) => {
        this.contributions = this.utilService.getDataForCard(data.result.content, constantData, dynamicFields, metaData);
        this.totalContributions = _.get(data, 'result.count') || 0;
      });
  }

  getTrainingAttended() {
    this.coursesService.enrolledCourseData$.pipe().subscribe(data => {
      this.attendedTraining = _.reverse(_.sortBy(data.enrolledCourses, val => {
        return _.isNumber(_.get(val, 'completedOn')) ? _.get(val, 'completedOn') : Date.parse(val.completedOn);
      })) || [];
    });
  }

/**
 * @param userId
 *It will fetch certificates of user, other than courses
 */
  getOtherCertificates(userId, certType) {
    const requestParam = { userId,  certType };
    if (this.otherCertificatesCounts) {
      requestParam['limit'] = this.otherCertificatesCounts;
    }
    this.certRegService.fetchCertificates(requestParam).subscribe((data) => {
      this.otherCertificatesCounts = _.get(data, 'result.response.count');
      this.otherCertificates = _.map(_.get(data, 'result.response.content'), val => {
        const certObj: any =  {
          certificates: [{
            url: _.get(val, '_source.pdfUrl')
          }],
          issuingAuthority: _.get(val, '_source.data.badge.issuer.name'),
          issuedOn: _.get(val, '_source.data.issuedOn'),
          courseName: _.get(val, '_source.data.badge.name'),
        };
        if (_.get(val, '_id') && _.get(val, '_source.data.badge.name')) {
          certObj.issuedCertificates = [{identifier: _.get(val, '_id'), name: _.get(val, '_source.data.badge.name') }];
        }
        return certObj;
      });
      if (this.otherCertificates && this.otherCertificates.length && this.scrollToId) {
        this.triggerAutoScroll();
      }
    });
  }

  downloadCert(course) {
    // Check for V2
    if (_.get(course, 'issuedCertificates.length')) {
      this.toasterService.success(_.get(this.resourceService, 'messages.smsg.certificateGettingDownloaded'));
      const certificateInfo = course.issuedCertificates[0];
      const courseName = course.courseName || _.get(course, 'issuedCertificates[0].name') || 'certificate';
      if (_.get(certificateInfo, 'identifier')) {
        this.courseCService.getSignedCourseCertificate(_.get(certificateInfo, 'identifier'))
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((resp) => {
          if (_.get(resp, 'printUri')) {
            this.certDownloadAsPdf.download(resp.printUri, null, courseName);
          } else if (_.get(course, 'certificates.length')) {
            this.downloadPdfCertificate(course.certificates[0]);
          } else {
            this.toasterService.error(this.resourceService.messages.emsg.m0076);
          }
        }, error => {
          this.downloadPdfCertificate(certificateInfo);
        });
      } else {
        this.downloadPdfCertificate(certificateInfo);
      }
    } else if (_.get(course, 'certificates.length')) { // For V1 - backward compatibility
      this.toasterService.success(_.get(this.resourceService, 'messages.smsg.certificateGettingDownloaded'));
      this.downloadPdfCertificate(course.certificates[0]);
    } else {
      this.toasterService.error(this.resourceService.messages.emsg.m0076);
    }
  }

  downloadPdfCertificate(value) {
    if (_.get(value, 'url')) {
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
    } else {
      this.toasterService.error(this.resourceService.messages.emsg.m0076);
    }
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
    this.submitTeacherDetailsInteractEdata = {
      id: 'add-teacher-details',
      type: 'click',
      pageid: 'profile-read'
    };
    this.updateTeacherDetailsInteractEdata = {
      id: 'edit-teacher-details',
      type: 'click',
      pageid: 'profile-read'
    };
  }

  navigate(url, formAction) {
    this.router.navigate([url], {queryParams: {formaction: formAction}});
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
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * @since - #SH-19
   * @param  {object} coursedata - data of the course which user will click from the courses section
   * @description - This method will redirect to the courses page which enrolled by the user
   */
  navigateToCourse(coursedata) {
    const courseId = _.get(coursedata, 'courseId');
    const interactData = {
      context: {
        env: _.get(this.activatedRoute.snapshot.data.telemetry, 'env'),
        cdata: [{
          type: 'batch',
          id: _.get(coursedata, 'batchId')
        }]
      },
      edata: {
        id: 'course-play',
        type: 'click',
        pageid: 'profile-read',
      },
      object: {
        id: courseId,
        type: _.get(coursedata, 'content.contentType'),
        ver: '1.0',
        rollup: {},
      }
    };
    this.telemetryService.interact(interactData);
    this.router.navigate([`learn/course/${courseId}`]);
  }

  toggleOtherCertific(showMore) {
    if (showMore) {
      if (this.otherCertificates.length !== this.otherCertificatesCounts) {
        this.getOtherCertificates(_.get(this.userProfile, 'userId'), 'all');
      }
      this.otherCertificateLimit = this.otherCertificatesCounts;
      this.showMoreCertificates = false;
    } else {
      this.otherCertificateLimit = this.configService.appConfig.PROFILE.defaultViewMoreLimit;
      this.showMoreCertificates = true;
    }
  }

  /**
   * @since - #SH-920
   * @description - This method will map self declared values with teacher details dynamic fields to display on profile page
   */
  getSelfDeclaredDetails() {
    this.selfDeclaredInfo = [];
    this.profileService.getPersonaTenantForm().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      const tenantConfig: any = res.find(config => config.code === 'tenant');
      this.tenantInfo = _.get(tenantConfig, 'templateOptions.options').find(tenant => tenant.value === this.declarationDetails.orgId);

      this.profileService.getSelfDeclarationForm(this.declarationDetails.orgId).pipe(takeUntil(this.unsubscribe$)).subscribe(formConfig => {
        const externalIdConfig = formConfig.find(config => config.code === 'externalIds');
        (externalIdConfig.children as FieldConfig<any>[]).forEach(config => {
          if (this.declarationDetails.info[config.code]) {
            this.selfDeclaredInfo.push({ label: config.fieldName, value: this.declarationDetails.info[config.code], code: config.code });
          }
        });
      });
    });
  }

  copyToClipboard(userName) {
    const textElement = document.createElement('textarea');
    textElement.style.position = 'fixed';
    textElement.value = userName;
    document.body.appendChild(textElement);
    textElement.select();
    document.execCommand('copy');
    document.body.removeChild(textElement);
    this.toasterService.success((this.resourceService.messages.profile.smsg.m0041).replace('{instance}', this.instance));
  }

  triggerAutoScroll() {
    setTimeout(() => {
      const element = document.getElementById(this.scrollToId);
      if (!element) { return; }
      var elementPosition = element.getBoundingClientRect().top;
      var offsetPosition = elementPosition - 144;

      window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
      });
    });
  }

}
