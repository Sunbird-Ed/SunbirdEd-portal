import { CsModule } from '@project-sunbird/client-services';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import {ResourceService, ToasterService, RecaptchaService, LayoutService} from '@sunbird/shared';
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
  disableBtn = false;
  verifiedMember: IGroupMember;
  telemetryImpression: IImpressionEventInput;
  public unsubscribe$ = new Subject<void>();
  @Output() members = new EventEmitter<any>();
  @ViewChild('captchaRef', {static: false}) captchaRef: RecaptchaComponent;
  captchaResponse = '';
  googleCaptchaSiteKey = '';
  isCaptchEnabled = false;
  layoutConfiguration: any;

  constructor(public resourceService: ResourceService, private groupsService: GroupsService,
    private toasterService: ToasterService,
    private activatedRoute: ActivatedRoute,
    private groupService: GroupsService,
    private router: Router,
    private location: Location,
    public recaptchaService: RecaptchaService,
    public telemetryService: TelemetryService,
    public layoutService: LayoutService
    ) {
  }

  ngOnInit() {
    this.initLayout();
    this.showModal = !localStorage.getItem('login_members_ftu');
    this.groupData = this.groupsService.groupData;
    this.initRecaptcha();
    this.instance = _.upperCase(this.resourceService.instance);
    this.membersList = this.groupsService.addFieldsToMember(_.get(this.groupData, 'members'));
    this.telemetryImpression = this.groupService.getImpressionObject(this.activatedRoute.snapshot, this.router.url);
  }

  initLayout() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.layoutService.switchableLayout().pipe(takeUntil(this.unsubscribe$)).subscribe(layoutConfig => {
      if (layoutConfig != null) {
        this.layoutConfiguration = layoutConfig.layout;
      }
    });
  }

  initRecaptcha() {
    this.groupService.getRecaptchaSettings().subscribe((res: any) => {
      if (res.result.response) {
        try {
          const captchaConfig = _.get(res, 'result.response.value') ? JSON.parse(_.get(res, 'result.response.value')) : {};
          this.googleCaptchaSiteKey = captchaConfig.key || '';
          this.isCaptchEnabled = captchaConfig.isEnabled || false;
        } catch (e) {
          console.log(_.get(res, 'result.response'));
        }
      }
    });
  }

  reset() {
    this.showLoader = false;
    this.isInvalidUser = false;
    this.isVerifiedUser = false;
  }

  resetValue(memberId?) {
    this.setInteractData('reset-userId', {searchQuery: memberId});
    this.memberId = '';
    this.groupsService.emitShowLoader(false);
    this.reset();
  }

  captchaResolved(captchaResponse: string) {
    this.captchaResponse = captchaResponse;
    this.verifyMember();
  }

  onVerifyMember() {
    this.reset();
    if (this.isCaptchEnabled) {
      this.showLoader = true;
      this.captchaRef.execute();
    } else {
      this.verifyMember();
    }
  }

  verifyMember() {
    this.showLoader = true;
    this.memberId = this.memberId.replace(/\s+/g, '');
      this.groupsService.getUserData((this.memberId), {token: this.captchaResponse})
      .pipe(takeUntil(this.unsubscribe$)).subscribe(member => {
        this.verifiedMember = this.groupsService.addFields(member);
        if (member.exists) {
          this.showLoader = false;
          this.isVerifiedUser = !this.isExistingMember();
          this.captchaRef.reset();
        } else {
          this.showInvalidUser();
        }
      }, (err) => {
        this.showInvalidUser();
      });
  }

  showInvalidUser () {
    this.isInvalidUser = true;
    this.showLoader = false;
    this.captchaRef.reset();
  }

  isExistingMember() {
    const isExisting = _.find(this.membersList, { userId: _.get(this.verifiedMember, 'id') });
    if (isExisting) {
      this.resetValue();
      this.toasterService.error(this.resourceService.messages.emsg.m007);
      return true;
    }
    return false;
  }

  addMemberToGroup() {
    this.setInteractData('add-user-to-group', {}, {id: _.get(this.verifiedMember, 'id'),  type: 'Member'});
    this.groupsService.emitShowLoader(true);
    this.disableBtn = true;
    if (!this.isExistingMember()) {
      const member: IMember = {members: [{ userId: _.get(this.verifiedMember, 'id'), role: 'member' }]};
      const groupId = _.get(this.groupData, 'id') || _.get(this.activatedRoute.snapshot, 'params.groupId');
      this.groupsService.addMemberById(groupId, member).pipe(takeUntil(this.unsubscribe$)).subscribe(response => {
        this.getUpdatedGroupData();
        this.disableBtn = false;
        const value = _.isEmpty(response.error) ? this.toasterService.success((this.resourceService.messages.smsg.m004).replace('{memberName}',
          this.verifiedMember['title'])) : this.showErrorMsg(response);
          this.memberId = '';
          this.reset();
      }, err => {
        this.groupsService.emitShowLoader(false);
        this.disableBtn = false;
        this.memberId = '';
        this.reset();
        this.showErrorMsg();
      });
    }
  }

  showErrorMsg(response?) {

    if (_.get(response, 'error.members[0].errorCode') === 'EXCEEDED_MEMBER_MAX_LIMIT') {
      this.toasterService.error(this.resourceService.messages.groups.emsg.m002);
      this.setInteractData('exceeded-member-max-limit', {searchQuery: this.memberId,
        member_count: this.membersList.length});
    } else {
      this.toasterService.error((this.resourceService.messages.emsg.m006).replace('{name}', _.get(response, 'errors')
      || _.get(this.verifiedMember, 'title')));
    }
  }

  getUpdatedGroupData() {
    const groupId = _.get(this.groupData, 'id') || _.get(this.activatedRoute.snapshot, 'params.groupId');
    this.groupsService.getGroupById(groupId, true).pipe(takeUntil(this.unsubscribe$)).subscribe(groupData => {
      this.groupsService.groupData = groupData;
      this.groupData = groupData;
      this.membersList = this.groupsService.addFieldsToMember(_.get(groupData, 'members'));
      this.groupsService.emitMembers(this.membersList);
      this.groupsService.emitShowLoader(false);
    }, err => {
      this.groupsService.emitShowLoader(false);
      this.membersList.push(this.verifiedMember);
    });
  }

  toggleModal(visibility: boolean = false) {
    this.showModal = visibility;
  }

  setInteractData (id, extra?, Cdata?) {
    const interactData = {
      context: {
        env: _.get(this.activatedRoute, 'snapshot.data.telemetry.env'),
        cdata: [
          {
            id: _.get(this.groupData, 'id'),
            type: 'Group'
          }
        ]
      },
      edata: {
        id: id,
        type: 'CLICK',
        pageid:  _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid')
      },
      object: {}
    };

    if (extra) {
      interactData.edata['extra'] = extra;
    }
    if (Cdata) {
      interactData.context.cdata.push(Cdata);
    }

    this.telemetryService.interact(interactData);
  }


  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
