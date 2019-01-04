import { Component, OnInit, Input, ChangeDetectorRef, EventEmitter, Output, OnDestroy, ViewChild } from '@angular/core';
import { FrameworkService, FormService, UserService, ChannelService, OrgDetailsService } from '@sunbird/core';
import { takeUntil, first, mergeMap, map, tap , filter} from 'rxjs/operators';
import { combineLatest, Subscription, Subject, of, throwError } from 'rxjs';
import {
  ConfigService, ResourceService, Framework, ToasterService, ServerResponse
} from '@sunbird/shared';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import * as _ from 'lodash';
import { ThrowStmt } from '@angular/compiler';
import { CacheService } from 'ng2-cache-service';
import { Response } from './profile-framework-popup.component.spec.data';
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
  public label: object = {};
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
  public initDropDown = false;
  public CustodianOrgBoard: object = {};
  constructor(public router: Router, public userService: UserService, public frameworkService: FrameworkService,
    public formService: FormService, public resourceService: ResourceService, private cdr: ChangeDetectorRef,
    public toasterService: ToasterService, public channelService: ChannelService, public orgDetailsService: OrgDetailsService,
    private cacheService: CacheService, ) { }

  ngOnInit() {
    this.orgDetailsService.getCustodianOrg().pipe(
      mergeMap((custodianOrg: any) => {
        if (this.userService.userProfile.rootOrg.rootOrgId === custodianOrg.result.response.value) {
          this.isCustodianOrg = true;
          return this.setCustodianOrgData();
        } else {
          this.frameworkService.initialize();
          return this.setFrameWorkDetails();
        }
      }), first(), takeUntil(this.unsubscribe)).subscribe(data => {
        if (this.isCustodianOrg) {
          this.board = _.cloneDeep(this.CustodianOrgBoard);
          if (this.isEdit) {
            this.selectedOption = _.cloneDeep(this.formInput);
            this.selectedOption.board = _.get(this.selectedOption, 'board[0]') ? _.get(this.selectedOption, 'board[0]') : undefined;
            if (this.selectedOption.board) {
              this.getAssociations(this.selectedOption.board, 2, this.board['code']);
            }
            this.onChange();
          }
        }
        this.initDropDown = true;
      }, err => {
        this.navigateTolibrary();
      });
  }
  setCustodianOrgData() {
    return this.channelService.getFrameWork(this.userService.hashTagId).pipe(map((channelData: any) => {
      this.channelData = channelData.result.channel.frameworks;
      const board = [];
      _.forEach(this.channelData, (value, index) => {
        board.push(value);
      });
      this.CustodianOrgBoard['range'] = board;
      this.CustodianOrgBoard['label'] = 'Board';
      this.CustodianOrgBoard['code'] = 'board';
      this.label['medium'] = { 'label': 'Medium', 'index': 2 };
      this.label['class'] = { 'label': 'Class', 'index': 3 };
      this.label['subject'] = { 'label': 'Subject', 'index': 4 };
      return this.CustodianOrgBoard;
    }));
  }

  setFrameWorkDetails() {
    return this.frameworkService.frameworkData$.pipe(
      filter((frameworkDetails) => { // wait to get the framework name if passed as input
      if (!frameworkDetails.err) {
        const framework = this.frameWorkId ? this.frameWorkId : 'defaultFramework';
        const frameworkData = _.get(frameworkDetails.frameworkdata, framework);
        if (frameworkData) {
          return true;
        } else {
          return false;
        }
      }
      return true;
    }),
     mergeMap((frameworkDetails) => {
      if (!frameworkDetails.err) {
        const framework = this.frameWorkId ? this.frameWorkId : 'defaultFramework';
        this.frameWorkId = this.frameWorkId ? this.frameWorkId : frameworkDetails.frameworkdata['defaultFramework'].identifier;
        const frameworkData = _.get(frameworkDetails.frameworkdata, framework);
        this.categoryMasterList = _.cloneDeep(frameworkData.categories);
        return this.getFormDetails();
      } else if (frameworkDetails.err) {
        return throwError(frameworkDetails.err);
      }
    }), map((formData) => {
        this.formFieldProperties = formData;
        if (!this.isCustodianOrg) {
          this.getFormConfig();
        }
    }));
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
    this.label['medium'] =  _.find(this.formFieldProperties, { label: 'Medium' });
    this.label['class'] =  _.find(this.formFieldProperties, { label: 'Class' });
    this.label['subject'] =  _.find(this.formFieldProperties, { label: 'Subject' });
    if (this.isEdit) {
      this.medium = _.find(this.formFieldProperties, { code: 'medium' });
      this.gradeLevel = _.find(this.formFieldProperties, { code: 'gradeLevel' });
      this.subject = _.find(this.formFieldProperties, { code: 'subject' });
    }
    this.selectedOption = _.cloneDeep(this.formInput);
    this.selectedOption.board = _.get(this.selectedOption, 'board[0]') ? _.get(this.selectedOption, 'board[0]') : undefined;
    this.onChange();
  }
  getFormDetails() {
    const formServiceInputParams = {
      formType: this.formType,
      formAction: this.formAction,
      contentType: 'framework',
      framework: this.frameWorkId
    };
    return this.formService.getFormConfig(formServiceInputParams, this.userService.hashTagId);
  }

  onChange(event?: any, nextIndex?: any, code?: any) {
    if (event) {
      this.getAssociations(event, nextIndex, code);
      this.resetSelectedOption(nextIndex);
    }
    if (this.selectedOption['board'] && this.selectedOption['medium'] && this.selectedOption['gradeLevel']) {
      if (this.selectedOption['board'].length > 0 && this.selectedOption['medium'].length > 0
        && this.selectedOption['gradeLevel'].length > 0) {
        this.showButton = true;
      } else {
        this.showButton = false;
      }
    }
  }
  resetSelectedOption(nextIndex) {
    if (nextIndex === 2) {
      this.selectedOption['medium'] = [];
      this.selectedOption['gradeLevel'] = [];
      this.selectedOption['subject'] = [];
    } else if (nextIndex === 3) {
      this.selectedOption['gradeLevel'] = [];
      this.selectedOption['subject'] = [];
    } else {
      this.selectedOption['subject'] = [];
    }
  }
  getAssociations(event, nextIndex, code) {
    if (this.isCustodianOrg && nextIndex === 2) {
      const identifier = _.find(this.channelData, { 'name': event });
      if (identifier) {
        this.frameWorkId = identifier['identifier'];
      }
      this.frameworkService.initialize(this.frameWorkId);
      this.setFrameWorkDetails().pipe( first(), takeUntil(this.unsubscribe)).subscribe((data) => {
      this.getFormatedData(event, nextIndex, code);
      }, err => {
       this.navigateTolibrary();
      });
    } else {
      this.getFormatedData(event, nextIndex, code);
    }
  }
  getFormatedData(event, nextIndex, code) {
   _.forEach(this.categoryMasterList, (category) => {
      _.forEach(this.formFieldProperties, (formFieldCategory) => {
        if (category.code === formFieldCategory.code && category.terms) {
          formFieldCategory.range = category.terms;
        }
        return formFieldCategory;
      });
    });
    this.formFieldProperties = _.sortBy(_.uniqBy(this.formFieldProperties, 'code'), 'index');
    if (this.isCustodianOrg) {
      this.board = {... _.find(this.formFieldProperties, { code: 'board' }), ...this.CustodianOrgBoard};
    } else {
      this.board =  _.find(this.formFieldProperties, { code: 'board' });
    }
    if (code === 'board') {
      this.selectedOption['board'] = event;
    }
    const rangeData = [];
    if (_.isString(event)) {
      this.selectedData = _.split(event);
    } else {
      this.selectedData = event;
    }
    const formData = _.find(this.formFieldProperties, { 'code': code });
    const nextFormData = _.find(this.formFieldProperties, { 'index': nextIndex });
    if (nextFormData) {
      this[nextFormData['code']] = nextFormData;
    }
    if (formData) {
      const range = _.get(formData, 'range');
      _.forEach(this.selectedData, (selectedValue, selectedIndex) => {
        const rangeValue = _.find(range, { 'name': selectedValue });
        _.forEach(_.get(rangeValue, 'associations'), (value, index) => {
          if (value.category === nextFormData['code']) {
            const field = _.find(this[nextFormData['code']].range, { code: value.code });
            if (field) {
              rangeData.push(field);
            }
          }
        });
      });
      if (rangeData.length) {
        this[nextFormData['code']].range = _.uniqBy(rangeData, 'identifier');
      }
    }
    if (this.isEdit && this.isCustodianOrg) {
      this.gradeLevel = _.find(this.formFieldProperties, { code: 'gradeLevel' });
      this.subject = _.find(this.formFieldProperties, { code: 'subject' });
      this.isEdit = false;
    }
  }
  onSubmitForm() {
    const selectedOption = _.cloneDeep(this.selectedOption);
    selectedOption.board = [this.selectedOption.board];
    selectedOption['id'] = this.frameWorkId;
    this.submit.emit(selectedOption);
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
  navigateTolibrary() {
    this.toasterService.warning(this.resourceService.messages.emsg.m0012);
    if (this.modal) {
      this.modal.deny();
    }
    this.router.navigate(['/resources']);
    this.cacheService.set('showFrameWorkPopUp', 'installApp' );
  }
}
