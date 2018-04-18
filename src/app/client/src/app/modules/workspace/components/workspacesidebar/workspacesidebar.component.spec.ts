import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspacesidebarComponent } from './workspacesidebar.component';
import {RouterTestingModule} from '@angular/router/testing';
import { ResourceService, ConfigService} from '@sunbird/shared';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
describe('WorkspacesidebarComponent', () => {
  let component: WorkspacesidebarComponent;
  let fixture: ComponentFixture<WorkspacesidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspacesidebarComponent ],
      providers: [ResourceService, ConfigService],
      imports: [RouterTestingModule, HttpClientTestingModule]
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
