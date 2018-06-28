import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed, tick , fakeAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SuiModule } from 'ng2-semantic-ui';
import {SharedModule, ResourceService, ToasterService} from '@sunbird/shared';
import {CoreModule} from '@sunbird/core';
import { CreateBatchComponent } from './create-batch.component';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CourseBatchService, CourseConsumptionService, CourseProgressService } from './../../../services';
import { UserService } from '@sunbird/core';
import { TelemetryService } from '@sunbird/telemetry';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mockResponse } from './create-batch.component.data';


class RouterStub {
  navigate = jasmine.createSpy('navigate');
}

const resourceServiceMockData = {
  messages: {
    imsg: { m0027: 'Something went wrong' },
    stmsg: { m0009: 'error' }
  },
  frmelmnts: {
    btn: {
      tryagain: 'tryagain',
      close: 'close'
    },
    lbl: {
      description: 'description',
      createnewbatch: ''
    }
  }
};

const fakeActivatedRoute = {
  'params': Observable.from([{ 'courseId': 'do_1125083286221291521153' }]),
  'parent': { 'params': Observable.from([{ 'courseId': 'do_1125083286221291521153' }]) },
  'snapshot': {
      params: [
        {
          courseId: 'do_1125083286221291521153',
        }
      ],
      data: {
        telemetry: {
        }
      }
    }
};

describe('CreateBatchComponent', () => {
  let component: CreateBatchComponent;
  let fixture: ComponentFixture<CreateBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateBatchComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [SharedModule.forRoot(), CoreModule.forRoot(), SuiModule, RouterTestingModule,
        HttpClientTestingModule],
      providers: [CourseBatchService, ToasterService, ResourceService, UserService, CourseConsumptionService,
        CourseProgressService, TelemetryService, { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should disable the button on click of submit button in create batch', fakeAsync(() => {
    const courseBatchService = TestBed.get(CourseBatchService);
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    const userService = TestBed.get(UserService);
    resourceService.messages = mockResponse.resourceBundle.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    spyOn(component, 'getUserList');
    spyOn(component, 'createBatch');
    userService._userData$.next({ err: null, userProfile: mockResponse.userMockData });
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('#submitbutton'));
    button.triggerEventHandler('click', null);
    tick(1000);
    expect(component.createBatch).toHaveBeenCalled();
    expect(component.disableSubmitBtn).toEqual(true);
  }));

  it('should enable the submit button which was disabled during click of createBatch function on api error', fakeAsync(() => {
    const courseBatchService = TestBed.get(CourseBatchService);
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    const userService = TestBed.get(UserService);
    resourceService.messages = mockResponse.resourceBundle.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    spyOn(component, 'getUserList');
    spyOn(component, 'createBatch').and.callThrough();
    spyOn(toasterService, 'error');
    spyOn(courseBatchService, 'createBatch').and.callFake(() => Observable.throw(mockResponse.errorResponse));
    userService._userData$.next({ err: null, userProfile: mockResponse.userMockData });
    component.createBatchUserForm.value.startDate = new Date();
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('#submitbutton'));
    button.triggerEventHandler('click', null);
    tick(1000);
    expect(component.createBatch).toHaveBeenCalled();
    expect(component.disableSubmitBtn).toEqual(false);
    expect(toasterService.error).toHaveBeenCalled();
  }));

  it('should enable the submit button which was disabled during click of createBatch function on success response', fakeAsync(() => {
    const courseBatchService = TestBed.get(CourseBatchService);
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    const userService = TestBed.get(UserService);
    resourceService.messages = mockResponse.resourceBundle.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    spyOn(component, 'getUserList');
    spyOn(component, 'createBatch').and.callThrough();
    spyOn(toasterService, 'success');
    spyOn(courseBatchService, 'createBatch').and.callFake(() => Observable.of(mockResponse.returnValue));
    userService._userData$.next({ err: null, userProfile: mockResponse.userMockData });
    component.createBatchUserForm.value.startDate = new Date();
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('#submitbutton'));
    button.triggerEventHandler('click', null);
    tick(1000);
    expect(component.createBatch).toHaveBeenCalled();
    expect(component.disableSubmitBtn).toEqual(false);
    expect(toasterService.success).toHaveBeenCalled();
  }));

});
