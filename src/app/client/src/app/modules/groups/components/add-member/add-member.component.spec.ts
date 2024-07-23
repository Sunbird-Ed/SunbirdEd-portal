import { Location } from '@angular/common';
import { ActivatedRoute,Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { ResourceService,ToasterService,RecaptchaService,LayoutService } from '@sunbird/shared';
import { Component,OnInit,Output,EventEmitter,OnDestroy,ViewChild } from '@angular/core';
import { _ } from 'lodash-es';
import { IGroupMember,IGroupCard,IMember } from '../../interfaces';
import { GroupsService } from '../../services';
import { Subject, of } from 'rxjs';
import { IImpressionEventInput } from '@sunbird/telemetry';
import { RecaptchaComponent } from 'ng-recaptcha';
import { TelemetryService } from '@sunbird/telemetry';
import { VERIFY_USER,USER_SEARCH } from '../../interfaces/telemetryConstants';
import { sessionKeys } from '../../../../modules/groups/interfaces/group';
import { AddMemberComponent } from './add-member.component';

describe('AddMemberComponent', () => {
    let component: AddMemberComponent;

    const mockResourceService :Partial<ResourceService> ={
		messages:{
			emsg:{
				m006: 'Other mock errors',
				m007: 'The value has been reset',
			},
			groups:{
				emsg:{
					m002: 'Exceeded member maximum limit.',
				}
			}
		}
	};
	const mockGroupsService :Partial<GroupsService> ={};
	const mockToasterService :Partial<ToasterService> ={
		error: jest.fn(),
	};
	const mockActivatedRoute :Partial<ActivatedRoute> ={
		snapshot: {
			data: {
			  telemetry: {
				env: 'mock-env',
				pageid: 'mock-page-id',
			  }
			}
		} as any,
	};
	const mockGroupService :Partial<GroupsService> ={
		getGroupById: jest.fn(),
		emitShowLoader: jest.fn(),
		getUserData:jest.fn(),
	};
	const mockRouter :Partial<Router> ={};
	const mockLocation :Partial<Location> ={};
	const mockRecaptchaService :Partial<RecaptchaService> ={};
	const mockTelemetryService :Partial<TelemetryService> ={
		interact: jest.fn(),
	};
	const mockLayoutService :Partial<LayoutService> ={
		initlayoutConfig: jest.fn(),
		switchableLayout: jest.fn(),
	};

    beforeAll(() => {
        component = new AddMemberComponent(
            mockResourceService as ResourceService,
			mockGroupsService as GroupsService,
			mockToasterService as ToasterService,
			mockActivatedRoute as ActivatedRoute,
			mockGroupService as GroupsService,
			mockRouter as Router,
			mockLocation as Location,
			mockRecaptchaService as RecaptchaService,
			mockTelemetryService as TelemetryService,
			mockLayoutService as LayoutService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });

	it('should destroy the member', () => {
		component.unsubscribe$ = {
			next: jest.fn(),
			complete: jest.fn()
		} as any;
		component.ngOnDestroy();
		expect(component.unsubscribe$.next).toHaveBeenCalled();
		expect(component.unsubscribe$.complete).toHaveBeenCalled();
	});

	it('should set showModal value on toggleModal',()=>{
      component.toggleModal(false);
	  expect(component.showModal).toBeFalsy;
	});

	it('should construct interactData object correctly and call telemetryService.interact', () => {
		component.groupData ={ id: 'mock-id'} as any;
		component.setInteractData('mock-id','mock-extra',{cdata: 'mock-Cdata'},{type: 'mock-edata'},'mock-obj');

		expect(component.telemetryService.interact).toHaveBeenCalledWith(
			{"context": {"cdata": [{"id": "mock-id", "type": "Group"}, 
			{"cdata": "mock-Cdata"}], "env": "mock-env"}, "edata": 
			{"extra": "mock-extra", "id": "mock-id", "pageid": "mock-page-id", 
			"type": "mock-edata"}, "object": "mock-obj"}
		);
	});


    describe('showErrorMsg',()=>{
		it('should show error message for exceeded member limit', () => {
			const response = { error: { members: [{ errorCode: 'EXCEEDED_MEMBER_MAX_LIMIT' }] } };
			component.memberId =  'mock-member-id';
			component.membersList = ['member1','member2'] as any;
			const interactDataSpy = jest.spyOn(component,'setInteractData');
			component.showErrorMsg(response);
		
			expect(mockToasterService.error).toHaveBeenCalledWith('Exceeded member maximum limit.');
			expect(interactDataSpy).toHaveBeenCalledWith('exceeded-member-max-limit', { searchQuery: 'mock-member-id', member_count: 2 });
		});
		
		it('should show default error message', () => {
			const response = { errors: 'Some mock error occurred' };
		
			component.showErrorMsg(response);
		
			expect(mockToasterService.error).toHaveBeenCalledWith('Other mock errors');
			expect(component.setInteractData).not.toHaveBeenCalled();
		});
    });
    
	describe('isExistingMember',()=>{
		it('should call resetValue and return true when values are present', () => {
			component.membersList = { member: 'mock-member'} as any;
			component.verifiedMember = { id: 'mock-id'} as any;
			const resetSpy = jest.spyOn(component,'resetValue')
			const result = component.isExistingMember();
		
            expect(result).toBeTruthy;
		});
		
		it('should return false when values are not present', () => {
			const result = component.isExistingMember();
            expect(result).toBeFalsy;
		});
    });

	it('should call methods and set values on showInvalidUser',()=>{
		component.captchaRef={
		reset: jest.fn(),
		} as any;
		component.showInvalidUser();

		expect(component.isInvalidUser).toBeTruthy;
		expect(component.showLoader).toBeFalsy;
		expect(component.captchaRef.reset).toHaveBeenCalled();
	});

	it('should call methods and set values on onVerifyMember whwn captcha is enabled', () => {
		component.isCaptchEnabled = true;
		component.captchaRef={
		execute: jest.fn(),
		} as any;
		jest.spyOn(component as any,'reset');
		component.onVerifyMember();

		expect(component.reset).toHaveBeenCalled();
		expect(component.showLoader).toBeTruthy;
		expect(component.captchaRef.execute).toHaveBeenCalled();
	});
	
	it('should set values to false on reset',()=>{
         component.reset();

		 expect(component.showLoader).toBeFalsy;
		 expect(component.isInvalidUser).toBeFalsy;
		 expect(component.isVerifiedUser).toBeFalsy;   
	});
});