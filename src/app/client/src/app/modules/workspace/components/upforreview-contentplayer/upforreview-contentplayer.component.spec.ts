
import {of as observableOf, throwError as observableThrowError,  Observable } from 'rxjs';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { UpforreviewContentplayerComponent } from './upforreview-contentplayer.component';
import { TelemetryModule , TelemetryService } from '@sunbird/telemetry';
// Import NG testing module(s)
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule,  ToasterService, ResourceService, NavigationHelperService } from '@sunbird/shared';
import { PlayerService, UserService, LearnerService, ContentService, CoreModule } from '@sunbird/core';
import * as mockData from './upforreview-content.component.spce.data';
import { NO_ERRORS_SCHEMA } from '@angular/core';

const testData = mockData.mockRes;
describe('UpforreviewContentplayerComponent', () => {
  let component: UpforreviewContentplayerComponent;
  let fixture: ComponentFixture<UpforreviewContentplayerComponent>;
  const resourceBundle = {
  messages : {
    imsg: { m0027: 'Something went wrong'},
    stmsg: { m0025: 'error' }
  },
  frmelmnts: {
    btn: {
      tryagain: 'tryagain',
      close: 'close'
    },
    lbl: {
      description: 'description'
    }
  }
};
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpforreviewContentplayerComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [HttpClientTestingModule,
      CoreModule,
      TelemetryModule,
      RouterTestingModule, SharedModule.forRoot()],
      providers: [ ResourceService, ToasterService, NavigationHelperService, TelemetryService,
      { provide: ResourceService, useValue: resourceBundle }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpforreviewContentplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should throw error if content api throws error', () => {
    const playerService = TestBed.get(PlayerService);
    const userService = TestBed.get(UserService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceBundle.messages;
    resourceService.frmelmnts = resourceBundle.frmelmnts;
    spyOn(playerService, 'getContent').and.returnValue(observableThrowError(testData.errorRes));
    userService._userProfile = { 'organisations': ['01229679766115942443'] };
    component.getContent();
    expect(component.playerConfig).toBeUndefined();
    expect(component.showError).toBeTruthy();
    expect(component.errorMessage).toBe(resourceService.messages.stmsg.m0009);
  });

  it('should call  content api and return content data', () => {
    const playerService = TestBed.get(PlayerService);
    const userService = TestBed.get(UserService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceBundle.messages;
    resourceService.frmelmnts = resourceBundle.frmelmnts;
    spyOn(playerService, 'getContent').and.returnValue(observableOf(testData.sucessRes));
    userService._userProfile = { 'organisations': ['01229679766115942443'] };
    component.getContent();
    fixture.detectChanges();
    expect(component.contentData).toBeDefined();
    expect(component.showError).toBeFalsy();
    expect(component.showLoader).toBeFalsy();
  });

});
