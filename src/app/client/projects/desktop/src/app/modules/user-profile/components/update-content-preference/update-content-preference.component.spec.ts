import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateContentPreferenceComponent } from './update-content-preference.component';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SuiModalModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { OnboardingService } from '../../../offline/services';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { user_content_preferences_Data } from './update-content-preference.component.spec.data';
describe('UpdateContentPreferenceComponent', () => {
  let component: UpdateContentPreferenceComponent;
  let fixture: ComponentFixture<UpdateContentPreferenceComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  class ActivatedRouteStub {
    snapshot = {
      data: {
        telemetry: {
          env: 'profile',
          pageid: 'profile'
        }
      }
    };
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModalModule, HttpClientTestingModule, TelemetryModule.forRoot(),
        FormsModule, ReactiveFormsModule, SharedModule.forRoot()],
      declarations: [UpdateContentPreferenceComponent],
      providers: [{ provide: Router, useClass: RouterStub },
      { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        OnboardingService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateContentPreferenceComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call createContentPreferenceForm method', () => {
    spyOn(component, 'createContentPreferenceForm');
    component.ngOnInit();
    expect(component.createContentPreferenceForm).toHaveBeenCalled();

  });

  it('should call getCustodianOrg', () => {
    spyOn(component.orgDetailsService, 'getCustodianOrgDetails').and.returnValue(of(user_content_preferences_Data.custodianOrgId));
    spyOn(component, 'readChannel');
    component.getCustodianOrg();
    expect(component.readChannel).toHaveBeenCalled();
  });

  it('should call readChannel and success while getting framework details', () => {
    spyOn(component.channelService, 'getFrameWork').and.returnValue(of(user_content_preferences_Data.readChannel));
    component.readChannel('01285019302823526477');
    expect(component.boardOption).toEqual(user_content_preferences_Data.readChannel.result.channel.frameworks);
  });

  it('should call readChannel and error while getting framework details', () => {
    spyOn(component, 'onBoardChange');
    spyOn(component.channelService, 'getFrameWork').and.returnValue(of(user_content_preferences_Data.framework_error));
    component.onBoardChange();
    spyOn(component, 'filterContent');
    spyOn(component, 'getSelecteddata');
    expect(component.mediumOption).toEqual([]);
    expect(component.classOption).toEqual([]);
    expect(component.subjectsOption).toEqual([]);
  });

  it('should call onBoardChange and get getFrameworkCategories', () => {
    spyOn(component, 'onBoardChange');
    spyOn(component.frameworkService, 'getFrameworkCategories').and.returnValue(of(user_content_preferences_Data.framework));
    spyOn(component, 'filterContent');
    spyOn(component, 'getSelecteddata');
    component.onBoardChange();
    spyOn(component.userService, 'getAssociationData');
    expect(component.mediumOption).toEqual([]);
    expect(component.classOption).toEqual([]);
    expect(component.subjectsOption).toEqual([]);
  });

  it('should disable submit button when on change in board ', () => {
    spyOn(component, 'onBoardChange');
    component.ngOnInit();
    let errors = {};
    const medium_control = component.contentPreferenceForm.controls['medium'];
    medium_control.setValue('');
    errors = medium_control.errors || {};
    expect(errors['required']).toBeTruthy();
    expect(component.contentPreferenceForm.invalid).toBeTruthy();
    expect(component.mediumOption).toEqual([]);
    expect(component.classOption).toEqual([]);
    expect(component.subjectsOption).toEqual([]);
  });

  it('should call onMediumChange and filter data', () => {
    spyOn(component.userService, 'getAssociationData');
    spyOn(component, 'onMediumChange');
    component.onMediumChange();
    spyOn(component, 'filterContent');
    spyOn(component, 'getSelecteddata');
    expect(component.classOption).toEqual([]);
    expect(component.subjectsOption).toEqual([]);
  });

  it('should disable submit button when on change in medium ', () => {
    spyOn(component, 'onMediumChange');
    component.ngOnInit();
    let errors = {};
    const class_control = component.contentPreferenceForm.controls['class'];
    class_control.setValue('');
    errors = class_control.errors || {};
    expect(errors['required']).toBeTruthy();
    expect(component.contentPreferenceForm.invalid).toBeTruthy();
    expect(component.classOption).toEqual([]);
    expect(component.subjectsOption).toEqual([]);
  });


  it('should call onClassChange', () => {
    spyOn(component.userService, 'getAssociationData').and.returnValue(user_content_preferences_Data.update_content_api_body.subjects);
   component.onClassChange();
    expect(component.subjectsOption).toEqual(user_content_preferences_Data.update_content_api_body.subjects);
  });

  it('should disable submit button when on change in class ', () => {
    spyOn(component, 'onMediumChange');
    spyOn(component, 'onBoardChange');
    spyOn(component, 'onClassChange');
    component.ngOnInit();
    let errors = {};
    const subjects_control = component.contentPreferenceForm.controls['subjects'];
    subjects_control.setValue('');
    errors = subjects_control.errors || {};
    expect(errors['required']).toBeTruthy();
    expect(component.contentPreferenceForm.invalid).toBeTruthy();
  });

  it('should call close modal', () => {
    spyOn(component.dismissed, 'emit').and.returnValue(user_content_preferences_Data.request_body.request);
    component.closeModal(user_content_preferences_Data.request_body.request);
    expect(component.dismissed.emit).toHaveBeenCalledWith(user_content_preferences_Data.request_body.request);
  });

  it('should call update contenet preferences (success) in onboarding service', () => {
    const userService = TestBed.get(OnboardingService);
    spyOn(component, 'updateUser');
    spyOn(userService, 'updateUser').and.returnValue(of(user_content_preferences_Data.success_update_preferences));
    component.updateUser();
    userService.updateUser(user_content_preferences_Data.update_content_api_body).subscribe(data => {
      expect(data).toBe(user_content_preferences_Data.success_update_preferences);
      spyOn(component.toasterService, 'success').and.returnValue(of(user_content_preferences_Data.resourceBundle.messages.smsg.m0058));
      expect(component.toasterService.error(user_content_preferences_Data.resourceBundle.messages.smsg.m0058));
    });
    spyOn(component, 'telemetryService');
    spyOn(component, 'setTelemetryData').and.callThrough();
    component.setTelemetryData();
    expect(component.setTelemetryData).toHaveBeenCalled();
  });

  it('should call update contenet preferences (error) in onboarding service', () => {
    const userService = TestBed.get(OnboardingService);
    spyOn(component, 'updateUser');
    spyOn(userService, 'updateUser').and.returnValue(of(user_content_preferences_Data.error_update_preferences));
    userService.update(user_content_preferences_Data.request_body).subscribe(data => {

    }, error => {
      expect(error).toBe(user_content_preferences_Data.error_update_preferences);
      spyOn(component.toasterService, 'error').and.returnValue(of(user_content_preferences_Data.resourceBundle.messages.emsg.m0022));
      expect(component.toasterService.error(user_content_preferences_Data.resourceBundle.messages.emsg.m0022));
    });
    spyOn(component, 'telemetryService');
    spyOn(component, 'setTelemetryData').and.callThrough();
    component.setTelemetryData();
    expect(component.setTelemetryData).toHaveBeenCalled();
  });
});
