import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute,Router } from '@angular/router';
import { UntypedFormGroup,UntypedFormBuilder,Validators, FormGroup, FormControl } from '@angular/forms';
import { Subject, of } from 'rxjs';
import { ResourceService,ToasterService } from '@sunbird/shared';
import { Component,OnInit,ViewChild,OnDestroy,AfterViewInit } from '@angular/core';
import { GroupsService } from '../../services';
import { _ } from 'lodash-es';
import { IImpressionEventInput,TelemetryService } from '@sunbird/telemetry';
import { NavigationHelperService } from '@sunbird/shared';
import { POPUP_LOADED,CREATE_GROUP,SELECT_CLOSE,CLOSE_ICON,SELECT_RESET } from '../../interfaces/telemetryConstants';
import { UtilService } from '../../../shared/services/util/util.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateEditGroupComponent } from './create-edit-group.component';

describe('CreateEditGroupComponent', () => {
    let component: CreateEditGroupComponent;

    const mockResourceService :Partial<ResourceService> ={
		instance: 'mockinstance',
	};
	const mockToasterService :Partial<ToasterService> ={
		success: jest.fn(),
		error: jest.fn()
	};
	const mockFb :Partial<UntypedFormBuilder> ={
		group: jest.fn(),
	};
	const mockGroupService :Partial<GroupsService> ={
		goBack: jest.fn(),
		addTelemetry: jest.fn(),
		createGroup: jest.fn(),
	};
	const mockActivatedRoute :Partial<ActivatedRoute> ={
		snapshot: {
            data: {
              telemetry: { env: 'mock-env', pageid: 'mock-page-id', type: 'mock-type', subtype: 'mock-sub-type' }
            },
        } as any,
		parent: {
			snapshot: {
			  params: { groupId: 'mock-group-id' }
			}
		}as any,
		
	};
	const mockTelemetryService :Partial<TelemetryService> ={
		impression: jest.fn(),
	};
	const mockRouter :Partial<Router> ={
		url: '/mock-url',
	};
	const mockNavigationHelperService :Partial<NavigationHelperService> ={
		getPageLoadTime : jest.fn(),
	};
	const mockUtilService :Partial<UtilService> ={
		isDesktopApp: true,
		getAppBaseUrl: jest.fn(),
	};
	const mockMatDialog :Partial<MatDialog> ={
		getDialogById: jest.fn(),
	};

    beforeAll(() => {
        component = new CreateEditGroupComponent(
            mockResourceService as ResourceService,
			mockToasterService as ToasterService,
			mockFb as UntypedFormBuilder,
			mockGroupService as GroupsService,
			mockActivatedRoute as ActivatedRoute,
			mockTelemetryService as TelemetryService,
			mockRouter as Router,
			mockNavigationHelperService as NavigationHelperService,
			mockUtilService as UtilService,
			mockMatDialog as MatDialog
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });

	it('should initialize properties correctly when groupId is present', () => {
		jest.spyOn(component.utilService,'getAppBaseUrl').mockReturnValue('mock-base-url');
		jest.spyOn(component as any,'initializeForm');
		component.ngOnInit();
	
		expect(component.instance).toBe('MOCKINSTANCE');
		expect(component.isDesktopApp).toBe(true);
		expect(component.groupId).toBe('mock-group-id');
		expect(component.groupService.goBack).toHaveBeenCalled();
		expect(component.url).toBe('mock-base-url');
		expect(component['initializeForm']).toHaveBeenCalled();
	});
	
	describe('ngAfterViewInit',()=>{
		it('should call setTelemetryImpression method when groupId is not present', () => {
			component.groupId = null;
			jest.spyOn(component,'setTelemetryImpression')
			component.ngAfterViewInit();

			expect(component.setTelemetryImpression).toHaveBeenCalledWith({ type: 'popup-loaded' });
		});
		
		it('should not call setTelemetryImpression() when groupId is present', () => {
			component.groupId = 'mock-group-id';
			component.ngAfterViewInit();

			expect(component.setTelemetryImpression).not.toHaveBeenCalled();
		});
    });

	it('should call close and goBack methods on closeModal method',()=>{
	   const modalId = 'mock-modal-id' 
	   const closeSpy = jest.spyOn(component,'close');
       component.closeModal({modalId});
       
       expect(closeSpy).toHaveBeenCalledWith(modalId);
	   expect(component.groupService.goBack).toHaveBeenCalled();
	});
    
	it('should call groupService.addTelemetry with correct parameters', () => {
		component.groupId = 'mock-group-id';
		const edata = { type: 'mock-type', subtype: 'mock-sub-type' };
		component.addTelemetry('mock-id', 'mock-extra-data', edata);
	
		expect(component.groupService.addTelemetry).toHaveBeenCalled();
	});
	
	it('should construct telemetryImpression object and call telemetryService.impression()', () => {
		component.groupId = 'mock-group-id';
		jest.spyOn(component.navigationHelperService,'getPageLoadTime').mockReturnValue(10);
	
		component.setTelemetryImpression({ type: 'customType' });
	
		expect(component.telemetryImpression).toEqual({
		  context: {
			env: 'mock-env',
			cdata: [{
			  type: 'Group',
			  id: ''
			}]
		  },
		  edata: {
			type: 'popup-loaded',
			subtype: 'mock-sub-type',
			pageid: 'mock-page-id',
			uri: '/mock-url',
			duration: undefined
		  }
		});
	});
	

	it('should call ngOnDestroy', () => {
		component['unsubscribe$'] = {
		  next: jest.fn(),
		  complete: jest.fn()
	  } as any;
	   component.ngOnDestroy();
	   expect(component['unsubscribe$'].next).toHaveBeenCalled();
	   expect(component['unsubscribe$'].complete).toHaveBeenCalled();
	});
	
});