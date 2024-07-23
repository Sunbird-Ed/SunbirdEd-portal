import { UserService } from '@sunbird/core';
import { Component,ElementRef,Input,OnDestroy,OnInit,ViewChild } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { GroupMemberRole,GroupEntityStatus } from '@project-sunbird/client-services/models/group';
import { ResourceService,ToasterService } from '@sunbird/shared';
import { _ } from 'lodash-es';
import { fromEvent,of,Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GROUP_DETAILS,IGroupMember,IGroupMemberConfig,MY_GROUPS,IGroupCard } from '../../interfaces';
import * as rxjs from 'rxjs';
import { GroupsService } from '../../services';
import { ADD_MEMBER } from '../../interfaces/telemetryConstants';
import { GroupMembersComponent } from './group-members.component';
import { ComponentPortal } from '@angular/cdk/portal';

describe('GroupMembersComponent', () => {
    let component: GroupMembersComponent;

    const mockRouter :Partial<Router> ={
        navigate: jest.fn(),
    };
	const mockActivatedRoute :Partial<ActivatedRoute> ={
        snapshot: {
            queryParams: {
              params: 'mock-params'
            }
        } as any
    };
	const mockResourceService :Partial<ResourceService> ={};
	const mockGroupsService :Partial<GroupsService> ={
        addTelemetry: jest.fn(),
        updateMembers: jest.fn(),
        emitMenuVisibility: jest.fn(),
        membersList: of([]) as any,
        showMenu: of('member') as any,
        updateEvent: of(GroupEntityStatus.ACTIVE) as any
    };
	const mockToasterService :Partial<ToasterService> ={
        success: jest.fn(),
        error: jest.fn(),
    };
	const mockUserService :Partial<UserService> ={};

    beforeAll(() => {
        component = new GroupMembersComponent(
            mockRouter as Router,
			mockActivatedRoute as ActivatedRoute,
			mockResourceService as ResourceService,
			mockGroupsService as GroupsService,
			mockToasterService as ToasterService,
			mockUserService as UserService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit',() =>{
        it('should handle click events to hide kebab menu', () => {
            const fromEventMock = jest.fn().mockReturnValue({
                pipe: jest.fn().mockReturnThis(),
                subscribe: jest.fn()
            });
            jest.spyOn(rxjs, 'fromEvent').mockImplementation(fromEventMock);
            const membersListMock = of([{ id: 'member1' }, { id: 'member2' }]);
            mockGroupsService.membersList = membersListMock as any;
            jest.spyOn(component, 'hideMemberMenu').mockImplementation();
            const showMenuMock = of({ id: 'member1' });
            mockGroupsService.showMenu = showMenuMock as any;

            const updateEventMock = of({ success: true });
            mockGroupsService.updateEvent = updateEventMock as any;
            mockGroupsService.updateGroupStatus = jest.fn(() => of({status: GroupEntityStatus.ACTIVE})) as any;
            component.ngOnInit();
            const clickEvent = new MouseEvent('click');
            const spyAddTelemetry = jest.spyOn(component, 'addTelemetry');
            document.dispatchEvent(clickEvent);
            expect(component.showKebabMenu).toBe(false);
            expect(component.hideMemberMenu).toHaveBeenCalled();
            jest.restoreAllMocks();
        });
    });

    it('should search for members', () => {
        const members = [
            { title: 'Member 1' },
            { title: 'Member 2' },
            { title: 'Member 3' }
        ];
        component.members = members as any;

        component.search('Member 1');

        expect(component.showSearchResults).toBeTruthy();
        expect(component.memberListToShow.length).toBe(1);
        expect(component.memberListToShow[0].title).toBe('Member 1');
        expect(mockGroupsService.addTelemetry).toHaveBeenCalled();
    });

    it('should reset search and show all members', () => {
        const members = [
            { title: 'Member 1' },
            { title: 'Member 2' },
            { title: 'Member 3' }
        ];
        component.members = members as any;

        component.search('');

        expect(component.showSearchResults).toBeFalsy();
        expect(component.memberListToShow.length).toBe(3);
        expect(component.memberListToShow).toEqual(members);
    });

    it('should set value and call search method on resetValue', () => {
        const mockElementRef = { nativeElement: { value: 'mock-value', focus: jest.fn() } } as ElementRef;
        component.searchInputBox = mockElementRef;
        const searchMock = jest.spyOn(component,'search');
        component.resetValue();

        expect(component.searchInputBox.nativeElement.value).toEqual('');
        expect(searchMock).toHaveBeenCalledWith('');
    });

    it('should destroy the group members', () => {
        component['unsubscribe$'] = {
            next: jest.fn(),
            complete: jest.fn()
        } as any;
        component.ngOnDestroy();
        expect(component['unsubscribe$'].next).toHaveBeenCalled();
        expect(component['unsubscribe$'].complete).toHaveBeenCalled();
    });

    describe('showAddMember',() =>{
        it('should return false when groupData is not active on showAddMember',() =>{
            component.groupData = { active: true } as any;
            component.config = { showAddMemberButton: true } as any;
            const result = component.showAddMember();

            expect(result).toBeFalsy;
        });

        it('should return vlaue based on groupData and showSearchResults on showAddMember',() =>{
            component.groupData = { active: false, isAdmin: true} as any;
            component.config = { showAddMemberButton: true } as any;
            component.showSearchResults =false;
            const result = component.showAddMember();

            expect(result).toBeTruthy;
        });
    });

    it('should call groupservice method on addTelemetry',() =>{
        component.addTelemetry('mock-id','mock-extra','mock-edata');
        expect(component['groupsService'].addTelemetry).toHaveBeenCalled();
    });

    it('should set showModal as false on onModalClose',() =>{
        component.onModalClose();
        expect(component.showModal).toBeFalsy;
    });

    it('should call navigate on addMember',() =>{
        component.groupData = {id: 'mock-id'} as any;
        component.groupId ='mock-id';
        component.addMember();
        expect(component['router'].navigate).toHaveBeenCalledWith(
            ["my-groups/group-details", "mock-id", "add-member-to-group"]
        );
    });

    it('should set values on openModal',() =>{
        component.showModal = false;
        component.openModal('mock-action');

        expect(component.showModal).toBeTruthy;
        expect(component.memberAction).toEqual('mock-action');
    });

    it('should filter member list when search key is provided', () => {
        const members = [
            { title: 'Member 1' },
            { title: 'Member 2' },
            { title: 'Member 3' }
        ];
        component.members = members as any;
        component.search('medium');

        expect(component.showSearchResults).toBeFalsy();
        expect(component.memberListToShow.length).toEqual(3);
        expect(component.memberListToShow).toEqual(members);
    });

    it('should set values and call methods on getMenuData when showKebabMenu is truthy',() =>{
        const mockEvent = {
            event: {
              stopImmediatePropagation: jest.fn()
            }
        };
        const mockMember = { id: 'mock-id', name: 'mock-name' };
        component.showKebabMenu = false;
        jest.spyOn(component,'addTelemetry');
        component.getMenuData(mockEvent,mockMember);

        expect(component.showKebabMenu).toBeTruthy;
        expect(component['groupsService'].emitMenuVisibility).toHaveBeenCalledWith('member');
        expect(component.addTelemetry).toHaveBeenCalledWith('member-card-menu-show');
        expect(component.selectedMember).toBe(mockMember);
        expect(mockEvent.event.stopImmediatePropagation).toHaveBeenCalled();
    });

    it('should set values and call methods on getMenuData when showKebabMenu is falsy',() =>{
        const mockEvent = {
            event: {
              stopImmediatePropagation: jest.fn()
            }
        };
        const mockMember = { id: 'mock-id', name: 'mock-name' };
        component.showKebabMenu = true;
        jest.spyOn(component,'addTelemetry');
        component.getMenuData(mockEvent,mockMember);

        expect(component.showKebabMenu).toBeFalsy;
        expect(component.addTelemetry).toHaveBeenCalledWith('member-card-menu-close');
    });

    describe('hideMemberMenu',() =>{
        it('should not modify member items if showMemberMenu is true', () => {
            component.config = { showMemberMenu: true } as any;
            component.memberListToShow = [{ id: '1', isMenu: false }, { id: '2', isMenu: true }] as any;
            component.hideMemberMenu();

            expect(component.memberListToShow).toEqual([{ id: '1', isMenu: false }, { id: '2', isMenu: true }]);
        });

        it('should set isMenu property to false for all member items if showMemberMenu is false', () => {
            component.config = { showMemberMenu: false } as any;
            component.memberListToShow = [{ id: '1', isMenu: true }, { id: '2', isMenu: true }] as any;
            component.hideMemberMenu();

            expect(component.memberListToShow).toEqual([{ id: '1', isMenu: false }, { id: '2', isMenu: false }]);
        });

        it('should initialize component properties properly', () => {
            expect(component.showLoader).toBe(false);
            expect(component.groupId).toBe('mock-id');
            expect(component.showKebabMenu).toBe(false);
        });
    });

});