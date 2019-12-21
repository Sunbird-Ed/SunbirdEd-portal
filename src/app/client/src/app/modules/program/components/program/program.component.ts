import { ExtPluginService, UserService, FrameworkService } from '@sunbird/core';
import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService, ResourceService, ToasterService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { Subject } from 'rxjs';
import { tap, map, first } from 'rxjs/operators';
import { CollectionComponent, DashboardComponent } from '../../../cbse-program';
import { programSession } from './data';
import { ICollectionComponentInput } from '../../../cbse-program/interfaces';
import { InitialState, ISessionContext, IUserParticipentDetails } from '../../interfaces';
import { ProgramStageService } from '../../services/';

interface IDynamicInput {
  collectionComponentInput?: ICollectionComponentInput;
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
  public showTabs = true;
  public showOnboardPopup:boolean = true;
  public programSelected = false;
  public associatedPrograms: any;
  public headerComponentInput: any;
  public tabs;
  public showStage;
  public defaultView;
  public dynamicInputs: IDynamicInput;
  public component;
  private componentMapping = {
    dashboardComponent: DashboardComponent,
    collectionComponent: CollectionComponent,
  };
  public sessionContext: ISessionContext = {};
  public state: InitialState = {
    stages: []
  };
  public currentStage: any;

  outputs = {
    isCollectionSelected: (check) => {
      this.showTabs = false;
    }
  };

  constructor(public frameworkService: FrameworkService, public resourceService: ResourceService,
    public configService: ConfigService, public activatedRoute: ActivatedRoute,
    public extPluginService: ExtPluginService, public userService: UserService,
    public toasterService: ToasterService, public programStageService: ProgramStageService) {
    this.programId = this.activatedRoute.snapshot.params.programId;
    localStorage.setItem('programId', this.programId);
  }

  ngOnInit() {
    this.handleOnboardEvent(event);
    this.programStageService.getStage().subscribe(state => {
      this.state.stages = state.stages;
      this.changeView();
    });
    this.sessionContext.framework = _.get(programSession, 'config.framework');
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
    this.fetchFrameWorkDetails();
  }

  handleOnboardEvent(event) {
    this.fetchProgramDetails().subscribe((programDetails) => {
      this.handleOnboarding(event);
    }, error => {
      // TODO: navigate to program list page
      const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
      this.toasterService.error(errorMes || 'Fetching program details failed');
      this.handleHeader('failed');
    });
  }

  public fetchFrameWorkDetails() {
    this.frameworkService.initialize(this.sessionContext.framework);
    this.frameworkService.frameworkData$.pipe(first()).subscribe((frameworkDetails: any) => {
      if (frameworkDetails && !frameworkDetails.err) {
        this.sessionContext.frameworkData = frameworkDetails.frameworkdata[this.sessionContext.framework].categories;
      }
    }, error => {
      const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
      this.toasterService.error(errorMes || 'Fetching framework details failed');
    });
  }

  handleOnboarding(event) {
    const checkUserParticipentData = _.has(this.programDetails, 'userDetails') ? true : false;
    if (checkUserParticipentData) {
      this.showOnboardPopup = false;
      this.handleHeader('success');
    } else if (_.has(programSession.config, 'onBoardingForm')) {
      this.showOnboardPopup = true;
      this.handleHeader('success');
    } else {
      this.userOnbording(event);
      this.showOnboardPopup = false;
    }
    this.initiateInputs('success');
  }


  userOnbording(event): any {
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

  setUserParticipentDetails(data) {
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
  }

  initiateInputs (status) {
    this.dynamicInputs = {
      collectionComponentInput:  {
        programDetails: this.programDetails,
        sessionContext: this.sessionContext,
        userProfile: this.userProfile,
        config: _.find(programSession.config.components, {'id': 'ng.sunbird.collection'}), // TODO: change programSession to programDetails
        programContext: programSession
      }
    };
  }


  handleHeader(status) {
    if (status === 'success') {
      this.headerComponentInput = {
        roles: _.get(programSession.config, 'roles'),
        actions: _.get(programSession.config, 'actions'),
        header: _.get(programSession.config, 'header'),
        userDetails: _.get(this.programDetails, 'userDetails'),
        showTabs: this.showTabs
      };
      this.tabs = _.get(programSession.config, 'header.config.tabs');

      if (this.tabs) {
        this.defaultView = _.find(this.tabs, {'index': this.getDefaultActiveTab()});
        this.programStageService.addStage(this.defaultView.onClick);
        this.component = this.componentMapping[this.defaultView.onClick];
      }
      this.showLoader = false;
    } else {
      this.toasterService.error('Fetching program details failed');
    }
  }

  changeView() {
    if (!_.isEmpty(this.state.stages)) {
      this.currentStage  = _.last(this.state.stages).stage;
    }
  }


  getDefaultActiveTab () {
   const defaultView =  _.find(programSession.config.roles, {'name': this.programDetails.userDetails.roles[0]});
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
    }));
  }

  tabChangeHandler(e) {
    this.component = this.componentMapping[e];
  }

}
