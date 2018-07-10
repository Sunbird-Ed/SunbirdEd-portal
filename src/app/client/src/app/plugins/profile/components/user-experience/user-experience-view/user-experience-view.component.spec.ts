
import {of as observableOf,  Observable } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from './../../../services';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { UserService, CoreModule } from '@sunbird/core';
import { NO_ERRORS_SCHEMA, ViewChild, QueryList } from '@angular/core';
import * as _ from 'lodash';
import {
  ResourceService, ConfigService, IUserProfile, IUserData, SharedModule, ToasterService
} from '@sunbird/shared';
import { EditExperienceComponent } from '../../user-experience/edit-experience/edit-experience.component';
import { RouterTestingModule } from '@angular/router/testing';
import { UserExperienceViewComponent } from './user-experience-view.component';
import { mockRes } from './user-experience-view.component.spec.data';
import { Ng2IzitoastService } from 'ng2-izitoast';

describe('UserExperienceViewComponent', () => {
  let component: EditExperienceComponent;
  let fixture: ComponentFixture<EditExperienceComponent>;
  let parentComp: UserExperienceViewComponent;
  let parentFixture: ComponentFixture<UserExperienceViewComponent>;
  const fakeActivatedRoute = {
    'params': observableOf({ 'section': 'address', 'action': 'edit' })
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserExperienceViewComponent, EditExperienceComponent],
      imports: [FormsModule, ReactiveFormsModule, SuiModule, HttpClientTestingModule, SharedModule.forRoot(), CoreModule.forRoot()],
      providers: [UserService, ProfileService, Ng2IzitoastService, ToasterService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditExperienceComponent);
    component = fixture.componentInstance;
    parentFixture = TestBed.createComponent(UserExperienceViewComponent);
    parentComp = parentFixture.componentInstance;
  });

  it('should create', () => {
    const userService = TestBed.get(UserService);
    const activatedRoute = TestBed.get(ActivatedRoute);
    userService._userData$.next({ err: null, userProfile: mockRes.data.userProfile });
    parentComp.ngOnInit();
    activatedRoute.params = {
      'section': 'experience',
      'action': 'add'
    };
    component.experience = mockRes.data.userProfile;
    parentComp.privateProfileFields = true;
    expect(component).toBeTruthy();
    fixture.detectChanges();
  });
  it('should pass activated route', () => {
    const userService = TestBed.get(UserService);
    const activatedRoute = TestBed.get(ActivatedRoute);
    userService._userData$.next({ err: null, userProfile: mockRes.data.userProfile });
    parentComp.allowedAction = [];
    parentComp.ngOnInit();
    activatedRoute.params = {
      'section': 'experience',
      'action': 'add'
    };
    expect(component).toBeTruthy();
  });
  it('should call editExperience method', () => {
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = mockRes.resourceBundle.messages;
    parentComp.editChild = new QueryList<EditExperienceComponent>();
    component.experienceForm = new FormGroup({});
    const profileService = TestBed.get(ProfileService);
    spyOn(profileService, 'updateProfile').and.callFake(() => observableOf(mockRes.data));
    parentComp.editExperience();
  });
  xit('should call addExperience method', () => {
    const resourceService = TestBed.get(ResourceService);
    const router = TestBed.get(Router);
    resourceService.messages = mockRes.resourceBundle.messages;
    const profileService = TestBed.get(ProfileService);
    parentComp.userProfile.jobProfile = [];
    expect(parentFixture.componentInstance.addChild).toBeUndefined();
    parentFixture.detectChanges();
    expect(parentFixture.componentInstance.addChild).toBeDefined();
    const addChild = parentFixture.componentInstance.addChild;
    parentComp.addChild = component;
    component.experienceForm = new FormGroup({});
    spyOn(profileService, 'updateProfile').and.callFake(() => observableOf(mockRes.data));
    parentComp.addExperience();
    expect(router.navigate).toHaveBeenCalledWith(['/profile']);
  });
  it('should call deleteExperience method', () => {
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = mockRes.resourceBundle.messages;
    const profileService = TestBed.get(ProfileService);
    spyOn(profileService, 'updateProfile').and.callFake(() => observableOf(mockRes.data));
    parentComp.deleteExperience(mockRes.data);
  });
  it('should thorow error on deleteExperience method', () => {
    const resourceService = TestBed.get(ResourceService);
    const router = TestBed.get(Router);
    resourceService.messages = mockRes.resourceBundle.messages;
    const profileService = TestBed.get(ProfileService);
    const invalidData = {};
    spyOn(profileService, 'updateProfile').and.callFake(() => observableOf(invalidData));
    parentComp.deleteExperience(invalidData);
  });
  it('should call checkCurrentJob method', () => {
    const profileService = TestBed.get(ProfileService);
    const curJobId = 2;
    parentComp.isCurrentJobExist = false;
    expect(parentComp.isCurrentJobExist).toBe(false);
    expect(component).toBeTruthy();
  });
  it('should call checkCurrentJobAdd method', () => {
    const profileService = TestBed.get(ProfileService);
    const curJobId = 0;
    parentComp.isCurrentJobExist = true;
    expect(parentComp.isCurrentJobExist).toBe(true);
    expect(component).toBeTruthy();
  });
});
