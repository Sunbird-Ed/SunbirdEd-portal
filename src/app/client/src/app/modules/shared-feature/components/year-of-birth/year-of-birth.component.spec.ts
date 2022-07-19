import { YearOfBirthComponent } from './year-of-birth.component';
import { ProfileService } from '@sunbird/profile';
import { ConfigService, ResourceService } from '@sunbird/shared';
import { Observable, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

describe('YearOfBirthComponent', () => {
  let component: YearOfBirthComponent;
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
  const mockMatDialog: Partial<MatDialog> = {
    getDialogById: jest.fn()
  };

  beforeEach(() => {
    component = new YearOfBirthComponent(
      mockProfileService as ProfileService,
      mockConfigService as ConfigService,
      mockResourceService as ResourceService,
      mockMatDialog as MatDialog
    );
  });

  it('should be create a instance of yearOfBirthComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should return year by invoked ', () => {
    jest.spyOn(component, 'initiateYearSelector');
    component.ngOnInit();
  });

  it('should initialized total years', () => {
    component.initiateYearSelector();
    expect(mockConfigService.constants).toBeTruthy();
  });

  it('should update profile if DOB is missing', () => {
    component.selectedYearOfBirth = 2000;
    mockProfileService.updateProfile = jest.fn(() => of({})) as any;
    component.dialogProps = {id: "asd"};
    component.submitYearOfBirth();
    expect(component.selectedYearOfBirth).toBeTruthy();
  });

  it('should set select year', () => {
    const year = {value: 2000};
    component.changeBirthYear(year);
    expect(component.selectedYearOfBirth).toEqual(year.value);
  });
});