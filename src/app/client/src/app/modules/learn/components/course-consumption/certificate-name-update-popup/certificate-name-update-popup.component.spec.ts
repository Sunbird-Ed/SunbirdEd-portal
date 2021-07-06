import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { CertificateNameUpdatePopupComponent } from './certificate-name-update-popup.component';
import { configureTestSuite } from '@sunbird/test-util';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule, BrowserCacheTtlService, ConfigService, ToasterService, UtilService, ResourceService } from '@sunbird/shared';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { CacheService } from 'ng2-cache-service';
import { CoreModule, UserService } from '@sunbird/core';
import { ProfileService } from '@sunbird/profile';
import { response as CertMockResponse } from './certificate-name-update-popup.component.spec.data';
import { of as observableOf, throwError as observableThrowError, of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

xdescribe('CertificateNameUpdatePopupComponent', () => {
  let component: CertificateNameUpdatePopupComponent;
  let fixture: ComponentFixture<CertificateNameUpdatePopupComponent>;
  configureTestSuite();

  const resourceBundle = {
    frmelmnts: {
      lbl: {
        firstName: 'Gourav',
        LastName: 'More'
      }
  },
  messages: {
    fmsg: { m0085: 'profile update error.' }
  }
};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificateNameUpdatePopupComponent ],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        SuiModule,
        CoreModule,
        RouterTestingModule,
        TelemetryModule
      ],
      providers: [
        BrowserCacheTtlService,
        ConfigService,
        ToasterService,
        UtilService,
        CacheService,
        UserService,
        ProfileService,
        TelemetryService,
        {provide: ResourceService, useValue: resourceBundle},
        {
          provide: ActivatedRoute, useValue: {
            paramMap: of(convertToParamMap({ id: 0 }))
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificateNameUpdatePopupComponent);
    component = fixture.componentInstance;
    component.profileInfo = {
      firstName: 'Gourav',
      lastName: 'More'
    };
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable continue button on profile update call', () => {
    const userService = TestBed.get(UserService);
    userService._userData$.next({ err: null, userProfile: CertMockResponse.userMockData });
    userService._userProfile = CertMockResponse.userMockData;
    component.updateProfileName();
    expect(component.disableContinueBtn).toEqual(true);
  });

  it('should hide the profile update popup on profile update call', () => {
    const userService = TestBed.get(UserService);
    userService._userData$.next({ err: null, userProfile: CertMockResponse.userMockData });
    userService._userProfile = CertMockResponse.userMockData;

    const profileService = TestBed.get(ProfileService);
    spyOn(profileService, 'updateProfile').and.returnValue(of({}));
    component.updateProfileName();
    expect(profileService.updateProfile).toHaveBeenCalledWith({firstName: 'Gourav', lastName: 'More'});
  });

  it('should enabled disabled continue button on error of profile update call', () => {
    const userService = TestBed.get(UserService);
    userService._userData$.next({ err: null, userProfile: CertMockResponse.userMockData });
    userService._userProfile = CertMockResponse.userMockData;

    const profileService = TestBed.get(ProfileService);
    spyOn(profileService, 'updateProfile').and.callFake(() => observableThrowError({'error': 'error'}));
    component.updateProfileName();
    expect(component.disableContinueBtn).toEqual(false);
  });

  it('should disable the contibue button', () => {
    const isChecked = true;
    component.onClickCheckbox(isChecked);
    expect(component.disableContinueBtn).toEqual(false);
  });

  it('should enable the contibue button', () => {
    const isChecked = false;
    component.onClickCheckbox(isChecked);
    expect(component.disableContinueBtn).toEqual(true);
  });
});
