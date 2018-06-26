import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SuiModule } from 'ng2-semantic-ui';
import {SharedModule} from '@sunbird/shared';
import {CoreModule} from '@sunbird/core';
import { CreateBatchComponent } from './create-batch.component';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CourseBatchService, CourseConsumptionService, CourseProgressService } from './../../../services';
import { UserService } from '@sunbird/core';
import { TelemetryService } from '@sunbird/telemetry';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mockResponse } from './create-batch.component.spec.data';


class RouterStub {
  navigate = jasmine.createSpy('navigate');
}

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
      providers: [CourseBatchService, UserService, CourseConsumptionService,
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

  xit('should create', () => {
    expect(component).toBeTruthy();
  });

  fit('should disable the button on click of submit button in create batch', async(() => {
    const courseBatchService = TestBed.get(CourseBatchService);
    component.showCreateModal = true;
    fixture.detectChanges();
    component.createBatchUserForm = new FormGroup({});
    component.createBatchUserForm = new FormGroup({});
    component.createBatchUserForm.value.description = mockResponse.createBatchInputData.createBatchUserForm.value.description;
    component.createBatchUserForm.value.endDate = mockResponse.createBatchInputData.createBatchUserForm.value.endDate;
    component.createBatchUserForm.value.startDate = mockResponse.createBatchInputData.createBatchUserForm.value.startDate;
    component.createBatchUserForm.value.name = mockResponse.createBatchInputData.createBatchUserForm.value.name;
    component.createBatchUserForm.value.enrollmentType = mockResponse.createBatchInputData.createBatchUserForm.value.enrollmentType;
    // spyOn(component, 'createBatch');
    //
    // const test = fixture.debugElement.query(By.css('.submitbutton'))
    // console.log("testtest8756",test)
    // let element = fixture.nativeElement.querySelector('div')
    // console.log("element98765",element)
    // console.log("elesafsates2sdfs3tsdfsdfsament",test)
    // let button = fixture.debugElement.nativeElement.querySelector('button');
    // button.click();
    // let test = fixture.nativeElement.querySelector('div')
    // .triggerEventHandler('click', null);
    //
    // let button = fixture.debugElement.query(By.css('button'));
    // let button = fixture.debugElement.nativeElement.querySelector('button');
    // let button = fixture.nativeElement.querySelector('button .ui.primary.button');
    // let button = fixture.nativeElement.query(By.css('#submitbutton'));
    // console.log("button12dgdfgf12d12",button)
    // button.triggerEventHandler('click', null);
    // button.click();

    // fixture.whenStable().then(() => {
    //   console.log("elesafsafssdfsdfament",element)
    //   // console.log("testasfsasafsdfsdtest",button)
    //   // expect(component.createBatch).toHaveBeenCalled();
    // })
  }));

});
