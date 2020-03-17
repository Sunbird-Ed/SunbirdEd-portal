import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateContentPreferenceComponent } from './update-content-preference.component';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SuiModalModule, SuiSelectModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { OnboardingService } from '../../../offline/services';
import { ReactiveFormsModule, FormsModule, FormControl, Validators, FormBuilder } from '@angular/forms';
import { user_content_preferences_Data } from './update-content-preference.component.spec.data';
import * as _ from 'lodash-es';

describe('UpdateContentPreferenceComponent', () => {
  let component: UpdateContentPreferenceComponent;
  let fixture: ComponentFixture<UpdateContentPreferenceComponent>;
  const formBuilder: FormBuilder = new FormBuilder();
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
  const resourceBundle = {
    messages: {
      smsg: {
        m0058: 'User preference updated successfully...'
      },
      emsg: {
        m0022: 'Unable to update user preference. Please try again after \
        some time.'
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModalModule, HttpClientTestingModule, TelemetryModule.forRoot(),
        FormsModule, ReactiveFormsModule, SharedModule.forRoot(), SuiSelectModule],
      declarations: [UpdateContentPreferenceComponent],
      providers: [{ provide: Router, useClass: RouterStub },
      { provide: ActivatedRoute, useClass: ActivatedRouteStub },
      {provide: FormBuilder, useValue: formBuilder},
      {provide: ResourceService, useValue: resourceBundle},
        OnboardingService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateContentPreferenceComponent);
    component = fixture.componentInstance;
    component.userPreferenceData = {framework: user_content_preferences_Data.selectedFramework.framework};
    component.contentPreferenceForm = formBuilder.group({
      board: new FormControl(null, [Validators.required]),
      medium: new FormControl(null, [Validators.required]),
      class: new FormControl(null, [Validators.required]),
      subjects: new FormControl(null, []),
    });
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call createContentPreferenceForm method', () => {
    spyOn(component, 'createContentPreferenceForm');
    spyOn(component, 'getCustodianOrg');
    component.ngOnInit();
    expect(component.frameworkDetails).toEqual(user_content_preferences_Data.selectedFramework.framework);
    expect(component.createContentPreferenceForm).toHaveBeenCalled();
    expect(component.getCustodianOrg).toHaveBeenCalled();
  });

  it('should initialize contentPreferenceForm', () => {
    component.createContentPreferenceForm();
    expect(component.contentPreferenceForm).toBeDefined();
    expect(component.contentPreferenceForm.controls['board'].value).toBeNull();
  });

  it('should call readChannel', () => {
    spyOn(component, 'readChannel');
    spyOn(component.orgDetailsService, 'getCustodianOrgDetails').and.returnValue(of (user_content_preferences_Data.custodianOrgId));
    component.getCustodianOrg();
    component.orgDetailsService.getCustodianOrgDetails().subscribe(data => {
      expect(data).toEqual(user_content_preferences_Data.custodianOrgId);
      expect(component.readChannel).toHaveBeenCalledWith(user_content_preferences_Data.custodianOrgId.result.response.value);
    });
  });

  it('should call onBoardChange', () => {
    spyOn(component, 'onBoardChange');
    spyOn(component.channelService, 'getFrameWork').and.returnValue(of (user_content_preferences_Data.readChannel));
    component.frameworkDetails = user_content_preferences_Data.selectedFramework.framework;
    component.readChannel('0126684405014528002');
    component.channelService.getFrameWork('0126684405014528002').subscribe(data => {
      expect(data).toEqual(user_content_preferences_Data.readChannel);
      expect(component.boardOption).toEqual(_.sortBy(_.get(data, 'result.channel.frameworks'), 'index'));
      expect(component.contentPreferenceForm.value.board).toBeDefined();
      expect(component.onBoardChange).toHaveBeenCalled();
    });
  });

  it('should call clearForm and onMediumChange', () => {
    spyOn(component, 'onMediumChange');
    spyOn(component, 'clearForm');
    spyOn(component.frameworkService, 'getFrameworkCategories').and.returnValue(of (user_content_preferences_Data.framework));
    spyOn(component, 'filterContent').and.returnValue(user_content_preferences_Data.options.medium);
    spyOn(component.userService, 'getAssociationData').and.returnValue(
      user_content_preferences_Data.framework.result.framework.categories[1]);
    component.frameworkDetails = user_content_preferences_Data.selectedFramework.framework;
    component.contentPreferenceForm.value.board = user_content_preferences_Data.options.board;
    component.onBoardChange();
    expect(component.clearForm).toHaveBeenCalledWith(['medium', 'class', 'subjects']);
    component.frameworkService.getFrameworkCategories(
      user_content_preferences_Data.readChannel.result.channel.frameworks[0].identifier).subscribe(data => {
      expect(data).toEqual(user_content_preferences_Data.framework);
      expect(component.userService.getAssociationData).toHaveBeenCalled();
      expect(component.contentPreferenceForm.value.medium).toEqual(user_content_preferences_Data.options.medium);
      expect(component.frameworkCategories).toEqual(user_content_preferences_Data.framework.result.framework.categories);
    });
  });

  it('should call clearForm and onClassChange', () => {
    spyOn(component, 'onClassChange');
    spyOn(component, 'clearForm');
    spyOn(component, 'filterContent').and.returnValue(user_content_preferences_Data.options.class);
    component.frameworkDetails = user_content_preferences_Data.selectedFramework.framework;
    component.contentPreferenceForm.value.medium = user_content_preferences_Data.options.medium;
    component.contentPreferenceForm.value.board = user_content_preferences_Data.options.board;
    component.frameworkCategories = user_content_preferences_Data.framework.result.framework.categories;
    component.onMediumChange();
    expect(component.clearForm).toHaveBeenCalledWith(['class', 'subjects']);
    expect(component.onClassChange).toHaveBeenCalled();
    expect(component.contentPreferenceForm.value.class).toBeDefined();
    expect(component.contentPreferenceForm.value.class).toEqual(user_content_preferences_Data.options.class);
  });

  it('should call clearForm and should initialize subjectOption', () => {
    spyOn(component, 'clearForm');
    spyOn(component, 'filterContent').and.returnValue(user_content_preferences_Data.options.subject);
    component.frameworkDetails = user_content_preferences_Data.selectedFramework.framework;
    component.contentPreferenceForm.value.medium = user_content_preferences_Data.options.medium;
    component.contentPreferenceForm.value.board = user_content_preferences_Data.options.board;
    component.contentPreferenceForm.value.class = user_content_preferences_Data.options.class;
    component.frameworkCategories = user_content_preferences_Data.framework.result.framework.categories;
    component.onClassChange();
    expect(component.clearForm).toHaveBeenCalledWith(['subjects']);
    expect(component.contentPreferenceForm.value.subjects).toBeDefined();
    expect(component.contentPreferenceForm.value.subjects).toEqual(user_content_preferences_Data.options.subject);
  });

  it('should call update contenet preferences (success) in onboarding service', () => {
    spyOn(component.userService, 'updateUser').and.returnValue(of(user_content_preferences_Data.success_update_preferences));
    spyOn(component, 'setTelemetryData');
    spyOn(component.toasterService, 'success').and.returnValue(of(user_content_preferences_Data.resourceBundle.messages.smsg.m0058));
    component.contentPreferenceForm.value.medium = user_content_preferences_Data.options.medium;
    component.contentPreferenceForm.value.board = user_content_preferences_Data.options.board;
    component.contentPreferenceForm.value.class = user_content_preferences_Data.options.class;
    component.contentPreferenceForm.value.subjects = user_content_preferences_Data.options.subject;
    component.userPreferenceData = user_content_preferences_Data.selectedFramework;
    component.updateUser();
    component.userService.updateUser(user_content_preferences_Data.update_content_api_body).subscribe(data => {
      expect(data).toBe(user_content_preferences_Data.success_update_preferences);
      expect(component.toasterService.success(user_content_preferences_Data.resourceBundle.messages.smsg.m0058));
    });
  });

});
