import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
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
        this.mediumOption = this.getAssociationData(board.terms, 'medium');
      }
    }, err => {
    });
  }
  onMediumChange() {
    this.classOption = [];
    this.classOption = this.getAssociationData(this.contentPreferenceForm.value.medium, 'gradeLevel');
  }

  onClassChange() {
    this.subjectsOption = this.getAssociationData(this.contentPreferenceForm.value.class, 'subject');

  }
  getAssociationData(selectedData: Array<any>, category: string) {
    // Getting data for selected parent, eg: If board is selected it will get the medium data from board array
    let selectedCategoryData = [];
    _.forEach(selectedData, (data) => {
      const categoryData = _.filter(data.associations, (o) => {
        return o.category === category;
      });
      if (categoryData) {
        selectedCategoryData = _.concat(selectedCategoryData, categoryData);
      }
    });

    // Getting associated data from next category, eg: If board is selected it will get the association data for medium
    let associationData;
    _.forEach(this.frameworkCategories, (data) => {
      if (data.code === category) {
        associationData = data.terms;
      }
    });

    // Mapping the final data for next drop down
    let resultArray = [];
    _.forEach(selectedCategoryData, (data) => {
      const codeData = _.find(associationData, (element) => {
        return element.code === data.code;
      });
      if (codeData) {
        resultArray = _.concat(resultArray, codeData);
      }
    });

    return _.sortBy(_.unionBy(resultArray, 'identifier'), 'index');
  }

  updateUserPreferenece() {
    this.userService.saveLocation(this.contentPreferenceForm.getRawValue()).subscribe(() => {

    }, error => {
    });
  }
  closeModal() {
    this.dismissed.emit();
  }
}
