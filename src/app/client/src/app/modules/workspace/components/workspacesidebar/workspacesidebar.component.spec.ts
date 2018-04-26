import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Ng2IzitoastService } from 'ng2-izitoast';
import { CoreModule } from '@sunbird/core';
import { WorkspacesidebarComponent } from './workspacesidebar.component';
import {RouterTestingModule} from '@angular/router/testing';
import { SharedModule} from '@sunbird/shared';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as mockData from './workspace.sidebar.component.spec.data';
const testData = mockData.mockRes;
describe('WorkspacesidebarComponent', () => {
  let component: WorkspacesidebarComponent;
  let fixture: ComponentFixture<WorkspacesidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspacesidebarComponent ],
      providers: [ Ng2IzitoastService],
      imports: [RouterTestingModule, HttpClientTestingModule, CoreModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspacesidebarComponent);
    component = fixture.componentInstance;
  });

  it('should set the role for content  ', () => {
    component.draftRole = testData.workSpaceRole.draftRole;
    component.inreviewRole = testData.workSpaceRole.inreviewRole;
    component.publishedRole = testData.workSpaceRole.publishedRole;
    component.alluploadsRole = testData.workSpaceRole.alluploadsRole;
    component.upForReviewRole = testData.workSpaceRole.upForReviewRole;
    component.flaggedRole = testData.workSpaceRole.flaggedRole;
    component.limitedPublishingRole = testData.workSpaceRole.limitedPublishingRole;
    component.coursebacthesRole = testData.workSpaceRole.coursebacthesRole;
    component.ngOnInit();
    expect(component.draftRole).toBeDefined();
    expect(component.inreviewRole).toBeDefined();
    expect(component.publishedRole).toBeDefined();
    expect(component.alluploadsRole).toBeDefined();
    expect(component.upForReviewRole).toBeDefined();
    expect(component.flaggedRole).toBeDefined();
    expect(component.coursebacthesRole).toBeDefined();
    fixture.detectChanges();
  });
});
