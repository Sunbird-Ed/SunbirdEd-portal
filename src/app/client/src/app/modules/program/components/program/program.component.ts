import { ExtPluginService, UserService, FrameworkService } from '@sunbird/core';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService, ResourceService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { tap, map, first } from 'rxjs/operators';
import { CollectionComponent, DashboardComponent } from '../../../cbse-program';
import { ICollectionComponentInput, IDashboardComponentInput } from '../../../cbse-program/interfaces';
import { InitialState, ISessionContext, IUserParticipantDetails } from '../../interfaces';
import { ProgramStageService, ProgramComponentsService } from '../../services/';
import { IImpressionEventInput } from '@sunbird/telemetry';
interface IDynamicInput {
  collectionComponentInput?: ICollectionComponentInput;
  dashboardComponentInput?: IDashboardComponentInput;
}
@Component({
  selector: 'app-program-component',
  templateUrl: './program.component.html'
})
export class ProgramComponent implements OnInit, OnDestroy, AfterViewInit {
  public programId: string;
  public programDetails: any;
  public userProfile: any;
  public showLoader = true;
  public showTabs = true;
  public showOnboardPopup = false;
  public programSelected = false;
  public associatedPrograms: any;
  public headerComponentInput: any;
  public stageSubscription: any;
  public tabs;
  public showStage;
  public defaultView;
  public dynamicInputs: IDynamicInput;
  public component: any;
  private componentMapping = {
    dashboardComponent: DashboardComponent,
    collectionComponent: CollectionComponent,
  };
  public sessionContext: ISessionContext = {};
  public state: InitialState = {
    stages: []
  };
  public currentStage: any;
  public telemetryImpression: IImpressionEventInput;
  outputs = {
    isCollectionSelected: (check) => {
      this.showTabs = false;
    }
  };
  public telemetryPageId = 'collection';
  constructor(public frameworkService: FrameworkService, public resourceService: ResourceService,
    public configService: ConfigService, public activatedRoute: ActivatedRoute, private router: Router,
    public extPluginService: ExtPluginService, public userService: UserService,
    public toasterService: ToasterService, public programStageService: ProgramStageService,
    public programComponentsService: ProgramComponentsService,
    private navigationHelperService: NavigationHelperService) {
    this.programId = this.activatedRoute.snapshot.params.programId;
    localStorage.setItem('programId', this.programId);
  }
  ngOnInit() {
    this.initiateOnboarding();
    this.programStageService.initialize();
    this.stageSubscription = this.programStageService.getStage().subscribe(state => {
      this.state.stages = state.stages;
      this.changeView();
    });
    if (['null', null, undefined, 'undefined'].includes(this.programId)) {
      console.log('no programId found'); // TODO: need to handle this case
    }
  }
  ngAfterViewInit() {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    const telemetryCdata = [{ 'type': 'Program', 'id': this.programId }];
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env,
          cdata: telemetryCdata || [],
          pdata: {
            id: this.userService.appId,
            ver: version,
            pid: `${this.configService.appConfig.TELEMETRY.PID}.programs`
          }
        },
        edata: {
          type: _.get(this.activatedRoute, 'snapshot.data.telemetry.type'),
          pageid: this.telemetryPageId,
          uri: this.router.url,
          subtype: _.get(this.activatedRoute, 'snapshot.data.telemetry.subtype'),
          duration: this.navigationHelperService.getPageLoadTime()
        }
      };
    });
  }
  initiateOnboarding() {
    this.fetchProgramDetails().subscribe((programDetails) => {
      this.handleOnboarding();
    }, error => {
      // TODO: navigate to program list page
      const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
      this.toasterService.error(errorMes || 'Fetching program details failed');
      this.initiateHeader('failed');
    });
  }

  fetchProgramDetails() { // Getting Program Configuration
    const req = {
      // url: `${this.configService.urlConFig.URLS.CONTENT.GET}/${contentId}`,
      url: `program/v1/read/${this.programId}`,
      param: { userId: this.userService.userid }
    };
    return this.extPluginService.get(req).pipe(tap((programDetails: any) => {
      this.programDetails = programDetails.result;
      this.sessionContext.framework = _.get(this.programDetails, 'config.framework');
      if (this.sessionContext.framework) {
        this.userProfile = this.userService.userProfile;
        this.fetchFrameWorkDetails();
      }
    }));
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
  handleOnboarding() {
    const checkUserParticipentData = _.has(this.programDetails, 'userDetails') ? true : false;
    if (checkUserParticipentData) {
      this.showOnboardPopup = false;
      this.initiateHeader('success');
    } else if (_.has(this.programDetails.config, 'onBoardingForm')) {
      this.showOnboardPopup = true;
      //  this.initiateHeader('success');
    } else {
      this.userOnboarding();
    }
  }
  userOnboarding(): any {
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
      this.setUserParticipantDetails({
        data: data,
        onBoardingData: {}
      });
    }, error => {
      this.toasterService.error(_.get(error, 'error.params.errmsg') || 'User onboarding failed');
    });
  }

  setUserParticipantDetails(event) {
    this.showOnboardPopup = false;
    const userDetails: IUserParticipantDetails = {
      enrolledOn: event.data.ts,
      onBoarded: true,
      onBoardingData: event.onBoardingData,
      programId: event.data.result.programId,
      roles: ['CONTRIBUTOR'], // TODO: get default role from config
      userId: this.userService.userid
    };
    this.programDetails['userDetails'] = userDetails;
    this.initiateHeader('success');
  }

  initiateInputs() {
    this.showLoader = false;
    this.dynamicInputs = {
      collectionComponentInput: {
        sessionContext: this.sessionContext,
        userProfile: this.userProfile,
        config: _.find(this.programDetails.config.components, { 'id': 'ng.sunbird.collection' }),
        programContext: this.programDetails
      },
      dashboardComponentInput: {
        sessionContext: this.sessionContext,
        programContext: this.programDetails
      }
    };
  }
  initiateHeader(status) {
    if (status === 'success') {
      this.headerComponentInput = {
        roles: _.get(this.programDetails.config, 'roles'),
        actions: _.get(this.programDetails.config, 'actions'),
        header: _.get(this.programDetails.config, 'header'),
        userDetails: _.get(this.programDetails, 'userDetails'),
        showTabs: this.showTabs
      };
      this.tabs = _.get(this.programDetails.config, 'header.config.tabs');
      if (this.tabs && this.programDetails.userDetails) {
        this.defaultView = _.find(this.tabs, { 'index': this.getDefaultActiveTab() });
        this.programStageService.addStage(this.defaultView.onClick);
        this.component = this.programComponentsService.getComponentInstance(this.defaultView.onClick);
      }
      this.initiateInputs();
    } else {
      this.toasterService.error('Fetching program details failed');
    }
  }
  changeView() {
    if (!_.isEmpty(this.state.stages)) {
      this.currentStage = _.last(this.state.stages).stage;
    }
  }

  getDefaultActiveTab() {
    const defaultView = _.find(this.programDetails.config.roles, { 'name': this.programDetails.userDetails.roles[0] });
    return (defaultView) ? defaultView.defaultTab : 1;
  }

  tabChangeHandler(e) {
    this.component = this.programComponentsService.getComponentInstance(e);
  }

  ngOnDestroy() {
    this.stageSubscription.unsubscribe();
  }
}
