import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateTeacherIdentifierPopupComponent } from './validate-teacher-identifier-popup.component';
import { SuiModule } from 'ng2-semantic-ui';
import { ResourceService, SharedModule, ToasterService } from '@sunbird/shared';
import { CoreModule, UserService } from '@sunbird/core';
import { TelemetryModule } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { mockUserData } from './validate-teacher-identifier-popup.component.spec.data';
import * as _ from 'lodash-es';

import { throwError as observableThrowError, of as observableOf } from 'rxjs';

const mockUserService = {
  userProfile: {
    userId: '68777b59-b28b-4aee-88d6-50d46e4c35090'
  }, userMigrate: () => { },
  messages: {
    msg: {
      m0005: 'Something went wrong, please try in some time....'
    }
  }
};
describe('ValidateTeacherIdentifierPopupComponent', () => {
  let component: ValidateTeacherIdentifierPopupComponent;
  let fixture: ComponentFixture<ValidateTeacherIdentifierPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ValidateTeacherIdentifierPopupComponent],
      imports: [SharedModule.forRoot(), CoreModule, FormsModule, ReactiveFormsModule,
        HttpClientTestingModule, SuiModule, TelemetryModule.forRoot(), RouterTestingModule],
      providers: [ToasterService, ResourceService, { provide: UserService, useValue: mockUserService }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateTeacherIdentifierPopupComponent);
    component = fixture.componentInstance;
    component.userFeedData = mockUserData.feedSuccessResponse.result.response.userFeed[0];
    component.labels = mockUserData.formReadResponse.result.form.data.fields[0].range[0];
    fixture.detectChanges();
  });

  it('should call ngOnInit()', () => {
    spyOn(component, 'initializeFormField').and.callThrough();
    spyOn(component, 'processUserFeedData').and.callThrough();
    component.ngOnInit();
    expect(component.initializeFormField).toHaveBeenCalled();
    expect(component.processUserFeedData).toHaveBeenCalled();
  });

  it('should call handleSubmitButton() from initializeFormField() ', () => {
    spyOn(component, 'handleSubmitButton').and.callThrough();
    component.initializeFormField();
    expect(component.handleSubmitButton).toHaveBeenCalled();
  });

  it('should call verifyExtId() with action as accept and should show error for invalid ext. id ', () => {
    const userService = TestBed.get(UserService);
    spyOn(userService, 'userMigrate').and.callFake(() => observableThrowError(mockUserData.migrateErrorResponseWithAttemptCount));
    component.verifyExtId('accept');
    expect(component.showError).toBe(true);
  });

  it('should call verifyExtId() with action as accept and should show error after trying twice ', () => {
    const userService = TestBed.get(UserService);
    spyOn(userService, 'userMigrate').and.callFake(() => (observableThrowError(mockUserData.migrateErrorResponse)));
    component.verifyExtId('accept');
    expect(component.extIdFailed).toBe(true);
  });

  it('should call verifyExtId() with action as accept with correct ext. id ', () => {
    const userService = TestBed.get(UserService);
    spyOn(userService, 'userMigrate').and.returnValue(observableOf(mockUserData.migrateSuccessResponse));
    component.verifyExtId('accept');
    expect(component.extIdVerified).toBe(true);
  });

  it('should process feedData', () => {
    component.channelData = _.get(component.userFeedData, 'data.prospectChannels');
    component.processUserFeedData();
    expect(component.showStateDropdown).toBeTruthy();
  });

  it('should call navigateToValidateId', () => {
    component.navigateToValidateId();
    expect(component.processValidation).toBeTruthy();
  });
});
