import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FrameworkService, FormService, UserService, ChannelService, OrgDetailsService } from '@sunbird/core';
import { first, mergeMap, map, filter, catchError } from 'rxjs/operators';
import { of, throwError, Subscription } from 'rxjs';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { Router } from '@angular/router';
import * as _ from 'lodash-es';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
import { PopupControlService } from '../../../../service/popup-control.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProfileService } from '@sunbird/profile';
import { CslFrameworkService } from '../../../public/services/csl-framework/csl-framework.service';
import { ConfigService } from '../../../shared/services/config/config.service';

@Component({
  selector: 'app-popup',
  templateUrl: './profile-framework-popup.component.html',
  styleUrls: ['./profile-framework-popup.component.scss']
})
export class ProfileFrameworkPopupComponent implements OnInit, OnDestroy {
  @Input() showCloseIcon: boolean;
  @Input() buttonLabel: string;
  @Input() formInput: any = {};
  @Input() isClosable = false;
  @Input() isGuestUser = false;
  @Input() isPreference = false;
  @Output() submit = new EventEmitter<any>();
  @Output() close = new EventEmitter<any>();
  @Input() dialogProps;
  @Input() hashId;
  @Input() isStepper: boolean = false;
  public allowedFields = ['board', 'medium', 'gradeLevel', 'subject'];
  private _formFieldProperties: any;
  public formFieldOptions = [];
  private custOrgFrameworks: any;
  private categoryMasterList: any = {};
  public selectedOption: any = {};
  public showButton = false;
  private unsubscribe: Subscription;
  private frameWorkId: string;
  private custodianOrg = false;
  private custodianOrgBoard: any = {};
  submitInteractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  private editMode: boolean;
  guestUserHashTagId;
  instance: string;
  dialogRef: MatDialogRef<any>;
  private boardOptions;
  frameworkCategories;
  frameworkCategoriesObject;
  showLoader = true; 
  constructor(private router: Router, private userService: UserService, private frameworkService: FrameworkService,
    private formService: FormService, public resourceService: ResourceService, private cacheService: CacheService,
    private toasterService: ToasterService, private channelService: ChannelService, private orgDetailsService: OrgDetailsService,
    public popupControlService: PopupControlService, private matDialog: MatDialog, public profileService: ProfileService,private cslFrameworkService:CslFrameworkService, private configService:ConfigService ) {
    this.instance = (<HTMLInputElement>document.getElementById('instance'))
      ? (<HTMLInputElement>document.getElementById('instance')).value.toUpperCase() : 'SUNBIRD';
  }

