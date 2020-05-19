import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MyGroupsComponent } from './my-groups.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import * as _ from 'lodash-es';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { GroupsService } from '../../services';
import { of as observableOf, of } from 'rxjs';

describe('MyGroupsComponent', () => {
  let component: MyGroupsComponent;
  let fixture: ComponentFixture<MyGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule, RouterTestingModule],
      declarations: [ MyGroupsComponent ],
      providers: [ GroupsService ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyGroupsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get all the groups list', () => {
    const groupService = TestBed.get(GroupsService);
    spyOn(groupService, 'getAllGroups').and.callFake(() => observableOf(false));
    component.ngOnInit();
    component.getMyGroupList();
    expect(component.groupList).toBeUndefined();
  });

});
