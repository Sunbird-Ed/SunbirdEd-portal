import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupDetailsComponent } from './group-details.component';
import { SuiModalModule } from 'ng2-semantic-ui';
import { ResourceService, SharedModule, ToasterService } from '@sunbird/shared';
import { configureTestSuite } from '@sunbird/test-util';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GroupsService } from '../../services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { of, throwError } from 'rxjs';

describe('GroupDetailsComponent', () => {
  let component: GroupDetailsComponent;
  let fixture: ComponentFixture<GroupDetailsComponent>;
  configureTestSuite();
  const fakeActivatedRoute = {};
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  const resourceBundle = {
    'messages': {
      'emsg': {
        'm002': 'Unable to get Group data.Please try again later...',
      }
    },
    'frmelmnts': {
      'lbl': {}
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GroupDetailsComponent],
      imports: [SharedModule.forRoot(), HttpClientTestingModule, RouterTestingModule, SuiModalModule],
      providers: [ResourceService, GroupsService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: Router, useClass: RouterStub },
        { provide: ResourceService, useValue: resourceBundle },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    spyOn(component, 'getGroupData');
    component.ngOnInit();
    expect(component.getGroupData).toHaveBeenCalled();
  });

  it('should get group data', () => {
    const groupService = TestBed.get(GroupsService);
    spyOn(groupService, 'getGroupById').and.returnValue(of({ name: 'groupName' }));
    component.getGroupData();
    expect(component.groupData).toEqual({ name: 'groupName' });
  });

  it('should handle error', () => {
    const groupService = TestBed.get(GroupsService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(groupService, 'getGroupById').and.returnValue(throwError({}));
    spyOn(toasterService, 'error');
    component.getGroupData();
    expect(toasterService.error).toHaveBeenCalledWith('Unable to get Group data.Please try again later...');
  });

  it('should call toggleActivityModal', () => {
    component.toggleActivityModal();
    expect(component.showModal).toBe(false);
  });

  it('should call filterList', () => {
    component.filterList();
    expect(component.showFilters).toBe(true);
  });

  it('should call handleNextClick', () => {
    const router = TestBed.get(Router);
    spyOn(component, 'toggleActivityModal');
    component.addActivityModal = {
      deny: jasmine.createSpy('deny')
    };
    component.handleNextClick({});
    expect(component.toggleActivityModal).toHaveBeenCalled();
    expect(component.addActivityModal.deny).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should ngOnDestroy', () => {
    component.showModal = true;
    component.addActivityModal = {
      deny: jasmine.createSpy('deny')
    };
    spyOn(component.unsubscribe$, 'next');
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
    expect(component.addActivityModal.deny).toHaveBeenCalled();
  });

  it('should make showMemberPopUp as false', () => {
    component.closeModal();
    expect(component.showMemberPopup).toBeFalsy();
  });

});
