import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { ResourceService, ToasterService, RecaptchaService } from '@sunbird/shared';
import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import * as _ from 'lodash-es';
import { IGroupMember, IGroupCard, IMember } from '../../interfaces';
import { GroupsService } from '../../services';
import { Subject } from 'rxjs';
import { IImpressionEventInput } from '@sunbird/telemetry';
import { RecaptchaComponent } from 'ng-recaptcha';
import { TelemetryService } from '@sunbird/telemetry';
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
  @ViewChild('captchaRef') captchaRef: RecaptchaComponent;
  captchaResponse = '';
  googleCaptchaSiteKey = '';
  isCaptchEnabled = false;

  constructor(public resourceService: ResourceService, private groupsService: GroupsService,
    private toasterService: ToasterService,
    private activatedRoute: ActivatedRoute,
    private groupService: GroupsService,
    private router: Router,
    private location: Location,
    public recaptchaService: RecaptchaService,
    public telemetryService: TelemetryService
    ) {
  }

  ngOnInit() {
    this.showModal = !localStorage.getItem('login_members_ftu');
    this.groupData = this.groupsService.groupData;
    this.instance = _.upperCase(this.resourceService.instance);
    this.membersList = this.groupsService.addFieldsToMember(_.get(this.groupData, 'members'));
    this.telemetryImpression = this.groupService.getImpressionObject(this.activatedRoute.snapshot, this.router.url);
    if (!this.groupData) {
      this.location.back();
    }
    this.groupService.getRecaptchaSettings().subscribe((res: any) => {
      if (res.result.response) {
        const captchaConfig = JSON.parse(_.get(res, 'result.response.value'));
        this.googleCaptchaSiteKey = captchaConfig.key || '';
        this.isCaptchEnabled = captchaConfig.isEnabled || false;
      }
    }, (err: any) => {
      this.toasterService.error(this.resourceService.frmelmnts.instn.t0056);
    });
  }

  reset() {
    this.showLoader = false;
    this.isInvalidUser = false;
    this.isVerifiedUser = false;
  }

  resetValue(memberId?) {
    this.addTelemetry('reset-userId', memberId);
    this.memberId = '';
    this.reset();
  }

  captchaResolved(captchaResponse: string) {
    this.captchaResponse = captchaResponse;
    this.verifyMember();
  }

  onVerifyMember() {
    if (this.isCaptchEnabled) {
      this.showLoader = true;
      this.captchaRef.execute();
    } else {
      this.verifyMember();
    }
  }

  verifyMember() {
    this.showLoader = true;
    if (!this.isExistingMember()) {
      this.groupsService.getUserData(this.memberId, this.captchaResponse).pipe(takeUntil(this.unsubscribe$)).subscribe(member => {
        if (member.exists) {
          this.verifiedMember = this.groupsService.addFields(member);
          this.showLoader = false;
          this.isVerifiedUser = true;
          this.captchaRef.reset();
        } else {
          this.showInvalidUser();
        }
      }, (err) => {
        this.showInvalidUser();
      });
    }
  }

  showInvalidUser () {
    this.isInvalidUser = true;
    this.showLoader = false;
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
      const member: IMember = {members: [{ userId: _.get(this.verifiedMember, 'id'), role: 'member' }]};
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

  addTelemetry (id, memberId?) {
    const cdata = memberId ? [{id: this.memberId, type: 'member'}] : [];
    this.groupService.addTelemetry(id, this.activatedRoute.snapshot, cdata);
  }


  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
