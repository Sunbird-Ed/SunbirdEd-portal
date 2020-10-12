import { fakeActivatedRoute } from './../../../services/groups/groups.service.spec.data';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityFormComponent } from './activity-form.component';
import { ResourceService, SharedModule, ToasterService } from '@sunbird/shared';
import { FormsModule } from '@angular/forms';
import { configureTestSuite } from '@sunbird/test-util';
import { CoreModule, FormService } from '@sunbird/core';
import { TelemetryModule } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('ActivityFormComponent', () => {
  let component: ActivityFormComponent;
  let fixture: ComponentFixture<ActivityFormComponent>;

  const resourceBundle = {
    'messages': {
      'fmsg': {
        'm0085': 'There is some technical error',
      },
      'emsg': { 'm0005': 'Something went wrong, try again later' }
    },
    'frmelmnts': {
      'lbl': {}
    }
  };

  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityFormComponent],
      imports: [SharedModule.forRoot(), CoreModule, FormsModule, TelemetryModule.forRoot(), HttpClientTestingModule,
        RouterTestingModule],
      providers: [
        { provide: ResourceService, useValue: resourceBundle },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call chooseActivity', () => {
    component.chooseActivity({ title: 'courses' });
    expect(component.selectedActivity).toEqual({ title: 'courses' });
  });

  it('should call next', () => {
    component.selectedActivity = { title: 'courses' };
    spyOn(component['groupService'], 'addTelemetry');
    spyOn(component.nextClick, 'emit');
    component.next();
    expect(component.nextClick.emit).toHaveBeenCalledWith({ activityType: 'courses' });
    expect(component['groupService'].addTelemetry).toHaveBeenCalledWith(
      {id: 'activity-type'},
      fakeActivatedRoute.snapshot,
      [{id: 'courses' ,type: 'activityType'}, {id:fakeActivatedRoute.snapshot.params.groupId , type: 'group'}]
    );
  });

  it('should get getFormDetails', () => {
    const response = [
      { 'index': 0, 'title': 'ACTIVITY_COURSE_TITLE', 'desc': 'ACTIVITY_COURSE_DESC', 'activityType': 'Content', 'isEnabled': true, 'filters': { 'contentType': ['Course'] } },
      { 'index': 1, 'title': 'ACTIVITY_TEXTBOOK_TITLE', 'desc': 'ACTIVITY_TEXTBOOK_DESC', 'activityType': 'Content', 'isEnabled': false, 'filters': { 'contentType': ['TextBook'] } }
    ];
    const formService = TestBed.get(FormService);
    spyOn(component, 'chooseActivity');
    spyOn(formService, 'getFormConfig').and.returnValue(of(response));
    component['getFormDetails']();
    expect(component.chooseActivity).toHaveBeenCalledWith(response[0]);
    expect(component.activityTypes).toBeDefined();
  });

  it('should get getFormDetails on error', () => {
    const formService = TestBed.get(FormService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error');
    spyOn(formService, 'getFormConfig').and.returnValue(throwError({}));
    component['getFormDetails']();
    expect(component.activityTypes).not.toBeDefined();
    expect(toasterService.error).toHaveBeenCalledWith('Something went wrong, try again later');
  });
});
