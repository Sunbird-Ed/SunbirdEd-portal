import { Component, OnInit, Input, ChangeDetectorRef, EventEmitter, Output, OnDestroy, ViewChild } from '@angular/core';
import { FrameworkService, FormService, UserService, ChannelService } from '@sunbird/core';
import { takeUntil, first, mergeMap, map } from 'rxjs/operators';
import { combineLatest, Subscription, Subject } from 'rxjs';
import {
  ConfigService, ResourceService, Framework, ToasterService, ServerResponse
} from '@sunbird/shared';
import * as _ from 'lodash';
@Component({
  selector: 'app-popup',
  templateUrl: './profile-framework-popup.component.html',
  styleUrls: ['./profile-framework-popup.component.scss']
})
export class ProfileFrameworkPopupComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal;
  @Input() showCloseIcon: boolean;
  @Input() isEdit: boolean;
  @Input() buttonLabel: string;
  @Input() formInput: any = {};
  @Output() submit = new EventEmitter<any>();
  @Output() close = new EventEmitter<any>();
  private frameworkDataSubscription: Subscription;
  private formType = 'user';
  public formFieldProperties: any;
  public channelData: any;
  public board: object = {};
  public medium: object = {};
  public gradeLevel: object = {};
  public subject: object = {};
  public categoryMasterList: any = {};
  private formAction = 'update';
  public selectedOption: any = {};
  public showButton = false;
  public unsubscribe = new Subject<void>();
  public frameWorkId: string;
  userSubscription: Subscription;
  public selectedData = [];
  public isCustodianOrg = false;
  constructor(public userService: UserService, public frameworkService: FrameworkService,
    public formService: FormService, public resourceService: ResourceService, private cdr: ChangeDetectorRef,
    public toasterService: ToasterService, public channelService: ChannelService) { }

  ngOnInit() {
    const defaultTenant = (<HTMLInputElement>document.getElementById('defaultTenant')).value;
    this.userSubscription = this.userService.userData$.subscribe(
      (user: any) => {
        if (user && !user.err) {
          if (user.userProfile.rootOrg.channel === defaultTenant) {
            this.isCustodianOrg = true;
            this.getChannel();
            if (this.channelData) {
              this.board['range'] = _.find(this.channelData, 'name');
              this.board['label'] = 'Board';
              this.board['code'] = 'board';
            }
          } else {
            this.frameworkService.initialize();
            this.frameworkDataSubscription = this.frameworkService.frameworkData$.subscribe((frameworkData: Framework) => {
              if (!frameworkData.err) {
                this.frameWorkId = frameworkData.frameworkdata['defaultFramework'].identifier;
                this.categoryMasterList = _.cloneDeep(frameworkData.frameworkdata['defaultFramework'].categories);
                this.getFormFields(frameworkData.frameworkdata['defaultFramework'].code);
              } else if (frameworkData && frameworkData.err) {
                this.toasterService.error(this.resourceService.messages.emsg.m0005);
              }
            });
          }
        } else if (user.err) {
          this.toasterService.error(this.resourceService.messages.emsg.m0005);
        }
      });
  }

  getFormConfig() {
    _.forEach(this.categoryMasterList, (category) => {
      _.forEach(this.formFieldProperties, (formFieldCategory) => {
        if (category.code === formFieldCategory.code && category.terms) {
          formFieldCategory.range = category.terms;
        }
        return formFieldCategory;
      });
    });
    this.formFieldProperties = _.sortBy(_.uniqBy(this.formFieldProperties, 'code'), 'index');
    this.board = _.find(this.formFieldProperties, { code: 'board' });
    if (this.isEdit) {
      this.medium = _.find(this.formFieldProperties, { code: 'medium' });
      this.gradeLevel = _.find(this.formFieldProperties, { code: 'gradeLevel' });
      this.subject = _.find(this.formFieldProperties, { code: 'subject' });
    }
    this.selectedOption = _.cloneDeep(this.formInput);
    this.selectedOption.board = _.get(this.selectedOption, 'board[0]') ? _.get(this.selectedOption, 'board[0]') : undefined;
    this.onChange();
  }

  onChange(event?: any, nextIndex?: any, code?: any) {
    if (this.selectedOption['board'] && this.selectedOption['medium'] && this.selectedOption['gradeLevel']) {
      if (this.selectedOption['board'].length > 0 && this.selectedOption['medium'].length > 0
        && this.selectedOption['gradeLevel'].length > 0) {
        this.showButton = true;
      } else {
        this.showButton = false;
      }
    }
    if (event) {
      this.getAssociations(event, nextIndex, code);
    }
  }

  getChannel() {
    this.channelService.getFrameWork(this.userService.hashTagId)
      .subscribe(data => {
        this.channelData = data.result.channel.frameworks;
      }, err => {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
      });
  }
  getFormFields(frameworkCode) {
    const formServiceInputParams = {
      formType: this.formType,
      formAction: this.formAction,
      contentType: 'framework',
      framework: frameworkCode
    };
    this.formService.getFormConfig(formServiceInputParams, this.userService.hashTagId).pipe(
      takeUntil(this.unsubscribe)).subscribe((data: ServerResponse) => {
        this.formFieldProperties = data;
        this.getFormConfig();
      }, (err: ServerResponse) => {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
      });
  }
  getAssociations(event, nextIndex, code) {
    if (this.isCustodianOrg) {
      const identifier = _.find(this.channelData, {'name': event});
      this.frameWorkId = identifier['identifier'];
      this.frameworkService.getFrameworkCategories(this.frameWorkId)
        .subscribe(data => {
          this.categoryMasterList = data.result.framework.categories;
          this.getFormFields(data.result.framework.code);
        }, err => {
          this.toasterService.error(this.resourceService.messages.emsg.m0005);
        });
    } else {
      this.getFormatedData(event, nextIndex, code);
    }
  }
  getFormatedData(event, nextIndex, code) {
    const rangeData = [];
    if (_.isString(event)) {
      this.selectedData = _.split(event);
    } else {
      this.selectedData = event;
    }
    const formData = _.find(this.formFieldProperties, { 'code': code });
    const nextFormData = _.find(this.formFieldProperties, { 'index': nextIndex });
    this[nextFormData['code']] = nextFormData;
    if (formData) {
      const range = _.get(formData, 'range');
      _.forEach(this.selectedData, (selectedValue, selectedIndex) => {
        const rangeValue = _.find(range, { 'name': selectedValue });
        _.forEach(_.get(rangeValue, 'associations'), (value, index) => {
          if (value.category === nextFormData['code']) {
            rangeData.push(value);
          }
        });
      });
      if (rangeData.length > 0) {
        this[nextFormData['code']['range']] = rangeData;
      }
    }
  }
  onSubmitForm() {
    this.selectedOption.board = [this.selectedOption.board];
    this.selectedOption['id'] = this.frameWorkId;
    this.submit.emit(this.selectedOption);
  }

  onClose(modal) {
    modal.deny();
    this.close.emit();
  }

  ngOnDestroy() {
    if (this.frameworkDataSubscription) {
      this.frameworkDataSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
