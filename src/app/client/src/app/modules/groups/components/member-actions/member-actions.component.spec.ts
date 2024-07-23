import { ResourceService } from '@sunbird/shared';
import { Component,Input,EventEmitter,ViewChild,Output,OnDestroy,OnInit } from '@angular/core';
import { _ } from 'lodash-es';
import { IGroupMember } from '../../interfaces';
import { GroupsService } from '../../services';
import { ActivatedRoute } from '@angular/router';
import { IMemberActionData, MemberActionsComponent } from './member-actions.component';
import { of } from 'rxjs';

describe('MemberActionsComponent', () => {
    let component: MemberActionsComponent;

    const mockResourceService :Partial<ResourceService> ={
        frmelmnts: {
            btn: {
              makeAdmin: 'Make Admin',
              removeMember: 'Remove Member',
              dismissAdmin: 'Dismiss Admin',
              leaveGroup: 'Leave Group'
            },
            lbl: {
              makeAdmin: 'Make {memberName} admin',
              removeWarning: 'Remove {memberName} from group',
              dismissWarning: 'Dismiss {memberName} as admin',
              leaveGroupWarning: 'Leave group {groupName}'
            }
        }
    };
	const mockGroupService :Partial<GroupsService> ={
        addTelemetry: jest.fn(),
    };
	const mockActivateRoute :Partial<ActivatedRoute> ={
        snapshot: {} as any,
    };

    beforeAll(() => {
        component = new MemberActionsComponent(
            mockResourceService as ResourceService,
			mockGroupService as GroupsService,
			mockActivateRoute as ActivatedRoute
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });

    it('should destroy the member actions', () => {
        component.modal ={
			deny: jest.fn(),
		} as any;
		component.ngOnDestroy();
		expect(component.modal.deny).toHaveBeenCalled();
	});

    it('should call the necessary methods on performAction(', () => {
        component.memberActionData = {eid: 'mock-eid'} as any;
        component.modal ={
			deny: jest.fn(),
		} as any;
        jest.spyOn(component.actionConfirm,'emit');
        const mockAddTelemetry = jest.spyOn(component,'addTelemetry');
		component.performAction();
        expect(mockAddTelemetry).toHaveBeenCalledWith('confirm-mock-eid');
        expect(component.actionConfirm.emit).toHaveBeenCalled();
        expect(component.modal.deny).toHaveBeenCalled();
	});

    it('should perform actions on closeModal',()=>{
        component.memberActionData = {eid: 'mock-eid'} as any;
        component.modal ={
			deny: jest.fn(),
		} as any;
        jest.spyOn(component.modalClose,'emit');
        const mockAddTelemetry = jest.spyOn(component,'addTelemetry');
        component.closeModal();
        expect(mockAddTelemetry).toHaveBeenCalledWith('close-mock-eid');
        expect(component.modal.deny).toHaveBeenCalled();
        expect(component.modalClose.emit).toHaveBeenCalled();
    });

    describe('ngOnInit',()=>{
        it('should set memberActionData for promoteAsAdmin action', () => {
            component.action = 'promoteAsAdmin';
            component.member = { title: 'mock-name' } as any;
            component.ngOnInit();
            const expectedData: IMemberActionData = {
            title: 'Make Admin?',
            description: 'Make mock-name admin',
            buttonText: 'Make Admin',
            theme: 'primary',
            eid: 'promote-admin'
            };
            expect(component.memberActionData).toEqual(expectedData);
        });

        it('should set memberActionData for removeFromGroup action', () => {
            component.action = 'removeFromGroup';
            component.member = { title: 'mock-name' } as any;
            component.ngOnInit();
            const expectedData: IMemberActionData = {
              title: 'Remove Member?',
              description: 'Remove mock-name from group',
              buttonText: 'Remove Member',
              theme: 'error',
              eid: 'remove-from-group'
            };
            expect(component.memberActionData).toEqual(expectedData);
        });

        it('should set memberActionData for dismissAsAdmin action', () => {
            component.action = 'dismissAsAdmin';
            component.member = { title: 'mock-name' } as any;
            component.ngOnInit();
            const expectedData: IMemberActionData = {
              title: 'Dismiss Admin?',
              description: 'Dismiss mock-name as admin',
              buttonText: 'Dismiss Admin',
              theme: 'primary',
              eid: 'dismiss-admin'
            };
            expect(component.memberActionData).toEqual(expectedData);
        });
        
          it('should set memberActionData for leaveFromGroup action', () => {
            component.action = 'leaveFromGroup';
            component.groupName = 'Group1';
            component.ngOnInit();
            const expectedData: IMemberActionData = {
              title: "undefined?",
              description: 'Leave group Group1',
              buttonText: undefined,
              theme: 'error',
              eid: 'leave-from-group'
            };
            expect(component.memberActionData).toEqual(expectedData);
        });  

    });
});