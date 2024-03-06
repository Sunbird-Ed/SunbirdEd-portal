import { Component,OnDestroy,ViewChild,Input,Output,EventEmitter } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import { GeneraliseLabelService } from '@sunbird/core';
import { TelemetryService,IInteractEventInput } from '@sunbird/telemetry';
import { _ } from 'lodash-es';
import { ActivatedRoute } from '@angular/router';
import { CourseCompletionComponent } from './course-completion.component';

describe('CourseCompletionComponent', () => {
    let component: CourseCompletionComponent;

    const mockResourceService :Partial<ResourceService> ={};
	const mockTelemetryService :Partial<TelemetryService> ={
        interact: jest.fn(),
    };
	const mockActivatedRoute :Partial<ActivatedRoute> ={
        snapshot: {
            data: {
              telemetry: {
                env: 'mock-env',
                pageid: 'mock-pageid'
              }
            }
        } as any
    };
	const mockGeneraliseLabelService :Partial<GeneraliseLabelService> ={};

    beforeAll(() => {
        component = new CourseCompletionComponent(
            mockResourceService as ResourceService,
			mockTelemetryService as TelemetryService,
			mockActivatedRoute as ActivatedRoute,
			mockGeneraliseLabelService as GeneraliseLabelService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });

    it('should call closeModal method on ngOnDestroy',() =>{
        jest.spyOn(component,'closeModal');
        component.ngOnDestroy();
        expect(component.closeModal).toHaveBeenCalled();
    });

    it('should log telemetry when modal is denied', () => {
        component.modal = { deny: jest.fn() };
        component.logInteractTelemetry();
    
        expect(mockTelemetryService.interact).toHaveBeenCalledWith({
          context: {
            cdata: [{ id: 'course-completion', type: 'Feature' }],
            env: mockActivatedRoute.snapshot.data.telemetry.env,
          },
          edata: {
            id: 'close-course-completion-modal',
            type: 'click',
            pageid: mockActivatedRoute.snapshot.data.telemetry.pageid
          }
        });
        expect(mockTelemetryService.interact).toHaveBeenCalled();
    });
    
});