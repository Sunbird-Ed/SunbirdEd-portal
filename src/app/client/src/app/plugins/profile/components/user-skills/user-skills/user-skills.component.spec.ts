import { TelemetryModule } from '@sunbird/telemetry';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from './../../../services';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService, CoreModule } from '@sunbird/core';
import { Observable, of as observableOf } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ResourceService, ConfigService, IUserProfile, IUserData, SharedModule } from '@sunbird/shared';
import { EditUserSkillsComponent } from '../../user-skills/edit-user-skills/edit-user-skills.component';
import { UserSkillsComponent } from './user-skills.component';
import { mockSkillResponse } from './user-skills.component.spec.data';
describe('UserSkillsComponent', () => {
  let component: UserSkillsComponent;
  let fixture: ComponentFixture<UserSkillsComponent>;
  const fakeActivatedRoute = {
    'params': observableOf({ 'section': 'skills', 'action': 'add' })
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserSkillsComponent, EditUserSkillsComponent],
      imports: [FormsModule, ReactiveFormsModule, SuiModule, HttpClientTestingModule,
        TelemetryModule.forRoot(), SharedModule.forRoot(), CoreModule.forRoot()],
      providers: [UserService, ProfileService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSkillsComponent);
    component = fixture.componentInstance;
  });
  it('should create', () => {
    const userService = TestBed.get(UserService);
    const activatedRoute = TestBed.get(ActivatedRoute);
    userService._userData$.next({ err: null, userProfile: mockSkillResponse.userProfile });
    component.allowedAction = [];
    component.ngOnInit();
    activatedRoute.params = {
      'section': 'address',
      'action': 'add'
    };
    expect(component).toBeTruthy();
  });
  it('should pass activated route', () => {
    const userService = TestBed.get(UserService);
    const activatedRoute = TestBed.get(ActivatedRoute);
    userService._userData$.next({ err: null, userProfile: mockSkillResponse.userProfile });
    component.allowedAction = [];
    component.ngOnInit();
    activatedRoute.params = {
      'section': 'skills',
      'action': 'add'
    };
    component.action = activatedRoute.params.action;
  });
  it('should call toggle method', () => {
    const userService = TestBed.get(UserService);
    userService._userData$.next({ err: null, userProfile: mockSkillResponse.userProfile });
    const lim = true;
    mockSkillResponse.userProfile.skills.length = 1;
    component.userProfile = mockSkillResponse.userProfile;
    component.limit = mockSkillResponse.userProfile.skills.length;
    spyOn(component, 'toggle').and.callThrough();
    component.toggle(lim);
    expect(component.viewMore).toBe(false);
  });
  it('should pass else condition in toggle method', () => {
    const userService = TestBed.get(UserService);
    userService._userData$.next({ err: null, userProfile: mockSkillResponse.userProfile });
    const lim = false;
    mockSkillResponse.userProfile.skills.length = 3;
    component.limit = mockSkillResponse.userProfile.skills.length;
    spyOn(component, 'toggle').and.callThrough();
    component.toggle(lim);
    expect(component.viewMore).toBe(true);
  });
});
