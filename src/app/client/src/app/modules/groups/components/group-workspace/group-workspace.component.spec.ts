import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupWorkspaceComponent } from './group-workspace.component';

describe('GroupWorkspaceComponent', () => {
  let component: GroupWorkspaceComponent;
  let fixture: ComponentFixture<GroupWorkspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupWorkspaceComponent ]
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
