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
  const data = {
    userProfile: {
      'education': [{
        'boardOrUniversity': 'CBSE',
        'courseName': null,
        'degree': 'Graduation',
        'duration': null,
        'grade': 'A',
        'name': 'SVM',
        'percentage': 70,
        'yearOfPassing': 2012
      }]
    }
  };
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
    fixture.autoDetectChanges();
    parentFixture = TestBed.createComponent(UserEducationComponent);
    parentComp = parentFixture.componentInstance;
    component = fixture.componentInstance;
  });

  it('should create', () => {
    const userService = TestBed.get(UserService);
    const activatedRoute = TestBed.get(ActivatedRoute);
    userService._userProfile = data.userProfile;
    spyOn(userService, 'getUserProfile').and.callFake(() => Observable.of(data));
    activatedRoute.params = {
      'section': 'address',
      'action': 'add'
    };
    parentComp.privateProfileFields = true;
    component.education = [];
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('should create 2', () => {
    const userService = TestBed.get(UserService);
    const activatedRoute = TestBed.get(ActivatedRoute);
    userService._userProfile = data.userProfile;
    userService._userData$.next({ err: null, userProfile: data.userProfile });
    parentComp.allowedAction = [];
    parentComp.ngOnInit();
    activatedRoute.params = {
      'section': 'address',
      'action': 'add'
    };
    expect(component).toBeTruthy();
  });
});
