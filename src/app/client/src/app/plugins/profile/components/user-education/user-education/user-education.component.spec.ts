
import {of as observableOf,  Observable } from 'rxjs';
import { TelemetryModule } from '@sunbird/telemetry';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from './../../../services';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService, CoreModule } from '@sunbird/core';
import { ResourceService, ConfigService, IUserProfile, IUserData, SharedModule, ToasterService } from '@sunbird/shared';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { NO_ERRORS_SCHEMA, QueryList } from '@angular/core';
import { EditUserEducationComponent } from '../../user-education/edit-user-education/edit-user-education.component';
import { UserEducationComponent } from './user-education.component';
import {mockRes} from './user-education.component.spec.data';

describe('UserEducationComponent', () => {
  let component: EditUserEducationComponent;
  let fixture: ComponentFixture<EditUserEducationComponent>;
  let parentComp: UserEducationComponent;
  let parentFixture: ComponentFixture<UserEducationComponent>;
  const fakeActivatedRoute = {
    'params': observableOf({ 'section': 'education', 'action': 'edit' })
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserEducationComponent, EditUserEducationComponent],
      imports: [FormsModule, ReactiveFormsModule, SuiModule, HttpClientTestingModule,
        TelemetryModule.forRoot(), SharedModule.forRoot(), CoreModule.forRoot()],
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
  it('should call editEducation method', () => {
    const profileService = TestBed.get(ProfileService);
    const router = TestBed.get(Router);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = mockRes.resourceBundle.messages;
    parentComp.editChild = new QueryList<EditUserEducationComponent>();
    spyOn(profileService, 'updateProfile').and.callFake(() => observableOf(mockRes.data));
    parentComp.editEducation();
    expect(router.navigate).toHaveBeenCalledWith(['/profile']);
  });
  xit('should call addEducation method', () => {
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    const router = TestBed.get(Router);
    resourceService.messages = mockRes.resourceBundle.messages;
    const profileService = TestBed.get(ProfileService);
    // expect(parentFixture.componentInstance.addChild).toBeUndefined();
    parentComp.addChild = component;
    parentComp.addChild.educationForm = new FormGroup({});
    parentComp.addChild.educationForm = component.educationForm;
    spyOn(profileService, 'updateProfile').and.callFake(() => observableOf(mockRes.data));
    spyOn(toasterService, 'error').and.callThrough();
    parentComp.addEducation();
    expect(toasterService.error).toHaveBeenCalledWith(mockRes.resourceBundle.messages.fmsg.m0076);
  });
});
