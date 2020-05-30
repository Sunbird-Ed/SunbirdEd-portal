import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TelemetryModule } from '@sunbird/telemetry';
import { SubmitTeacherDetailsComponent } from './submit-teacher-details.component';
import {
  ResourceService,
  ToasterService,
  ConfigService,
  BrowserCacheTtlService,
  NavigationHelperService
} from '@sunbird/shared';
import { ProfileService } from '@sunbird/profile';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheService } from 'ng2-cache-service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { RouterTestingModule } from '@angular/router/testing';
import { mockResp } from './submit-teacher-details.component.spec.data';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule } from '@sunbird/shared';
import { CoreModule } from '@sunbird/core';
import { throwError as observableThrowError, of as observableOf } from 'rxjs';



describe('SubmitTeacherDetailsComponent', () => {
  let component: SubmitTeacherDetailsComponent;
  let fixture: ComponentFixture<SubmitTeacherDetailsComponent>;
  let configService;

  const resourceBundle = {
    'messages': {
      'fmsg': {
        'm0085': 'There is some technical error',
        'm0004': 'Something went wrong, try later'
      },
      'stmsg': {
        'm0130': 'We are fetching districts',
      },
      'emsg': {
        'm0005': 'Something went wrong, try later'
      },
      'smsg': {
        'm0046': 'Profile updated successfully',
        'm0037': 'Updated'
      }
    },
    'frmelmnts': {
      'lbl': {
        'resentOTP': 'OTP resent'
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        SuiModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        TelemetryModule.forRoot(),
        RouterTestingModule,
        SharedModule.forRoot()],
      declarations: [SubmitTeacherDetailsComponent],
      providers: [{ provide: ResourceService, useValue: resourceBundle },
        ToasterService, ProfileService, ConfigService, CacheService, BrowserCacheTtlService,
        NavigationHelperService, DeviceDetectorService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitTeacherDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    configService = TestBed.get(ConfigService);
    component.pageId = 'profile-read';
  });

  it('should call ng on init', () => {
    spyOn(component, 'setTelemetryData');
    spyOn(component, 'setFormDetails');
    component.ngOnInit();
    expect(component.setTelemetryData).toHaveBeenCalled();
    expect(component.setFormDetails).toHaveBeenCalled();
  });

  it('should call setTelemetryData', () => {
    component.setTelemetryData();
    expect(component.submitInteractEdata).toBeDefined();
    expect(component.updateInteractEdata).toBeDefined();
    expect(component.cancelInteractEdata).toBeDefined();
  });

  it('should call setFormDetails', () => {
    spyOn(component, 'getFormDetails').and.returnValue(observableOf('test_data'));
    spyOn(component, 'initializeFormFields');
    component.setFormDetails();
    expect(component.formData).toEqual('test_data');
    expect(component.initializeFormFields).toHaveBeenCalled();
  });

  it('should call updateProfile', () => {
    component.formAction = 'update';
    const profileService = TestBed.get(ProfileService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(profileService, 'updateProfile').and.returnValue(observableOf(''));
    spyOn(toasterService, 'success');
    spyOn(component, 'closeModal');
    component.updateProfile('');
    expect(toasterService.success).toHaveBeenCalledWith(resourceBundle.messages.smsg.m0037);
    expect(component.closeModal).toHaveBeenCalled();
  });

});

