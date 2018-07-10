
import {of as observableOf,  Observable } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToasterService, SharedModule, ResourceService } from '@sunbird/shared';
import { CoreModule, UserService } from '@sunbird/core';
import { ProfileService, UserSummaryComponent } from '@sunbird/profile';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { mockRes } from './user-summary.component.spec.data';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
describe('UserSummaryComponent', () => {
  let component: UserSummaryComponent;
  let fixture: ComponentFixture<UserSummaryComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const fakeActivatedRoute = {
    'params': observableOf({ 'section': 'skills', 'action': 'add' })
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, Ng2IziToastModule, SharedModule.forRoot(), FormsModule,
        RouterTestingModule, CoreModule.forRoot()],
      declarations: [UserSummaryComponent],
      providers: [ProfileService, ResourceService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSummaryComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    const userService = TestBed.get(UserService);
    const activatedRoute = TestBed.get(ActivatedRoute);
    userService._userData$.next({ err: null, userProfile: mockRes.data.userProfile });
    component.ngOnInit();
    activatedRoute.params = {
      'section': 'summary',
      'action': 'eidt'
    };
  });
  it('should pass activated route', () => {
    const userService = TestBed.get(UserService);
    const activatedRoute = TestBed.get(ActivatedRoute);
    userService._userData$.next({ err: null, userProfile: mockRes.data.userProfile });
    component.allowedAction = [];
    component.ngOnInit();
    activatedRoute.params = {
      'section': 'summary',
      'action': 'eidt'
    };
  });
  it('should call editDetails method', () => {
    const profileService = TestBed.get(ProfileService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = mockRes.resourceBundle.messages;
    const route = TestBed.get(Router);
    spyOn(profileService, 'updateProfile').and.callFake(() => observableOf(mockRes.successResponse));
    const editedSummary = 'newSummary';
    component.editDetails(editedSummary);
    fixture.detectChanges();
    expect(route.navigate).toHaveBeenCalledWith(['/profile']);
  });
});
