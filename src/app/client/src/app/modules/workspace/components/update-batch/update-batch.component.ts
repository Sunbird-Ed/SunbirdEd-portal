import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterNavigationService, ResourceService, ToasterService, ServerResponse } from '@sunbird/shared';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WorkSpaceService, BatchService } from '../../services';
import { SearchService, UserService } from '@sunbird/core';
import { IMenter, Ibatch } from './../../interfaces';
import { WorkSpace } from '../../classes/workspace';
import * as _ from 'lodash';
import { IImpressionEventInput,  IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
@Component({
  selector: 'app-update-batch',
  templateUrl: './update-batch.component.html',
  styleUrls: ['./update-batch.component.css']
})
export class UpdateBatchComponent extends WorkSpace implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('updatemodal') updatemodal;
  /**
  * updatebatchIntractEdata
  */
  updatebatchIntractEdata: IInteractEventEdata;
  /**
  * telemetryInteractObject
  */
  telemetryInteractObject: IInteractEventObject;
  /**
  * batchId
  */
  batchId: string;
  showUpdateModal = false;
  disableSubmitBtn = false;


  /**
  * coursecreatedby
  */
  coursecreatedby: string;
  /**
  * selectedUsers for menterList
  */
  selectedUsers = [];
  /**
  * selectedMentors for menterList
  */
  selectedMentors = [];
  /**
  * userList for menterList
  */
  userList = [];

  /**
  * batchData for form
  */
  batchData: Ibatch;
  /**
  * menterList for mentors in the batch
  */
  menterList: Array<IMenter> = [];

  userSearchTime: any;

  /**
  * userId for checking the enrollment type.
  */
  userId: string;
  /**
   * form group for batchAddUserForm
  */
  batchAddUserForm: FormGroup;

  /**
  * To navigate to other pages
  */
  route: Router;

  /**
   * To send activatedRoute.snapshot to router navigation
   * service for redirection to update batch  component
  */
  private activatedRoute: ActivatedRoute;
  /**
  * Refrence of UserService
  */
  private userService: UserService;
  /**
  * Refrence of UserService
  */
  private batchService: BatchService;
  /**
    * Reference for WorkSpaceService
  */
  public workSpaceService: WorkSpaceService;
  /**
   * To navigate back to parent component
  */
  public routerNavigationService: RouterNavigationService;
  /**
  * To call resource service which helps to use language constant
  */
  public resourceService: ResourceService;
  /**
  * To show toaster(error, success etc) after any API calls
  */
  private toasterService: ToasterService;
  /**
	* telemetryImpression
	*/
  telemetryImpression: IImpressionEventInput;

  pickerMinDate = new Date(new Date().setHours(0, 0, 0, 0));
  pickerMinDateForEndDate = new Date(this.pickerMinDate.getTime() + (24 * 60 * 60 * 1000));
  /**
	 * Constructor to create injected service(s) object
	 * @param {RouterNavigationService} routerNavigationService Reference of routerNavigationService
   * @param {WorkSpaceService} WorkSpaceService Reference of WorkSpaceService
   * @param {Router} route Reference of Router
   * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
   * @param {UserService} UserService Reference of UserService
   * @param {SearchService} SearchService Reference of SearchService
  */
  constructor(routerNavigationService: RouterNavigationService,
    activatedRoute: ActivatedRoute,
    route: Router, workSpaceService: WorkSpaceService,
    resourceService: ResourceService, userService: UserService,
    public searchService: SearchService,
    batchService: BatchService,
    toasterService: ToasterService) {
    super(searchService, workSpaceService);
    this.routerNavigationService = routerNavigationService;
    this.workSpaceService = workSpaceService;
    this.resourceService = resourceService;
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.userService = userService;
    this.batchService = batchService;
    this.toasterService = toasterService;
  }

  /**
   * Initialize form fields and getuserlist
  */
  ngOnInit() {
    this.userId = this.userService.userid;
    this.activatedRoute.params.subscribe(params => {
      this.batchId = params.batchId;
    });
    this.getBatchDetails();
    this.getUserList();
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      object: {
        id: this.activatedRoute.snapshot.params.batchId,
        type: this.activatedRoute.snapshot.data.telemetry.object.type,
        ver: this.activatedRoute.snapshot.data.telemetry.object.ver
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.activatedRoute.snapshot.data.telemetry.uri + this.activatedRoute.snapshot.params.batchId
      }
    };
  }

  ngAfterViewInit() {
    setTimeout(() => {
      $('#users').dropdown({
        forceSelection: false,
        fullTextSearch: true,
        onAdd: () =>  {
        }
      });
      $('#mentors').dropdown({
        fullTextSearch: true,
        forceSelection: false,
        onAdd: () =>  {
        }
      });
      $('#users input.search').on('keyup', (e) =>  {
        this.getUserListWithQuery($('#users input.search').val(), 'userList');
      });
      $('#mentors input.search').on('keyup', (e) => {
        this.getUserListWithQuery($('#mentors input.search').val(), 'menterList');
      });
    }, 1000);
  }

  getUserListWithQuery(query, type) {
    if (this.userSearchTime) {
      clearTimeout(this.userSearchTime);
    }
    this.userSearchTime = setTimeout(() => {
      this.getUserList(query, type);
    }, 1000);
  }

  ngOnDestroy() {
    if (this.updatemodal && this.updatemodal.deny) {
      this.updatemodal.deny();
    }
  }
  /**
  * Used to redirect user to batchlist   page.
  *
  * Function gets executed when user click close icon of batchAddUserForm form
  */
  redirectTobatches(): void {
    this.route.navigate(['workspace/content/batches/1']);
  }

  /**
  * It helps to initialize form fields and apply field level validation
  */
  initializeFormFields(): void {
    const endDate = this.batchData.endDate ? new Date(this.batchData.endDate) : null;
    this.batchAddUserForm = new FormGroup({
      name: new FormControl(this.batchData.name, [Validators.required]),
      description: new FormControl(this.batchData.description),
      enrollmentType: new FormControl(this.batchData.enrollmentType, [Validators.required]),
      startDate: new FormControl(new Date(this.batchData.startDate), [Validators.required]),
      endDate: new FormControl(endDate),
      mentors: new FormControl(''),
      users: new FormControl(''),
    });
    this.batchAddUserForm.controls['enrollmentType'].disable();
    this.batchAddUserForm.valueChanges.subscribe(val => {
      this.enableButton();
    });
  }
  /**
  * It helps to initialize local array of users
  */
  getSelectedUser(participant) {
    const users = [];
    for (const key in participant) {
      if (participant[key]) {
        users.push(key);
      }
    }
    return users;
  }
  /**
  * api call to get batch by Id
  */
  getBatchDetails() {
    this.batchService.getBatchDetailsById({ batchId: this.batchId }).subscribe((apiResponse: ServerResponse) => {
      this.batchData = apiResponse.result.response;
      this.initializeFormFields();
      this.setInteractEventData(this.batchData);
      this.fetchParticipantsMentorsDetails();
    }, (err) => {
      if (err.error && err.error.params.errmsg) {
        this.toasterService.error(err.error.params.errmsg);
      } else {
        this.toasterService.error(this.resourceService.messages.fmsg.m0054);
      }
      this.redirect();
    });
  }

  fetchParticipantsMentorsDetails() {
    if (this.batchData.participant || ( this.batchData.mentors && this.batchData.mentors.length > 0)) {
      const request =  {
        filters: {
          identifier: _.union(_.keys(this.batchData.participant), this.batchData.mentors)
        }
      };
      this.batchService.getUserDetails(request).subscribe((res) => {
        // this.batchData.participantDetails = res.result.response.content;
        this.processParticipantsMentorsDetails(res);
        this.showUpdateModal = true;
      }, (err) => {
        if (err.error && err.error.params.errmsg) {
          this.toasterService.error(err.error.params.errmsg);
        } else {
          this.toasterService.error(this.resourceService.messages.fmsg.m0056);
        }
        this.redirect();
      });
    } else {
      this.showUpdateModal = true;
    }
  }

  processParticipantsMentorsDetails(res) {
    const users = this.formatUserList(res);
    const userList = users.userList;
    const menterList = users.menterList;
    _.forEach(this.batchData.participant, (value, key) => {
      if (!_.isUndefined(_.find(userList, ['id', key]))) {
        this.selectedUsers.push(_.find(userList, ['id', key]));
      }
    });
    this.selectedUsers = _.uniqBy(this.selectedUsers, 'id');
    _.forEach(this.batchData.mentors, (mentorVal, key) => {
      if (!_.isUndefined(_.find(menterList, ['id', mentorVal]))) {
        this.selectedMentors.push(_.find(menterList, ['id', mentorVal]));
      }
    });
    this.selectedMentors = _.uniqBy(this.selectedMentors, 'id');
  }

  /**
  *  api call to get user list
  */
  getUserList(query: string = '', type?) {
    const requestBody = {
      filters: {},
      query: query
    };
    this.batchService.getUserList(requestBody).subscribe((res) => {
      const list = this.formatUserList(res);
      if (type) {
        if (type === 'userList') {
          this.userList = list.userList;
        } else {
          this.menterList = list.menterList;
        }
        this[type] = list[type];
      } else {
        this.userList = list.userList;
        this.menterList = list.menterList;
      }
      // this.showUpdateBatchModal();
    },
    (err) => {
      if (err.error && err.error.params.errmsg) {
        this.toasterService.error(err.error.params.errmsg);
      } else {
        this.toasterService.error(this.resourceService.messages.fmsg.m0056);
      }
    });
  }

  formatUserList(res) {
    const userList = [];
    const menterList = [];
    if (res.result.response.content && res.result.response.content.length > 0) {
      _.forEach(res.result.response.content, (userData) => {
        if (userData.identifier !== this.userService.userid) {
          const user = {
            id: userData.identifier,
            name: userData.firstName + (userData.lastName ? ' ' + userData.lastName : ''),
            avatar: userData.avatar,
            otherDetail: this.batchService.getUserOtherDetail(userData)
          };
          _.forEach(userData.organisations, (userOrgData) => {
            if (_.indexOf(userOrgData.roles, 'COURSE_MENTOR') !== -1) {
              menterList.push(user);
            }
          });
          userList.push(user);
        }
      });
    }
    return {
      userList: _.uniqBy(userList, 'id'),
      menterList: _.uniqBy(menterList, 'id')
    };
  }

  /**
  *  api call to update batch
  */
  updateBatchDetails(batchData, updatemodal) {
    if (this.batchAddUserForm.valid && this.batchData.status !== 2) {
      let users = [];
      let mentors = [];
      if (this.batchData.enrollmentType !== 'open') {
        users = $('#users').dropdown('get value').split(',');
        mentors = $('#mentors').dropdown('get value').split(',');
      }
      const startDate = new Date(this.batchAddUserForm.value.startDate.setHours(23, 59, 59, 999));
      const endDate = this.batchAddUserForm.value.endDate ?
       new Date(this.batchAddUserForm.value.endDate.setHours(23, 59, 59, 999)) : null;
      const requestParam = {
        name: this.batchAddUserForm.value.name,
        description: this.batchAddUserForm.value.description,
        enrollmentType: batchData.enrollmentType,
        startDate: batchData.startDate,
        endDate: this.batchAddUserForm.value.endDate,
        createdFor: batchData.createdFor,
        id: batchData.id,
        mentors: _.compact(mentors)
      };

      if (batchData.enrollmentType !== 'open') {
        const selected = [];
        _.forEach(this.selectedMentors, (value) => {
          selected.push(value.id);
        });
        requestParam['mentors'] = _.concat(_.compact(requestParam['mentors']), selected);
      }
      this.disableSubmitBtn = true;
      this.batchService.updateBatchDetails(requestParam).subscribe(
        (apiResponse: ServerResponse) => {
          this.disableSubmitBtn = false;
          if (apiResponse) {
            this.toasterService.success(this.resourceService.messages.smsg.m0034);
            if (batchData.enrollmentType !== 'open') {
              if (users && users.length > 0) {
                const userRequest = {
                  userIds: users
                };
                this.batchService.addUsers(userRequest, batchData.id).subscribe(
                  (response: ServerResponse) => {
                    if (response) {
                      updatemodal.approve();
                      this.redirectTobatches();
                    } else {
                      this.toasterService.error(this.resourceService.messages.fmsg.m0053);
                    }
                  },
                  err => {
                    this.toasterService.error(this.resourceService.messages.fmsg.m0055);
                  });
              } else {
                updatemodal.approve();
                this.redirectTobatches();
              }
            }
          } else {
            this.toasterService.error(this.resourceService.messages.fmsg.m0055);
          }
        },
        err => {
          this.disableSubmitBtn = false;
          this.toasterService.error(this.resourceService.messages.fmsg.m0055);
        });
    }
  }

  redirect() {
    this.route.navigate(['./'], {relativeTo: this.activatedRoute.parent});
  }

  /**
  *  reset the Form
  */
  clearForm() {
    this.batchAddUserForm.reset();
  }

  enableButton() {
    const data = this.batchAddUserForm ? this.batchAddUserForm.value : '';
    if (this.batchAddUserForm.status === 'VALID' && (data.name && data.startDate)) {
      this.disableSubmitBtn = false;
    } else {
      this.disableSubmitBtn = true;
    }
  }


 /**
  *  setInteractEventData
  */
  setInteractEventData(batchData) {
    if ( batchData.status === 0) {
      this.updatebatchIntractEdata = {
        id: 'update-upcoming-batch',
        type: 'click',
        pageid: 'course-batch'
      };
      this.telemetryInteractObject = {
        id: batchData.id,
        type: 'batch',
        ver: '1.0'
      };
    } else if ( batchData.status === 1 ) {
      this.updatebatchIntractEdata = {
        id: 'update-ongoing-batch',
        type: 'click',
        pageid: 'course-batch'
      };
      this.telemetryInteractObject = {
        id: batchData.id,
        type: 'batch',
        ver: '1.0'
      };
    }
  }
}
