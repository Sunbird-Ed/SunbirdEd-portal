import { ResourceService } from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { GroupWorkspaceComponent } from './group-workspace.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('GroupWorkspaceComponent', () => {
  let component: GroupWorkspaceComponent;
  let fixture: ComponentFixture<GroupWorkspaceComponent>;
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupWorkspaceComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [ResourceService]
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
