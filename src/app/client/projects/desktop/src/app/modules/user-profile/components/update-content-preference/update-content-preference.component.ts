import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { OrgDetailsService, ChannelService, FrameworkService } from '@sunbird/core';

import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { OnboardingService } from '../../../offline/services/onboarding/onboarding.service';
import * as _ from 'lodash-es';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-update-content-preference',
  templateUrl: './update-content-preference.component.html',
  styleUrls: ['./update-content-preference.component.scss']
})
export class UpdateContentPreferenceComponent implements OnInit, OnDestroy {
  contentPreferenceForm: FormGroup;
  boardOption = [];
  mediumOption = [];
  classOption = [];
  subjectsOption = [];
  frameworkCategories: any;
  @Input() userLocationData;
  @Output() dismissed = new EventEmitter<any>();
  public unsubscribe$ = new Subject<void>();
  constructor(
    public resourceService: ResourceService,
    private formBuilder: FormBuilder,
    public userService: OnboardingService,
    public orgDetailsService: OrgDetailsService,
    public channelService: ChannelService,
    public frameworkService: FrameworkService,
    public toasterService: ToasterService,
  ) { }
  ngOnInit() {
    this.createContentPreferenceForm();
    this.getCustodianOrg();
  }

  createContentPreferenceForm() {
    this.contentPreferenceForm = this.formBuilder.group({
      'board': ['', Validators.compose([Validators.required])],
      'medium': ['', Validators.compose([Validators.required])],
      'subjects': ['', Validators.compose([])],
      'class': ['', Validators.compose([Validators.required])],
    });
  }

  getCustodianOrg() {
    this.orgDetailsService.getCustodianOrgDetails()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        this.readChannel(_.get(data, 'result.response.value'));
      });
  }

  readChannel(custodianOrgId) {
    this.channelService.getFrameWork(custodianOrgId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        this.boardOption = _.get(data, 'result.channel.frameworks');
        this.contentPreferenceForm.controls['board'].setValue(_.find(this.boardOption, { name: this.userLocationData['board'] }));
        this.onBoardChange();
      }, err => {
      });
  }
  onBoardChange() {
    this.mediumOption = [];
    this.classOption = [];
    this.subjectsOption = [];
    if (this.contentPreferenceForm.value.board) {
      this.frameworkService.getFrameworkCategories(_.get(this.contentPreferenceForm.value.board, 'identifier'))
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((data) => {
          if (data && _.get(data, 'result.framework.categories')) {
            this.frameworkCategories = _.get(data, 'result.framework.categories');
            const board = _.find(this.frameworkCategories, (element) => {
              return element.code === 'board';
            });
            this.mediumOption = this.userService.getAssociationData(board.terms, 'medium', this.frameworkCategories);

            this.contentPreferenceForm.controls['medium'].setValue(this.filterContent(this.mediumOption, this.userLocationData['medium']));

            this.onMediumChange();

          }
        }, err => {
        });
    }

  }
  filterContent(filterArray, content) {
    const array = [];
    // tslint:disable-next-line: no-shadowed-variable
    _.forEach(content, (data) => {
      const filter = this.getSelecteddata(filterArray, data);
      array.push(filter);
    });
    return array;
  }
  getSelecteddata(filterArray, content) {
    return _.find(filterArray, { name: content });
  }
  onMediumChange() {
    this.classOption = [];
    if (this.contentPreferenceForm.value.medium) {
      this.classOption = this.userService.getAssociationData(this.contentPreferenceForm.value.medium, 'gradeLevel', this.frameworkCategories);

      this.contentPreferenceForm.controls['class'].setValue(this.filterContent(this.classOption, this.userLocationData['gradeLevel']));

      this.onClassChange();
    }

  }

  onClassChange() {
    this.subjectsOption = this.userService.getAssociationData(this.contentPreferenceForm.value.class, 'subject', this.frameworkCategories);

  }

  updateUserPreferenece() {
    this.userService.saveLocation(this.contentPreferenceForm.getRawValue())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.toasterService.success(this.resourceService.messages.smsg.m0061);

      }, error => {
        this.toasterService.error(this.resourceService.messages.emsg.m0025);

      });
  }
  closeModal() {
    this.dismissed.emit();
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
