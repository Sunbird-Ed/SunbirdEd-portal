import { ExtPluginService, UserService } from '@sunbird/core';
import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService, ResourceService, ToasterService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { Subject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { CollectionComponent, DashboardComponent } from '../../../cbse-program';
import { programSession } from './data';
import { ICollectionComponentInput } from '../../../cbse-program/interfaces';

interface IDynamicInput {
  collectionComponentInput?: ICollectionComponentInput;
}

interface IUserParticipentDetails {
  enrolledOn: any;
  onBoarded: boolean;
  onBoardingData: object;
  programId: string;
  roles: any;
  userId: string
}

@Component({
  selector: 'app-program-component',
  templateUrl: './program.component.html'
})
export class ProgramComponent implements OnInit {

  public programId: string;
  public programDetails: any;
  public userProfile: any;
  public showLoader = true;
  public showOnboardPopup = false;
  public programSelected = false;
  public associatedPrograms: any;
  public headerComponentInput: any;
  public tabs;
  public defaultView;
  public dynamicInputs: IDynamicInput;
  private componentMapping = {
    dashboardComponent: DashboardComponent,
    // issueCertificateComponent: IssueCertificateComponent,
    collectionComponent: CollectionComponent,
    // uploadComponent: UploadContentComponent,
    // questionCreationComponent: QuestionCreationComponent,
    // playerComponent: PlayerComponent
  };

  public component;
  constructor(public resourceService: ResourceService, public configService: ConfigService, public activatedRoute: ActivatedRoute,
    public extPluginService: ExtPluginService, public userService: UserService, public toasterService: ToasterService) {
    this.programId = this.activatedRoute.snapshot.params.programId;
    localStorage.setItem('programId', this.programId);
  }

  ngOnInit() {
    this.userProfile = this.userService.userProfile;
    if (['null', null, undefined, 'undefined'].includes(this.programId)) {
      console.log('no programId found'); // TODO: need to handle this case
    }
    this.getAssociatedPrograms().subscribe(response => {
      if (response && response.result) {
        this.associatedPrograms = response.result;
      }
    }, error => {

    });
    this.fetchProgramDetails().subscribe((programDetails) => {
      this.handleOnboarding();
    }, error => {
      // TODO: navigate to program list page
      const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
      this.toasterService.error(errorMes || 'Fetching program details failed');
      this.handleHeader('failed');
    });

  }

  handleOnboarding() {
    const checkUserParticipentData = this.programDetails.userDetails ? true : false;
    if (checkUserParticipentData) {
      this.showOnboardPopup = false;
      this.handleHeader('success');
      this.initiateInputs('success');
    }
    else if (_.has(programSession, 'onBoardingForm')) {
      this.showOnboardPopup = true;
      this.handleHeader('success');
      this.initiateInputs('success');
    }
    else {
      this.userOnbording();
      this.showOnboardPopup = false;
    }
  }

  userOnbording(): any {
    const req = {
      url: `program/v1/add/participant`,
      data: {
        request: {
          programId: this.programDetails.programId,
          userId: this.userService.userid,
          onBoarded: true
        }
      }
    };
    this.extPluginService.post(req).subscribe((data) => {
      this.setUserParticipentDetails(data);
    }, error => {
      this.toasterService.error(_.get(error, 'error.params.errmsg') || 'User onbording fails');
    });
  }

  setUserParticipentDetails(data: { [x: string]: { [x: string]: any; }; }) {
    const userDetails: IUserParticipentDetails = {
      enrolledOn: data['ts'],
      onBoarded: true,
      onBoardingData: {},
      programId: data['result']['programId'],
      roles: ['CONTRIBUTOR'],
      userId: this.userService.userid
    };
    this.programDetails['userDetails'] = userDetails;
    this.handleHeader('success');
    this.initiateInputs('success');
  }

  initiateInputs(status) {
    this.dynamicInputs = {
      collectionComponentInput: {
        programDetails: this.programDetails,
        userProfile: this.userProfile,
        config: _.find(programSession.components, { 'id': 'ng.sunbird.collection' }), // TODO: change programSession to programDetails
        entireConfig: programSession
      }
    };
  }

  handleHeader(status) {
    // console.log(programSession);
    if (status === 'success') {
      this.headerComponentInput = {
        roles: _.get(programSession, 'roles'),
        actions: _.get(programSession, 'actions'),
        header: _.get(programSession, 'header'),
        userDetails: _.get(this.programDetails, 'userDetails')
      };
      this.tabs = _.get(programSession, 'header.config.tabs');

      if (this.tabs) {
        // const tab = _.find(this.tabs, (obj) => {
        //   return obj.roles.includes(this.programDetails.userDetails.roles[0]);  // TODO: Have to change to current role
        // });
        // this.defaultView = _.find(programSession['header'].config.tabs, { 'index': tab.activeTab }).onClick;
        this.defaultView = _.find(this.tabs, { 'index': this.getDefaultActiveTab() });
        this.component = this.componentMapping[this.defaultView.onClick];
      }
    } else {
      console.log('program fetch failed'); // TODO: Have to change toaster
    }
  }

  getDefaultActiveTab() {
    const defaultView = _.find(programSession.roles, { 'name': this.programDetails.userDetails.roles[0] });
    if (defaultView) {
      return defaultView.defaultTab;
    } else {
      return 1;
    }
  }

  getAssociatedPrograms() {
    const req = {
      url: `program/v1/list`,
      data: {
        'request': {
          'filters': {
            'userId': this.userService.userid
          }
        }
      }
    };
    return this.extPluginService.post(req).pipe(map(res => {
      console.log(res);
      return res;
    }));
  }

  fetchProgramDetails() {
    const req = {
      // url: `${this.configService.urlConFig.URLS.CONTENT.GET}/${contentId}`,
      url: `program/v1/read/${this.programId}`,
      param: { userId: this.userService.userid }
    };
    return this.extPluginService.get(req).pipe(tap(programDetails => {
      this.programDetails = programDetails.result;
      this.showLoader = false;
    }));
  }

  tabChangeHandler(e) {
    this.component = this.componentMapping[e];
  }

  handleOnboardEvent(event) {
    this.fetchProgramDetails().subscribe((programDetails) => {
      this.showOnboardPopup = false;
      this.ngOnInit();
    }, error => {
      // TODO: navigate to program list page
      this.toasterService.error(_.get(error, 'error.params.errmsg') || 'Fetching program details failed');
    });
  }
}
