import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceService, ConfigService, IUserProfile, IUserData, ToasterService, SharedModule } from '@sunbird/shared';
import { UserService, CoreModule } from '@sunbird/core';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UserAdditionalInfoComponent } from './user-additional-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EditUserAdditionalInfoComponent } from '../../user-additional-info/edit-user-additional-info/edit-user-additional-info.component';
import { ProfileService } from '../../../services';
import { mockRes } from './user-additional-info.component.spec.data';

describe('UserAdditionalInfoComponent', () => {
  let component: EditUserAdditionalInfoComponent;
  let fixture: ComponentFixture<EditUserAdditionalInfoComponent>;
  let parentComp: UserAdditionalInfoComponent;
  let parentFixture: ComponentFixture<UserAdditionalInfoComponent>;
  const fakeActivatedRoute = {
    'params': Observable.from([{ 'section': 'additionalInfo', 'action': 'edit' }])
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const data = {
    userProfile: {
      'dob': '2017-10-23',
      'firstName': 'R. Juthika Admin us',
      'lastName': 'Admin userచూపడము ఎలాf',
      'phone': '******7418',
      'email': 'us*********@testss.com',
      'language': ['Bengali', 'Hindi', 'Urdu'],
      'grade': ['Grade 2', 'Grade 3', 'Grade 4', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 10'],
      'subject': ['Biology', 'Chemistry', 'Environmental Studies'],
      'gender': 'Female',
      'location': '123fgh',
      'webPages': [
        { type: 'fb', url: 'https://www.facebook.com/pauljuthika' },
        { type: 'in', url: 'https://www.linkedin.com/in/feed/?trk=hb_signin' },
        { type: 'blog', url: 'https://staging.open-sunbird.org/private/index#!/profile' }
      ]
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserAdditionalInfoComponent, EditUserAdditionalInfoComponent],
      imports: [FormsModule, ReactiveFormsModule, SuiModule, HttpClientTestingModule, SharedModule, CoreModule],
      providers: [ResourceService, ConfigService, UserService, ProfileService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserAdditionalInfoComponent);
    component = fixture.componentInstance;
    parentFixture = TestBed.createComponent(UserAdditionalInfoComponent);
    parentComp = parentFixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    const userService = TestBed.get(UserService);
    const activatedRoute = TestBed.get(ActivatedRoute);
    userService._userProfile = data.userProfile;
    userService._userData$.next({ err: null, userProfile: data.userProfile });
    parentComp.webPages = [];
    parentComp.ngOnInit();
    activatedRoute.params = {
      'section': 'address',
      'action': 'add'
    };
    expect(component).toBeTruthy();
  });
  it('should pass activated route', () => {
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
  xit('should call editBasicInfo method', () => {
    const profileService = TestBed.get(ProfileService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = mockRes.resourceBundle.messages;
    spyOn(profileService, 'updateProfile').and.callFake(() => Observable.of(mockRes.response));
    parentComp.editBasicInfo();
    expect(component).toBeTruthy();
  });
});
