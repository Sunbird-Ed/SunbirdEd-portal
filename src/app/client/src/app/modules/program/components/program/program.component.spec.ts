import { async, TestBed, inject, ComponentFixture } from '@angular/core/testing';
import { SharedModule } from '@sunbird/shared';
import { FrameworkService, UserService, ExtPluginService } from '@sunbird/core';
import { configureTestSuite } from '@sunbird/test-util';
import { DynamicModule } from 'ng-dynamic-component';
import { ProgramComponent } from './program.component';
import * as _ from 'lodash-es';
import {  throwError , of } from 'rxjs';
// tslint:disable-next-line:max-line-length
import { addParticipentResponseSample, userProfile,  frameWorkData, programDetailsWithOutUserDetails,
  programDetailsWithOutUserAndForm, extFrameWorkPostData, programDetailsWithUserDetails } from './program.component.spec.data';
import { CollectionComponent } from '../../../cbse-program/components/collection/collection.component';
import { ProgramHeaderComponent } from '../program-header/program-header.component';
import { OnboardPopupComponent } from '../onboard-popup/onboard-popup.component';
// tslint:disable-next-line:prefer-const
let errorInitiate;
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule } from '@angular/forms';
import { TelemetryModule } from '@sunbird/telemetry';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';

const userServiceStub = {
  get() {
    if (errorInitiate) {
      return throwError ({
        result: {
          responseCode: 404
        }
      });
    } else {
      return of(addParticipentResponseSample);
    }
  },
  userid: userProfile.userId,
  userProfile : userProfile

};

const extPluginServiceStub = {
  get() {
    if (errorInitiate) {
      return throwError ({
        result: {
          responseCode: 404
        }
      });
    } else {
      return of({err: null, result: programDetailsWithUserDetails});
    }
  },
  post() {
    if (errorInitiate) {
      return throwError ({
        result: {
          responseCode: 404
        }
      });
    } else {
      return of(extFrameWorkPostData);
    }
  }
};


const frameworkServiceStub = {
  initialize() {
    return null;
  },
  frameworkData$:  of(frameWorkData)
};

describe('ProgramComponent On Bording test', () => {
  let component: ProgramComponent;
  let fixture: ComponentFixture<ProgramComponent>;

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const fakeActivatedRoute = {
    snapshot: {
      params: {
        programId: '6835f250-1fe1-11ea-93ea-2dffbaedca40'
      },
      data: {
        telemetry: {
          env: 'programs'
        }
      }
    }
  };
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DynamicModule,
        SuiModule,
        SharedModule.forRoot(),
        FormsModule,
        TelemetryModule.forRoot(),
        HttpClientTestingModule
      ],
      declarations: [
        ProgramComponent,
        OnboardPopupComponent,
        ProgramHeaderComponent
      ],
      providers: [
        {
          provide: Router,
          useClass: RouterStub
        }, {
          provide: FrameworkService,
          useValue: frameworkServiceStub
        },
        {
          provide: UserService,
          useValue: userServiceStub
        },
        {
          provide: ActivatedRoute,
          useValue: fakeActivatedRoute
        },
        {
          provide: ExtPluginService,
          useValue: extPluginServiceStub
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should have a defined component', () => {
    expect(component).toBeDefined();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should execute OnboardEvent on initialization of component', () => {
    spyOn(component, 'initiateOnboarding');
    component.ngOnInit();
    expect(component.initiateOnboarding).toHaveBeenCalled();
  });

  it('should execute OnboardEvent on initialization of component', () => {
    component.programId = null;
    component.ngOnInit();
  });


  it('should call fetchProgramDetails', inject([HttpTestingController],
    (httpMock: HttpTestingController) => {
      component.fetchProgramDetails();
    })
  );
  it('should fetchFrameWorkDetails be called', () => {
    component.sessionContext.framework = 'NCFCOPY';

    component.fetchFrameWorkDetails();
    expect(component.sessionContext.frameworkData.length).toBeGreaterThan(0);
  });


  it('should open onboarding pop up', () => {
    spyOn(component, 'userOnboarding');
    component.ngOnInit();
    expect(component.userOnboarding).not.toHaveBeenCalled();
  });

  it('onboarding popup property should be initiated as false', () => {
    spyOn(component, 'userOnboarding');
    component.ngOnInit();
    expect(component.showOnboardPopup).toBe(false);
  });


  it('should not trigger the onboard popup as participant details are available in DB', () => {
    spyOn(component, 'userOnboarding');
    component.programDetails = programDetailsWithUserDetails;
    component.handleOnboarding();
    expect(component.showOnboardPopup).toBe(false);
    expect(component.userOnboarding).not.toHaveBeenCalled();
  });

  it('should trigger the onboard popup as participant details are not available in DB', () => {
    component.programDetails = programDetailsWithOutUserDetails;
    component.handleOnboarding();
    spyOn(component, 'userOnboarding');
    expect(component.showOnboardPopup).toBe(true);
    expect(component.userOnboarding).not.toHaveBeenCalled();
  });

  it('should not trigger the onboard popup as no onboarding form even though no user details are available in DB', () => {
    spyOn(component, 'userOnboarding');
    component.programDetails = programDetailsWithOutUserAndForm;
    component.handleOnboarding();
    expect(component.userOnboarding).toHaveBeenCalled();
  });


  it('should userOnboarding be triggered', () => {
    spyOn(component, 'setUserParticipantDetails');
    component.userOnboarding();
    expect(component.setUserParticipantDetails).toHaveBeenCalledWith({data: extFrameWorkPostData, onBoardingData: {}});
    // expect(component.programDetails.userDetails) =
  });


  it('should set userDetails when calling setUserParticipantDetails', () => {
    const userDetailsMock = {
      enrolledOn: extFrameWorkPostData.ts,
      onBoarded: true,
      onBoardingData: {},
      programId: extFrameWorkPostData.result.programId,
      roles: ['CONTRIBUTOR'], // TODO: get default role from config
      userId: component.userService.userid
    };
    component.setUserParticipantDetails({data: extFrameWorkPostData, onBoardingData: {}});
    expect(component.programDetails.userDetails).toEqual(jasmine.objectContaining(userDetailsMock));
  });


  it('should tabChangeHandler be triggered', () => {
    component.tabChangeHandler('collectionComponent');
    expect(component.component).toBe(CollectionComponent);
  });

  it('should changeView be called when stages is empty', () => {
    component.changeView();
    expect(component.currentStage).toBeUndefined();
  });

  it('should changeView be called when stages is not empty', () => {
    component.state.stages = [
      {
        'stageId': 1,
        'stage': 'collectionComponent'
      }
    ];
    component.changeView();
    expect(component.currentStage).toBe('collectionComponent');
  });


  it('should getDefaultActiveTab be called', () => {
    component.programDetails = programDetailsWithUserDetails;
    expect(component.getDefaultActiveTab()).toEqual(1);
  });

  it('should initiateHeader be called', () => {
    component.initiateHeader('failure');
  });


  it('should unsubscribe subject', () => {
    component.ngOnDestroy();
  });
});