  ngOnInit() {
    this.frameworkCategories = this.cslFrameworkService.getFrameworkCategories();
    this.frameworkCategoriesObject = this.cslFrameworkService.getFrameworkCategoriesObject();
    this.dialogRef = this.dialogProps && this.dialogProps.id && this.matDialog.getDialogById(this.dialogProps.id);
    this.popupControlService.changePopupStatus(false);
    this.selectedOption = _.pickBy(_.cloneDeep(this.formInput), 'length') || {}; // clone selected field inputs from parent
    if (this.isGuestUser && !this.isStepper) {
      this.orgDetailsService.getOrgDetails(this.userService.slug).subscribe((data: any) => {
        this.guestUserHashTagId = data.hashTagId;
      });
      this.guestUserHashTagId =this.guestUserHashTagId || this.hashId;
      this.allowedFields = [this.frameworkCategories?.fwCategory1?.code, this.frameworkCategories?.fwCategory2?.code, this.frameworkCategories?.fwCategory3?.code];
    }
    if (this.isGuestUser && this.isStepper) {
      this.orgDetailsService.getCustodianOrgDetails().subscribe((custodianOrg) => {
        this.guestUserHashTagId = custodianOrg.result.response.value;

      });
      this.allowedFields = [this.frameworkCategories?.fwCategory1?.code, this.frameworkCategories?.fwCategory2?.code, this.frameworkCategories?.fwCategory3?.code];
    }
    this.editMode = _.some(this.selectedOption, 'length') || false;
    this.unsubscribe = this.isCustodianOrgUser().pipe(
      mergeMap((custodianOrgUser: boolean) => {
        this.custodianOrg = custodianOrgUser;
        if (this.isGuestUser) {
          return this.getFormOptionsForCustodianOrgForGuestUser();
        } else if (custodianOrgUser) {
          return this.getFormOptionsForCustodianOrg();
        } else {
          return this.getFormOptionsForOnboardedUser();
        }
      }), first()).subscribe(data => {
        this.formFieldOptions = data;
      }, err => {
        this.toasterService.warning(this.resourceService.messages.emsg.m0012);
        this.navigateToLibrary();
      });
    this.setInteractEventData();
  }
  private getFormOptionsForCustodianOrgForGuestUser() {
    return this.getCustodianOrgDataForGuest().pipe(mergeMap((data) => {
      this.custodianOrgBoard = data;
      const boardObj = _.cloneDeep(this.custodianOrgBoard);
      boardObj.range = _.sortBy(boardObj.range, 'index');
      const board = boardObj;
      this.boardOptions = board;
      if (_.get(this.selectedOption, `${this.frameworkCategories?.fwCategory1?.code}[0]`)) { // update mode, get 1st board framework and update all fields
        this.selectedOption[this.frameworkCategories?.fwCategory1?.code] = _.get(this.selectedOption, `${this.frameworkCategories?.fwCategory1?.code}[0]`);
        this.frameWorkId = _.get(_.find(this.custOrgFrameworks, { 'name': this.selectedOption[this.frameworkCategories?.fwCategory1?.code] }), 'identifier');
        return this.getFormatedFilterDetails().pipe(map((formFieldProperties) => {
          this._formFieldProperties = formFieldProperties;
          this.mergeBoard(); // will merge board from custodian org and board from selected framework data
          return this.getUpdatedFilters(board, true);
        }));
      } else {
        let userType = localStorage.getItem('userType');
        userType == "administrator" ? board.required = true  : null;
        const fieldOptions = [board,
          { code: this.frameworkCategories?.fwCategory2?.code, label: this.frameworkCategories?.fwCategory2?.label, index: 2 },
          { code: this.frameworkCategories?.fwCategory3?.code, label: this.frameworkCategories?.fwCategory3?.label, index: 3 },
          { code: this.frameworkCategories?.fwCategory4?.code, label: this.frameworkCategories?.fwCategory4?.label, index: 4 }];
        return of(fieldOptions);
      }
    }));
  }

