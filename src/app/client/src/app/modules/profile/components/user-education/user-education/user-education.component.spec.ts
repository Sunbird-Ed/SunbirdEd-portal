import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from './../../../services';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService, CoreModule } from '@sunbird/core';
import { ResourceService, ConfigService, IUserProfile, IUserData, SharedModule } from '@sunbird/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EditUserEducationComponent } from '../../user-education/edit-user-education/edit-user-education.component';
import { UserEducationComponent } from './user-education.component';
import {mockRes} from './user-education.component.spec.data';

describe('UserEducationComponent', () => {
  let component: EditUserEducationComponent;
  let fixture: ComponentFixture<EditUserEducationComponent>;
  let parentComp: UserEducationComponent;
  let parentFixture: ComponentFixture<UserEducationComponent>;
  const fakeActivatedRoute = {
    'params': Observable.from([{ 'section': 'education', 'action': 'edit' }])
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserEducationComponent, EditUserEducationComponent],
      imports: [FormsModule, ReactiveFormsModule, SuiModule, HttpClientTestingModule, SharedModule, CoreModule],
      providers: [ResourceService, UserService, ProfileService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserEducationComponent);
    // fixture.autoDetectChanges();
    parentFixture = TestBed.createComponent(UserEducationComponent);
    parentComp = parentFixture.componentInstance;
    component = fixture.componentInstance;
  });

  it('should create UserEducationComponent', () => {
    const userService = TestBed.get(UserService);
    const activatedRoute = TestBed.get(ActivatedRoute);
    userService._userProfile = mockRes.data.userProfile;
    userService._userData$.next({ err: null, userProfile: mockRes.data.userProfile });
    parentComp.ngOnInit();
    parentFixture.detectChanges();
  });
  it('should pass activated route', () => {
    const router = TestBed.get(Router);
    const userService = TestBed.get(UserService);
    const activatedRoute = TestBed.get(ActivatedRoute);
    userService._userProfile = mockRes.data.userProfile;
    userService._userData$.next({ err: null, userProfile: mockRes.data.userProfile });
    parentComp.ngOnInit();
    parentFixture.detectChanges();
    activatedRoute.params = {
      'section': 'education',
      'action': 'add'
    };
    parentFixture.detectChanges();
    expect(router.navigate).not.toHaveBeenCalledWith(['/profile']);
  });
  xit('should call editExperience method', () => {
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = mockRes.resourceBundle.messages;
    const profileService = TestBed.get(ProfileService);
    spyOn(profileService, 'updateProfile').and.callFake(() => Observable.of(mockRes.data));
    parentComp.editEducation();
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
    parentComp.addEducation();
    expect(router.navigate).toHaveBeenCalledWith(['/profile']);
  });
});
