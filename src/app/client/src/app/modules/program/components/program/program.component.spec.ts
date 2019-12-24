import { async, TestBed, inject, ComponentFixture } from '@angular/core/testing';
import { SharedModule } from '@sunbird/shared';
import { DynamicModule } from 'ng-dynamic-component';
import { ProgramComponent } from './program.component';
import { of as observableOf, throwError as observableError, of } from 'rxjs';
// tslint:disable-next-line:max-line-length
import { addParticipentResponseSample, programSession, userDetails, programDetailsWithOutUserDetails, programDetailsWithUserDetails } from './program.component.spec.data';
import { DebugElement } from '@angular/core';
import { ProgramHeaderComponent } from '../program-header/program-header.component';
import { OnboardPopupComponent } from '../onboard-popup/onboard-popup.component';
let errorInitiate, de: DebugElement;
import { SuiTabsModule, SuiModule } from 'ng2-semantic-ui';
import { FormsModule } from '@angular/forms';
import { TelemetryModule } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

const userServiceStub = {
  get() {
    if (errorInitiate) {
      return observableError({
        result: {
          responseCode: 404
        }
      });
    } else {
      return observableOf(addParticipentResponseSample);
    }
  }
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
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DynamicModule.withComponents([]),
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
        },
        {
          provide: ActivatedRoute,
          useValue: fakeActivatedRoute
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

  it('should open onbording pop up', () => {
    spyOn(component, 'userOnboarding');
    component.ngOnInit();
    expect(component.userOnboarding).not.toHaveBeenCalled();
  });

  it('onbording popup property should be initiated as true', () => {
    spyOn(component, 'userOnboarding');
    component.ngOnInit();
    expect(component.showOnboardPopup).toBe(true);
  });

  it('should not trigger the onboard popup as participant details are vailable in DB', () => {
    spyOn(component, 'userOnboarding');
    component.programDetails = programDetailsWithUserDetails;
    component.handleOnboarding();
    expect(component.showOnboardPopup).toBe(false);
  });
});
