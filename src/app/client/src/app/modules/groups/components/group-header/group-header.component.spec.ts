import { CREATE_EDIT_GROUP } from './../routerLinks';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '@sunbird/shared';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { SuiModule } from 'ng2-semantic-ui';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { GroupHeaderComponent } from './group-header.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { MY_GROUPS } from '../routerLinks';

describe('GroupHeaderComponent', () => {
  let component: GroupHeaderComponent;
  let fixture: ComponentFixture<GroupHeaderComponent>;
  configureTestSuite();
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = 'browse';
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupHeaderComponent ],
      imports: [SuiModule, CommonConsumptionModule, SharedModule.forRoot(), HttpClientModule, RouterTestingModule],
      providers: [ { provide: Router, useClass: RouterStub }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
    component.deleteGroup();
    expect(component.showModal).toBeTruthy();
  });

  it('should call router with create-edit-group', () => {
    component.editGroup();
    expect(component['router'].navigate).toHaveBeenCalledWith([`${MY_GROUPS}/${CREATE_EDIT_GROUP}`]);
  });
});
