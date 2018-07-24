
import {of as observableOf,  Observable } from 'rxjs';
import { TelemetryModule } from '@sunbird/telemetry';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceService, ConfigService, IUserProfile, IUserData, ToasterService, SharedModule, IBasicInfo } from '@sunbird/shared';
import { UserService, CoreModule } from '@sunbird/core';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UserAdditionalInfoComponent } from './user-additional-info.component';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EditUserAdditionalInfoComponent } from '../../user-additional-info/edit-user-additional-info/edit-user-additional-info.component';
import { ProfileService } from '../../../services';
import { mockRes } from './user-additional-info.component.spec.data';
describe('UserAdditionalInfoComponent', () => {
  let component: EditUserAdditionalInfoComponent;
  let fixture: ComponentFixture<EditUserAdditionalInfoComponent>;
  let parentComp: UserAdditionalInfoComponent;
  let parentFixture: ComponentFixture<UserAdditionalInfoComponent>;
  class FakeActivatedRoute {
    params =  observableOf([{ 'section': 'additionalInfo', 'action': 'edit' }]);
    changeParams(params) {
      this.params = params;
    }
  }
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
      imports: [FormsModule, ReactiveFormsModule, SuiModule, HttpClientTestingModule,
        TelemetryModule.forRoot(), SharedModule.forRoot(), CoreModule.forRoot()],
      providers: [ResourceService, ConfigService, UserService, ProfileService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useClass: FakeActivatedRoute }],
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
    activatedRoute.changeParams(undefined);
    expect(parentComp.action).toBe('view');
    expect(component).toBeTruthy();
  });
  it('should call editBasicInfo method', () => {
    const profileService = TestBed.get(ProfileService);
    const router = TestBed.get(Router);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = mockRes.resourceBundle.messages;
    parentComp.editChild = component;
    parentComp.editChild.basicInfo = {
      id: '',
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      gender: '',
      dob: '',
      location: '',
      subject: [],
      grade: [],
      language: [],
      webPages: []
    };
    parentComp.editChild.basicInfoForm = new FormGroup({});
    parentComp.editChild.basicInfoForm = component.basicInfoForm;
    spyOn(profileService, 'updateProfile').and.callFake(() => observableOf(mockRes.response));
    parentComp.editBasicInfo();
    expect(router.navigate).toHaveBeenCalledWith(['/profile']);
  });
  it('should call setInteractEventData method', () => {
    const edata = {
      id: '',
      type: '',
      pageid: ''
    };
    parentComp.editAdditionalInfoInteractEdata = edata;
    parentComp.closeAdditionalInfoInteractEdata = edata;
    parentComp.saveEditAdditionalInfoInteractEdata = edata;
    parentComp.telemetryInteractObject = {
      id: '',
      type: '',
      ver: ''
    };
    parentComp.setInteractEventData();
    expect(parentComp.editAdditionalInfoInteractEdata).toBeDefined();
  });
});
