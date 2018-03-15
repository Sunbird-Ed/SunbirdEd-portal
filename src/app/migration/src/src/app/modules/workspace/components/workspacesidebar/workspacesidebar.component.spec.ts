import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspacesidebarComponent } from './workspacesidebar.component';

describe('WorkspacesidebarComponent', () => {
  let component: WorkspacesidebarComponent;
  let fixture: ComponentFixture<WorkspacesidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspacesidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspacesidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
