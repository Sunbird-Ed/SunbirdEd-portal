import {ProfileService} from '../../services';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Inject } from '@angular/core';
import {
  CertRegService,
  CoursesService,
  OrgDetailsService,
  PlayerService,
  SearchService,
  UserService,
  FormService
} from '@sunbird/core';
import {
  ConfigService,
  IUserData, LayoutService,
  NavigationHelperService,
  ResourceService,
  ServerResponse,
  ToasterService,
  UtilService,
  ConnectionService
} from '@sunbird/shared';
import * as _ from 'lodash-es';
import {Subject, Subscription} from 'rxjs';
import {IImpressionEventInput, IInteractEventEdata, IInteractEventObject, TelemetryService} from '@sunbird/telemetry';
import {ActivatedRoute, Router} from '@angular/router';
import {CacheService} from 'ng2-cache-service';
import {takeUntil} from 'rxjs/operators';
import { CertificateDownloadAsPdfService } from 'sb-svg2pdf';
import { CsCourseService } from '@project-sunbird/client-services/services/course/interface';
import { FieldConfig, FieldConfigOption } from 'common-form-elements-web-v9';
import { CsCertificateService } from '@project-sunbird/client-services/services/certificate/interface';

@Component({
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
  providers: [CertificateDownloadAsPdfService]
})
export class ProfilePageComponent implements OnInit, OnDestroy, AfterViewInit {
  private static readonly SUPPORTED_PERSONA_LIST_FORM_REQUEST =
  { formType: 'config', formAction: 'get', contentType: 'userType', component: 'portal' };
  private static readonly DEFAULT_PERSONA_LOCATION_CONFIG_FORM_REQUEST =
  { formType: 'profileConfig_v2', contentType: 'default', formAction: 'get' };
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
  nonCustodianUserLocation: object = {};
  declarationDetails;
  tenantInfo;
  selfDeclaredInfo = [];
  selfDeclaredErrorTypes = [];
  scrollToId;
  isDesktopApp;
  userLocation: {};
  persona: {};
  subPersona: string[];
  isConnected = true;
  showFullScreenLoader = false;

  constructor(@Inject('CS_COURSE_SERVICE') private courseCService: CsCourseService, private cacheService: CacheService,
  public resourceService: ResourceService, public coursesService: CoursesService,
    public toasterService: ToasterService, public profileService: ProfileService, public userService: UserService,
    public configService: ConfigService, public router: Router, public utilService: UtilService, public searchService: SearchService,
    private playerService: PlayerService, private activatedRoute: ActivatedRoute, public orgDetailsService: OrgDetailsService,
    public navigationhelperService: NavigationHelperService, public certRegService: CertRegService,
    private telemetryService: TelemetryService, public layoutService: LayoutService, private formService: FormService,
    private certDownloadAsPdf: CertificateDownloadAsPdfService, private connectionService: ConnectionService,
    @Inject('CS_CERTIFICATE_SERVICE') private CsCertificateService: CsCertificateService) {
    this.getNavParams();
  }

  getNavParams() {
    this.scrollToId = _.get(this.router.getCurrentNavigation(), 'extras.state.scrollToId');
  }

