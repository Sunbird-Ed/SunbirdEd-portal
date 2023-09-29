import { OnboardingPopupComponent } from "./onboarding-popup.component"
import { DomSanitizer } from '@angular/platform-browser';
import { DeviceRegisterService, FormService, UserService } from '@sunbird/core';
import { of } from "rxjs";
import { mockData } from './onboarding-popup.component.spec.data'
import { MatStepper } from '@angular/material/stepper';
import { ResourceService } from '@sunbird/shared'

describe("Onboarding Component", () => {
  let onboardingPopupComponent: OnboardingPopupComponent;
  const mockResourceService: Partial<ResourceService> = {}
  const mockDomSanitizer: Partial<DomSanitizer> = {
    bypassSecurityTrustResourceUrl: jest.fn()
  };
  const mockDeviceRegisterService: Partial<DeviceRegisterService> = {
    updateDeviceProfile: jest.fn().mockReturnValue(of(true)) as any,

  };
  const mockFormService: Partial<FormService> = {};
  const mockUserService: Partial<UserService> = {};
  beforeAll(() => {
    onboardingPopupComponent = new OnboardingPopupComponent(
      mockDomSanitizer as DomSanitizer,
      mockDeviceRegisterService as DeviceRegisterService,
      mockFormService as FormService,
      mockResourceService as ResourceService,
      mockUserService as UserService

    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be create a instance of onboardingPopupComponent', () => {
    expect(onboardingPopupComponent).toBeTruthy();
  });
  describe('getLocation', () => {
    it('should return the location data', () => {
      // arrange
      const result = { ipLocation: { state: "Karnataka", district: "Bangalore" } };
      onboardingPopupComponent.deviceProfile = result;
      mockDeviceRegisterService.fetchDeviceProfile = jest.fn().mockReturnValue(of({ result: result })) as any;
      //act
      onboardingPopupComponent.getLocation();
      //assert
      expect(onboardingPopupComponent.deviceProfile).toBeDefined();
      expect(mockDeviceRegisterService.fetchDeviceProfile).toHaveBeenCalled();
    });
  });
  describe('ngOnDestroy', () => {
    it('should destroy subscription', () => {
      //arrange
      onboardingPopupComponent.unsubscribe$ = {
        next: jest.fn(),
        complete: jest.fn()
      } as any;
      //act
      onboardingPopupComponent.ngOnDestroy();
      //assert
      expect(onboardingPopupComponent.unsubscribe$.next).toHaveBeenCalled();
      expect(onboardingPopupComponent.unsubscribe$.complete).toHaveBeenCalled();
    });
  });

  describe('isAllScreenDisabled', () => {
    it('popup will be hide if allScreen are disabled', () => {
      //arrange
      onboardingPopupComponent.OnboardingFormConfig = [{}];
      onboardingPopupComponent.isStepperCompleted = { emit: jest.fn() } as any;
      onboardingPopupComponent.onboardingFilterData = [{}];
      onboardingPopupComponent.isPreview = false;

      //act
      onboardingPopupComponent.isAllScreenDisabled();
      //assert
      expect(onboardingPopupComponent.onboardingFilterData).toHaveLength(0);
      expect(onboardingPopupComponent.isStepperCompleted.emit).toBeCalledWith(true);
      expect(onboardingPopupComponent.isAllScreenDisabled).toHaveLength(0);

    });
    it('preview will be hide if only one screen', () => {
      //arrange
      onboardingPopupComponent.OnboardingFormConfig = mockData.enbledDForOneScreen as any;
      onboardingPopupComponent.onboardingFilterData = mockData.enbledDForOneScreen as any;
      onboardingPopupComponent.isPreview = false;

      //act
      onboardingPopupComponent.isAllScreenDisabled();
      //assert
      expect(onboardingPopupComponent.isPreview).toBeFalsy();
      expect(onboardingPopupComponent.onboardingFilterData).toHaveLength(1);

    });
  });

  describe('updateFrameWork', () => {
    it('should moved to the next step when BMGS submit event call ', () => {
      // arrange
      Storage.prototype.getItem = jest.fn(() => JSON.stringify('guestUserDetails'))
      onboardingPopupComponent.isSkipped = false;
      // onboardingPopupComponent.isGuestUser = true;
      onboardingPopupComponent.onboardingFilterData = mockData.onboardingEnabled as any;
      // onboardingPopupComponent.isStepperCompleted = {emit:jest.fn()} as any;
      const stepper = {
        next: jest.fn()
      } as unknown as MatStepper;
      //act
      onboardingPopupComponent.updateFrameWork(stepper);
      //assert
      expect(Storage.prototype.getItem).toBeCalled();
      expect(onboardingPopupComponent.guestUserStoredData).toEqual('guestUserDetails');
      expect(onboardingPopupComponent.isSkipped).toBeFalsy();
      expect(stepper.next).toBeCalled();

    });
    it('should complete the process  when BMGS submit event call for single screen', () => {
      // arrange
      Storage.prototype.getItem = jest.fn(() => JSON.stringify('guestUserDetails'))
      onboardingPopupComponent.isSkipped = false;
      onboardingPopupComponent.onboardingFilterData = mockData.enbledDForOneScreen as any;
      onboardingPopupComponent.isStepperCompleted = { emit: jest.fn() } as any;
      const stepper = {
        next: jest.fn()
      } as unknown as MatStepper;

      //act
      onboardingPopupComponent.updateFrameWork(stepper);
      //assert
      expect(Storage.prototype.getItem).toBeCalled();
      expect(onboardingPopupComponent.guestUserStoredData).toEqual('guestUserDetails');
      expect(onboardingPopupComponent.isSkipped).toBeFalsy();
      expect(onboardingPopupComponent.isStepperCompleted.emit).toBeCalledWith(true);
      expect(onboardingPopupComponent.onboardingFilterData).toHaveLength(1);
    });
  });
  describe('updateGuestUser', () => {
    // arrange
    it('should update the guestUser Service with default value', () => {
      let event = {
        "board": ["State (Tamil Nadu)"],
        "medium": ["Tamil"],
        "gradeLevel": ["Class 3"],
        "subject": [],
        "id": "tn_k-12_5"
      };
      Storage.prototype.getItem = jest.fn(() => JSON.stringify('userType'));
      let defaultVal = { name: 'guest', formatedName: 'Guest', framework: event };
      mockUserService.createGuestUser = jest.fn().mockReturnValue(of(true)) as any;
      //act
      onboardingPopupComponent.updateGuestUser(defaultVal);
      //assert
      expect(Storage.prototype.getItem).toBeCalled();
    })
  });
  describe('getOnboardingFormConfig', () => {
    it('should check if BMGS is disabled and having default data in form config', () => {
      //arrange
      onboardingPopupComponent.OnboardingFormConfig = mockData.onboardingDisabled as any;
      jest.spyOn(onboardingPopupComponent, 'updateGuestUser').mockImplementation(() => { return; })
      jest.spyOn(onboardingPopupComponent, 'isAllScreenDisabled').mockImplementation(() => { return; })
      const defaultData = { "board": ["State (Tamil Nadu)"], "gradeLevel": ["Class 1"], "medium": ["Tamil"] }
      //act
      onboardingPopupComponent.getOnboardingFormConfig(false, false, false);
      //assert
      expect(onboardingPopupComponent.isAllScreenDisabled).toBeCalled();
      expect(onboardingPopupComponent.updateGuestUser).toHaveBeenCalledWith(defaultData);

    });

    it('should check if Usertype is disabled and having default data in form config', () => {
      //arrange
      onboardingPopupComponent.OnboardingFormConfig = mockData.onboardingDisabled as any;
      Storage.prototype.setItem = jest.fn(() => true);
      Storage.prototype.getItem = jest.fn(() => 'guestUserType');
      jest.spyOn(onboardingPopupComponent, 'isAllScreenDisabled').mockImplementation(() => {
        return;
      })
      //act
      onboardingPopupComponent.getOnboardingFormConfig(false, false, false);
      //assert
      expect(Storage.prototype.setItem).toBeCalledTimes(1);
      expect(onboardingPopupComponent.userTypeStoredData).toEqual('guestUserType');
      expect(onboardingPopupComponent.isAllScreenDisabled).toBeCalled();

    });

    it('should check if location is disabled and having default data in form config', () => {
      // arrange
      onboardingPopupComponent.OnboardingFormConfig = mockData.onboardingDisabled as any;
      const defaultData = { "district": "Bidar", "state": "Karnataka" }
      jest.spyOn(onboardingPopupComponent, 'isAllScreenDisabled').mockImplementation(() => { return; });
      mockDeviceRegisterService.updateDeviceProfile = jest.fn().mockReturnValue(of(true)) as any;
      // jest.spyOn(mockDeviceRegisterService,'updateDeviceProfile').mockImplementation(()=> { return {} ;})
      // act
      onboardingPopupComponent.getOnboardingFormConfig(false, false, false);
      //assert
      expect(onboardingPopupComponent.isAllScreenDisabled).toBeCalled();
      expect(mockDeviceRegisterService.updateDeviceProfile).toHaveBeenCalledWith(defaultData);

    });
    it('should check if location is enabaled & having default data but skipped by user', () => {
      // arrange
      const defaultData = { "district": "Bidar", "state": "Karnataka" }
      onboardingPopupComponent.OnboardingFormConfig = mockData.onboardingEnabled as any;
      jest.spyOn(onboardingPopupComponent, 'isAllScreenDisabled').mockImplementation(() => { return; });
      mockDeviceRegisterService.updateDeviceProfile = jest.fn().mockReturnValue(of(true)) as any;
      // act
      onboardingPopupComponent.getOnboardingFormConfig(false, false, true);
      // assert
      expect(onboardingPopupComponent.isAllScreenDisabled).toBeCalled();
      expect(mockDeviceRegisterService.updateDeviceProfile).toHaveBeenCalledWith(defaultData);
    });

    it('should check if BMGS is enabaled & having default data but skipped by user', () => {
      //arrange
      const defaultData = { "board": ["State (Tamil Nadu)"], "gradeLevel": ["Class 1"], "medium": ["Tamil"] }
      onboardingPopupComponent.OnboardingFormConfig = mockData.onboardingEnabled as any;
      jest.spyOn(onboardingPopupComponent, 'updateGuestUser').mockImplementation(() => { return; });
      //act
      onboardingPopupComponent.getOnboardingFormConfig(true, false, false);
      // assert
      expect(onboardingPopupComponent.isAllScreenDisabled).toBeCalled();
      expect(onboardingPopupComponent.updateGuestUser).toHaveBeenCalledWith(defaultData);
    });

    it('should check if userType is enabaled & having default data but skipped by user', () => {
      // arrange
      onboardingPopupComponent.OnboardingFormConfig = mockData.onboardingEnabled as any;
      Storage.prototype.setItem = jest.fn(() => true);
      Storage.prototype.getItem = jest.fn(() => 'guestUserType');
      jest.spyOn(onboardingPopupComponent, 'isAllScreenDisabled').mockImplementation(() => { return; });
      // act   
      onboardingPopupComponent.getOnboardingFormConfig(false, true, false);
      // assert
      expect(Storage.prototype.setItem).toBeCalledTimes(1);
      expect(onboardingPopupComponent.userTypeStoredData).toEqual('guestUserType');
      expect(onboardingPopupComponent.isAllScreenDisabled).toBeCalled();
    });
  });

  describe('ngOnInit', () => {
    it('should call when guestUser dont have data', () => {
      // arrange
      onboardingPopupComponent.isGuestUser = true;
      onboardingPopupComponent.guestUserDetails = undefined;
      const user: any = { name: 'guest', formatedName: 'Guest', framework: {} };
      jest.spyOn(onboardingPopupComponent, 'getOnboardingFormConfig').mockImplementation(() => { return });
      Storage.prototype.getItem = jest.fn(() => JSON.stringify('guestUserDetails'));
      onboardingPopupComponent.tenantInfo = mockData.tenantData;
      onboardingPopupComponent.tenantInfo.titleName = mockData.tenantData.titleName;
      localStorage.setItem('guestUserDetails', JSON.stringify(user));
      //act
      onboardingPopupComponent.ngOnInit();
      //assert
      expect(onboardingPopupComponent.isGuestUser).toBeTruthy();
      expect(onboardingPopupComponent.guestUserStoredData).toEqual('guestUserDetails');
      expect(onboardingPopupComponent.getOnboardingFormConfig).toHaveBeenCalledWith(false, false, false);
    });
  });

  describe('onProcessComplete', () => {
    it('should call when userType is null', () => {
      //arrange
      jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { return null });
      jest.spyOn(onboardingPopupComponent, 'getOnboardingFormConfig').mockImplementation(() => { return });
      //act
      onboardingPopupComponent.onProcessComplete();
      //assert
      expect(onboardingPopupComponent.getOnboardingFormConfig).toHaveBeenCalledWith(false, true, false);
      expect(onboardingPopupComponent.isStepperCompleted.emit).toBeCalledWith(true);
    });

    it('should call when guestUserDeatils is null', () => {
      //arrange
      onboardingPopupComponent.guestUserStoredData = undefined;
      jest.spyOn(onboardingPopupComponent, 'getOnboardingFormConfig').mockImplementation(() => { return });
      //act
      onboardingPopupComponent.onProcessComplete();
      //assert
      expect(onboardingPopupComponent.getOnboardingFormConfig).toHaveBeenCalledWith(true, false, false);
      expect(onboardingPopupComponent.isStepperCompleted.emit).toBeCalledWith(true);
    });

    it('should call when location is null', () => {
      //arrange
      onboardingPopupComponent.deviceProfile = undefined;
      jest.spyOn(onboardingPopupComponent, 'getOnboardingFormConfig').mockImplementation(() => { return });
      //act
      onboardingPopupComponent.onProcessComplete();
      //assert
      expect(onboardingPopupComponent.getOnboardingFormConfig).toHaveBeenCalledWith(true, false, false);
      expect(onboardingPopupComponent.isStepperCompleted.emit).toBeCalledWith(true);

    });

  });

  describe('userTypeSubmit', () => {
    it('should call when user type submit event call', () => {
      // arrange
      let stepper = {
        next: jest.fn()
      } as unknown as MatStepper;
      Storage.prototype.getItem = jest.fn(() => 'getUserType');
      onboardingPopupComponent.isSkipped = false;
      onboardingPopupComponent.onboardingFilterData = mockData.onboardingEnabled;
      //act
      onboardingPopupComponent.userTypeSubmit(stepper);
      //assert
      expect(onboardingPopupComponent.userTypeStoredData).toEqual('getUserType');
      expect(onboardingPopupComponent.isSkipped).toBeFalsy();
      expect(stepper.next).toBeCalled();
    });

    it('should complete the process when user type submit event call', () => {
      // arrange
      let stepper = {
        next: jest.fn()
      } as unknown as MatStepper;
      Storage.prototype.getItem = jest.fn(() => 'getUserType');
      onboardingPopupComponent.isSkipped = false;
      onboardingPopupComponent.onboardingFilterData = mockData.enbledDForOneScreen;
      onboardingPopupComponent.isStepperCompleted = { emit: jest.fn() } as any;
      //act
      onboardingPopupComponent.userTypeSubmit(stepper);
      //assert
      expect(onboardingPopupComponent.userTypeStoredData).toEqual('getUserType');
      expect(onboardingPopupComponent.isSkipped).toBeFalsy();
      expect(onboardingPopupComponent.isStepperCompleted.emit).toBeCalledWith(true);
      expect(onboardingPopupComponent.onboardingFilterData).toHaveLength(1);
    });
  });

  describe('locationSubmit', () => {
    it('should call when location submit event call', () => {
      // arrange
      let stepper = {
        next: jest.fn()
      } as unknown as MatStepper;
      Storage.prototype.getItem = jest.fn(() => JSON.stringify('guestUserDetails'));
      onboardingPopupComponent.isSkipped = false;
      jest.spyOn(onboardingPopupComponent, 'getLocation').mockImplementation(() => { return });
      onboardingPopupComponent.onboardingFilterData = mockData.onboardingEnabled;
      //act
      onboardingPopupComponent.locationSubmit(stepper);
      // assert
      expect(onboardingPopupComponent.guestUserStoredData).toEqual('guestUserDetails');
      expect(onboardingPopupComponent.isSkipped).toBeFalsy();
      expect(stepper.next).toBeCalled();
      expect(onboardingPopupComponent.getLocation).toHaveBeenCalled();
    });
    it('should complete the process when location submit event call', () => {
      // arrange
      let stepper = {
        next: jest.fn()
      } as unknown as MatStepper;
      Storage.prototype.getItem = jest.fn(() => JSON.stringify('guestUserDetails'));
      onboardingPopupComponent.isSkipped = false;
      jest.spyOn(onboardingPopupComponent, 'getLocation').mockImplementation(() => { return });
      onboardingPopupComponent.onboardingFilterData = mockData.enbledDForOneScreen as any;
      onboardingPopupComponent.isStepperCompleted = { emit: jest.fn() } as any;
      //act
      onboardingPopupComponent.locationSubmit(stepper);
      // assert
      expect(onboardingPopupComponent.guestUserStoredData).toEqual('guestUserDetails');
      expect(onboardingPopupComponent.isSkipped).toBeFalsy();
      expect(onboardingPopupComponent.getLocation).toHaveBeenCalled();
      expect(onboardingPopupComponent.isStepperCompleted.emit).toBeCalledWith(true);
      expect(onboardingPopupComponent.onboardingFilterData).toHaveLength(1);

    });
  });

  describe('getSanitizedURL', () => {
    it('should sanitized the url for iframe', () => {
      // arrange
      const url = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf#page=3'
      mockDomSanitizer.bypassSecurityTrustResourceUrl = jest.fn();
      //act
      onboardingPopupComponent.getSanitizedURL(url);
      // assertion
      expect(mockDomSanitizer.bypassSecurityTrustResourceUrl).toBeDefined();
    });
  });

  describe('onClickNext', () => {
    it('should complete the process when next event called for single screen', () => {
      //arrange
      onboardingPopupComponent.onboardingFilterData = mockData.enbledDForOneScreen as any;
      onboardingPopupComponent.onProcessComplete = jest.fn();
      // act
      onboardingPopupComponent.onClickNext();
      //assert
      expect(onboardingPopupComponent.onProcessComplete).toHaveBeenCalled();
    });
  });
});