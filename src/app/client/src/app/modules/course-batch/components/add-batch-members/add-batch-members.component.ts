import { Component, OnInit, Input, ViewChild, HostListener, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Subject, combineLatest, of } from 'rxjs';
import { takeUntil, first, map, debounceTime, distinctUntilChanged, delay, flatMap } from 'rxjs/operators';
import { ResourceService, ServerResponse, ToasterService, FilterPipe } from '@sunbird/shared';
import { UserService, SearchService } from '@sunbird/core';
import { CourseBatchService } from './../../services';
import * as _ from 'lodash';
import { AngularMultiSelect } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
@Component({
  selector: 'app-add-batch-members',
  templateUrl: './add-batch-members.component.html',
  styleUrls: ['./add-batch-members.component.css'],
})
export class AddBatchMembersComponent implements OnInit {
  @ViewChild('mentorDropDown') mentorDropDown;
  @ViewChild('participantsDropDown') participantsDropDown;
  @ViewChild('subOrgDropDown') subOrgDropDown;
  @Input() batchDetails: any;
  @Output() deleteBatchDetails = new EventEmitter<any>();
  /**
   * To get logged-in user published course(s)
  */
  searchService: SearchService;
  /**
   * To get logged-in user profile
  */
  userService: UserService;
  /**
  * Reference of UserService
  */
  private courseBatchService: CourseBatchService;
  /**
  * To show toaster(error, success etc) after any API calls
  */
  private toasterService: ToasterService;
  /**
 * To call resource service which helps to use language constant
 */
  public resourceService: ResourceService;
  /**
   * Variable to gather and unsubscribe all observable subscriptions in this component.
   */
  public unsubscribe = new Subject<void>();
  /**
   *userDataSubscription
  */
  userDataSubscription: Subscription;
  /**
   * Organization list
  */
  organizations: Array<any> = [];
  /**
* To navigate to other pages
*/
  public router: Router;
  /**
  * sub Organization list
 */
  subOrganizations: Array<any> = [];

  /**
  * participantList for mentorList
  */
  participantList = [];
  /**
  * mentorList for mentors in the batch
  */
  mentorList: Array<any> = [];
  /**
   * selectedUserList
  */
  selectedUserList = [];
  /**
   * selectedMentorList
  */
  selectedMentorList = [];
  /**
   * selectedParticipantList
  */
  selectedParticipantList = [];
  /**
   * selectedRootOrg
  */
  public selectedRootOrg = [];
  /**
   * selectedOrg
  */
  public selectedOrg = [];
  /**
 rootOrgName
  *
 */
  public rootOrgName: string;
  /**
  selectedItems
  *
 */
  selectedItems: any = [];
  /**
  removeModalFlag
  *
  */
  removeModalFlag = false;
  /**
  subOrgRequired
  *
 */
  subOrgRequired = false;
  /**
  selectAllUserCheck
  *
  */
  selectAllUserCheck = false;
  /**
  to show the selected user check
  *
  */
  selectItemCheck = false;
  /**
  to show showRootOrg
  *
  */
  showRootOrg = false;

  /**
   * This variable stores the search input.
  */
  searchData: string;
  /**
   * This variable stores the searchText for members.
  */
  searchInputChanged: Subject<string> = new Subject<string>();
  /**
  * This variable stores the settings of  subOrgDropDownSettings.
 */
  subOrgDropDownSettings = {};
  /**
   * This variable stores the settings of  MentorsDropDownSettings.
  */
  mentorsDropDownSettings = {};
  /**
   * This variable stores the settings of  MentorsDropDownSettings.
  */
  participantsDropDownSettings = {};

