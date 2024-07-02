import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { FormService } from '@sunbird/core';
import { GroupsService } from '../../../services';
import { ActivatedRoute } from '@angular/router';
import { ActivityFormComponent } from './activity-form.component';
import {of , throwError } from 'rxjs';

describe('ActivityFormComponent', () => {
  let component: ActivityFormComponent;

  const mockActivatedRoute: Partial<ActivatedRoute> = {
    params: of({ groupId: 'sampleGroupId', activityId: 'sampleActivityId' }),
    queryParams: of({ primaryCategory: 'Course' }),
      snapshot: {
      } as any,
  };
  const mockResourceService: Partial<ResourceService> = {
    frmelmnts: {
            lbl: {
                Select: 'Select'
            },
    },
    messages: {
      emsg:{
        m0005: 'Form service error'
      },
        lbl: {
          you: 'You'
        },
      },
    };
  const mockToasterService: Partial<ToasterService> = {
    error: jest.fn(),
    warning: jest.fn(),
  };
  const mockGroupService: Partial<GroupsService> ={
    getGroupById: jest.fn(() => of({})),
    getActivity: jest.fn(() => of({})),
    addTelemetry: jest.fn(),
    goBack: jest.fn(),
    getImpressionObject: jest.fn(),
  };

  const mockFormService: Partial<FormService>={
    getFormConfig: jest.fn(() => of()),
  }

   beforeAll(() => {
    component = new ActivityFormComponent(
      mockResourceService as ResourceService, mockFormService as FormService, mockToasterService as ToasterService, mockGroupService as GroupsService, mockActivatedRoute as ActivatedRoute
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a instance ', () => {
    expect(component).toBeTruthy();
  });

  it('should call getFormDetails during ngOnInit', () => {
    jest.spyOn(component, 'getFormDetails' as any);
    component.ngOnInit();
    expect(component['getFormDetails']).toHaveBeenCalled();
  });

  it('should handle successful form service response', () => {
    const mockFields = [{ title: 'Field 1' }, { title: 'Field 2' }];
    (mockFormService.getFormConfig as any).mockReturnValue(of(mockFields));

    component.ngOnInit();

    expect(mockFormService.getFormConfig).toHaveBeenCalled();
    expect(component.activityTypes).toEqual(mockFields);
    expect(component.selectedActivity).toEqual(mockFields[0]);
    expect(component['toasterService'].error).not.toHaveBeenCalled();
  });

  it('should update selected activity on chooseActivity', () => {
    const mockActivity = { title: 'Selected Activity' };
    component.chooseActivity(mockActivity);

    expect(component.selectedActivity).toEqual(mockActivity);
  });

  it('should add telemetry on next', () => {
    const mockActivity = { title: 'Selected Activity' };
    component.selectedActivity = mockActivity;

    component.next();

    expect(mockGroupService.addTelemetry).toHaveBeenCalledWith(
      { id: 'activity-type' },
      mockActivatedRoute.snapshot,
      [{ id: mockActivity.title, type: 'activityType' }]
    );
  });

  it('should handle form service error', () => {
    const errorMessage = 'Form service error';
    (mockFormService.getFormConfig as any).mockReturnValue(throwError(errorMessage) as any);
    component['getFormDetails']();
    expect(mockToasterService.error).toHaveBeenCalledWith(mockResourceService.messages.emsg.m0005);
  });

});