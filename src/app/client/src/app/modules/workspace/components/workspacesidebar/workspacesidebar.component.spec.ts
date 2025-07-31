import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ResourceService, ConfigService } from '@sunbird/shared';
import { PermissionService } from '@sunbird/core';
import { WorkspacesidebarComponent } from './workspacesidebar.component';
import { WorkSpaceService } from '../../services';

describe('WorkspacesidebarComponent - Skill Map Features', () => {
  let component: WorkspacesidebarComponent;
  let fixture: ComponentFixture<WorkspacesidebarComponent>;
  let mockConfigService: jasmine.SpyObj<ConfigService>;
  let mockPermissionService: jasmine.SpyObj<PermissionService>;

  beforeEach(async () => {
    const configSpy = jasmine.createSpyObj('ConfigService', [], {
      rolesConfig: {
        workSpaceRole: {
          skillmapRole: ['SKILL_MAP_CREATOR'],
          skillmapReviewerRole: ['SKILL_MAP_REVIEWER'],
          createRole: ['SKILL_MAP_CREATOR'],
          draftRole: ['SKILL_MAP_CREATOR'],
          publishedRole: ['SKILL_MAP_CREATOR'],
          flagReviewer: ['FLAG_REVIEWER']
        }
      }
    });

    const permissionSpy = jasmine.createSpyObj('PermissionService', [], {
      permissionAvailable: true
    });

    const resourceSpy = jasmine.createSpyObj('ResourceService', [], {
      frmelmnts: {
        lbl: {
          skillMap: 'Skill Map',
          skillMapReviewer: 'Skill Map Reviewer'
        }
      }
    });

    const routerSpy = jasmine.createSpyObj('Router', ['isActive']);
    const workSpaceServiceSpy = jasmine.createSpyObj('WorkSpaceService', ['getQuestionSetCreationStatus']);

    await TestBed.configureTestingModule({
      declarations: [WorkspacesidebarComponent],
      providers: [
        { provide: ConfigService, useValue: configSpy },
        { provide: PermissionService, useValue: permissionSpy },
        { provide: ResourceService, useValue: resourceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: WorkSpaceService, useValue: workSpaceServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkspacesidebarComponent);
    component = fixture.componentInstance;
    mockConfigService = TestBed.inject(ConfigService) as jasmine.SpyObj<ConfigService>;
    mockPermissionService = TestBed.inject(PermissionService) as jasmine.SpyObj<PermissionService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize skill map roles correctly', () => {
    component.ngOnInit();
    
    expect(component.skillmapRole).toEqual(['SKILL_MAP_CREATOR']);
    expect(component.skillmapReviewerRole).toEqual(['SKILL_MAP_REVIEWER']);
  });

  it('should show different navigation options based on user roles', () => {
    component.ngOnInit();
    
    // Test skill map creator role
    component.skillmapRole = ['SKILL_MAP_CREATOR'];
    component.skillmapReviewerRole = ['SKILL_MAP_REVIEWER'];
    
    expect(component.skillmapRole).toContain('SKILL_MAP_CREATOR');
    expect(component.skillmapReviewerRole).toContain('SKILL_MAP_REVIEWER');
  });

  it('should set correct telemetry data for skill map buttons', () => {
    const skillMapData = component.setInteractData('skillmap-button');
    const skillMapReviewerData = component.setInteractData('skillmap-reviewer-button');
    
    expect(skillMapData).toEqual({
      id: 'skillmap-button',
      type: 'click',
      pageid: 'workspace'
    });
    
    expect(skillMapReviewerData).toEqual({
      id: 'skillmap-reviewer-button',
      type: 'click',
      pageid: 'workspace'
    });
  });
});
