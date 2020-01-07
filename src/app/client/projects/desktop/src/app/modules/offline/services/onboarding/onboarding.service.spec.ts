import { onboarding_location_test } from './../../components/onboarding-location/onboarding-location.component.spec.data';
import { onboarding } from './onboarding.service.spec.data';
import { of as observableOf, throwError as observableThrowError } from 'rxjs';
import { PublicDataService, CoreModule } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '@sunbird/shared';
import { TestBed } from '@angular/core/testing';

import { OnboardingService } from './onboarding.service';

describe('OnboardingService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [SharedModule.forRoot(), HttpClientTestingModule, CoreModule]
  }));

  it('should get User (NOT PRESENT)', () => {
    const service: OnboardingService = TestBed.get(OnboardingService);
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'get').and.returnValue(observableThrowError(onboarding.read_user_not_present));
    service.getUser();
    expect(service).toBeTruthy();
    expect(publicDataService.get).toHaveBeenCalled();
    publicDataService.get().subscribe(data => {
    }, err => {
      expect(err).toEqual(onboarding.read_user_not_present);
    });
  });

  it('should get User', () => {
    const service: OnboardingService = TestBed.get(OnboardingService);
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'get').and.returnValue(observableOf(onboarding.read_user_present));
    service.getUser();
    expect(service).toBeTruthy();
    expect(publicDataService.get).toHaveBeenCalled();
    publicDataService.get().subscribe(data => {
      expect(data).toEqual(onboarding.read_user_present);
    });
  });

  it('should search Location ', () => {
    const service: OnboardingService = TestBed.get(OnboardingService);
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'post').and.returnValue(observableOf(onboarding_location_test.statesList));
    service.searchLocation({ type: 'state' });
    expect(service).toBeTruthy();
    expect(publicDataService.post).toHaveBeenCalled();
    publicDataService.post({ type: 'state' }).subscribe(data => {
      expect(data).toEqual(onboarding_location_test.statesList);
    });
  });

  it('should search Location for districts', () => {
    const service: OnboardingService = TestBed.get(OnboardingService);
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'post').and.returnValue(observableOf(onboarding_location_test.districtList));
    service.searchLocation({ type: 'state', parentId: 'b6381e02-5a79-45ec-8e1a-a2e74fc29da3' });
    expect(service).toBeTruthy();
    expect(publicDataService.post).toHaveBeenCalled();
    publicDataService.post({ type: 'state', parentId: 'b6381e02-5a79-45ec-8e1a-a2e74fc29da3' }).subscribe(data => {
      expect(data).toEqual(onboarding_location_test.districtList);
    });
  });

  it('should save Location ', () => {
    const service: OnboardingService = TestBed.get(OnboardingService);
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'post').and.returnValue(observableOf(onboarding_location_test.saveLocation));
    service.saveLocation(onboarding_location_test.filters);
    expect(service).toBeTruthy();
    expect(publicDataService.post).toHaveBeenCalled();
    publicDataService.post(onboarding_location_test.filters).subscribe(data => {
      expect(data).toEqual(onboarding_location_test.saveLocation);
    });
  });

  it('should get Location ', () => {
    const service: OnboardingService = TestBed.get(OnboardingService);
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'get').and.returnValue(observableOf(onboarding_location_test.location_read_success));
    service.getLocation();
    expect(service).toBeTruthy();
    expect(publicDataService.get).toHaveBeenCalled();
    publicDataService.get().subscribe(data => {
      expect(data).toEqual(onboarding_location_test.location_read_success);
    });
  });

  it('should get Location (ERROR)', () => {
    const service: OnboardingService = TestBed.get(OnboardingService);
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'get').and.returnValue(observableThrowError(onboarding_location_test.location_read_error));
    service.getLocation();
    expect(service).toBeTruthy();
    expect(publicDataService.get).toHaveBeenCalled();
    publicDataService.get().subscribe(data => {
    }, err => {
      expect(err).toEqual(onboarding_location_test.location_read_error);
    });
  });

  it('should get content filter data ', () => {
    const service: OnboardingService = TestBed.get(OnboardingService);
    spyOn(service, 'getAssociationData');
    service.getAssociationData(onboarding.frameworkCategories, onboarding.category, onboarding.frameworkCategories);
  });
  it('should  update user successfully', () => {
    const service: OnboardingService = TestBed.get(OnboardingService);
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'post').and.returnValue(observableOf(onboarding.success_update_user));
    service.updateUser(onboarding.update_user_request_body).subscribe(data => {
      expect(data).toBe(onboarding.success_update_user);
    }, err => {
    });
  });
  it('should throw error while updating user', () => {
    const service: OnboardingService = TestBed.get(OnboardingService);
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'post').and.returnValue(observableThrowError(onboarding.error_update_user));
    service.updateUser(onboarding.update_user_request_body).subscribe(data => {
    }, err => {
      expect(err).toBe(onboarding.error_update_user);
    });
  });
});
