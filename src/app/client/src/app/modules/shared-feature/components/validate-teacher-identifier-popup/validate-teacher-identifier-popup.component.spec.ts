import { ResourceService } from '@sunbird/shared';
import { UserService } from '@sunbird/core';
import { ToasterService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PopupControlService } from '../../../../service/popup-control.service';
import { mockUserData } from './validate-teacher-identifier-popup.component.spec.data';
import { ValidateTeacherIdentifierPopupComponent } from './validate-teacher-identifier-popup.component'

describe('ValidateTeacherIdentifierPopupComponent', () => {
  let component: ValidateTeacherIdentifierPopupComponent;

  const resourceService: Partial<ResourceService> = {
    messages: {
      emsg: {
        m0005: 'Something went wrong, try again later',
        m0017: 'Fetching districts failed. Try again later'
      }
    }
  };
  const toasterService: Partial<ToasterService> = {
    error: jest.fn(),
    success: jest.fn()
  };
  const router: Partial<Router> = {};
  const userService: Partial<UserService> = {
    loggedIn: true,
    userMigrate: jest.fn(),
    getUserProfile:jest.fn(),
    userData$: of({
      userProfile: {
        userId: 'sample-uid',
        rootOrgId: 'sample-root-id',
        rootOrg: {},
        hashTagIds: ['id'],
        profileUserType: {
          type: 'student'
        }
      } as any
    }) as any
  };
  const popupControlService: Partial<PopupControlService> = {
    changePopupStatus: jest.fn()
  };
  beforeAll(() => {
    component = new ValidateTeacherIdentifierPopupComponent(
      userService as UserService,
      resourceService as ResourceService,
      toasterService as ToasterService,
      router as Router,
      popupControlService as PopupControlService
    )
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create a instance of component', () => {
    expect(component).toBeTruthy();
  })
  it('should call handleSubmitButton() from initializeFormField() ', () => {
    jest.spyOn(component, 'handleSubmitButton');
    component.initializeFormField();
    expect(component.handleSubmitButton).toHaveBeenCalled();
  });
  it('should call ngOnInit()', () => {
    component.userFeedData = mockUserData.userFeedData;
    jest.spyOn(component, 'initializeFormField')
    jest.spyOn(component, 'processUserFeedData')
    component.ngOnInit();
    expect(component.initializeFormField).toHaveBeenCalled();
    expect(component.processUserFeedData).toHaveBeenCalled();
  });
  it('should call ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(component.popupControlService.changePopupStatus).toBeDefined()
  });
  it('should call verifyExtId() with action as accept and should show error for invalid ext. id ', () => {
    jest.spyOn(userService, 'userMigrate').mockReturnValue(throwError(mockUserData.migrateErrorResponseWithAttemptCount) as any);
    component.verifyExtId('accept');
    expect(component.showError).toBe(true);
  });
  it('should call verifyExtId() with action as accept and should show error after trying twice ', () => {
    jest.spyOn(userService, 'userMigrate').mockReturnValue(throwError(mockUserData.migrateErrorResponse) as any);
    component.verifyExtId('accept');
    expect(component.extIdFailed).toBe(true);
  });
  it('should call verifyExtId() with action as accept and should show error after trying twice with new error', () => {
    jest.spyOn(userService, 'userMigrate').mockReturnValue(throwError(mockUserData.migrateErrorResponsewithothererror) as any);
    component.verifyExtId('accept');
    expect(component.extIdFailed).toBe(true);
    expect(toasterService.error).toBeCalledWith(resourceService.messages.emsg.m0005);
  });
  it('should call verifyExtId() with action as accept with correct ext. id ', () => {
    jest.spyOn(userService, 'userMigrate').mockReturnValue(of(mockUserData.migrateSuccessResponse) as any);
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
  it('should call getUserProfile of userService', () => {
    component.createValidateModal = jest.fn();
    component.createValidateModal.deny = jest.fn();
    component.extIdVerified =true;
    component.closeModal();
    expect(userService.getUserProfile).toBeCalled();
  });

});

