import { Component, OnInit, Input, EventEmitter, Output, OnDestroy, ViewChild } from '@angular/core';
import { FrameworkService, FormService, UserService, ChannelService, OrgDetailsService } from '@sunbird/core';
import { first, mergeMap, map , filter} from 'rxjs/operators';
import { Subject, of, throwError } from 'rxjs';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { CacheService } from 'ng2-cache-service';

@Component({
  selector: 'app-popup',
  templateUrl: './profile-framework-popup.component.html',
  styleUrls: ['./profile-framework-popup.component.scss']
})
export class ProfileFrameworkPopupComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal;
  @Input() showCloseIcon: boolean;
  @Input() buttonLabel: string;
  @Input() formInput: any = {};
  @Output() submit = new EventEmitter<any>();
  @Output() close = new EventEmitter<any>();
  public allowedFields = ['board', 'medium', 'gradeLevel', 'subject'];
  public _formFieldProperties: any;
  public formFieldOptions = [];
  public custOrgFrameworks: any;
  public categoryMasterList: any = {};
  public selectedOption: any = {};
  public showButton = false;
  public unsubscribe = new Subject<void>();
  public frameWorkId: string;
  public custodianOrg = false;
  public initDropDown = false;
  public custodianOrgBoard: any = {};
  constructor(public router: Router, public userService: UserService, public frameworkService: FrameworkService,
    public formService: FormService, public resourceService: ResourceService,
    public toasterService: ToasterService, public channelService: ChannelService, public orgDetailsService: OrgDetailsService,
    private cacheService: CacheService, ) { }

  ngOnInit() {
    this.selectedOption = _.cloneDeep(this.formInput) || {}; // clone selected field inputs from parent
    this.isCustodianOrgUser().pipe(
      mergeMap((custodianOrgUser: boolean) => {
        this.custodianOrg = custodianOrgUser;
        if (custodianOrgUser) {
          return this.getFieldOptionsForCustodianOrg();
        } else {
          return this.getFieldOptionsForOnboardedUser();
        }
      }), first()).subscribe(data => {
        this.formFieldOptions = data;
        this.initDropDown = true;
      }, err => {
        this.navigateToLibrary();
      });
  }
  private getFieldOptionsForCustodianOrg() {
    return this.getCustodianOrgData().pipe(mergeMap((data) => {
      this.custodianOrgBoard = data;
      const board = _.cloneDeep(this.custodianOrgBoard);
      if (_.get(this.selectedOption, 'board[0]')) {
        this.selectedOption.board = _.get(this.selectedOption, 'board[0]');
        this.frameWorkId = _.get(_.find(this.custOrgFrameworks, { 'name': event }), 'identifier');
        return this.getFormatedFilterDetails().pipe(map((formFieldProperties) => {
          this._formFieldProperties = formFieldProperties;
          this.mergeBoard(); // will merge board from custodian org and board from selected framework data
          return this.getUpdatedFilters(board, true);
        }));
      } else {
        const filterOptions = [ board,
          { code: 'medium', label: 'Medium', index: 2 },
          { code: 'gradeLevel', label: 'Class', index: 3 },
          { code: 'subject', label: 'Subject', index: 4 } ];
        return of(filterOptions);
      }
    }));
  }
  private getFieldOptionsForOnboardedUser() {
    return this.getFormatedFilterDetails().pipe(map((formFieldProperties) => {
      this._formFieldProperties = formFieldProperties;
      let editMode = false;
      if (_.get(this.selectedOption, 'board[0]')) {
        this.selectedOption.board = _.get(this.selectedOption, 'board[0]');
        editMode = true;
      }
      return this.getUpdatedFilters({index: 0}, editMode); // get filters for first field i.e index 0 incase of init
    }));
  }
  private getFormatedFilterDetails() {
    this.frameworkService.initialize(this.frameWorkId);
    return this.frameworkService.frameworkData$.pipe(
      filter((frameworkDetails) => { // wait to get the framework name if passed as input
      if (!frameworkDetails.err) {
        const framework = this.frameWorkId ? this.frameWorkId : 'defaultFramework';
        if (!_.get(frameworkDetails.frameworkdata, framework)) {
          return false;
        }
      }
      return true;
    }),
    mergeMap((frameworkDetails) => {
      if (!frameworkDetails.err) {
        const framework = this.frameWorkId ? this.frameWorkId : 'defaultFramework';
        const frameworkData = _.get(frameworkDetails.frameworkdata, framework);
        this.frameWorkId = frameworkData.identifier;
        this.categoryMasterList = _.cloneDeep(frameworkData.categories);
        return this.getFormDetails();
      } else {
        return throwError(frameworkDetails.err);
      }
    }), map((formData: any) => {
      const formFieldProperties = _.filter(formData, (formFieldCategory) => {
        formFieldCategory.range = _.get(_.find(this.categoryMasterList, { code : formFieldCategory.code}), 'terms') || [];
        return true;
      });
      return _.sortBy(_.uniqBy(formFieldProperties, 'code'), 'index');
    }), first());
  }
  public handleFieldChange(event, field) {
    if (!this.custodianOrg || field.index !== 1) { // no need to fetch data, just rearrange fields
      this.formFieldOptions = this.getUpdatedFilters(field);
      this.enableSubmitButton();
      return;
    }
    this.frameWorkId = _.get(_.find(field.range, { name: _.get(this.selectedOption, field.code)}), 'identifier');
    this.getFormatedFilterDetails().subscribe(
      (formFieldProperties) => {
        if (!formFieldProperties.length) {
          console.log('no data');
        } else {
          this._formFieldProperties = formFieldProperties;
          this.mergeBoard();
          this.formFieldOptions = this.getUpdatedFilters(field);
          this.enableSubmitButton();
        }
      }, (error) => {
        this.navigateToLibrary();
      });
  }
  private mergeBoard() {
    _.forEach(this._formFieldProperties, (field) => {
      if (field.code === 'board') {
        field.range = _.unionBy(_.concat(this.custodianOrgBoard.range, field.range), 'name');
      }
    });
  }
  private getUpdatedFilters(field, editMode = false) {
    const targetIndex = field.index + 1; // only update next field if not editMode
    const formFields = _.reduce(this.formFieldProperties, (accumulator, current) => {
      if (current.index === targetIndex || editMode) {
        const parentField: any = _.find(this.formFieldProperties, { index: current.index - 1 }) || {};
        const parentAssociations = _.reduce(parentField.range, (collector, term) => {
          const selectedFields = this.selectedOption[parentField.code] || [];
          if ((selectedFields.includes(term.name) || selectedFields.includes(term.code))) {
            const selectedAssociations = _.filter(term.associations, { category: current.code }) || [];
            collector = _.concat(collector, selectedAssociations);
          }
          return collector;
        }, []);
        const updatedRange = _.filter(current.range, range => _.find(parentAssociations, {code: range.code}));
        current.range = updatedRange.length ? updatedRange : current.range;
        current.range = _.unionBy(current.range, 'code');
        if (!editMode) {
          this.selectedOption[current.code] = [];
        }
        accumulator.push(current);
      } else {
        if (current.index <= field.index) { // retain options for already selected fields
          const updateField = current.code === 'board' ? current : _.find(this.formFieldOptions, { index: current.index});
          accumulator.push(updateField);
        } else { // empty filters and selection
          current.range = [];
          this.selectedOption[current.code] = [];
          accumulator.push(current);
        }
      }
      return accumulator;
    }, []);
    return formFields;
  }
  private getCustodianOrgData() {
    return this.channelService.getFrameWork(this.userService.hashTagId).pipe(map((channelData: any) => {
      this.custOrgFrameworks =  _.get(channelData, 'result.channel.frameworks') || [];
      return {
          range: this.custOrgFrameworks,
          label: 'Board',
          code: 'board',
          index: 1
        };
    }));
  }
  private getFormDetails() {
    const formServiceInputParams = {
      formType: 'user',
      formAction: 'update',
      contentType: 'framework',
      framework: this.frameWorkId
    };
    return this.formService.getFormConfig(formServiceInputParams, this.userService.hashTagId);
  }
  onSubmitForm() {
    const selectedOption = _.cloneDeep(this.selectedOption);
    selectedOption.board = [this.selectedOption.board];
    selectedOption.id = this.frameWorkId;
    this.submit.emit(selectedOption);
  }
  private enableSubmitButton() {
    if (_.get(this.selectedOption, 'board.length') && _.get(this.selectedOption, 'medium.length')
      && _.get(this.selectedOption, 'gradeLevel.length')) {
      this.showButton = true;
    } else {
      this.showButton = false;
    }
  }
  ngOnDestroy() {
    if (this.modal) {
      this.modal.deny();
    }
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  private isCustodianOrgUser() {
    return this.orgDetailsService.getCustodianOrg().pipe(map((custodianOrg) => {
      if (_.get(this.userService, 'userProfile.rootOrg.rootOrgId') === _.get(custodianOrg, 'result.response.value')) {
        return true;
      }
      return false;
    }));
  }
  get formFieldProperties() {
    return _.cloneDeep(this._formFieldProperties);
  }
  private navigateToLibrary() {
    this.toasterService.warning(this.resourceService.messages.emsg.m0012);
    this.router.navigate(['/resources']);
    this.cacheService.set('showFrameWorkPopUp', 'installApp' );
  }
}
