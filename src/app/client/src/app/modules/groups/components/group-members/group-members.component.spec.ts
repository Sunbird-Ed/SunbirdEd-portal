import { RouterTestingModule } from '@angular/router/testing';
import { SuiModule } from 'ng2-semantic-ui';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMembersComponent } from './group-members.component';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('GroupMembersComponent', () => {
  let component: GroupMembersComponent;
  let fixture: ComponentFixture<GroupMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupMembersComponent ],
      imports: [SuiModule, CommonConsumptionModule, RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
