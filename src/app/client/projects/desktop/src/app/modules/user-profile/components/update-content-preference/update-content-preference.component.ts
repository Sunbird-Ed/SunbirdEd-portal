import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { OrgDetailsService, ChannelService, FrameworkService } from '@sunbird/core';

import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { OnboardingService } from '../../../offline/services/onboarding/onboarding.service';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-update-content-preference',
  templateUrl: './update-content-preference.component.html',
  styleUrls: ['./update-content-preference.component.scss']
})
export class UpdateContentPreferenceComponent implements OnInit {
  contentPreferenceForm: FormGroup;
  boardOption = [];
  mediumOption = [];
  classOption = [];
  subjectsOption = [];
  frameworkCategories: any;
  @Input() userLocationData;
  @Output() dismissed = new EventEmitter<any>();
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
    this.orgDetailsService.getCustodianOrgDetails().subscribe(data => {
      this.readChannel(_.get(data, 'result.response.value'));
    });
  }

  readChannel(custodianOrgId) {
    this.channelService.getFrameWork(custodianOrgId).subscribe(data => {
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
    this.frameworkService.getFrameworkCategories(_.get(this.contentPreferenceForm.value.board, 'identifier')).subscribe((data) => {
      if (data && _.get(data, 'result.framework.categories')) {
        this.frameworkCategories = _.get(data, 'result.framework.categories');
        const board = _.find(this.frameworkCategories, (element) => {
          return element.code === 'board';
        });
        this.mediumOption = this.userService.getAssociationData(board.terms, 'medium', this.frameworkCategories);
      this.contentPreferenceForm.controls['medium'].setValue(_.find(this.mediumOption, { name: this.userLocationData['medium'] }));
      }
    }, err => {
    });
  }
  onMediumChange() {
    this.classOption = [];
    this.classOption = this.userService.getAssociationData(this.contentPreferenceForm.value.medium, 'gradeLevel', this.frameworkCategories);
  }

  onClassChange() {
    this.subjectsOption = this.userService.getAssociationData(this.contentPreferenceForm.value.class, 'subject', this.frameworkCategories);

  }

  updateUserPreferenece() {
    this.userService.saveLocation(this.contentPreferenceForm.getRawValue()).subscribe(() => {
      this.toasterService.success(this.resourceService.messages.smsg.m0061);

    }, error => {
      this.toasterService.error(this.resourceService.messages.emsg.m0025);

    });
  }
  closeModal() {
    this.dismissed.emit();
  }
}
