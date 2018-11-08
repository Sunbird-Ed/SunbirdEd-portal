import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProfileFrameworkPopupComponent } from './profile-popup.component';
import { SuiModule } from 'ng2-semantic-ui';
import { ActivatedRoute, Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { OrgDetailsService, FrameworkService, FormService, LearnerService, CoreModule } from '@sunbird/core';
import {ConfigService, ResourceService, Framework, ToasterService, SharedModule} from '@sunbird/shared';
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { Response } from './profile-popup.component.spec.data';

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
      declarations: [ ProfileFrameworkPopupComponent ],
      providers: [ConfigService,  LearnerService, OrgDetailsService, FrameworkService, FormService,
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
  it('When framework  api throw error', () => {
    const orgDetailsService = TestBed.get(OrgDetailsService);
    const frameworkService = TestBed.get(FrameworkService);
    const formService = TestBed.get(FormService);
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceBundle.messages;
    spyOn(orgDetailsService, 'getOrgDetails').and.callFake(() => observableOf(Response.orgSuccess));
    frameworkService._frameworkData$.next({err: 'client error', framework: null, frameworkdata: null });
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(formService, 'getFormConfig').and.callFake(() => observableOf(Response.formData.result.form.data.fields));
    component.ngOnInit();
    expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.emsg.m0005);
  });

  it('When formservice api throw error', () => {
    const orgDetailsService = TestBed.get(OrgDetailsService);
    const frameworkService = TestBed.get(FrameworkService);
    const formService = TestBed.get(FormService);
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceBundle.messages;
    spyOn(orgDetailsService, 'getOrgDetails').and.callFake(() => observableOf(Response.orgSuccess));
    frameworkService._frameworkData$.next({err: 'client error', framework: null, frameworkdata: null });
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(formService, 'getFormConfig').and.callFake(() => observableThrowError({}));
    component.ngOnInit();
    expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.emsg.m0005);
  });

  it('when we are sending input field', () => {
    const orgDetailsService = TestBed.get(OrgDetailsService);
    const frameworkService = TestBed.get(FrameworkService);
    const formService = TestBed.get(FormService);
    component.formInput = { board: ['NCERT'], medium: ['English'], gradeLevel: ['KG']};
    spyOn(orgDetailsService, 'getOrgDetails').and.callFake(() => observableOf(Response.orgSuccess));
    frameworkService._frameworkData$.next(Response.frameworkData);
    spyOn(formService, 'getFormConfig').and.callFake(() => observableOf(Response.formData.result.form.data.fields));
    component.ngOnInit();
    expect(component.categoryMasterList).toEqual(Response.frameworkData.frameworkdata);
    expect(component.formFieldProperties).toEqual(Response.formData.result.form.data.fields);
    expect(component.board).toEqual(Response.data[0]);
    expect(component.medium).toEqual(Response.data[1]);
    expect(component.class).toEqual(Response.data[2]);
    expect(component.subject).toEqual(Response.data[3]);
    expect(component.showButton).toBeTruthy();
  });

  it('When org details  api failed', () => {
    const orgDetailsService = TestBed.get(OrgDetailsService);
    const frameworkService = TestBed.get(FrameworkService);
    const formService = TestBed.get(FormService);
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceBundle.messages;
    spyOn(orgDetailsService, 'getOrgDetails').and.callFake(() => observableThrowError({}));
    spyOn(toasterService, 'error').and.callThrough();
    component.ngOnInit();
    expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.emsg.m0005);
  });
});
