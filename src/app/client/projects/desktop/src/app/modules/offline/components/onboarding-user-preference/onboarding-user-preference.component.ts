import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { OnboardingService } from './../../services';
import { OrgDetailsService, ChannelService, FrameworkService, TenantService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { retry } from 'rxjs/operators';

@Component({
  selector: 'app-onboarding-user-preference',
  templateUrl: './onboarding-user-preference.component.html',
  styleUrls: ['./onboarding-user-preference.component.scss']
})
export class OnboardingUserPreferenceComponent implements OnInit {

  boardOption: Array<any>;
  mediumOption: Array<any>;
  classOption: Array<any>;
  selectedBoard: any;
  selectedMedium: any;
  selectedClass: any;
  frameworkCategories: any;
  showMedium = false;
  showClass = false;
  disableContinueBtn = true;
  tenantInfo: any = {};
  @Output() userPreferenceSaved = new EventEmitter();
  submitLabel = _.upperCase(this.resourceService.frmelmnts.lbl.submit);

  constructor(public onboardingService: OnboardingService,
    public orgDetailsService: OrgDetailsService, public channelService: ChannelService,
    public frameworkService: FrameworkService, public tenantService: TenantService,
    public resourceService: ResourceService, public toasterService: ToasterService) { }

  ngOnInit() {
    this.tenantService.tenantData$.subscribe(({tenantData}) => {
      this.tenantInfo.logo = tenantData ? tenantData.logo : undefined;
      this.tenantInfo.titleName = (tenantData && tenantData.titleName) ? tenantData.titleName.toUpperCase() : undefined;
    });

    this.orgDetailsService.getCustodianOrg().subscribe(data => {
      this.readChannel(_.get(data, 'result.response.value'));
    });
  }

  readChannel(custodianOrgId) {
    this.channelService.getFrameWork(custodianOrgId).subscribe(data => {
      this.boardOption = _.get(data, 'result.channel.frameworks');
    }, err => {
      this.toasterService.error(this.resourceService.messages.emsg.m0005);
    });
  }

  onBoardChange(option) {
    this.mediumOption = [];
    this.selectedMedium = '';
    this.classOption = [];
    this.selectedClass = '';
    this.showMedium = false;
    this.showClass = false;
    this.disableContinueBtn = true;
    this.frameworkService.getFrameworkCategories(_.get(option, 'identifier')).subscribe((data) => {
      if (data && _.get(data, 'result.framework.categories')) {
        this.frameworkCategories = _.get(data, 'result.framework.categories');
        const board = _.find(this.frameworkCategories, (element) => {
          return element.code === 'board';
        });
        this.mediumOption = this.getAssociationData(board.terms, 'medium');
        this.showMedium = true;
      }
    }, err => {
      this.toasterService.error(this.resourceService.messages.emsg.m0005);
    });
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

  onMediumChange(mediumData) {
    this.classOption = [];
    this.selectedClass = '';
    this.classOption = this.getAssociationData(mediumData, 'gradeLevel');
    this.showClass = true;
    this.selectedMedium = mediumData;
    this.disableContinueBtn = _.isEmpty(this.selectedMedium) || _.isEmpty(this.selectedClass) ? true : false;
  }

  onClassChange(classData) {
    this.selectedClass = classData;
    this.disableContinueBtn = _.isEmpty(this.selectedMedium) || _.isEmpty(this.selectedClass) ? true : false;
  }

  saveUserData() {
    const requestData = {
      'request': {
        'framework': {
          'id': _.get(this.orgDetailsService, 'orgDetails.hashTagId'),
          'board': _.get(this.selectedBoard, 'name'),
          'medium': _.map(this.selectedMedium, 'name'),
          'gradeLevel': _.map(this.selectedClass, 'name')
        }
      }
    };

    this.onboardingService.saveUserPreference(requestData).subscribe(data => {
      this.getUserData();
    }, err => {
      this.toasterService.error(this.resourceService.messages.emsg.m0022);
      this.getUserData();
    });
  }

  getUserData() {
    this.onboardingService.getUser().pipe(retry(3))
    .subscribe((response) => {
      this.userPreferenceSaved.emit('SUCCESS');
    }, (error) => {
      this.userPreferenceSaved.emit('SUCCESS');
    });
  }

  setTelemetryData () {
    return {
      id: 'onboarding_user-preference',
      type: 'click',
      pageid: 'onboarding_user_preference',
      extra: {
        'framework': {
          'id': _.get(this.orgDetailsService, 'orgDetails.hashTagId'),
          'board': _.get(this.selectedBoard, 'name'),
          'medium': _.map(this.selectedMedium, 'name'),
          'gradeLevel': _.map(this.selectedClass, 'name')
        }
      }
    };
  }
}
