import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { FtuPopupComponent } from './ftu-popup.component';
import { ResourceService } from '@sunbird/shared';
import { GroupsService } from '../../services';

describe('FtuPopupComponent', () => {
  let component: FtuPopupComponent;
  let mockResourceService: Partial<ResourceService> = {
      instance: 'mockInstance' 
   };
  let mockActivatedRoute: Partial<ActivatedRoute> = {
      snapshot: {} as any 
  };
  let mockGroupService: Partial<GroupsService>= {
      addTelemetry: jest.fn() 
  };

  beforeAll(() => {
    component = new FtuPopupComponent(
      mockResourceService as ResourceService,
      mockActivatedRoute as ActivatedRoute,
      mockGroupService as GroupsService
    )
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit close event when closeModal is called', () => {
    const emitSpy = jest.spyOn(component.close, 'emit');
    component.closeModal();
    expect(emitSpy).toHaveBeenCalledWith(true);
    expect(component.showWelcomePopup).toBeFalsy();
  });

  it('should emit close event and set showMemberPopup to false when closeMemberPopup is called', () => {
    const emitSpy = jest.spyOn(component.close, 'emit');
    component.closeMemberPopup();
    expect(emitSpy).toHaveBeenCalledWith(true);
    expect(component.showMemberPopup).toBeFalsy();
    expect(localStorage.getItem('login_members_ftu')).toEqual('members');
  });

  it('should call addTelemetry method of GroupsService when addTelemetry is called', () => {
    component.addTelemetry('testId');
    expect(mockGroupService.addTelemetry).toHaveBeenCalledWith({ id: 'testId' }, {}, []);
  });
});
