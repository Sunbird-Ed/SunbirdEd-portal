import { async, TestBed, inject, ComponentFixture } from '@angular/core/testing';
import { SharedModule } from '@sunbird/shared';
import { FrameworkService, UserService, ExtPluginService } from '@sunbird/core';

import { DynamicModule } from 'ng-dynamic-component';
import { ProgramComponent } from './program.component';
import {  throwError , of } from 'rxjs';
// tslint:disable-next-line:max-line-length
import { addParticipentResponseSample, userProfile,  frameWorkData, programDetailsWithOutUserDetails,
  programDetailsWithOutUserAndForm, extFrameWorkPostData, programDetailsWithUserDetails } from './program.component.spec.data';
import { DebugElement } from '@angular/core';
import { CollectionComponent } from '../../../cbse-program/components/collection/collection.component';
import { ProgramHeaderComponent } from '../program-header/program-header.component';
import { OnboardPopupComponent } from '../onboard-popup/onboard-popup.component';
// tslint:disable-next-line:prefer-const
let errorInitiate, de: DebugElement;
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

describe('ProgramComponent On Boarding test', () => {
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
});
