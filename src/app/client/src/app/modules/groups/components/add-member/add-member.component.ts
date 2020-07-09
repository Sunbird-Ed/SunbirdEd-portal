import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '@sunbird/core';
import { ResourceService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import * as _ from 'lodash-es';
import { IGroupMember, IGroupCard, IMember } from '../../interfaces';
import { GroupsService } from '../../services';
import { Subject } from 'rxjs';
import { IImpressionEventInput } from '@sunbird/telemetry';
@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss']
})
export class AddMemberComponent implements OnInit, OnDestroy {
  showModal = false;
  instance: string;
  membersList: IGroupMember[] ;
  groupData: IGroupCard;
  showLoader = false;
  isVerifiedUser = false;
  memberId: string;
  config = { size: 'medium', isBold: true, isSelectable: false, view: 'horizontal' };
  isInvalidUser = false;
  verifiedMember: IGroupMember;
  telemetryImpression: IImpressionEventInput;
  public unsubscribe$ = new Subject<void>();
  @Output() members = new EventEmitter<any>();

  constructor(public resourceService: ResourceService, private groupsService: GroupsService,
    private userService: UserService, private toasterService: ToasterService,
    private activatedRoute: ActivatedRoute,
    private groupService: GroupsService,
    private router: Router
    ) {
  }

  ngOnInit() {
    this.showModal = !localStorage.getItem('login_members_ftu');
    this.groupData = this.groupsService.groupData;
    this.instance = _.upperCase(this.resourceService.instance);
    this.membersList = this.groupsService.addFieldsToMember(_.get(this.groupData, 'members'));
    this.telemetryImpression = this.groupService.getImpressionObject(this.activatedRoute.snapshot, this.router.url);
  }

  reset() {
    this.showLoader = false;
    this.isInvalidUser = false;
    this.isVerifiedUser = false;
  }

  resetValue() {
    this.memberId = '';
    this.reset();
  }

  verifyMember() {
    this.showLoader = true;
    if (!this.isExistingMember()) {
      this.userService.getUserData(this.memberId).pipe(takeUntil(this.unsubscribe$)).subscribe(member => {
        const user = this.groupsService.addFields(_.get(member, 'result.response'));
        this.verifiedMember = _.pick(user, ['title', 'initial', 'identifier', 'isAdmin', 'isCreator']);
        this.showLoader = false;
        this.isVerifiedUser = true;
      }, err => {
        this.isInvalidUser = true;
        this.showLoader = false;
      });
    }
  }

  isExistingMember() {
    const isExisting = _.find(this.membersList, { userId: this.memberId });
    if (isExisting) {
      this.resetValue();
      this.toasterService.error(this.resourceService.messages.emsg.m007);
      return true;
    }
    return false;
  }

  addMemberToGroup() {
    if (!this.isExistingMember()) {
      const member: IMember = {members: [{ userId: this.memberId, role: 'member' }]};
      this.groupsService.addMemberById(this.groupData.id, member).pipe(takeUntil(this.unsubscribe$)).subscribe(response => {
        this.getUpdatedGroupData();
        const value = _.isEmpty(response.errors) ? this.toasterService.success((this.resourceService.messages.smsg.m004).replace('{memberName}',
          this.verifiedMember['title'])) : this.showErrorMsg(response);
      }, err => this.showErrorMsg());
    }
  }

  showErrorMsg(response?) {
    this.toasterService.error((this.resourceService.messages.emsg.m006).replace('{name}', _.get(response, 'errors') || this.verifiedMember['title']));
  }

  getUpdatedGroupData() {
    this.groupsService.getGroupById(this.groupData.id, true).pipe(takeUntil(this.unsubscribe$)).subscribe(groupData => {
      this.groupsService.groupData = groupData;
      this.groupData = groupData;
      this.membersList = this.groupsService.addFieldsToMember(_.get(groupData, 'members'));
      this.groupsService.emitMembers(this.membersList);
    }, err => {
      this.membersList.push(this.verifiedMember);
    });
  }

  toggleModal(visibility: boolean = false) {
    this.showModal = visibility;
  }

  addTelemetry (id) {
    this.groupService.addTelemetry(id, this.activatedRoute.snapshot);
  }


  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