  ngOnInit() {
    this.isDesktopApp = this.utilService.isDesktopApp;

    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['showEditUserDetailsPopup']) {
        this.showEditUserDetailsPopup = true;
      }
      });

    if (this.isDesktopApp) {
      this.connectionService.monitor()
      .pipe(takeUntil(this.unsubscribe$)).subscribe(isConnected => {
        this.isConnected = isConnected;
      });
    }
    this.initLayout();
    this.instance = _.upperFirst(_.toLower(this.resourceService.instance || 'SUNBIRD'));
    this.getCustodianOrgUser();
    this.userSubscription = this.userService.userData$.subscribe((user: IUserData) => {
      /* istanbul ignore else */
      this.showFullScreenLoader = false;
      if (user.userProfile) {
        this.userProfile = user.userProfile;
        const role: string = (!this.userProfile.profileUserType.type ||
          (this.userProfile.profileUserType.type && this.userProfile.profileUserType.type === 'OTHER')) ? '' : this.userProfile.profileUserType.type;
        this.userLocation = this.getUserLocation(this.userProfile);
        this.getPersonaConfig(role).then((val) => {
          this.persona = val;
        });
        this.getSubPersonaConfig(role.toLowerCase(), this.userLocation).then((val) => {
          this.subPersona = val;
        });
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
    });
    let userRoles;
    if (_.get(this.userProfile, 'roles') && !_.isEmpty(this.userProfile.roles)) {
      userRoles = _.map(this.userProfile.roles, 'role');
    }
    _.forEach(userRoles, (value, key) => {
      if (value !== 'PUBLIC') {
        const roleName = _.find(this.userProfile.roleList, { id: value });
        if (roleName) {
          this.roles.push(roleName['name']);
        }
      }
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
   * It will fetch certificates of user, other than courses
   * Learner passbook API
   */
  getOtherCertificates(userId, certType) {
    let requestBody = { userId: userId, schemaName: 'certificate' };
    this.CsCertificateService.fetchCertificates(requestBody, {
      apiPath: '/learner/certreg/v2',
      apiPathLegacy: '/certreg/v1',
      rcApiPath: '/learner/rc/${schemaName}/v1',
    }).subscribe((_res) => {
      console.log('Portal :: CSL response ', _res); // TODO: log!
      this.otherCertificates = _res;
    }, (error) => {
      // this.otherCertificates = [
      //   {
      //     "id": "83a570f4-667a-4fb6-9635-c8a0734c5979",
      //     "trainingName": "vk-2.8coursewithallcontents",
      //     "issuerName": "Gujarat Council of Educational Research and Training",
      //     "issuedOn": "2020-03-16T00:00:00Z",
      //     "courseId": "do_21297903501076889616",
      //     "pdfUrl": "https://preprod.ntp.net.in/certs/01269878797503692810_0129790433215119362/83a570f4-667a-4fb6-9635-c8a0734c5979.pdf",
      //     "type": "certificate_registry"
      //   },
      //   {
      //     "id": "72b144d0-46f5-4acd-b44f-5570802bee34",
      //     "trainingName": "Copy of Vjay1105",
      //     "issuerName": "Gujarat Council of Educational Research and Training",
      //     "issuedOn": "2020-06-19T00:00:00Z",
      //     "courseId": "do_2130460954138705921142",
      //     "pdfUrl": "https://preprod.ntp.net.in/certs/01269878797503692810_0130461337718456321/c6452360-b38a-11ea-adfd-8182610c1c44.pdf",
      //     "type": "certificate_registry"
      //   },
      //   {
      //     "id": "4c050c5f-951a-4702-98f9-0a187ef1725a",
      //     "trainingName": "Non TPD course 1 - 0813",
      //     "issuerName": "Gujarat Council of Educational Research and Training",
      //     "issuedOn": "2020-08-13T00:00:00Z",
      //     "courseId": "do_21308516619623628818804",
      //     "pdfUrl": "https://preprod.ntp.net.in/certs/01269878797503692810_01308517302126182481/08477b50-dd61-11ea-b6da-85ae3acb17e8.pdf",
      //     "type": "certificate_registry"
      //   },
      //   {
      //     "id": "48d962d1-2952-4c35-82d0-70e0f55265d6",
      //     "trainingName": "SHS 1 - 1207",
      //     "issuerName": "Gujarat Council of Educational Research and Training",
      //     "issuedOn": "2020-12-07T00:00:00Z",
      //     "courseId": "do_2131671646862786561724",
      //     "pdfUrl": null,
      //     "type": "certificate_registry"
      //   },
      //   {
      //     "id": "20024a4d-e13f-4da6-8c8a-78ab8c837ed8",
      //     "trainingName": "3.5 Trackable Book",
      //     "issuerName": "Gujarat Council of Educational Research and Training",
      //     "issuedOn": "2020-12-08T00:00:00Z",
      //     "courseId": "do_2131586259123404801208",
      //     "pdfUrl": null,
      //     "type": "certificate_registry"
      //   },
      //   {
      //     "id": "f2613b10-a52d-492b-bc91-eb6a9983cd6d",
      //     "trainingName": "SK-Course-Cert with description",
      //     "issuerName": "Gujarat Council of Educational Research and Training",
      //     "issuedOn": "2020-12-08T00:00:00Z",
      //     "courseId": "do_213167936904691712167",
      //     "pdfUrl": null,
      //     "type": "certificate_registry"
      //   },
      //   {
      //     "id": "42827bbc-3b42-4277-86cb-c2c952424fc8",
      //     "trainingName": "Certificate Check - May11",
      //     "issuerName": "Gujarat Council of Educational Research and Training",
      //     "issuedOn": "2021-05-12T00:00:00Z",
      //     "courseId": "do_2132769169312317441142",
      //     "pdfUrl": null,
      //     "type": "certificate_registry"
      //   },
      //   {
      //     "id": "a61452f4-c82a-4240-8fc7-85c3c717fc94",
      //     "trainingName": " R3.9.0 Course testing - 01",
      //     "issuerName": "Gujarat Council of Educational Research and Training",
      //     "issuedOn": "2021-05-07T00:00:00Z",
      //     "courseId": "do_213274221564076032141",
      //     "pdfUrl": null,
      //     "type": "certificate_registry"
      //   },
      //   {
      //     "id": "36d8a663-d9c8-43fe-8dfd-40a8e946ffc5",
      //     "trainingName": "Course_with_batch25",
      //     "issuerName": "Gujarat Council of Educational Research and Training",
      //     "issuedOn": "2021-03-30T00:00:00Z",
      //     "courseId": "do_213242183756898304154",
      //     "pdfUrl": null,
      //     "type": "certificate_registry"
      //   },
      //   {
      //     "id": "5d6d231b-1d7d-4153-86eb-ca08696aa448",
      //     "trainingName": "kiruba 4.0",
      //     "issuerName": "Gujarat Council of Educational Research and Training",
      //     "issuedOn": "2021-07-23T00:00:00Z",
      //     "courseId": "do_2133018188148080641956",
      //     "pdfUrl": null,
      //     "type": "certificate_registry"
      //   },
      //   {
      //     "id": "edd967aa-db7d-4f74-87a5-8e433c451fca",
      //     "trainingName": "Dummy testing course",
      //     "issuerName": "Gujarat Council of Educational Research and Training",
      //     "issuedOn": "2022-03-17T10:13:21.193Z",
      //     "courseId": "do_1133327",
      //     "type": "rc_certificate_registry"
      //   },
      //   {
      //     "id": "6095b9a3-c459-4b30-a24f-bd6e070f7ba5",
      //     "trainingName": "Course Name1",
      //     "issuerName": "Gujarat Council of Educational Research and Training",
      //     "issuedOn": "2022-03-17T10:12:56.972Z",
      //     "courseId": "do_1133",
      //     "type": "rc_certificate_registry"
      //   },
      //   {
      //     "id": "a772eba5-b26f-4405-aba1-f15ea33b64fa",
      //     "trainingName": "New testing course",
      //     "issuerName": "Gujarat Council of Educational Research and Training",
      //     "issuedOn": "2022-03-17T10:13:08.736Z",
      //     "courseId": "do_113332739606568960117",
      //     "type": "rc_certificate_registry"
      //   }
      // ]
      console.log('Portal :: CSL : Fetch certificate CSL API failed ', error);
    });
  }

  downloadCert(course) {
    if (this.isDesktopApp && !this.isConnected) {
      this.toasterService.error(this.resourceService.messages.desktop.emsg.cannotAccessCertificate);
      return;
    }
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

  downloadOldAndRCCert(courseObj) {
    let requestBody = {
      certificateId: courseObj.id,
      schemaName: 'certificate',
      type: courseObj.type,
    };
    this.CsCertificateService.getCerificateDownloadURI(requestBody, {
      apiPath: '/learner/certreg/v2',
      apiPathLegacy: '/certreg/v1',
      rcApiPath: '/learner/rc/${schemaName}/v1',
    })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        if (_.get(resp, 'printUri')) {
          this.certDownloadAsPdf.download(resp.printUri, null, courseObj.trainingName);
        } else {
          this.toasterService.error(this.resourceService.messages.emsg.m0076);
        }
        console.log('Portal :: CSL : Download certificate CSL API response ', resp);
      }, error => {
        console.log('Portal :: CSL : Download certificate CSL API failed ', error);
      });
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
      this.profileModal && this.profileModal.deny();
      // this.showEdit = false;
    }, err => {
      // this.showEdit = false;
      this.toasterService.warning(this.resourceService.messages.emsg.m0012);
      this.profileModal && this.profileModal.deny();
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

  goBack() {
    this.navigationhelperService.goBack();
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
    const batchId = _.get(coursedata, 'batchId');
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
    this.router.navigate([`learn/course/${courseId}/batch/${batchId}`]);
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
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition - 144;

      window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
      });
    });
  }

  private getUserLocation(profile: any) {
   const userLocation = {};
    if (profile && profile.userLocations && profile.userLocations.length) {
        profile.userLocations.forEach((d) => {
            userLocation[d.type] = d;
        });
    }
    return userLocation;
}

