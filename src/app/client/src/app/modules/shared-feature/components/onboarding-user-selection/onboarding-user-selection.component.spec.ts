import { ResourceService,ToasterService,NavigationHelperService} from "@sunbird/shared";
import { TelemetryService } from "@sunbird/telemetry";
import { TenantService, FormService, UserService } from "@sunbird/core";
import { ProfileService } from "@sunbird/profile";
import { isObservable, Observable, of, throwError } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { OnboardingUserSelectionComponent } from "./onboarding-user-selection.component";
import { HttpErrorResponse } from "@angular/common/http";
import { PopupControlService } from '../../../../service/popup-control.service';

describe('OnboardingUserSelection component', () => {
  let onboardingUserSelectionComponent: OnboardingUserSelectionComponent;
  const mockResourceService: Partial<ResourceService> = {};
  const mockTenantService: Partial<TenantService> = {};
  const mockRouter: Partial<Router> = {
    events: of({ id: 1, url: 'sample-url' }) as any,
    navigate: jest.fn(),
    url: 'jest/user'
  };
  const mockNavigationHelperService: Partial<NavigationHelperService> = {};
  const mockTelemetryService: Partial<TelemetryService> = {
    audit:jest.fn()
  };
  const mockActivatedRoute: Partial<ActivatedRoute> = {
    snapshot: {
      data: {
        telemetry: {
           pageid: 'onboard'
        }
      }
    } as any,
    queryParams: of({})
  };
  const mockFormService: Partial<FormService> = {
    getFormConfig: jest.fn().mockReturnValue(of(true)) as any
  };
  const mockProfileService: Partial<ProfileService> = {};
  const mockUserService: Partial<UserService> = {
    loggedIn:false
  };
  const mockToasterService: Partial<ToasterService> = {};
  const mockPopupControlService: Partial<PopupControlService> = {
    getOnboardingData: jest.fn()
  };

  beforeAll(() => {
    onboardingUserSelectionComponent = new OnboardingUserSelectionComponent(
      mockResourceService as ResourceService,
      mockTenantService as TenantService,
      mockRouter as Router,
      mockNavigationHelperService as NavigationHelperService,
      mockTelemetryService as TelemetryService,
      mockActivatedRoute as ActivatedRoute,
      mockFormService as FormService,
      mockProfileService as ProfileService,
      mockUserService as UserService,
      mockToasterService as ToasterService,
      mockPopupControlService as PopupControlService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should  create an instance of onboardingUserSelectionComponent', () => {
    expect(onboardingUserSelectionComponent).toBeTruthy();
  });

  describe('ngOnInit function', () => {
    it('should call setPopupInteractEdata method and initialize method', () => {
      //arrange
      //@ts-ignore
      const initializeSpy=jest.spyOn(onboardingUserSelectionComponent,'initialize');
      const setPopupInteractEdataSpy=jest.spyOn(onboardingUserSelectionComponent,'setPopupInteractEdata');
      jest.spyOn(onboardingUserSelectionComponent['popupControlService'], 'getOnboardingData').mockReturnValue(of({"response": true}));
      //act
      onboardingUserSelectionComponent.ngOnInit();
      //assert
      //@ts-ignore
      expect(initializeSpy).toBeCalled();
      expect( setPopupInteractEdataSpy).toBeCalled();
    });

    it('should set usertype enabled value to be true', () => {
      const formConfigResponse = {
        userTypePopup: {
          isVisible: true,
          defaultUserType: "Teacher",
          defaultGuestUserType: "Teacher"
        },
      };
      jest.spyOn(onboardingUserSelectionComponent['popupControlService'], 'getOnboardingData').mockReturnValue(of(formConfigResponse));
      onboardingUserSelectionComponent.ngOnInit();
      expect(onboardingUserSelectionComponent.isUserTypeEnabled).toBe(true);
    });
    it('should set usertype enabled value to be false', () => {
      const formConfigResponse = {
        userTypePopup: {
          isVisible: false,
          defaultUserType: "Teacher",
          defaultGuestUserType: "Teacher"
        },
      };
      jest.spyOn(onboardingUserSelectionComponent['popupControlService'], 'getOnboardingData').mockReturnValue(of(formConfigResponse));
      onboardingUserSelectionComponent.ngOnInit();
      expect(onboardingUserSelectionComponent.isUserTypeEnabled).toBe(false);
    });
    
  });


  describe('setPopupInteractEdata method', () => {
    it('should set userSelectionInteractEdata property to the first responseData', () => {
      //arrange
      let responseData = {
        id: 'user-type-select',
        type: 'click',
        pageid: 'onboard',
      };
      //act
      onboardingUserSelectionComponent.setPopupInteractEdata();
      //assert
      expect(onboardingUserSelectionComponent.userSelectionInteractEdata).toBeTruthy();
      expect(onboardingUserSelectionComponent.userSelectionInteractEdata).toEqual(responseData);
    });

    it('should set userSelectionInteractEdata property to the second responseData', () => {
      //arrange
      onboardingUserSelectionComponent.activatedRoute.snapshot.data.telemetry.pageid=undefined
      let responseData = {
        id: 'user-type-select',
        type: 'click',
        pageid: 'user',
      };
      //act
      onboardingUserSelectionComponent.setPopupInteractEdata();
      //assert
      expect(onboardingUserSelectionComponent.userSelectionInteractEdata).toBeTruthy();
      expect(onboardingUserSelectionComponent.userSelectionInteractEdata).toEqual(responseData);
    });
  });

  describe('initialize method', () => {
    it('should call getFormConfig method of the onboard user selection component', () => {
      //arrange
      //@ts-ignore
      const getFormConfigSpy = jest.spyOn( onboardingUserSelectionComponent,'getFormConfig');
      //act
      onboardingUserSelectionComponent['initialize']();
      //assert
      expect(getFormConfigSpy).toBeCalled();
    });

    it('should call updateUserSelection and prepareGuestList', () => {
      //arrange
      //@ts-ignore
      const updateUserSelectionSpy = jest.spyOn(onboardingUserSelectionComponent,'updateUserSelection');
      //act
      onboardingUserSelectionComponent['initialize']();
      //assert
      expect(updateUserSelectionSpy).toBeCalled();
      expect(onboardingUserSelectionComponent.guestList).toBeDefined();
    });

    it('should return an observable after merge', () => {
      //arrange
      let returnedObservable = undefined;
      //run
      returnedObservable = onboardingUserSelectionComponent['initialize']();
      //assert
      expect(isObservable(returnedObservable)).toEqual(true);
    });
  });

  describe('getFormConfig method', () => {
    it('should return an Observable', () => {
      //arrange
      let returnedObservable = undefined;
      //run
      returnedObservable = onboardingUserSelectionComponent['getFormConfig']();
      //assert
      expect(isObservable(returnedObservable)).toEqual(true);
    });

    it('should capture the error in case of thrown error', () => {
      //arrange
      const errorResponse: HttpErrorResponse = {status: 401} as HttpErrorResponse;
      mockFormService.getFormConfig = jest.fn().mockReturnValue(throwError(errorResponse));
      //run
      onboardingUserSelectionComponent['getFormConfig']().subscribe(() => {},(err: HttpErrorResponse) => {
          //assert
          expect(err).toEqual(errorResponse);
        });
    });
  });

  describe('ngOnDestroy', () => {
    it('should destroy subscription', () => {
      //arrange
      onboardingUserSelectionComponent.unsubscribe$ = {
          next: jest.fn(),
          complete: jest.fn()
      } as any;
      //run
      onboardingUserSelectionComponent.ngOnDestroy();
      //assert
      expect(onboardingUserSelectionComponent.unsubscribe$.next).toHaveBeenCalled();
      expect(onboardingUserSelectionComponent.unsubscribe$.complete).toHaveBeenCalled();
    });
  });

  describe("ngAfterViewInit", () => {
    it('should set telemetryImpression', (done) => {
      //arrange
      mockNavigationHelperService.getPageLoadTime = jest.fn().mockReturnValue(10);
      //run
      onboardingUserSelectionComponent.ngAfterViewInit();
      //assert
      setTimeout(() => {
        expect(onboardingUserSelectionComponent.telemetryImpression).toBeDefined();
        done();
      })
    });
  });

  it('should set the user-type appropriately', () => {
    //arrange
    const selectedGuest={code:'123',
      name: 'test'
    } as any;
    //run
    onboardingUserSelectionComponent.selectUserType(selectedGuest);
    //assert
    expect(onboardingUserSelectionComponent.selectedUserType).toBeDefined();
    expect(onboardingUserSelectionComponent.selectedUserType).toEqual(selectedGuest);
  })

  describe('submit', () => {
    const selectedGuest={
      code:'123',
      name: 'test'
    } as any;

    it('should call setItem twice if loggedIn status is false', () => {
      //arrange
      jest.spyOn(Storage.prototype, 'setItem');
      //run
      onboardingUserSelectionComponent.submit();
      //assert
      expect(localStorage.setItem).toHaveBeenCalledTimes(2);
    })

    it('should set both userType and guestUserType if loggedIn status is false', () => {
      //arrange
      jest.spyOn(Storage.prototype, 'getItem');
      //run
      onboardingUserSelectionComponent.submit();
      //assert
      expect(localStorage.getItem('userType')).toEqual(selectedGuest.code);
      expect(localStorage.getItem('guestUserType')).toEqual(selectedGuest.name);
    })

    it('should call emit on userSelect if loggedIn status is false', () => {
      //arrange
      onboardingUserSelectionComponent.userSelect={
        emit:jest.fn()
      } as any
      //run
      onboardingUserSelectionComponent.submit();
      //assert
      expect(onboardingUserSelectionComponent.userSelect.emit).toBeCalled();

    })

    it('should call setItem only once and set the userType if loggedIn status is true', () => {
      //arrange
      //@ts-ignore
      mockUserService.loggedIn=true;
      jest.spyOn(Storage.prototype, 'setItem');
      jest.spyOn(Storage.prototype, 'getItem');
      //run
      onboardingUserSelectionComponent.submit();
      //assert
      expect(localStorage.getItem('userType')).toBeDefined();
      expect(localStorage.getItem('userType')).toEqual(selectedGuest.code);
      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    })

    it('should call next on updateUserSelection if loggedIn status is true', () => {
      //arrange
      onboardingUserSelectionComponent['updateUserSelection$']={
        next:jest.fn()
      } as any
      //run
      onboardingUserSelectionComponent.submit();
      //assert
      expect(onboardingUserSelectionComponent['updateUserSelection$'].next).toBeCalled();
    })

    it('should call logAuditEvent ', () => {
      //arrange
      jest.spyOn(onboardingUserSelectionComponent,'logAuditEvent');
      //run
      onboardingUserSelectionComponent.submit();
      //assert
      expect(onboardingUserSelectionComponent.logAuditEvent).toBeCalled();
    })
  })

  it('should  call the audit with auditEventInput on logAuditEvent call', () => {
    //arrange
    const auditEventInput = {
      'context': {
        'env': 'onboarding',
        'cdata': [
          { id: 'test', type: 'UserType' },
        ]
      },
      'object': {
        'id': 'test',
        'type': '',
        'ver': ''
      },
      'edata': {
        'state': 'Updated',
        'props': [
          'profile_type'
        ],
        'type': 'set-usertype',
        'prevstate': 'set-usertype',
      }
    };
    //act
    onboardingUserSelectionComponent.logAuditEvent('test');
    //assert
    expect(onboardingUserSelectionComponent.telemetryService.audit).toBeCalledWith(auditEventInput);
  })
});


