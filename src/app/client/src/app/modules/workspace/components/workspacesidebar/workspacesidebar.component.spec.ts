import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Ng2IzitoastService } from 'ng2-izitoast';
import { CoreModule } from '@sunbird/core';
import { WorkspacesidebarComponent } from './workspacesidebar.component';
import {RouterTestingModule} from '@angular/router/testing';
import { SharedModule, ConfigService} from '@sunbird/shared';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
describe('WorkspacesidebarComponent', () => {
  let component: WorkspacesidebarComponent;
  let fixture: ComponentFixture<WorkspacesidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspacesidebarComponent ],
      providers: [ Ng2IzitoastService, ConfigService],
      imports: [RouterTestingModule, HttpClientTestingModule, CoreModule.forRoot(), SharedModule.forRoot()]
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
    component.coursebacthesRole = configService.rolesConfig.workSpaceRole.coursebacthesRole;
    component.createRole =  configService.rolesConfig.workSpaceRole.createRole;
    component.allContentRole = configService.rolesConfig.workSpaceRole.allContentRole;
    component.ngOnInit();
    expect(component.draftRole).toBeDefined();
    expect(component.inreviewRole).toBeDefined();
    expect(component.publishedRole).toBeDefined();
    expect(component.alluploadsRole).toBeDefined();
    expect(component.upForReviewRole).toBeDefined();
    expect(component.flaggedRole).toBeDefined();
    expect(component.coursebacthesRole).toBeDefined();
    expect(component.createRole).toBeDefined();
    expect(component.allContentRole).toBeDefined();
    fixture.detectChanges();
  });
});