  private getCustodianOrgDataForGuest() {
    return this.channelService.getFrameWork(this.guestUserHashTagId).pipe(map((channelData: any) => {
      this.custOrgFrameworks = _.get(channelData, 'result.channel.frameworks') || [];
      this.custOrgFrameworks = _.sortBy(this.custOrgFrameworks, 'index');
      return {
        range: this.custOrgFrameworks,
        label: this.frameworkCategories?.fwCategory1?.label,
        code: this.frameworkCategories?.fwCategory1?.code,
        index: 1
      };
    }));
  }
  private getFormOptionsForCustodianOrg() {
    return this.getCustodianOrgData().pipe(mergeMap((data) => {
      this.custodianOrgBoard = data;
      const boardObj = _.cloneDeep(this.custodianOrgBoard);
      boardObj.range = _.sortBy(boardObj.range, 'index');
      const board = boardObj;
      this.boardOptions = board;
      if (_.get(this.selectedOption, `${this.frameworkCategories?.fwCategory1?.code}[0]`)) { // update mode, get 1st board framework and update all fields
        this.selectedOption[ this.frameworkCategories?.fwCategory1?.code] = _.get(this.selectedOption, `${ this.frameworkCategories?.fwCategory1?.code}[0]`);
        this.frameWorkId = _.get(_.find(this.custOrgFrameworks, { 'name': this.selectedOption[ this.frameworkCategories?.fwCategory1?.code] }), 'identifier');
        return this.getFormatedFilterDetails().pipe(map((formFieldProperties) => {
          this._formFieldProperties = formFieldProperties;
          this.mergeBoard(); // will merge board from custodian org and board from selected framework data
          return this.getUpdatedFilters(board, true);
        }));
      } else {
        const fieldOptions = [board,
          { code: this.frameworkCategories?.fwCategory2?.code, label: this.frameworkCategories?.fwCategory2?.label, index: 2 },
          { code: this.frameworkCategories?.fwCategory3?.code, label: this.frameworkCategories?.fwCategory3?.label, index: 3 },
          { code: this.frameworkCategories?.fwCategory4?.code, label: this.frameworkCategories?.fwCategory4?.label, index: 4 }];
        return of(fieldOptions);
      }
    }));
  }
  private getFormOptionsForOnboardedUser() {
    return this.getFormatedFilterDetails().pipe(map((formFieldProperties) => {
      this._formFieldProperties = formFieldProperties;
      this.boardOptions = _.find(formFieldProperties, { code: this.frameworkCategories?.fwCategory1?.code});

      if (_.get(this.selectedOption, [this.frameworkCategories?.fwCategory1?.code][0])) {
        this.selectedOption[this.frameworkCategories?.fwCategory1?.code] = _.get(this.selectedOption, `${this.frameworkCategories?.fwCategory1?.code}[0]`);
      }
      return this.getUpdatedFilters({ index: 0 }, this.editMode); // get filters for first field i.e index 0 incase of init
    }));
  }
  private getFormatedFilterDetails() {
    if (this.isGuestUser) {
      this.frameworkService.initialize(this.frameWorkId, this.guestUserHashTagId);
    } else {
      this.frameworkService.initialize(this.frameWorkId);
    }
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
          this.categoryMasterList = frameworkData.categories;
          return this.getFormDetails();
        } else {
          return throwError(frameworkDetails.err);
        }
      }), map((formData: any) => {
        const formFieldProperties = _.filter(formData, (formFieldCategory) => {
          formFieldCategory.range = _.get(_.find(this.categoryMasterList, { code: formFieldCategory.code }), 'terms') || [];
          return true;
        });
        return _.sortBy(_.uniqBy(formFieldProperties, 'code'), 'index');
      }), first());
  }
  public handleFieldChange(event, field) {
    if ((!this.isGuestUser || field.index !== 1) && (!this.custodianOrg || field.index !== 1)) { // no need to fetch data, just rearrange fields
      this.formFieldOptions = this.getUpdatedFilters(field);
      this.enableSubmitButton();
      return;
    }
    if (_.get(this.boardOptions, 'range.length')) {
      this.frameWorkId = _.get(_.find(this.boardOptions.range, { name: _.get(this.selectedOption, field.code) }), 'identifier');
    } else {
      this.frameWorkId = _.get(_.find(field.range, { name: _.get(this.selectedOption, field.code) }), 'identifier');
    }
    if (this.unsubscribe) { // cancel if any previous api call in progress
      this.unsubscribe.unsubscribe();
    }
    this.updateFrameworkCategories(this.frameWorkId);
    this.unsubscribe = this.getFormatedFilterDetails().pipe().subscribe(
      (formFieldProperties) => {
        if (!formFieldProperties.length) {
        } else {
          this._formFieldProperties = formFieldProperties;
          this.mergeBoard();
          this.formFieldOptions = this.getUpdatedFilters(field);
          this.enableSubmitButton();
        }
      }, (error) => {
        this.toasterService.warning(this.resourceService.messages.emsg.m0012);
        this.navigateToLibrary();
      });
  }
  public async updateFrameworkCategories(frameWorkId) {
    this.showLoader = false;
    try {
      this.frameworkCategories = this.frameworkCategoriesObject = '';
     localStorage.setItem('selectedFramework', frameWorkId);
      await this.cslFrameworkService.setFWCatConfigFromCsl(frameWorkId);
      [this.frameworkCategories, this.frameworkCategoriesObject] = [
        this.cslFrameworkService.getFrameworkCategories(),
        this.cslFrameworkService.getFrameworkCategoriesObject()
      ];
      this.cslFrameworkService.setTransFormGlobalFilterConfig();
      this.showLoader = true;
    } catch (error) {
      console.error('Error updating framework categories:', error);
      // Handle error if needed
    }
  }
  private mergeBoard() {
    _.forEach(this._formFieldProperties, (field) => {
      if (field.code === this.frameworkCategories?.fwCategory1?.code) {
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
          const selectedFields = this.selectedOption[parentField.code] || [];
          if ((selectedFields.includes(term.name) || selectedFields.includes(term.code))) {
            const selectedAssociations = _.filter(term.associations, { category: current.code }) || [];
            collector = _.concat(collector, selectedAssociations);
          }
          return collector;
        }, []);
        const updatedRange = _.filter(current.range, range => _.find(parentAssociations, { code: range.code }));
        current.range = updatedRange.length ? updatedRange : current.range;
        current.range = _.unionBy(current.range, 'identifier');
        if (!editMode) {
          this.selectedOption[current.code] = [];
        }
        accumulator.push(current);
      } else {
        if (current.index <= field.index) { // retain options for already selected fields
          const updateField = current.code === this.frameworkCategories?.fwCategory1?.code ? (current) : _.find(this.formFieldOptions, { index: current.index });
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
      this.custOrgFrameworks = _.get(channelData, 'result.channel.frameworks') || [];
      this.custOrgFrameworks = _.sortBy(this.custOrgFrameworks, 'index');
      return {
        range: this.custOrgFrameworks,
        label: this.frameworkCategories?.fwCategory1?.label,
        code: this.frameworkCategories?.fwCategory1?.code,
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
    let userType = localStorage.getItem('userType');
    if (this.isGuestUser && userType == "administrator") {
      formServiceInputParams.formAction = 'create',
      formServiceInputParams.contentType= 'admin_framework'
      delete formServiceInputParams.framework;
    }
    const hashTagId = this.isGuestUser ? this.guestUserHashTagId : _.get(this.userService, 'hashTagId');
    return this.formService.getFormConfig(formServiceInputParams, hashTagId)
    .pipe(
      catchError(error => {
        console.error('Error fetching form config:', error);
        return of(this.frameworkCategoriesObject);
      })
    );
  }
  onSubmitForm() {
      let selectedData = _.cloneDeep(this.selectedOption);
      let selectedOption:any = this.cslFrameworkService.transformSelectedData(selectedData,this.frameworkCategoriesObject);
      selectedOption[this.frameworkCategories?.fwCategory1?.code] = _.get(this.selectedOption,  `${this.frameworkCategories?.fwCategory1?.code}`) ? [this.selectedOption[this.frameworkCategories?.fwCategory1?.code]] : [];
      selectedOption.id = this.frameWorkId;
      if (this.dialogRef && this.dialogRef.close) {
        this.dialogRef.close();
      }
      // Process to handle in case of component rendered in stepper dialog
      // API to be called for updation

      if(this.isStepper && this.isGuestUser) {
        const user: any = { name: 'guest', formatedName: 'Guest', framework: selectedOption };
        const userType = localStorage.getItem('userType');
        if (userType) {
          user.role = userType;
        }
        this.userService.createGuestUser(user).subscribe(data => {
          this.toasterService.success(_.get(this.resourceService, 'messages.smsg.m0058'));
        }, error => {
          this.toasterService.error(_.get(this.resourceService, 'messages.emsg.m0005')); 
        });
      } else {
        const req = {
          framework: selectedOption
        };
        this.profileService.updateProfile(req).subscribe(res => {
          this.userService.setUserFramework(selectedOption);
        });
      }
    this.submit.emit(selectedOption);
  }
  private enableSubmitButton() {
    const optionalFields = _.map(_.filter(this._formFieldProperties, formField => !_.get(formField, 'required')), 'code');
    const enableSubmitButton = _.every(this.selectedOption, (value, index) => {
      return _.includes(optionalFields, index) ? true : value.length;
    });
    if (enableSubmitButton) {
      this.showButton = true;
    } else {
      this.showButton = false;
    }
  }
  ngOnDestroy() {
    this.close.emit();
    this.popupControlService.changePopupStatus(true);
    if (this.unsubscribe) {
      this.unsubscribe.unsubscribe();
    }
    if (this.dialogRef && this.dialogRef.close) {
      this.dialogRef.close();
    }
  }
  private isCustodianOrgUser() {
    return this.orgDetailsService.getCustodianOrgDetails().pipe(map((custodianOrg) => {
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
    if (this.dialogRef && this.dialogRef.close) {
      this.dialogRef.close();
    }
    if (_.isEmpty(this.formInput)) {
      this.router.navigate(['/resources']);
      this.cacheService.set('showFrameWorkPopUp', 'installApp');
    }
  }

  setInteractEventData() {
    this.submitInteractEdata = {
      id: 'submit-profile-framework-details',
      type: 'click',
      pageid: 'profile-read'
    };

    this.telemetryInteractObject = {
      id: this.userService.userid,
      type: 'User',
      ver: '1.0'
    };
  }
}