import { SuiModalModule } from 'ng2-semantic-ui';
import { ResourceService, SharedModule } from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { GroupWorkspaceComponent } from './group-workspace.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GroupsService } from '../../services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

describe('GroupWorkspaceComponent', () => {
  let component: GroupWorkspaceComponent;
  let fixture: ComponentFixture<GroupWorkspaceComponent>;
  configureTestSuite();
  const fakeActivatedRoute = {};
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = 'browse';
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupWorkspaceComponent ],
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
    fixture = TestBed.createComponent(GroupWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
