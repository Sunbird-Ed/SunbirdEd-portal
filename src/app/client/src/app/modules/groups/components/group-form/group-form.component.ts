import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { UserService } from '@sunbird/core';
import { first, mergeMap, map  } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
import { ResourceService, ToasterService, IUserProfile } from '@sunbird/shared';
import { Router } from '@angular/router';
import * as _ from 'lodash-es';
import { IInteractEventObject, IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { GroupsService } from '../../services';

@Component({
  selector: 'app-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.scss']
})
export class GroupFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('createGroupModal') createGroupModal;
  @Output() closeEvent = new EventEmitter<any>();
  @Output() submitForm = new EventEmitter<any>();
  groupForm: FormGroup;
  private _formFieldProperties: any;
  public formFieldOptions = [];
  public selectedOption: any = {};
  private unsubscribe: Subscription;
  private frameWorkId: string;
  private custodianOrg = false;
  private custodianOrgBoard: any = {};
  submitInteractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  telemetryImpression: IImpressionEventInput;
  public userProfile: IUserProfile;
  public editMode: boolean;
  public boardList: [];
  public mediumList: [];
  public gradesList: [];
  public subjectList: [];

  constructor(private userService: UserService, public resourceService: ResourceService, private toasterService: ToasterService,
    private fb: FormBuilder, public groupService: GroupsService, private route: Router) { }

  ngOnInit() {
    this.initializeForm();
    this.setTelemetryData();
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
    this.unsubscribe = this.groupService.isCustodianOrgUser().pipe(
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

  public getFormOptionsForCustodianOrg() {
    return this.groupService.getCustodianOrgData().pipe(mergeMap((data) => {
      this.custodianOrgBoard = data;
      const boardObj = _.cloneDeep(this.custodianOrgBoard);
      boardObj.range = _.sortBy(boardObj.range, 'index');
      const board = boardObj;
      if (_.get(this.selectedOption, 'board[0]')) { // update mode, get 1st board framework and update all fields
        this.groupForm.controls.board.setValue(_.get(this.selectedOption, 'board[0]'));
        this.frameWorkId = _.get(_.find(this.custodianOrgBoard.range, { 'name': this.selectedOption.board[0] }), 'identifier');
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
  public getFormOptionsForOnboardedUser() {
    return this.getFormatedFilterDetails().pipe(map((formFieldProperties) => {
      this._formFieldProperties = formFieldProperties;
      if (_.get(this.selectedOption, 'board[0]')) {
        this.groupForm.controls.board.setValue(_.get(this.selectedOption, 'board[0]'));
      }
      return this.getUpdatedFilters({index: 0}, this.editMode); // get filters for first field i.e index 0 incase of init
    }));
  }
  public getFormatedFilterDetails() {
    return this.groupService.getFilteredFieldData(this.frameWorkId).pipe(
      map((data: any) => {
        this.frameWorkId = data.frameWorkId;
        return data.formFieldProperties;
      })
    );
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
  public mergeBoard() {
    _.forEach(this._formFieldProperties, (field) => {
      if (field.code === 'board') {
        field.range = _.unionBy(_.concat(field.range, this.custodianOrgBoard.range), 'name');
      }
    });
  }
  public getUpdatedFilters(field, editMode = false) {
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
  async onSubmitForm() {
    if (this.groupForm.valid) {
      const group = await this.groupService.createGroup(this.groupForm.value);
      if (group) {
        this.toasterService.success('Group created sucessfully');
        this.submitForm.emit(group);
      }
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
    if (this.createGroupModal && this.createGroupModal.deny) {
      this.createGroupModal.deny();
    }
  }
  get formFieldProperties() {
    return _.cloneDeep(this._formFieldProperties);
  }
  isFieldValid(field: string) {
    return !this.groupForm.get(field).valid && this.groupForm.get(field).touched;
  }
  setTelemetryData() {
    this.submitInteractEdata = {
      id: 'submit-group-creation',
      type: 'click',
      pageid: 'group-creation'
    };

    this.telemetryInteractObject = {
      id: this.userService.userid,
      type: 'groups',
      ver: '1.0'
    };
  }
  ngAfterViewInit () {
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: 'groups'
        },
        edata: {
          type: 'create',
          pageid: 'create-group',
          uri: this.route.url,
        }
      };
    });
  }

}
