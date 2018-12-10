import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProfileFrameworkPopupComponent } from './profile-framework-popup.component';
import { SuiModule } from 'ng2-semantic-ui';
import { ActivatedRoute, Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FrameworkService, FormService, LearnerService, CoreModule, UserService } from '@sunbird/core';
import { ConfigService, ResourceService, Framework, ToasterService, SharedModule } from '@sunbird/shared';
import { throwError as observableThrowError, of as observableOf, Observable } from 'rxjs';
import { Response } from './profile-framework-popup.component.spec.data';

describe('PopupComponent', () => {
  let component: ProfileFrameworkPopupComponent;
  let fixture: ComponentFixture<ProfileFrameworkPopupComponent>;
  const resourceBundle = {
    'messages': {
      'emsg': {
        'm0005': 'Fetching data failed, please try again later...'
      }
    }
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const fakeActivatedRoute = {
    'params': observableOf({ }),
    'queryParams': observableOf({ })
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule.forRoot()],
      declarations: [ProfileFrameworkPopupComponent],
      providers: [ConfigService, LearnerService, UserService, FrameworkService, FormService,
        { provide: ResourceService, useValue: resourceBundle },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
        schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileFrameworkPopupComponent);
    component = fixture.componentInstance;
  });
  it('Error message to be displayed when framework api returns error', () => {
    const userService = TestBed.get(UserService);
    const frameworkService = TestBed.get(FrameworkService);
    const formService = TestBed.get(FormService);
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceBundle.messages;
    userService._userData$.next({ err: null, userProfile: Response.userData });
    frameworkService._frameworkData$.next({ err: 'client error', framework: null, frameworkdata: null });
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(formService, 'getFormConfig').and.callFake(() => observableOf(Response.formData.result.form.data.fields));
    component.ngOnInit();
    expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.emsg.m0005);
  });

  it('Error message to be displayed when form config service throws error', () => {
    const userService = TestBed.get(UserService); const frameworkService = TestBed.get(FrameworkService);
    const formService = TestBed.get(FormService);
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceBundle.messages;
    userService._userData$.next({ err: null, userProfile: Response.userData });
    frameworkService._frameworkData$.next({ err: 'client error', framework: null, frameworkdata: null });
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(formService, 'getFormConfig').and.callFake(() => observableThrowError({}));
    component.ngOnInit();
    expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.emsg.m0005);
  });

  it('Error message to be displayed when org details API throws error', () => {
    const userService = TestBed.get(UserService);
    const frameworkService = TestBed.get(FrameworkService);
    const formService = TestBed.get(FormService);
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceBundle.messages;
    userService._userData$.next({ err: 'err', userProfile: null });
    spyOn(toasterService, 'error').and.callThrough();
    component.ngOnInit();
    expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.emsg.m0005);
  });

  it('Form to successfully set input framework data sent', () => {
    const userService = TestBed.get(UserService);
    const frameworkService = TestBed.get(FrameworkService);
    const formService = TestBed.get(FormService);
    component.formInput = { board: ['NCERT'], medium: ['English'], gradeLevel: ['KG'] };
    userService._userData$.next({ err: null, userProfile: Response.userData });
    frameworkService._frameworkData$.next({ frameworkdata: Response.frameworkData });
    spyOn(formService, 'getFormConfig').and.callFake(() => observableOf(Response.formData.result.form.data.fields));
    component.ngOnInit();
    expect(component.board).toBeDefined();
    expect(component.medium).toBeDefined();
    expect(component.class).toBeDefined();
    expect(component.subject).toBeDefined();
    expect(component.showButton).toBeTruthy();
  });
});

