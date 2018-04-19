import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from './../../../services';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService, CoreModule } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ResourceService, ConfigService, IUserProfile, IUserData, ToasterService, SharedModule,
  WindowScrollService
} from '@sunbird/shared';
import { EditUserSkillsComponent } from './edit-user-skills.component';
import { mockRes } from './edit-user-skills.component.spec.data';
import { Ng2IzitoastService } from 'ng2-izitoast';

describe('EditUserSkillsComponent', () => {
  let component: EditUserSkillsComponent;
  let fixture: ComponentFixture<EditUserSkillsComponent>;
  const fakeActivatedRoute = {
    'params': Observable.from([{ 'section': 'skills', 'action': 'add' }])
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditUserSkillsComponent],
      imports: [FormsModule, ReactiveFormsModule, SuiModule, HttpClientTestingModule, SharedModule, CoreModule],
      providers: [ResourceService, UserService, ProfileService, Ng2IzitoastService, ToasterService,
        WindowScrollService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserSkillsComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    const userService = TestBed.get(UserService);
    const windowScrollService = TestBed.get(WindowScrollService);
    const offsetTop = 'skills';
    spyOn(windowScrollService, 'smoothScroll').and.returnValue(null);
    userService._userProfile = mockRes.data.userProfile;
    userService._userData$.next({ err: null, userProfile: mockRes.data.userProfile });
    component.ngOnInit();
    expect(component).toBeTruthy();
  });
  it('should call addSkill method', () => {
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = mockRes.resourceBundle.messages;
    const profileService = TestBed.get(ProfileService);
    const router = TestBed.get(Router);
    const addedSkill = ['java', 'angular'];
    spyOn(profileService, 'add').and.callFake(() => Observable.of(mockRes.response));
    component.addSkill(addedSkill);
    expect(router.navigate).toHaveBeenCalledWith(['/profile']);
  });
  it('should call redirect method', () => {
    const router = TestBed.get(Router);
    component.redirect();
    expect(router.navigate).toHaveBeenCalledWith(['/profile']);
  });
});
