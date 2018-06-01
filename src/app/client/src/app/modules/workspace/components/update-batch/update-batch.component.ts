import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterNavigationService, ResourceService, ToasterService, ServerResponse } from '@sunbird/shared';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WorkSpaceService, BatchService } from '../../services';
import { SearchService, UserService } from '@sunbird/core';
import { IMenter, Ibatch } from './../../interfaces';
import { WorkSpace } from '../../classes/workspace';
import * as _ from 'lodash';
import { IInteractEventInput, IImpressionEventInput } from '@sunbird/telemetry';
@Component({
  selector: 'app-update-batch',
  templateUrl: './update-batch.component.html',
  styleUrls: ['./update-batch.component.css']
})
export class UpdateBatchComponent extends WorkSpace implements OnInit, OnDestroy {
  @ViewChild('updatemodal') updatemodal;
  /**
  * batchId
  */
  batchId: string;
  /**
  * coursecreatedby
  */
  coursecreatedby: string;
  /**
  * selectedUsers for mentorlist
  */
  selectedUsers = [];
  /**
  * selectedMentors for mentorlist
  */
  selectedMentors = [];
  /**
  * userList for mentorlist
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
    this.batchData = this.batchService.getBatchData();
    if (_.isEmpty(this.batchData)) {
      this.batchService.getBatchDetailsById({ batchId: this.batchId }).subscribe(
        (apiResponse: ServerResponse) => {
          if (apiResponse) {
            this.batchData = apiResponse.result.response;
            const selectedParticipants = this.getSelectedUser(this.batchData.participant);
            const users = _.concat(selectedParticipants, this.batchData.mentors);
            this.getUserList(undefined, users);
            this.initializeFormFields();
          } else {
            this.toasterService.error(this.resourceService.messages.fmsg.m0054);
          }
        },
        err => {
          this.toasterService.error(this.resourceService.messages.fmsg.m0054);
        });
    } else {
      const selectedParticipants = this.getSelectedUser(this.batchData.participant);
      const users = _.concat(selectedParticipants, this.batchData.mentors);
      this.getUserList(undefined, users);
      this.initializeFormFields();
    }
  }
  /**
  *  api call to get user list
  */
  getUserList(query?: string, users?: string[]) {
    const request = this.batchService.getRequestBodyForUserSearch(query, users);
    const userId = this.userService.userid;
    this.UserList(request.request).subscribe(
      (res: ServerResponse) => {
        if (res.result.response.count && res.result.response.content.length > 0) {
          _.forEach(res.result.response.content, (userData) => {
            if (userData.identifier !== userId) {
              if (this.batchService.filterUserSearchResult(userData, query)) {
                const user = {
                  id: userData.identifier,
                  name: userData.firstName + (userData.lastName ? ' ' + userData.lastName : ''),
                  avatar: userData.avatar,
                  otherDetail: this.batchService.getUserOtherDetail(userData)
                };
                _.forEach(userData.organisations, (userOrgData) => {
                  if (_.indexOf(userOrgData.roles, 'COURSE_MENTOR') !== -1) {
                    this.menterList.push(user);
                  }
                });
                this.userList.push(user);
              }
            }
          });
          this.userList = _.uniqBy(this.userList, 'id');
          this.menterList = _.uniqBy(this.menterList, 'id');
          this.showUpdateBatchModal();
        } else {

        }
      },
      (err: ServerResponse) => {
        this.toasterService.error(this.resourceService.messages.fmsg.m0056);
      }
    );
  }
  /**
  *  it helps to make a lsit of user and selected mentors,selected users
  */
  showUpdateBatchModal() {
    this.coursecreatedby = this.batchData.courseCreator;
    _.forEach(this.batchData.participant, (value, key) => {
      if (!_.isUndefined(_.find(this.userList, ['id', key]))) {
        this.selectedUsers.push(_.find(this.userList, ['id', key]));
        this.userList = _.reject(this.userList, ['id', key]);
        this.selectedUsers = _.uniqBy(this.selectedUsers, 'id');
      }
    });
    _.forEach(this.batchData.mentors, (mentorVal, key) => {
      if (!_.isUndefined(_.find(this.menterList, ['id', mentorVal]))) {
        this.selectedMentors.push(_.find(this.menterList, ['id', mentorVal]));
        this.menterList = _.reject(this.menterList, ['id', mentorVal]);
        this.selectedMentors = _.uniqBy(this.selectedMentors, 'id');
      }
    });
  }
  /**
  *  api call to update batch
  */
  updateBatchDetails(batchData, updatemodal) {
    if (this.batchAddUserForm.valid) {
      const requestParam = {
        name: this.batchAddUserForm.value.name,
        description: this.batchAddUserForm.value.description,
        enrollmentType: batchData.enrollmentType,
        startDate: batchData.startDate,
        endDate: batchData.endDate,
        createdFor: batchData.createdFor,
        id: batchData.id
      };

      if (batchData.enrollmentType !== 'open') {
        const selected = [];
        _.forEach(this.selectedMentors, (value) => {
          selected.push(value.id);
        });
        requestParam['mentors'] = _.concat(_.compact(this.batchAddUserForm.value.mentors), selected);
      }

      this.batchService.updateBatchDetails(requestParam).subscribe(
        (apiResponse: ServerResponse) => {
          if (apiResponse) {
            if (batchData.enrollmentType !== 'open') {
              const users = this.batchAddUserForm.value.users;
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
          this.toasterService.error(this.resourceService.messages.fmsg.m0055);
        });
    }
  }

  /**
  *  reset the Form
  */
  clearForm() {
    this.batchAddUserForm.reset();
  }
}
