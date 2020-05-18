import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FrameworkService, UserService, ChannelService, OrgDetailsService } from '@sunbird/core';
import { first, mergeMap, map , filter, takeUntil } from 'rxjs/operators';
import { of, throwError, Subscription, Subject } from 'rxjs';
import { ResourceService, ToasterService, IUserProfile } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.scss']
})
export class GroupFormComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal;
  groupForm: FormGroup;
  public allowedFields = ['board', 'medium', 'gradeLevel', 'subject'];
  private _formFieldProperties: any;
  public formFieldOptions = [];
  private custOrgFrameworks: any;
  private categoryMasterList: any = {};
  public selectedOption: any = {};
  private unsubscribe: Subscription;
  private frameWorkId: string;
  private custodianOrg = false;
  private custodianOrgBoard: any = {};
  submitInteractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  public userProfile: IUserProfile;
  private editMode: boolean;
  public boardList: [];
  public mediumList: [];
  public gradesList: [];
  public subjectList: [];

  constructor(private userService: UserService, private frameworkService: FrameworkService,
    public resourceService: ResourceService, private toasterService: ToasterService, private channelService: ChannelService,
    private orgDetailsService: OrgDetailsService, private fb: FormBuilder) { }

  ngOnInit() {
    this.initializeForm();
  }
  private initializeForm() {
    this.userService.userData$.subscribe(userdata => {
      if (userdata && !userdata.err) {
        this.userProfile = userdata.userProfile;
      }
    });
    this.selectedOption = _.pickBy(_.cloneDeep(this.userProfile.framework), 'length') || {};
    this.groupForm = this.fb.group({
      groupName: ['', [ Validators.required ]],
      board: [_.get(this.selectedOption, 'board') || [], [ Validators.required ]],
      medium: [_.get(this.selectedOption, 'medium') || [], [ Validators.required ]],
      gradeLevel: [_.get(this.selectedOption, 'gradeLevel') || [], [ Validators.required ]],
      subject: [_.get(this.selectedOption, 'subject') || [], [ Validators.required ]],
    });
    this.editMode = _.some(this.selectedOption, 'length') || false ;
    this.unsubscribe = this.isCustodianOrgUser().pipe(
      mergeMap((custodianOrgUser: boolean) => {
        this.custodianOrg = custodianOrgUser;
        if (custodianOrgUser) {
          return this.getFormOptionsForCustodianOrg();
        } else {
          return this.getFormOptionsForOnboardedUser();
        }
      }), first()).subscribe(data => {
        this.formFieldOptions = data;
        this.boardList = _.get(_.find(data, { 'code': 'board' }), 'range') || [];
        this.mediumList = _.get(_.find(data, { 'code': 'medium' }), 'range') || [];
        this.gradesList = _.get(_.find(data, { 'code': 'gradeLevel' }), 'range') || [];
        this.subjectList = _.get(_.find(data, { 'code': 'subject' }), 'range') || [];
      }, err => {
        this.toasterService.warning(this.resourceService.messages.emsg.m0012);
      });
  }
  private isCustodianOrgUser() {
    return this.orgDetailsService.getCustodianOrg().pipe(map((custodianOrg) => {
      if (_.get(this.userService, 'userProfile.rootOrg.rootOrgId') === _.get(custodianOrg, 'result.response.value')) {
        return true;
      }
      return false;
    }));
  }
  private getFormOptionsForCustodianOrg() {
    return this.getCustodianOrgData().pipe(mergeMap((data) => {
      this.custodianOrgBoard = data;
      const boardObj = _.cloneDeep(this.custodianOrgBoard);
      boardObj.range = _.sortBy(boardObj.range, 'index');
      const board = boardObj;
      if (_.get(this.selectedOption, 'board[0]')) { // update mode, get 1st board framework and update all fields
        this.selectedOption.board = _.get(this.selectedOption, 'board[0]');
        this.frameWorkId = _.get(_.find(this.custOrgFrameworks, { 'name': this.selectedOption.board }), 'identifier');
        return this.getFormatedFilterDetails().pipe(map((formFieldProperties) => {
          this._formFieldProperties = formFieldProperties;
          this.mergeBoard(); // will merge board from custodian org and board from selected framework data
          return this.getUpdatedFilters(board, true);
        }));
      } else {
        return of([ board ]);
      }
    }));
  }
  private getFormOptionsForOnboardedUser() {
    return this.getFormatedFilterDetails().pipe(map((formFieldProperties) => {
      this._formFieldProperties = formFieldProperties;
      if (_.get(this.selectedOption, 'board[0]')) {
        this.selectedOption.board = _.get(this.selectedOption, 'board[0]');
      }
      return this.getUpdatedFilters({index: 0}, this.editMode); // get filters for first field i.e index 0 incase of init
    }));
  }
  private getFormatedFilterDetails() {
    this.frameworkService.initialize(this.frameWorkId);
    return this.frameworkService.frameworkData$.pipe(
      filter((frameworkDetails: any) => { // wait to get the framework name if passed as input
      if (!frameworkDetails.err) {
        const framework = this.frameWorkId ? this.frameWorkId : 'defaultFramework';
        if (!_.get(frameworkDetails.frameworkdata, framework)) {
          return false;
        }
      }
      return true;
    }),
    mergeMap((frameworkDetails: any) => {
      if (!frameworkDetails.err) {
        const framework = this.frameWorkId ? this.frameWorkId : 'defaultFramework';
        const frameworkData = _.get(frameworkDetails.frameworkdata, framework);
        this.frameWorkId = frameworkData.identifier;
        this.categoryMasterList = _.filter(frameworkData.categories, (category) => {
          return this.allowedFields.includes(_.get(category, 'code'));
        });
        return of(this.categoryMasterList);
      } else {
        return throwError(frameworkDetails.err);
      }
    }), map((formData: any) => {
      const formFieldProperties = _.filter(formData, (formFieldCategory) => {
        formFieldCategory.range = _.get(_.find(this.categoryMasterList, { code : formFieldCategory.code }), 'terms') || [];
        return true;
      });
      return _.sortBy(_.uniqBy(formFieldProperties, 'code'), 'index');
    }), first());
  }
  public handleFieldChange(event, code) {
    const field  = _.find(this.formFieldOptions, {'code': code});
    if (field) {
      if (!this.custodianOrg || field.index !== 1) { // no need to fetch data, just rearrange fields
        this.formFieldOptions = this.getUpdatedFilters(field);
        return;
      }
      this.frameWorkId = _.get(_.find(field.range, { name: event}), 'identifier');
      if (this.unsubscribe) { // cancel if any previous api call in progress
        this.unsubscribe.unsubscribe();
      }
      this.unsubscribe = this.getFormatedFilterDetails().pipe().subscribe(
        (formFieldProperties) => {
          if (formFieldProperties.length) {
            this._formFieldProperties = formFieldProperties;
            this.mergeBoard();
            this.formFieldOptions = this.getUpdatedFilters(field);
          }
        }, (error) => {
          this.toasterService.warning(this.resourceService.messages.emsg.m0012);
        });
    }
  }
  private mergeBoard() {
    _.forEach(this._formFieldProperties, (field) => {
      if (field.code === 'board') {
        field.range = _.unionBy(_.concat(field.range, this.custodianOrgBoard.range), 'name');
      }
    });
  }
  private getUpdatedFilters(field, editMode = false) {
    const targetIndex = field.index + 1; // only update next field if not editMode
    const formFields = _.reduce(this.formFieldProperties, (accumulator, current) => {
      if (current.index === targetIndex || editMode) {
        const parentField: any = _.find(this.formFieldProperties, { index: current.index - 1 }) || {};
        const parentAssociations = _.reduce(parentField.range, (collector, term) => {
          const selectedFields = this.groupForm.value[parentField.code] || [];
          if (selectedFields.length && (selectedFields.includes(term.name) || selectedFields.includes(term.code))) {
            const selectedAssociations = _.filter(term.associations, { category: current.code }) || [];
            collector = _.concat(collector, selectedAssociations);
          }
          return collector;
        }, []);
        const updatedRange = _.filter(current.range, range => _.find(parentAssociations, {code: range.code}));
        current.range = updatedRange.length ? updatedRange : current.range;
        current.range = _.unionBy(current.range, 'identifier');
        if (!editMode) {
          this.groupForm.controls[current.code].patchValue([]);
        }
        accumulator.push(current);
      } else {
        if (current.index <= field.index) { // retain options for already selected fields
          const updateField = current.code === 'board' ? current : _.find(this.formFieldOptions, { index: current.index});
          accumulator.push(updateField);
        } else { // empty filters and selection
          current.range = [];
          this.groupForm.controls[current.code].patchValue([]);
          accumulator.push(current);
        }
      }
      return accumulator;
    }, []);
    this.boardList = _.get(_.find(formFields, { 'code': 'board' }), 'range') || [];
    this.mediumList = _.get(_.find(formFields, { 'code': 'medium' }), 'range') || [];
    this.gradesList = _.get(_.find(formFields, { 'code': 'gradeLevel' }), 'range') || [];
    this.subjectList = _.get(_.find(formFields, { 'code': 'subject' }), 'range') || [];
    return formFields;
  }
  private getCustodianOrgData() {
    return this.channelService.getFrameWork(this.userService.hashTagId).pipe(map((channelData: any) => {
      this.custOrgFrameworks =  _.get(channelData, 'result.channel.frameworks') || [];
      this.custOrgFrameworks = _.sortBy(this.custOrgFrameworks, 'index');
      return {
          range: this.custOrgFrameworks,
          label: 'Board',
          code: 'board',
          index: 1
        };
    }));
  }
  onSubmitForm() {
    console.log(this.groupForm.value);
    if (this.groupForm.valid) {
      this.groupForm.markAsTouched();
    } else {
      Object.keys(this.groupForm.controls).forEach(field => {
        const control = this.groupForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }
  ngOnDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe.unsubscribe();
    }
    if (this.modal && this.modal.deny) {
      this.modal.deny();
    }
  }
  get formFieldProperties() {
    return _.cloneDeep(this._formFieldProperties);
  }
  isFieldValid(field: string) {
    return !this.groupForm.get(field).valid && this.groupForm.get(field).touched;
  }

}
