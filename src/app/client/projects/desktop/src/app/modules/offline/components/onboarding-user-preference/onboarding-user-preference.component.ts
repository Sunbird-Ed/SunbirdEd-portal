import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { OnboardingService } from './../../services';
import { OrgDetailsService, ChannelService, FrameworkService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { ResourceService, ToasterService } from '@sunbird/shared';

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
  @Output() userPreferenceSaved = new EventEmitter();
  submitLabel = _.upperCase(this.resourceService.frmelmnts.lbl.submit);

  constructor(public onboardingService: OnboardingService,
    public orgDetailsService: OrgDetailsService, public channelService: ChannelService,
    public frameworkService: FrameworkService,
    public resourceService: ResourceService, public toasterService: ToasterService) { }

  ngOnInit() {
    this.orgDetailsService.getOrgDetails().subscribe(orgdata => {
      this.readChannel();
    }, err => {
      this.toasterService.error(this.resourceService.messages.emsg.m0005);
    });
  }

  readChannel() {
    this.channelService.getFrameWork(_.get(this.orgDetailsService, 'orgDetails.hashTagId')).subscribe(data => {
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
        this.setFrameworkData();
      }
    }, err => {
      this.toasterService.error(this.resourceService.messages.emsg.m0005);
    });
  }

  setFrameworkData() {
    this.frameworkCategories.forEach(element => {
      switch (element.code) {
        case 'medium':
          this.mediumOption = element.terms.map(medium => medium);
          this.showMedium = true;
          break;
        case 'gradeLevel':
          this.classOption = element.terms.map(gradeLevel => gradeLevel);
          break;
      }
    });
  }

  onMediumChange(mediumData) {
    console.log('mediumData', JSON.stringify(mediumData));
    this.showClass = true;
    this.selectedMedium = mediumData;
    this.disableContinueBtn = _.isEmpty(this.selectedMedium) || _.isEmpty(this.selectedClass) ? true : false;
  }

  onClassChange(classData) {
    console.log('classData', JSON.stringify(classData));
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
      this.toasterService.success(this.resourceService.messages.smsg.m0058);
      this.userPreferenceSaved.emit('SUCCUSS');
    }, err => {
      this.toasterService.error(this.resourceService.messages.emsg.m0022);
      this.userPreferenceSaved.emit('ERROR');
    });
  }

  setTelemetryData () {
    return {
      id: 'onboarding_user-preference',
      type: 'click',
      pageid: 'onboarding_user_preference_setting',
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
