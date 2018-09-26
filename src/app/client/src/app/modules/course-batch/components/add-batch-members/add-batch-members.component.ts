import { Component, OnInit, Input } from '@angular/core';
import { Subscription, Subject, combineLatest } from 'rxjs';
import { takeUntil, first, map } from 'rxjs/operators';
import { ResourceService, ServerResponse, ToasterService } from '@sunbird/shared';
import { UserService, SearchService } from '@sunbird/core';
import { CourseBatchService } from './../../services';
import * as _ from 'lodash';
import { ComponentFactoryResolver } from '@angular/core/src/render3';
@Component({
  selector: 'app-add-batch-members',
  templateUrl: './add-batch-members.component.html',
  styleUrls: ['./add-batch-members.component.css']
})
export class AddBatchMembersComponent implements OnInit {
  @Input() batchDetails: any;
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
   * userSearchTime
  */
  private userSearchTime: any;
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
  selectedItems: any = [];
  removeModalFlag = false;

  constructor(userService: UserService, searchService: SearchService,
    courseBatchService: CourseBatchService, toasterService: ToasterService,
    resourceService: ResourceService) {
    this.searchService = searchService;
    this.userService = userService;
    this.courseBatchService = courseBatchService;
    this.toasterService = toasterService;
    this.resourceService = resourceService;
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
            this.subOrganizations = data.result.response.content;
          }
        },
        (err: ServerResponse) => {
          this.toasterService.error(this.resourceService.messages.emsg.m0005);
        }
      );
  }

  public fetchMembersDetails(event) {
    const requestBody = {
      orgid: this.selectedOrg
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
              this.initDropDown();
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
    if (this.batchDetails.participant || (this.batchDetails.mentors && this.batchDetails.mentors.length > 0)) {
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
    return {
      participantList: _.uniqBy(participantList, 'id'),
      mentorList: _.uniqBy(mentorList, 'id')
    };
  }

  public selectMentor(mentor) {
    this.selectedMentorList.push(mentor);
    const mentorId = _.map(this.selectedUserList, 'id');
    if (mentorId.indexOf(mentor.id) !== 1) {
      mentor['role'] = 'mentor';
      mentor['orgname'] = this.rootOrgName;
      this.selectedUserList.push(mentor);
    }
    _.remove(this.mentorList, mentorList => mentorList.id === mentor.id);
  }

  public selectParticipants(participants) {
    this.selectedParticipantList.push(participants);
    const participantsId = _.map(this.selectedUserList, 'id');
    if (participantsId.indexOf(participants.id) !== 1) {
      participants['role'] = 'participant';
      participants['orgname'] = this.rootOrgName;
      this.selectedUserList.push(participants);
    }
    _.remove(this.participantList, participantList => participantList.id === participants.id);
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
  toggle(event: boolean, item: any , id: string) {
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
    _.forEach(selectedItemId, (id ) => {
      const index = this.selectedUserList.findIndex(i => i.id === id);
      if (index !== -1) {
        this.selectedUserList.splice(index, 1);
      }
    });

  }
  private initDropDown() {
    setTimeout(() => {
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
    }, 0);
  }
  private getUserListWithQuery(query, type) {
    if (this.userSearchTime) {
      clearTimeout(this.userSearchTime);
    }
    this.userSearchTime = setTimeout(() => {
      this.getUserList(query, type);
    }, 1000);
  }
}


