import { throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignBadgesContentComponent } from './assign-badges-content.component';
import { SuiModule } from 'ng2-semantic-ui';
import { UserService, BadgesService, CoreModule } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule, ResourceService, ToasterService } from '@sunbird/shared';
import { mockResponse } from './assign-badges-content.component.spec.data';
import { ContentBadgeService } from './../../services';
import { TelemetryModule, TelemetryInteractDirective } from '@sunbird/telemetry';

describe('AssignBadgesContentComponent', () => {
  let component: AssignBadgesContentComponent;
  let fixture: ComponentFixture<AssignBadgesContentComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const fakeActivatedRoute = {
    'params': observableOf({ collectionId: 'Test_Textbook2_8907797' })
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AssignBadgesContentComponent],
      imports: [SuiModule, CoreModule.forRoot(), SharedModule.forRoot(), HttpClientTestingModule, TelemetryModule.forRoot()],
      providers: [ContentBadgeService, ResourceService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: Router, useClass: RouterStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignBadgesContentComponent);
    component = fixture.componentInstance;
  });

  it('should get collectionId from activated route, should get user data', () => {
    const userService = TestBed.get(UserService);
    const badgeService = TestBed.get(BadgesService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = mockResponse.resourceBundle.messages;
    userService._userData$.next({ err: null, userProfile: mockResponse.userMockData });
    spyOn(badgeService, 'getAllBadgeList').and.callFake(() => observableOf(mockResponse.badgeSuccessResponse));
    expect(component.contentId).toBe(fakeActivatedRoute.params['collectionId']);
    fixture.detectChanges();
  });
  it('should call assign method and make service call, should return success response', () => {
    const userService = TestBed.get(UserService);
    const badgeService = TestBed.get(ContentBadgeService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = mockResponse.resourceBundle.messages;
    const toasterService = TestBed.get(ToasterService);
    userService._userData$.next({ err: null, userProfile: mockResponse.userMockData });
    component.allBadgeList = mockResponse.badgeSuccessResponse.result.badges;
    spyOn(badgeService, 'addBadge').and.callFake(() => observableOf(mockResponse.returnValue));
    spyOn(toasterService, 'success').and.callThrough();
    component.assignBadge(mockResponse.badgeSuccessResponse.result.badges);
    expect(toasterService.success).toHaveBeenCalledWith(resourceService.messages.smsg.m0044);
  });
  it('should unsubscribe from all observable subscriptions', () => {
    component.ngOnInit();
    spyOn(component.unsubscribe, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe.complete).toHaveBeenCalled();
  });

  it('makes expected calls for setInteractEventData ', () => {
    spyOn(component, 'setInteractEventData');
    component.ngOnInit();
    expect(component.setInteractEventData).toHaveBeenCalled();
  });
  it('should call assign method and make service call, should emit the event', () => {
    const userService = TestBed.get(UserService);
    const badgeService = TestBed.get(ContentBadgeService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = mockResponse.resourceBundle.messages;
    const toasterService = TestBed.get(ToasterService);
    userService._userData$.next({ err: null, userProfile: mockResponse.userMockData });
    component.allBadgeList = mockResponse.badgeSuccessResponse.result.badges;
    spyOn(badgeService, 'addBadge').and.callFake(() => observableOf(mockResponse.returnValue));
    spyOn(badgeService, 'setAssignBadge').and.callThrough();
    spyOn(toasterService, 'success').and.callThrough();
    component.assignBadge(mockResponse.badgeSuccessResponse.result.badges);
    expect(toasterService.success).toHaveBeenCalledWith(resourceService.messages.smsg.m0044);
  });

  it('should call assign method and make service call, should throw error', () => {
    const userService = TestBed.get(UserService);
    const badgeService = TestBed.get(ContentBadgeService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = mockResponse.resourceBundle.messages;
    const toasterService = TestBed.get(ToasterService);
    userService._userData$.next({ err: null, userProfile: mockResponse.userMockData });
    spyOn(badgeService, 'addBadge').and.callFake(() => observableThrowError({}));
    spyOn(toasterService, 'error').and.callThrough();
    component.assignBadge(mockResponse.badgeSuccessResponse.result.badges);
    toasterService.error(resourceService.messages.fmsg.m0079);
    expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.fmsg.m0079);
  });
});


