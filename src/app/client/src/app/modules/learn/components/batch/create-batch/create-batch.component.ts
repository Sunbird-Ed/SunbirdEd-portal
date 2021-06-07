import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { takeUntil, mergeMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterNavigationService, ResourceService, ToasterService, ServerResponse, NavigationHelperService } from '@sunbird/shared';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '@sunbird/core';
import { CourseConsumptionService, CourseBatchService } from './../../../services';
import { IImpressionEventInput, IInteractEventEdata, IInteractEventObject, TelemetryService } from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import dayjs from 'dayjs';
import { Subject, combineLatest } from 'rxjs';
import { LazzyLoadScriptService } from 'LazzyLoadScriptService';
import { ConfigService } from '@sunbird/shared';
import { CsModule } from '@project-sunbird/client-services';
import { CsLibInitializerService } from '../../../../../service/CsLibInitializer/cs-lib-initializer.service';
import { DiscussionService } from '../../../../../../app/modules/discussion/services/discussion/discussion.service';

@Component({
  selector: 'app-create-batch',
  templateUrl: './create-batch.component.html'
})
export class CreateBatchComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('createBatchModel', {static: false}) private createBatchModel;

  private userSearchTime: any;

  showCreateModal = false;

  disableSubmitBtn = true;

  private courseId: string;
  /**
  * courseCreator
  */
  courseCreator = false;
  /**
  * participantList for mentorList
  */
  participantList = [];

  public selectedParticipants: any = [];

  public selectedMentors: any = [];
  /**
  * batchData for form
  */
  batchData: any;
  /**
  * mentorList for mentors in the batch
  */
  mentorList: Array<any> = [];
  /**
   * form group for batchAddUserForm
  */
  createBatchForm: FormGroup;
  /**
  * To navigate to other pages
  */
  router: Router;
  /**
   * To send activatedRoute.snapshot to router navigation
   * service for redirection to update batch  component
  */
  private activatedRoute: ActivatedRoute;
  /**
  * Reference of UserService
  */
  private userService: UserService;
  /**
  * Reference of UserService
  */
  private courseBatchService: CourseBatchService;
  /**
  * To call resource service which helps to use language constant
  */
  public resourceService: ResourceService;
  /**
  * To show toaster(error, success etc) after any API calls
  */
  private toasterService: ToasterService;
  /**
	 * telemetryImpression object for create batch page
	*/
  telemetryImpression: IImpressionEventInput;

  public unsubscribe = new Subject<void>();

  public courseConsumptionService: CourseConsumptionService;

  pickerMinDate = new Date(new Date().setHours(0, 0, 0, 0));

  pickerMinDateForEndDate = new Date(this.pickerMinDate.getTime() + (24 * 60 * 60 * 1000));

  createBatchInteractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  clearButtonInteractEdata: IInteractEventEdata;
  telemetryCdata: Array<{}> = [];
  url = document.location.origin;
  instance: string;

  private discussionCsService: any;
  createForumRequest: any;
  showDiscussionForum: string;

  /**
	 * Constructor to create injected service(s) object
	 * @param {RouterNavigationService} routerNavigationService Reference of routerNavigationService
   * @param {Router} router Reference of Router
   * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
   * @param {UserService} UserService Reference of UserService
  */
  constructor(routerNavigationService: RouterNavigationService,
    activatedRoute: ActivatedRoute,
    route: Router,
    resourceService: ResourceService, userService: UserService,
    courseBatchService: CourseBatchService,
    toasterService: ToasterService,
    public configService: ConfigService,
    courseConsumptionService: CourseConsumptionService,
    public navigationhelperService: NavigationHelperService, private lazzyLoadScriptService: LazzyLoadScriptService,
    private telemetryService: TelemetryService,
    private csLibInitializerService: CsLibInitializerService,
    private discussionService: DiscussionService) {
    this.resourceService = resourceService;
    this.router = route;
    this.activatedRoute = activatedRoute;
    this.userService = userService;
    this.courseBatchService = courseBatchService;
    this.toasterService = toasterService;
    this.courseConsumptionService = courseConsumptionService;
    if (!CsModule.instance.isInitialised) {
      this.csLibInitializerService.initializeCs();
    }
    this.discussionCsService = CsModule.instance.discussionService;
  }

  /**
   * Initialize form fields and getuserlist
  */
  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);
    this.activatedRoute.parent.params.pipe(mergeMap((params) => {
      this.courseId = params.courseId;
      this.initializeFormFields();
      this.setTelemetryInteractData();
      this.fetchForumConfig();
      this.showCreateModal = true;
      return this.fetchBatchDetails();
    }),
      takeUntil(this.unsubscribe))
      .subscribe((data) => {
        this.showDiscussionForum = _.get(data.courseDetails, 'discussionForum.enabled');
        if (data.courseDetails.createdBy === this.userService.userid) {
          this.courseCreator = true;
        }
        const userList = this.sortUsers(data.userDetails);
        this.participantList = userList.participantList;
        this.mentorList = userList.mentorList;
        this.initDropDown();
      }, (err) => {
        if (err.error && err.error.params.errmsg) {
          this.toasterService.error(err.error.params.errmsg);
        } else {
          this.toasterService.error(this.resourceService.messages.fmsg.m0056);
        }
        this.redirect();
      });
  }

  private fetchBatchDetails() {
    const requestBody = {
      filters: {'status': '1'},
    };
    return combineLatest(
      this.courseBatchService.getUserList(requestBody),
      this.courseConsumptionService.getCourseHierarchy(this.courseId),
      (userDetails, courseDetails) => ({ userDetails, courseDetails })
    );
  }
  /**
  * It helps to initialize form fields and apply field level validation
  */
  private initializeFormFields(): void {
    this.createBatchForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      enrollmentType: new FormControl('open', [Validators.required]),
      startDate: new FormControl(null, [Validators.required]),
      endDate: new FormControl(),
      mentors: new FormControl(),
      users: new FormControl(),
      enrollmentEndDate: new FormControl(),
      issueCertificate: new FormControl(null, [Validators.required]),
      tncCheck: new FormControl(false, [Validators.requiredTrue]),
      enableDiscussions: new FormControl('false', [Validators.required])
    });
    this.createBatchForm.valueChanges.subscribe(val => {
      if (this.createBatchForm.status === 'VALID') {
        this.disableSubmitBtn = false;
      } else {
        this.disableSubmitBtn = true;
      }
    });
  }
  private sortUsers(res) {
    const participantList = [];
    const mentorList = [];
    if (res.result.response.content && res.result.response.content.length > 0) {
      _.forEach(res.result.response.content, (userData) => {
        if ( _.includes(this.selectedMentors , userData.identifier) ||
          _.includes(this.selectedParticipants , userData.identifier)) {
          return;
        }
        if (userData.identifier !== this.userService.userid) {
          const user = {
            id: userData.identifier,
            name: userData.firstName + (userData.lastName ? ' ' + userData.lastName : ''),
            avatar: userData.avatar,
            otherDetail: this.getUserOtherDetail(userData)
          };
          _.forEach(userData.organisations, (userOrgData) => {
            if (_.indexOf(userOrgData.roles, 'COURSE_MENTOR') !== -1) {
              mentorList.push(user);
            }
          });
          participantList.push(user);
        }
      });
    }
    return {
      participantList: _.uniqBy(participantList, 'id'),
      mentorList: _.uniqBy(mentorList, 'id')
    };
  }

  public createBatch() {
    this.disableSubmitBtn = true;
    let participants = [];
    let mentors = [];
    mentors = $('#mentors').dropdown('get value') ? $('#mentors').dropdown('get value').split(',') : [];
    if (this.createBatchForm.value.enrollmentType !== 'open') {
      participants = $('#participants').dropdown('get value') ? $('#participants').dropdown('get value').split(',') : [];
    }
    const startDate = dayjs(this.createBatchForm.value.startDate).format('YYYY-MM-DD');
    const endDate = this.createBatchForm.value.endDate && dayjs(this.createBatchForm.value.endDate).format('YYYY-MM-DD');
    const requestBody = {
      courseId: this.courseId,
      name: this.createBatchForm.value.name,
      description: this.createBatchForm.value.description,
      enrollmentType: this.createBatchForm.value.enrollmentType,
      startDate: startDate,
      endDate: endDate || null,
      createdBy: this.userService.userid,
      createdFor: this.userService.userProfile.organisationIds,
      mentors: _.compact(mentors),
      tandc : this.createBatchForm.value.tncCheck
    };
    if (this.createBatchForm.value.enrollmentType === 'open' && this.createBatchForm.value.enrollmentEndDate) {
      requestBody['enrollmentEndDate'] = dayjs(this.createBatchForm.value.enrollmentEndDate).format('YYYY-MM-DD');
    }
    this.courseBatchService.createBatch(requestBody).pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        if (participants && participants.length > 0) {
          this.addParticipantToBatch(response.result.batchId, participants);
        } else {
          // this.disableSubmitBtn = false; // - On success; the button will be still disabled to avoid multiple clicks
          this.toasterService.success(this.resourceService.messages.smsg.m0033);
          this.reload();
          this.checkIssueCertificate(response.result.batchId);
          this.checkEnableDiscussions(response.result.batchId);
        }
      },
        (err) => {
          this.disableSubmitBtn = false;
          if (err.error && err.error.params.errmsg) {
            this.toasterService.error(err.error.params.errmsg);
          } else {
            this.toasterService.error(this.resourceService.messages.fmsg.m0052);
          }
        });
  }
  private addParticipantToBatch(batchId, participants) {
    const userRequest = {
      userIds: _.compact(participants)
    };
    this.courseBatchService.addUsersToBatch(userRequest, batchId).pipe(takeUntil(this.unsubscribe))
      .subscribe((res) => {
        this.disableSubmitBtn = false;
        this.toasterService.success(this.resourceService.messages.smsg.m0033);
        this.reload();
        this.checkIssueCertificate(batchId);
      },
        (err) => {
          this.disableSubmitBtn = false;
          if (err.error && err.error.params.errmsg) {
            this.toasterService.error(err.error.params.errmsg);
          } else {
            this.toasterService.error(this.resourceService.messages.fmsg.m0053);
          }
        });
  }
  public redirect() {
    this.createBatchModel.deny();
    this.router.navigate(['./'], { relativeTo: this.activatedRoute.parent });
  }
  private reload() {
    setTimeout(() => {
      this.courseBatchService.updateEvent.emit({ event: 'create' });
      this.router.navigate(['./'], { relativeTo: this.activatedRoute.parent });
    }, 1000);
  }

  checkIssueCertificate(batchId) {
    this.courseBatchService.updateEvent.emit({ event: 'issueCert', value: this.createBatchForm.value.issueCertificate,
    mode: 'create', batchId: batchId });
  }

  private getUserOtherDetail(userData) {
    if (userData.maskedEmail && userData.maskedPhone) {
      return ' (' + userData.maskedEmail + ', ' + userData.maskedPhone + ')';
    }
    if (userData.maskedEmail && !userData.maskedPhone) {
      return ' (' + userData.maskedEmail + ')';
    }
    if (!userData.maskedEmail && userData.maskedPhone) {
      return ' (' + userData.maskedPhone + ')';
    }
  }
  private initDropDown() {
    this.lazzyLoadScriptService.loadScript('semanticDropdown.js').subscribe(() => {
      $('#participants').dropdown({
        forceSelection: false,
        fullTextSearch: true,
        onAdd: () => {
        }
      });
      $('#mentors').dropdown({
        fullTextSearch: true,
        forceSelection: false,
        onAdd: () => {
        }
      });
      $('#participants input.search').on('keyup', (e) => {
        this.getUserListWithQuery($('#participants input.search').val(), 'participant');
      });
      $('#mentors input.search').on('keyup', (e) => {
        this.getUserListWithQuery($('#mentors input.search').val(), 'mentor');
      });
    });
  }
  private getUserListWithQuery(query, type) {
    if (this.userSearchTime) {
      clearTimeout(this.userSearchTime);
    }
    this.userSearchTime = setTimeout(() => {
      this.getUserList(query, type);
    }, 1000);
  }
  /**
  *  api call to get user list
  */
  private getUserList(query: string = '', type) {
    this.selectedParticipants = $('#participants').dropdown('get value') ? $('#participants').dropdown('get value').split(',') : [];
    this.selectedMentors = $('#mentors').dropdown('get value') ? $('#mentors').dropdown('get value').split(',') : [];
    const requestBody = {
      filters: {'status': '1'},
      query: query
    };
    this.courseBatchService.getUserList(requestBody).pipe(takeUntil(this.unsubscribe))
      .subscribe((res) => {
        const list = this.sortUsers(res);
        if (type === 'participant') {
          this.participantList = list.participantList;
        } else {
          this.mentorList = list.mentorList;
        }
      },
        (err) => {
          if (err.error && err.error.params.errmsg) {
            this.toasterService.error(err.error.params.errmsg);
          } else {
            this.toasterService.error(this.resourceService.messages.fmsg.m0056);
          }
        });
  }
  ngAfterViewInit () {
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env
        },
        edata: {
          type: this.activatedRoute.snapshot.data.telemetry.type,
          pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
          uri: this.router.url,
          duration: this.navigationhelperService.getPageLoadTime()
        }
      };
    });
  }

  setTelemetryInteractData() {
    this.createBatchInteractEdata = {
      id: 'create-batch',
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };
    this.clearButtonInteractEdata = {
      id: 'clear-button',
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };
    this.telemetryInteractObject = {
      id: this.courseId,
      type: this.activatedRoute.snapshot.data.telemetry.object.type,
      ver: this.activatedRoute.snapshot.data.telemetry.object.ver
    };
  }

  setTelemetryCData(cdata: []) {
    this.telemetryCdata = _.unionBy(this.telemetryCdata, cdata, 'id');
  }

  ngOnDestroy() {
    if (this.createBatchModel && this.createBatchModel.deny) {
      this.createBatchModel.deny();
    }
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  fetchForumConfig() {
    this.discussionService.fetchForumConfig('batch').subscribe((formData: any) => {
      this.createForumRequest = formData[0];
    }, error => {
      this.toasterService.error(this.resourceService.messages.emsg.m0005);
    });
  }

  checkEnableDiscussions(batchId) {
    if (this.createBatchForm.value.enableDiscussions === 'true') {
      this.enableDiscussionForum(batchId);
    } else {
      this.handleInputChange('enable-DF-no', {
        id: batchId,
        type: 'Batch'
      });
    }
  }

  enableDiscussionForum(batchId) {
    const fetchForumConfigReq = [{
      type: 'batch',
      identifier: batchId
    }];
    if (this.createForumRequest) {
      this.createForumRequest['category']['context'] =  fetchForumConfigReq;
      this.discussionService.createForum(this.createForumRequest).subscribe(resp => {
        this.handleInputChange('enable-DF-yes', {
          id: batchId,
          type: 'Batch'
        });
        this.toasterService.success(_.get(this.resourceService, 'messages.smsg.m0065'));
      }, error => {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
      });
    } else {
      this.toasterService.error(this.resourceService.messages.emsg.m0005);
    }
  }

  handleInputChange(inputId, cdata) {
    const telemetryData = {
      context: {
        env:  this.activatedRoute.snapshot.data.telemetry.env,
        cdata: [{
          id: this.courseId,
          type: 'Course'
        }]
      },
      edata: {
        id: inputId,
        type: 'click',
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid
      }
    };
    if (cdata){
      telemetryData.context.cdata.push(cdata);
    }
    this.telemetryService.interact(telemetryData);
  }
}
