import { SharedModule } from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupHeaderComponent } from './group-header.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

describe('GroupHeaderComponent', () => {
  let component: GroupHeaderComponent;
  let fixture: ComponentFixture<GroupHeaderComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const fakeActivatedRoute = {
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupHeaderComponent ],
      imports: [SharedModule.forRoot(), HttpClientModule],
      providers: [
        {provide: Router, useClass: RouterStub},
        {provide: ActivatedRoute, useValue: fakeActivatedRoute},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should assign modalName to showPastMembers', () => {
    expect(component.showModal).toBeFalsy();
    component.showPastMembers();
    expect(component.showModal).toBeTruthy();
    expect(component.modalName).toEqual('showPastMembers');
  });

  it('should assign modalName to deleteGroup', () => {
    expect(component.showModal).toBeFalsy();
    component.deleteGroup();
    expect(component.showModal).toBeTruthy();
    expect(component.modalName).toEqual('deleteGroup');
  });

  it('should assign showModal to FALSE', () => {
    component.closeModal();
    expect(component.showModal).toBeFalsy();
  });

  it('should call navigationHelperService', () => {
    spyOn(component['navigationHelperService'], 'goBack');
    component.goBack();
    expect(component['navigationHelperService'].goBack).toHaveBeenCalled();
  });
});
