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
  public allowedFields = ['board', 'medium', 'gradeLevel', 'subject'];
  public formFieldProperties: any;
  public filterOptions = [];
  public channelData: any;
  public categoryMasterList: any = {};
  public selectedOption: any = {};
  public showButton = false;
  public unsubscribe = new Subject<void>();
  public frameWorkId: string;
  public custodianOrg = false;
  public initDropDown = false;
  public custodianOrgBoard: any = {};
  constructor(public router: Router, public userService: UserService, public frameworkService: FrameworkService,
    public formService: FormService, public resourceService: ResourceService, private cdr: ChangeDetectorRef,
    public toasterService: ToasterService, public channelService: ChannelService, public orgDetailsService: OrgDetailsService,
    private cacheService: CacheService, ) { }

  ngOnInit() {
    this.selectedOption = _.cloneDeep(this.formInput) || {}; // clone selected field inputs from parent
    this.isCustodianOrgUser().pipe(
      mergeMap((custodianOrgUser: boolean) => {
        this.custodianOrg = custodianOrgUser;
        if (custodianOrgUser) {
          return this.getFiltersForCustodianOrg();
        } else {
          return []; // this.setFrameWorkDetails();
        }
      }), first()).subscribe(data => {
        this.filterOptions = data;
        this.initDropDown = true;
      }, err => {
        this.navigateToLibrary();
      });
  }
  private getFiltersForCustodianOrg() {
    return this.getCustodianOrgData().pipe(mergeMap((data) => {
      this.custodianOrgBoard = data;
      const board = _.cloneDeep(this.custodianOrgBoard);
      if (_.get(this.selectedOption, 'board[0]')) {
        this.selectedOption.board = _.get(this.selectedOption, 'board[0]');
        this.enableSubmitButton();
        this.frameWorkId = _.get(_.find(this.channelData, { 'name': event }), 'identifier');
        return this.getFormatedFilterDetails().pipe(map((formFieldProperties) => {
          this.formFieldProperties = formFieldProperties;
          this.mergeBoard(); // will merge board from custodian org and board from selected framework data
          return this.getUpdateFilters(board, true);
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
  private getFormatedFilterDetails() {
    this.frameworkService.initialize(this.frameWorkId);
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
        const frameworkData = _.get(frameworkDetails.frameworkdata, framework);
        this.frameWorkId = frameworkData.identifier;
        this.categoryMasterList = _.cloneDeep(frameworkData.categories);
        return this.getFormDetails();
      } else if (frameworkDetails.err) {
        return throwError(frameworkDetails.err);
      }
    }), map((formData: any) => {
      let formFieldProperties = _.filter(formData, (formFieldCategory) => {
        formFieldCategory.range = _.get(_.find(this.categoryMasterList, { code : formFieldCategory.code}), 'terms') || [];
        return true;
      });
      formFieldProperties = _.sortBy(_.uniqBy(formFieldProperties, 'code'), 'index');
      return formFieldProperties;
    }), first());
  }
  public handleFieldChange(field) {
    if (!this.custodianOrg || field.index !== 1) { // no need to fetch data, just rearrange fields
      this.filterOptions = this.getUpdateFilters(field);
      this.enableSubmitButton();
      return;
    }
    this.frameWorkId = _.get(_.find(field.range, { name: _.get(this.selectedOption, field.code)}), 'identifier');
    this.getFormatedFilterDetails().subscribe(
      (formFieldProperties) => {
        if (!formFieldProperties.length) {
          console.log('no data');
        } else {
          this.formFieldProperties = formFieldProperties;
          this.mergeBoard();
          this.filterOptions = this.getUpdateFilters(field);
          this.enableSubmitButton();
        }
      }, (error) => {
        console.log('got error', error);
    });
  }
  private mergeBoard() {
    _.forEach(this.formFieldProperties, (field) => {
      if (field.code === 'board') {
        field.range = _.unionBy(_.concat(this.custodianOrgBoard.range, field.range), 'name');
      }
    });
  }
  private getUpdateFilters(field, editMode = false) {
    const targetIndex = field.index + 1;
    const formFieldProperties = _.cloneDeep(this.formFieldProperties);
    const filters = _.reduce(formFieldProperties, (acc, cur) => {
      if (cur.index === targetIndex || editMode) {
        const parentField: any = _.find(formFieldProperties, { index: cur.index - 1 });
        const parentAssociations = _.reduce(parentField.range, (associations, term) => {
          const selectedFields = this.selectedOption[parentField.code] || [];
          if ((selectedFields.includes(term.name) || selectedFields.includes(term.code))) {
            const selectedAssociations = _.filter(term.associations, {category: cur.code}) || [];
            associations = _.concat(associations, selectedAssociations);
          }
          return associations;
        }, []);
        const updateRange = _.filter(cur.range, (range) => {
          return _.find(parentAssociations, {code: range.code});
        });
        cur.range = updateRange.length ? updateRange : cur.range;
        cur.range = _.unionBy(cur.range, 'code');
        this.selectedOption[cur.code] = [];
        acc.push(cur);
      } else {
        if (cur.index <= field.index) {
          acc.push(_.find(this.filterOptions, { index: cur.index}));
        } else {
          cur.range = [];
          this.selectedOption[cur.code] = [];
          acc.push(cur);
        }
      }
      return acc;
    }, []);
    return filters;
  }
  private getCustodianOrgData() {
    return this.channelService.getFrameWork(this.userService.hashTagId).pipe(map((channelData: any) => {
      this.channelData =  channelData.result.channel.frameworks;
      const board = [];
      _.forEach(this.channelData, (value, index) => {
        board.push(value);
      });
      const custodianOrgBoard = {
        range: board,
        label: 'Board',
        code: 'board',
        index: 1
      };
      return custodianOrgBoard;
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
    selectedOption['id'] = this.frameWorkId;
    this.submit.emit(selectedOption);
  }
  onClose(modal) {
    modal.deny();
    this.close.emit();
  }
  private enableSubmitButton() {
    if (this.selectedOption['board'] && this.selectedOption['medium'] && this.selectedOption['gradeLevel']) {
      if (this.selectedOption['board'].length > 0 && this.selectedOption['medium'].length > 0
        && this.selectedOption['gradeLevel'].length > 0) {
        this.showButton = true;
      } else {
        this.showButton = false;
      }
    }
  }
  ngOnDestroy() {
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
  private navigateToLibrary() {
    this.toasterService.warning(this.resourceService.messages.emsg.m0012);
    if (this.modal) {
      this.modal.deny();
    }
    this.router.navigate(['/resources']);
    this.cacheService.set('showFrameWorkPopUp', 'installApp' );
  }
}
