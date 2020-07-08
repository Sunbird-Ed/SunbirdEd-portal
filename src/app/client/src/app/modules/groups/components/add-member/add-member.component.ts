import { takeUntil } from 'rxjs/operators';
import { UserService } from '@sunbird/core';
import { ResourceService, ToasterService, RecaptchaService } from '@sunbird/shared';
import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import * as _ from 'lodash-es';
import { IGroupMember } from '../../interfaces';
import { GroupsService } from '../../services';
import { Subject } from 'rxjs';
import { RecaptchaComponent } from 'ng-recaptcha';
import { TelemetryService } from '@sunbird/telemetry';
@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss']
})

export class AddMemberComponent implements OnInit {
  showModal = false;
  instance: string;
  membersList = [];
  groupData;
  showLoader = false;
  isVerifiedUser = false;
  memberId: string;
  config = { size: 'medium', isBold: true, isSelectable: false, view: 'horizontal' };
  isInvalidUser = false;
  verifiedMember: {};
  public unsubscribe$ = new Subject<void>();
  @Output() members = new EventEmitter<any>();
  @ViewChild('captchaRef') captchaRef: RecaptchaComponent;
  captchaResponse = '';
  googleCaptchaSiteKey: string;

  constructor(public resourceService: ResourceService, private groupsService: GroupsService,
    private userService: UserService, private toasterService: ToasterService, public recaptchaService: RecaptchaService,
    public telemetryService: TelemetryService) {
  }

  ngOnInit() {
    this.showModal = !localStorage.getItem('login_members_ftu');
    this.groupData = this.groupsService.groupData;
    this.instance = _.upperCase(this.resourceService.instance);
    try {
      this.googleCaptchaSiteKey = (<HTMLInputElement>document.getElementById('googleCaptchaSiteKey')).value;
    } catch (error) {
      this.googleCaptchaSiteKey = '';
    }
    this.membersList = this.groupsService.addFieldsToMember(_.get(this.groupData, 'members'));
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
      this.userService.getUserData(this.memberId).subscribe(member => {
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
      const member = [{ userId: this.memberId, role: 'member' }];
      this.groupsService.addMemberById(this.groupData.id, member).subscribe(response => {
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


  /**
   * @description This function will reset google recaptcha and execute method of recaptcha component
   */
  onVarifyMember() {
    this.captchaRef.reset();
    this.captchaRef.execute();
  }

   /**
   * @description reCaptcha component will triggered this method, which will verify recaptcha token and on success proceed with logical task
   */
  resolved(captchaResponse: string) {
    this.recaptchaService.validateRecaptcha(captchaResponse).subscribe((data: any) => {
        if (_.get(data, 'result.success')) {
          this.telemetryLogEvents('validate-recaptcha', true);
          this.verifyMember();
        }
      }, (error: any) => {
        const telemetryErrorData = {
          env: 'add-member', errorMessage: _.get(error, 'error.params.errmsg') || '',
          errorType: 'SYSTEM', pageid: 'add-member',
          stackTrace: JSON.stringify((error && error.error) || '')
        };
        this.telemetryService.generateErrorEvent(telemetryErrorData);
        this.captchaRef.reset();
      });
  }

  telemetryLogEvents(api: any, status: boolean) {
    let level = 'ERROR';
    let msg = api + ' failed';
    if (status) {
      level = 'SUCCESS';
      msg = api + ' success';
    }
    const event = {
      context: {
        env: 'add-member'
      },
      edata: {
        type: api,
        level: level,
        message: msg
      }
    };
    this.telemetryService.log(event);
  }

}

