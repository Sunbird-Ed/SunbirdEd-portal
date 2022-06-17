import { ConfigService, ResourceService, UtilService } from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';
import { SignupBasicInfoComponent } from './signup-basic-info.component';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

describe('SignupBasicInfoComponent', () => {
  let component: SignupBasicInfoComponent;

  const mockResourceService: Partial<ResourceService> = {};
  const mockTelemetryService: Partial<TelemetryService> = {};
  const mockUtilService: Partial<UtilService> = {};
  const mockConfigService: Partial<ConfigService> = {
    constants: {
      "SIGN_UP": {
        "MAX_YEARS": 100,
        "MINIMUN_AGE": 18
      }
    }
  };
  const mockFormBuilder: Partial<FormBuilder> = {
  };

  beforeAll(() => {
      component = new SignupBasicInfoComponent(
        mockResourceService as ResourceService, 
        mockTelemetryService as TelemetryService, 
        mockUtilService as UtilService, 
        mockConfigService as ConfigService, 
        mockFormBuilder as FormBuilder
      );
  });

  beforeEach(() => {
      jest.clearAllMocks();
  });

  it('should be create a instance', () => {
      expect(component).toBeTruthy();
  });

  describe("birth year initialize and filter", () => {
    it("intialize bith year", () => {
      component.initiateYearSelecter();
      expect(component.birthYearOptions.length).toEqual(100)
    })

    it("filter year of birth", () => {
      component.initiateYearSelecter();
      expect(component['_filter']('2000')).toEqual([ '2000', '2000' ])
    })
  })

  describe("ngOnInit", () => {
    it("initialize form fields with name and email", () => {
      jest.spyOn(component, 'initiateYearSelecter').mockImplementation();
      mockFormBuilder.group = jest.fn().mockReturnValue({
        controls: {
          name: new FormControl(''),
          yearOfBirth: new FormControl('')
        }
      })
      component.ngOnInit();
      expect(mockFormBuilder.group).toHaveBeenCalled();
      expect(component.initiateYearSelecter).toHaveBeenCalled();
    });

    it("filter year of birth on value change", () => {
      jest.spyOn(component, 'initiateYearSelecter').mockImplementation();
      jest.spyOn(component as any, '_filter').mockImplementation();
      mockFormBuilder.group = jest.fn().mockReturnValue({
        controls: {
          name: new FormControl(''),
          yearOfBirth: new FormControl('')
        }
      })
      component.ngOnInit();
      component.personalInfoForm.controls.yearOfBirth.setValue('2000');
      expect(mockFormBuilder.group).toHaveBeenCalled();
      expect(component.initiateYearSelecter).toHaveBeenCalled();
    })
  })

  describe("changeBirthYear", () => {
    it("should change birth of year", () => {
      component.changeBirthYear({option: {value: 2000}});
      expect(component.yearOfBirth).toEqual("2000");
      expect(component.isMinor).toBeFalsy();
    });
    it("should change birth of year for minor user", () => {
      component.isIOSDevice = true;
      component.changeBirthYear({target: {value: 2018}});
      expect(component.yearOfBirth).toEqual("2018");
      expect(component.isMinor).toBeTruthy();
    })
  })

  describe("trigger next step", () => {
    it("should trigger next step if form is valid", () => {
      component.personalInfoForm = new FormGroup({
        name: new FormControl('test-name'),
        yearOfBirth: new FormControl('2000')
      })
      jest.spyOn(window.localStorage.__proto__, 'setItem');
      jest.spyOn(component.subformInitialized, 'emit');
      component.next();
      expect(localStorage.setItem).toHaveBeenCalledWith('guestUserDetails', "{\"name\":\"test-name\"}")
      expect(component.subformInitialized.emit).toHaveBeenCalledWith({"isMinor": true, "name": "test-name", "yearOfBirth": "2000"});
    });
  })

  describe("isNumber", () => {
    it("should return with false for non numeric value", () => {
      let event = {which: 40};
      let res = component.isNumber(event);
      expect(res).toBeFalsy();
    });
    it("should return with true for numeric value", () => {
      let event = {which: 50};
      let res = component.isNumber(event);
      expect(res).toBeTruthy();
    });
  })

});
