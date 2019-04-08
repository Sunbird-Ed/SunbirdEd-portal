import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from '@sunbird/core';
import { WorkspacesidebarComponent } from './workspacesidebar.component';
import {RouterTestingModule} from '@angular/router/testing';
import { SharedModule, ConfigService} from '@sunbird/shared';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SuiModule } from 'ng2-semantic-ui';
describe('WorkspacesidebarComponent', () => {
  let component: WorkspacesidebarComponent;
  let fixture: ComponentFixture<WorkspacesidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspacesidebarComponent ],
      providers: [ ConfigService],
      imports: [RouterTestingModule, HttpClientTestingModule, CoreModule, SharedModule.forRoot(), SuiModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspacesidebarComponent);
    component = fixture.componentInstance;
  });

  it('should set the role for content  ', () => {
   const configService = TestBed.get(ConfigService);
    component.draftRole = configService.rolesConfig.workSpaceRole.draftRole;
    component.inreviewRole = configService.rolesConfig.workSpaceRole.inreviewRole;
    component.publishedRole = configService.rolesConfig.workSpaceRole.publishedRole;
    component.alluploadsRole = configService.rolesConfig.workSpaceRole.alluploadsRole;
    component.upForReviewRole = configService.rolesConfig.workSpaceRole.upForReviewRole;
    component.flaggedRole = configService.rolesConfig.workSpaceRole.flaggedRole;
    component.limitedPublishingRole = configService.rolesConfig.workSpaceRole.limitedPublishingRole;
    component.courseBatchRoles = configService.rolesConfig.workSpaceRole.courseBatchRoles;
    component.createRole =  configService.rolesConfig.workSpaceRole.createRole;
    component.allContentRole = configService.rolesConfig.workSpaceRole.allContentRole;
    component.collaboratingRole = configService.rolesConfig.workSpaceRole.collaboratingRole;
    component.ngOnInit();
    expect(component.draftRole).toBeDefined();
    expect(component.inreviewRole).toBeDefined();
    expect(component.publishedRole).toBeDefined();
    expect(component.alluploadsRole).toBeDefined();
    expect(component.upForReviewRole).toBeDefined();
    expect(component.flaggedRole).toBeDefined();
    expect(component.courseBatchRoles).toBeDefined();
    expect(component.createRole).toBeDefined();
    expect(component.allContentRole).toBeDefined();
    expect(component.collaboratingRole).toBeDefined();
  });
});
