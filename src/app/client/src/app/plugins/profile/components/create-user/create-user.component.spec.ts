import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateUserComponent } from './create-user.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { CoreModule, FormService } from '@sunbird/core';
import { ResourceService, SharedModule, ToasterService } from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { throwError as observableThrowError, of as observableOf } from 'rxjs';
import { mockRes } from './create-user.component.spec.data';


describe('CreateUserComponent', () => {
  let component: CreateUserComponent;
  let fixture: ComponentFixture<CreateUserComponent>;

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    snapshot: {
      data: {
        telemetry: {
          env: 'profile', pageid: 'profile', subtype: 'paginate', type: 'view',
          object: { type: '', ver: '1.0' }
        }
      }
    };
  }
  const env = 'profile';
  class ActivatedRouteStub {
    snapshot = {
      root: { firstChild : {data: { telemetry: { env: env} } } },
      data : {
         telemetry: { env: env }
      }
    };
  }

  const resourceBundle = {
    'messages': {
      'fmsg': {
        'm0085': 'There is some technical error',
      },
      'stmsg': {
        'm0130': 'We are fetching districts',
      },
      'emsg': {
        'm0005': 'Something went wrong, try later'
      },
      'smsg': {
        'm0046': 'Profile updated successfully'
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
      imports: [SharedModule.forRoot(), CoreModule, FormsModule, ReactiveFormsModule,
        HttpClientTestingModule, TelemetryModule],
      declarations: [CreateUserComponent],
      providers: [{ provide: ResourceService, useValue: resourceBundle }, { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: Router, useClass: RouterStub }, ToasterService, TelemetryService, FormService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call ngOnInit', () => {
    spyOn(component, 'fetchTncData');
    spyOn(component, 'getFormDetails');
    component.ngOnInit();
    expect(component.instance).toEqual('SUNBIRD');
    expect(component.fetchTncData).toHaveBeenCalled();
    expect(component.getFormDetails).toHaveBeenCalled();
  });

  it('should call getFormDetails with success', () => {
    const formService = TestBed.get(FormService);
    spyOn(formService, 'getFormConfig').and.returnValue(observableOf(mockRes.formData));
    spyOn(component, 'initializeFormFields');
    component.getFormDetails();
    expect(component.formData).toEqual(mockRes.formData);
    expect(component.initializeFormFields).toHaveBeenCalled();
  });

  it('should call getFormDetails with error', () => {
    const formService = TestBed.get(FormService);
    spyOn(formService, 'getFormConfig').and.returnValue(observableThrowError({}));
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callThrough();
    component.getFormDetails();
    expect(component.showLoader).toBeFalsy();
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.emsg.m0005);
  });
});
