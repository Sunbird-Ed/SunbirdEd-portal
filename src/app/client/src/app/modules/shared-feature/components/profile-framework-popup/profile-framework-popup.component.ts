import { Component, OnInit, Input, ChangeDetectorRef, EventEmitter, Output, OnDestroy, ViewChild } from '@angular/core';
import { FrameworkService, FormService, UserService } from '@sunbird/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
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
  @Input() buttonLabel: string;
  @Input() formInput: any = {};
  @Output() submit = new EventEmitter<any>();
  @Output() close = new EventEmitter<any>();
  private frameworkDataSubscription: Subscription;
  private formType = 'user';
  public formFieldProperties: any;
  public board: object = {};
  public medium: object = {};
  public class: object = {};
  public subject: object = {};
  public categoryMasterList: any = {};
  private formAction = 'update';
  public selectedOption: object = {};
  public showButton = false;
  public unsubscribe = new Subject<void>();
  userSubscription: Subscription;
  constructor(public userService: UserService, public frameworkService: FrameworkService,
    public formService: FormService, public resourceService: ResourceService, private cdr: ChangeDetectorRef,
    public toasterService: ToasterService, ) { }

  ngOnInit() {
    this.userSubscription = this.userService.userData$.subscribe(
      (user: any) => {
        if (user && !user.err) {
          this.frameworkService.initialize();
          this.frameworkDataSubscription = this.frameworkService.frameworkData$.subscribe((frameworkData: Framework) => {
            if (!frameworkData.err  && frameworkData.frameworkdata !== null) {
              this.categoryMasterList = _.cloneDeep(frameworkData.frameworkdata['defaultFramework'].categories);
              const formServiceInputParams = {
                formType: this.formType,
                formAction: this.formAction,
                contentType: 'framework',
                framework: frameworkData.frameworkdata['defaultFramework'].code
              };
              this.formService.getFormConfig(formServiceInputParams, user.userProfile.rootOrg.hashTagId).pipe(
                takeUntil(this.unsubscribe)).subscribe((data: ServerResponse) => {
                  this.formFieldProperties = data;
                  this.getFormConfig();
                }, (err: ServerResponse) => {
                  this.toasterService.error(this.resourceService.messages.emsg.m0005);
                });
            } else if (frameworkData && frameworkData.err) {
              this.toasterService.error(this.resourceService.messages.emsg.m0005);
            }
          });
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
    this.medium = _.find(this.formFieldProperties, { code: 'medium' });
    this.class = _.find(this.formFieldProperties, { code: 'gradeLevel' });
    this.subject = _.find(this.formFieldProperties, { code: 'subject' });
    this.selectedOption = _.cloneDeep(this.formInput);
    this.onChange();
  }

  onChange() {
    if (this.selectedOption['board'] && this.selectedOption['medium'] && this.selectedOption['gradeLevel']) {
      if (this.selectedOption['board'].length > 0 && this.selectedOption['medium'].length > 0
          && this.selectedOption['gradeLevel'].length > 0) {
        this.showButton = true;
      } else {
        this.showButton = false;
      }
    }
  }

  onSubmitForm() {
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
