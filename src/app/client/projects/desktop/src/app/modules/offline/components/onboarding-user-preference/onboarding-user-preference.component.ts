import { TelemetryService, IImpressionEventInput } from '@sunbird/telemetry';
import { Router, ActivatedRoute } from '@angular/router';
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
  public telemetryImpression: IImpressionEventInput;
  submitLabel = _.upperCase(this.resourceService.frmelmnts.lbl.submit);

  constructor(public onboardingService: OnboardingService,
    public orgDetailsService: OrgDetailsService, public channelService: ChannelService,
    public frameworkService: FrameworkService, public tenantService: TenantService,
    public resourceService: ResourceService, public toasterService: ToasterService,
    public telemetryService: TelemetryService, public activatedRoute: ActivatedRoute,
    public router: Router) { }

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
      this.boardOption = _.sortBy(_.get(data, 'result.channel.frameworks'), 'index');
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
        this.mediumOption = this.onboardingService.getAssociationData(board.terms, 'medium', this.frameworkCategories);
        this.showMedium = true;
      }
    }, err => {
      this.toasterService.error(this.resourceService.messages.emsg.m0005);
    });
  }



  onMediumChange(mediumData) {
    this.classOption = [];
    this.selectedClass = '';
    this.classOption = this.onboardingService.getAssociationData(mediumData, 'gradeLevel', this.frameworkCategories);
    this.showClass = _.isEmpty(this.selectedMedium) ? false : true;
    this.selectedMedium = mediumData;
    this.disableContinueBtn = _.isEmpty(this.selectedMedium) || _.isEmpty(this.selectedClass) ? true : false;
  }

  onClassChange(classData) {
    this.selectedClass = classData;
    this.disableContinueBtn = _.isEmpty(this.selectedMedium) || _.isEmpty(this.selectedClass) ? true : false;
  }

  saveUserData() {
    this.setTelemetryInteract();
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

  setTelemetryImpression() {
    this.telemetryImpression = {
      context: { env: 'onboarding' },
      edata: {
        type: 'view',
        pageid: 'onboarding_user_preference',
        uri: this.router.url
      }
    };
  }

  setTelemetryInteract () {
    const interactData = {
      context: {
        env: 'onboarding',
        cdata: []
      },
      edata: {
        id: 'onboarding_user_preference',
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
      }
    };
      this.telemetryService.interact(interactData);
  }
}
