import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from './../../../services';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService, CoreModule } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
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
    'params': Observable.from([{ 'section': 'address', 'action': 'edit' }])
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserExperienceViewComponent, EditExperienceComponent],
      imports: [FormsModule, ReactiveFormsModule, SuiModule, HttpClientTestingModule, SharedModule, CoreModule],
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
    userService._userProfile = mockRes.data.userProfile;
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
    userService._userProfile = mockRes.data.userProfile;
    userService._userData$.next({ err: null, userProfile: mockRes.data.userProfile });
    parentComp.allowedAction = [];
    parentComp.ngOnInit();
    activatedRoute.params = {
      'section': 'experience',
      'action': 'add'
    };
    expect(component).toBeTruthy();
  });
  xit('should call editExperience method', () => {
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = mockRes.resourceBundle.messages;
    const profileService = TestBed.get(ProfileService);
    spyOn(profileService, 'updateProfile').and.callFake(() => Observable.of(mockRes.data));
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
    spyOn(profileService, 'updateProfile').and.callFake(() => Observable.of(mockRes.data));
    parentComp.addExperience();
    expect(router.navigate).toHaveBeenCalledWith(['/profile']);
  });
  it('should call deleteExperience method', () => {
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = mockRes.resourceBundle.messages;
    const profileService = TestBed.get(ProfileService);
    spyOn(profileService, 'updateProfile').and.callFake(() => Observable.of(mockRes.data));
    parentComp.deleteExperience(mockRes.data);
  });
  it('should thorow error on deleteExperience method', () => {
    const resourceService = TestBed.get(ResourceService);
    const router = TestBed.get(Router);
    resourceService.messages = mockRes.resourceBundle.messages;
    const profileService = TestBed.get(ProfileService);
    const invalidData = {};
    spyOn(profileService, 'updateProfile').and.callFake(() => Observable.of(invalidData));
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