  constructor(userService: UserService, searchService: SearchService,
    courseBatchService: CourseBatchService, toasterService: ToasterService,
    resourceService: ResourceService,
    activatedRoute: ActivatedRoute,
    route: Router) {
    this.searchService = searchService;
    this.userService = userService;
    this.courseBatchService = courseBatchService;
    this.toasterService = toasterService;
    this.resourceService = resourceService;
    this.router = route;
    this.subOrgDropDownSettings = {
      text: 'Select Sub-Organisation',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      badgeShowLimit: 1,
      labelKey: 'orgName',
    };
    this.mentorsDropDownSettings = {
      text: 'Select mentors',
      enableSearchFilter: true,
      labelKey: 'name',
      showCheckbox: false,
      selectAllText: '',
      unSelectAllText: '',
      badgeShowLimit: 1
    };
    this.participantsDropDownSettings = {
      text: 'Select participants',
      showCheckbox: false,
      enableSearchFilter: true,
      labelKey: 'name',
      selectAllText: '',
      unSelectAllText: '',
      badgeShowLimit: 1
    };
  }

  ngOnInit() {
    this.rootOrgName = this.userService.rootOrgName;
    this.userDataSubscription = this.userService.userData$.pipe(first()).subscribe(
      user => {
        if (user && user.userProfile.organisationIds && user.userProfile.organisationIds.length) {
          this.getSubOrgDetails([user.userProfile.rootOrgId]);
          this.fetchParticipantDetails();
        }
      },
      err => {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
      }
    );
  }
  private getSubOrgDetails(rootOrgId) {
    this.searchService.getSubOrganisationDetails({ rootOrgId: rootOrgId }).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (data: ServerResponse) => {
          if (data.result.response.content) {
            const subOrganization = [];
            if (data.result.response.content && data.result.response.content.length > 0) {
              this.subOrganizations = data.result.response.content;
            }
            const mentorOrg = this.userService.userProfile.roleOrgMap['COURSE_MENTOR'];
            if (mentorOrg && mentorOrg.includes(this.userService.rootOrgId)) {
              this.subOrganizations = _.remove(this.subOrganizations, (subOrg) => {
                return subOrg.id !== this.userService.rootOrgId;
              });
              const org = {
                id: this.userService.rootOrgId,
                itemName: this.rootOrgName
              };
              this.subOrganizations.push(org);
              this.showRootOrg = true;
            } else {
              this.showRootOrg = false;
            }
            if (this.subOrganizations.length === 1) {
              this.selectedOrg = _.map(this.subOrganizations, 'id');
              this.fetchMembersDetails(this.selectedOrg);
            }
          }
        },
        (err: ServerResponse) => {
          this.toasterService.error(this.resourceService.messages.emsg.m0005);
        }
      );
  }

  public fetchMembersDetails(event) {
    const orgId = _.map(this.selectedOrg, 'id');
    this.validateSubOrg();
    const requestBody = {
      orgid: orgId
    };
    if (this.selectedOrg.length > 0) {
      this.courseBatchService.getUserList(requestBody).pipe(
        takeUntil(this.unsubscribe))
        .subscribe(
          (data: ServerResponse) => {
            if (data.result.response.content) {
              const userList = this.sortUsers(data);
              this.participantList = userList.participantList;
              this.mentorList = userList.mentorList;
            }
          },
          (err) => {
            if (err.error && err.error.params.errmsg) {
              this.toasterService.error(err.error.params.errmsg);
            } else {
              this.toasterService.error(this.resourceService.messages.fmsg.m0056);
            }
          }
        );
    }
  }
  /**
  *  api call to get user list
  */
  private getUserList(query: string = '', type) {
    const requestBody = {
      filters: {},
      query: query
    };
    this.courseBatchService.getUserList(requestBody).pipe(
      takeUntil(this.unsubscribe))
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
  /**
  * fetch mentors and participant details
  */
  private fetchParticipantDetails() {
    if (this.batchDetails && this.batchDetails.participant ||
      (this.batchDetails && this.batchDetails.mentors && this.batchDetails.mentors.length > 0)) {
      const request = {
        filters: {
          identifier: _.union(_.keys(this.batchDetails.participant), this.batchDetails.mentors)
        }
      };
      this.courseBatchService.getUserList(request).pipe(takeUntil(this.unsubscribe))
        .subscribe((res) => {
          this.processParticipantDetails(res);
        }, (err) => {
          if (err.error && err.error.params.errmsg) {
            this.toasterService.error(err.error.params.errmsg);
          } else {
            this.toasterService.error(this.resourceService.messages.fmsg.m0056);
          }
          // this.redirect();
        });
    }
  }
  private processParticipantDetails(res) {
    const users = this.sortUsers(res);
    const participantList = users.participantList;
    const mentorList = users.mentorList;
    _.forEach(this.batchDetails.participant, (value, key) => {
      const user = _.find(participantList, ['id', key]);
      if (user) {
        user['role'] = 'participant';
        user['orgname'] = this.rootOrgName;
        this.selectedUserList.push(user);
      }
    });
    _.forEach(this.batchDetails.mentors, (value, key) => {
      const mentor = _.find(mentorList, ['id', value]);
      if (mentor) {
        mentor['role'] = 'mentor';
        mentor['orgname'] = this.rootOrgName;
        this.selectedUserList.push(mentor);
      }
    });
    this.selectedUserList = _.uniqBy(this.selectedUserList, 'id');
  }
  private sortUsers(res) {
    const participantList = [];
    const mentorList = [];
    if (res.result.response.content && res.result.response.content.length > 0) {
      _.forEach(res.result.response.content, (userData) => {
        if (userData.identifier !== this.userService.userid) {
          const user = {
            id: userData.id,
            name: userData.firstName + (userData.lastName ? ' ' + userData.lastName : ''),
            avatar: userData.avatar,
            email: userData.email,
            phone: userData.phone,
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
    // check for if route is update show the checkbox
    this.selectedUserCheck();
    return {
      participantList: _.uniqBy(participantList, 'id'),
      mentorList: _.uniqBy(mentorList, 'id')
    };
  }

  public selectMentor(mentor) {
    const mentorId = _.map(this.selectedUserList, 'id');
    if (mentorId.indexOf(mentor.id) !== 1) {
      mentor['role'] = 'mentor';
      mentor['orgname'] = this.rootOrgName;
      this.selectedUserList.push(mentor);
    }
    _.remove(this.mentorList, mentorList => mentorList.id === mentor.id);
    this.selectAllUserCheck = false;
  }
  public selectParticipants(participants) {
    const participantsId = _.map(this.selectedUserList, 'id');
    if (participantsId.indexOf(participants.id) !== 1) {
      participants['role'] = 'participant';
      participants['orgname'] = this.rootOrgName;
      this.selectedUserList.push(participants);
    }
    _.remove(this.participantList, participantList => participantList.id === participants.id);
    this.selectAllUserCheck = false;
  }
  public selectedUserCheck() {
    if (_.includes(this.router.url, 'update')) {
      this.selectItemCheck = true;
    } else {
      this.selectItemCheck = false;
    }
  }
  public deleteUser(user, index) {
    this.selectedUserList.splice(index, 1);
    const mentorId = _.map(this.mentorList, 'id');
    const participantsId = _.map(this.participantList, 'id');
    if (this.mentorList.length > 0 && mentorId.indexOf(user.id) !== 1) {
      this.mentorList.push(user);
    }
    if (this.participantList.length > 0 && participantsId.indexOf(user.id) !== 1) {
      this.participantList.push(user);
    }
    const selectedMentorId = _.map(this.selectedMentorList, 'id');
    _.forEach(selectedMentorId, (id) => {
      const mentorIndex = this.selectedMentorList.findIndex(i => i.id === id);
      if (mentorIndex !== -1) {
        this.selectedMentorList.splice(mentorIndex, 1);
      }
    });
    const selectedParticipantId = _.map(this.selectedParticipantList, 'id');
    _.forEach(selectedParticipantId, (id) => {
      const particcipantIndex = this.selectedParticipantList.findIndex(i => i.id === id);
      if (particcipantIndex !== -1) {
        this.selectedParticipantList.splice(particcipantIndex, 1);
      }
    });
    this.deleteBatchDetails.emit(user);
  }
  selectAll(event) {
    if (event) {
      _.forEach(this.selectedUserList, (key, value) => {
        this.selectedUserList[value].selected = true;
      });
      this.selectedItems = this.selectedUserList;
    } else {
      _.forEach(this.selectedUserList, (key, value) => {
        this.selectedUserList[value].selected = false;
      });
      this.selectedItems = [];
    }
  }
  toggle(event: boolean, item: any, id: string) {
    if (event) {
      this.selectedItems.push(item);
    } else {
      _.remove(this.selectedItems, (currentObject) => {
        return currentObject['id'] === id;
      });
    }
  }
  remove() {
    const selectedItemId = _.map(this.selectedItems, 'id');
    _.forEach(selectedItemId, (id) => {
      const index = this.selectedUserList.findIndex(i => i.id === id);
      if (index !== -1) {
        this.selectedUserList.splice(index, 1);
      }
    });
    this.deleteBatchDetails.emit(this.selectedItems);
    const selectedMentorId = _.map(this.selectedMentorList, 'id');
    _.forEach(selectedMentorId, (id) => {
      const mentorIndex = this.selectedMentorList.findIndex(i => i.id === id);
      if (mentorIndex !== -1) {
        this.selectedMentorList.splice(mentorIndex, 1);
      }
    });
    const selectedParticipantId = _.map(this.selectedParticipantList, 'id');
    _.forEach(selectedParticipantId, (id) => {
      const participantIndex = this.selectedParticipantList.findIndex(i => i.id === id);
      if (participantIndex !== -1) {
        this.selectedParticipantList.splice(participantIndex, 1);
      }
    });
    this.selectedItems = [];
  }
  OnParticipantsDeSelect(event) {
    const selectedUserListId = _.map(this.selectedUserList, 'id');
    _.forEach(selectedUserListId, (id) => {
      const participantIndex = this.selectedUserList.findIndex(i => i.id === event.id);
      if (participantIndex !== -1) {
        this.selectedUserList.splice(participantIndex, 1);
      }
    });
  }
  private getUserListWithQuery(query, type) {
    this.searchInputChanged.next(query.target.value);
    this.searchInputChanged.pipe(debounceTime(500),
      distinctUntilChanged(),
      flatMap(search => of(search).pipe(delay(500)))
    ).
      subscribe((search) => {
        this.getUserList(search, type);
      });
  }
  public validateSubOrg() {
    if (this.selectedOrg.length === 0) {
      this.subOrgRequired = true;
    } else {
      this.subOrgRequired = false;
    }
    return this.subOrgRequired;
  }

  public onMentorDropDownOpen() {
    this.validateSubOrg();
    if (this.subOrgRequired && this.mentorDropDown) {
      this.mentorDropDown.isActive = false;
    }
    this.participantsDropDown.isActive = false;
    this.subOrgDropDown.isActive = false;
  }
  public onParticipantDropDownOpen() {
    this.validateSubOrg();
    if (this.subOrgRequired && this.participantsDropDown) {
      this.participantsDropDown.isActive = false;
    }
    this.mentorDropDown.isActive = false;
    this.subOrgDropDown.isActive = false;
  }
  public onSubOrgDropDownOpen() {
    this.mentorDropDown.isActive = false;
    this.participantsDropDown.isActive = false;
  }
  public closeSubOrgDropdown() {
    this.subOrgDropDown.isActive = false;
  }
  public closeMentorDropdown() {
    this.mentorDropDown.isActive = false;
  }
  public closeParticipantsDropdown() {
    this.participantsDropDown.isActive = false;
  }
}
