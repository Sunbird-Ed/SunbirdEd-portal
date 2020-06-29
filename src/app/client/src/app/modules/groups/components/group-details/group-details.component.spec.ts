import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupDetailsComponent } from './group-details.component';
import { SuiModalModule } from 'ng2-semantic-ui';
import { ResourceService, SharedModule } from '@sunbird/shared';
import { configureTestSuite } from '@sunbird/test-util';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GroupsService } from '../../services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

describe('GroupDetailsComponent', () => {
  let component: GroupDetailsComponent;
  let fixture: ComponentFixture<GroupDetailsComponent>;
  configureTestSuite();
  const fakeActivatedRoute = {};
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupDetailsComponent ],
      imports: [SharedModule.forRoot(), HttpClientTestingModule, RouterTestingModule, SuiModalModule],
      providers: [ResourceService, GroupsService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        {provide: APP_BASE_HREF, useValue: '/'},
        { provide: Router, useClass: RouterStub }
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

});
