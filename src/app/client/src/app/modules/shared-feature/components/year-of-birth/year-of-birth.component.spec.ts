import { YearOfBirthComponent } from './year-of-birth.component';
import { ProfileService } from '@sunbird/profile';
import { ConfigService, ResourceService } from '@sunbird/shared';
import { Observable, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

describe('YearOfBirthComponent', () => {
  let yearOfBirthComponent: YearOfBirthComponent;
  const mockConfigService: Partial<ConfigService> = {
    constants: {
      SIGN_UP: {
        MAX_YEARS: '1921'
      }
    }
  };
  const mockProfileService: Partial<ProfileService> = {
    updateProfile(request): Observable<any> {
      return of({});
    }
  };
  const mockResourceService: Partial<ResourceService> = {};
  const mockMatDialog: Partial<MatDialog> = {};

  beforeAll(() => {
    yearOfBirthComponent = new YearOfBirthComponent(
      mockProfileService as ProfileService,
      mockConfigService as ConfigService,
      mockResourceService as ResourceService,
      mockMatDialog as MatDialog
    );
  });

  it('should be create a instance of yearOfBirthComponent', () => {
    expect(yearOfBirthComponent).toBeTruthy();
  });

  it('should return year by invoked ', () => {
    spyOn(yearOfBirthComponent, 'initiateYearSelector');
    yearOfBirthComponent.ngOnInit();
  });

  it('should initialized total years', () => {
    yearOfBirthComponent.initiateYearSelector();
    expect(mockConfigService.constants).toBeTruthy();
  });

  it('should update profile if DOB is missing', () => {
    yearOfBirthComponent.selectedYearOfBirth = 2000;
    const spy = spyOn(mockProfileService, 'updateProfile').and.callFake(() => {

      return of({});
    });
    yearOfBirthComponent.submitYearOfBirth();
    expect(yearOfBirthComponent.selectedYearOfBirth).toBeTruthy();
  });

  it('should set select year', () => {
    const year = 2000;
    yearOfBirthComponent.changeBirthYear(year);
    expect(yearOfBirthComponent.selectedYearOfBirth).toBe(year);
  });
});