private async getPersonaConfig(persona: string) {
  const formFields = await this.formService.getFormConfig(ProfilePageComponent.SUPPORTED_PERSONA_LIST_FORM_REQUEST).toPromise();
  return formFields.find(config => config.code === persona);
}

private async getSubPersonaConfig(persona: string, userLocation: any): Promise<string[]> {
  if ((!this.userProfile.profileUserTypes || !this.userProfile.profileUserTypes.length) &&
  (!this.userProfile.profileUserType || !this.userProfile.profileUserType.subType)) {
      return undefined;
  }
  let formFields;
  try {
      const state = userLocation.state;
      formFields = await this.formService.getFormConfig({
        ...ProfilePageComponent.DEFAULT_PERSONA_LOCATION_CONFIG_FORM_REQUEST,
        ...(state ? {contentType: state.code} : {})
      }).toPromise();
  } catch (e) {
      formFields = await this.formService.getFormConfig(ProfilePageComponent.DEFAULT_PERSONA_LOCATION_CONFIG_FORM_REQUEST).toPromise();
  }

  const personaConfig = formFields.find(formField => formField.code === 'persona');
  const personaChildrenConfig: FieldConfig<any>[] = personaConfig['children'][persona];
  const subPersonaConfig = personaChildrenConfig.find(formField => formField.code === 'subPersona');
  if (!subPersonaConfig) {
      return undefined;
   }
  const subPersonaList = [];
  if (_.get(subPersonaConfig, 'templateOptions.multiple')) {
    if (this.userProfile.profileUserTypes && this.userProfile.profileUserTypes.length) {
      this.userProfile.profileUserTypes.forEach(ele => {
        if (_.get(ele, 'subType')) {
          subPersonaList.push(ele.subType);
        }
      });
    } else {
      subPersonaList.push(this.userProfile.profileUserType.subType);
    }
  } else {
    subPersonaList.push(this.userProfile.profileUserType.subType);
  }

   const subPersonaFieldConfigOption = [];
   subPersonaList.forEach((ele) => {
    subPersonaFieldConfigOption.push((subPersonaConfig.templateOptions.options as FieldConfigOption<any>[]).
    find(option => option.value === ele).label);
   });

  return subPersonaFieldConfigOption;
}

public onLocationModalClose(event) {
  this.showEditUserDetailsPopup = !this.showEditUserDetailsPopup;
  this.showFullScreenLoader = !event?.isSubmitted ? false : true;
  setTimeout(() => {
    if (this.showFullScreenLoader) {
      this.showFullScreenLoader = false;
      this.toasterService.error(this.resourceService.messages.emsg.m0005);
    }
  }, 5000);
}

}
