import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AccessDiscussionComponent } from './access-discussion.component';
import { DiscussionService } from '../../services';
import { of as observableOf, throwError } from 'rxjs';
import { MockResponseData } from './access-discussion.component.spec.data';
import { ToasterService, ResourceService, SharedModule, NavigationHelperService } from '../../../shared';
import { configureTestSuite } from '../../../../testUtil';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { ConfigService } from '@sunbird/shared';
import { APP_BASE_HREF } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { TelemetryService } from '@sunbird/telemetry';
import { RouterModule } from '@angular/router';

describe('AccessDiscussionComponent', () => {
  let component: AccessDiscussionComponent;
  let fixture: ComponentFixture<AccessDiscussionComponent>;

  const resourceBundle = {
    messages: {
      emsg: {
        m003: '',
        m0005: 'Something went wrong, try again later'
      },
    },
  };

  configureTestSuite();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccessDiscussionComponent],
      imports: [SharedModule.forRoot(), RouterModule.forRoot([]), HttpClientTestingModule, HttpClientModule, RouterTestingModule],
      providers: [{ provide: ResourceService, useValue: resourceBundle }, DiscussionService, ConfigService,
      { provide: APP_BASE_HREF, useValue: '/' },
        TelemetryService, NavigationHelperService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessDiscussionComponent);
    component = fixture.componentInstance;
    component.fetchForumIdReq = {
      identifier: ['123'],
      type: 'course'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    spyOn(component, 'fetchForumIds');
    component.ngOnInit();
    expect(component.fetchForumIds).toHaveBeenCalled();
    expect(component).toBeTruthy();
  });

  it('should fetch all the forumIds attached to a course/batch', () => {
    /** Arrange */
    spyOn(component['discussionCsService'], 'getForumIds').and.returnValue(observableOf(MockResponseData.fetchForumResponse));

    /** Act */
    component.fetchForumIds();

    /** Assert */
    expect(component.forumIds).toEqual([9]);
  });

  it('should show error toast if fetch forum id api fails', () => {
    /** Arrange */
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error');
    spyOn(component['discussionCsService'], 'getForumIds').and.callFake(() => throwError({}));

    /** Act */
    component.fetchForumIds();

    /** Assert */
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.emsg.m0005);
  });

  it('should navigate to Discussion forum landing page', () => {
    /** Arrange */
    const navigationHelperService = TestBed.get(NavigationHelperService);
    spyOn(navigationHelperService, 'setNavigationUrl').and.stub();
    spyOn(component['discussionCsService'], 'createUser').and.callThrough();
    spyOn(component.routerData, 'emit').and.returnValue(MockResponseData.emitData);

    /** Act */
    component.navigateToDiscussionForum();
    component.routerData.emit(MockResponseData.emitData);

    /** Assert */
    expect(navigationHelperService.setNavigationUrl).toHaveBeenCalled();
    expect(component.routerData.emit).toHaveBeenCalledWith(MockResponseData.emitData);
  });

  it('should throw error if the register-user api fails', () => {
    /** Arrange */
    const toasterService = TestBed.get(ToasterService);
    const navigationHelperService = TestBed.get(NavigationHelperService);
    spyOn(navigationHelperService, 'setNavigationUrl').and.stub();
    spyOn(component['discussionCsService'], 'createUser').and.callFake(() => throwError({}));
    spyOn(toasterService, 'error').and.stub();

    /** Act */
    component.navigateToDiscussionForum();

    /** Assert */
    expect(component.showLoader).toBeFalsy();
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.emsg.m0005);
    expect(navigationHelperService.setNavigationUrl).toHaveBeenCalledWith({ url: component['router'].url });
  });
});
