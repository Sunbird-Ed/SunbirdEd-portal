import { throwError as observableThrowError, of as observableOf,  Observable, BehaviorSubject, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignBadgesContentComponent } from './assign-badges-content.component';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { UserService, BadgesService, CoreModule } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule, ResourceService, ToasterService,IUserData,  IUserProfile } from '@sunbird/shared';
import { mockResponse } from './assign-badges-content.component.spec.data';
import { ContentBadgeService } from './../../services';
import { TelemetryModule, TelemetryInteractDirective } from '@sunbird/telemetry';

describe('AssignBadgesContentComponent', () => {
  let component: AssignBadgesContentComponent;
  const mockResourceService: Partial<ResourceService> = {};
  const mockUserService: Partial<UserService> = {
    _userData$: new BehaviorSubject<Partial<IUserData>>(undefined),
  };
  const mockActivatedRoute: Partial<ActivatedRoute> = {
    params: observableOf({ collectionId: 'Test_Textbook2_8907797' })
  };
  const mockToasterService: Partial<ToasterService> = {};
  const mockContentBadgeService: Partial<ContentBadgeService> = {};
  const mockBadgeService: Partial<BadgesService> = {};

  beforeAll(() => {
    component = new AssignBadgesContentComponent(
      mockResourceService as ResourceService, 
      mockUserService as UserService, 
      mockBadgeService as BadgesService, 
      mockToasterService as ToasterService, 
      mockActivatedRoute as ActivatedRoute, 
      mockContentBadgeService as ContentBadgeService
    );
  });

  beforeEach(() => {
      jest.clearAllMocks();
  });

  it('should be create a instance of appComponent', () => {
      expect(component).toBeTruthy();
  });

  it('should initialize the component expected calls for setInteractEventData and  getAllBadgeList ', () => {
    
    mockResourceService.messages = mockResponse.resourceBundle.messages;
    component.contentId = mockActivatedRoute.params['collectionId'];
    jest.spyOn(component, 'getBadgeDetails').mockImplementation();
    jest.spyOn(component, 'setInteractEventData').mockImplementation();
    mockBadgeService.getAllBadgeList = jest.fn(() => observableOf(mockResponse.badgeSearchData)) 
    mockUserService._userData$.next({ err: null, userProfile: mockResponse.userMockData as IUserProfile });
    component.ngOnInit();
    expect(component.userProfile).toBeDefined();
    expect(component.contentId).toBe('Test_Textbook2_8907797');
    expect(component.setInteractEventData).toHaveBeenCalled();
    expect(component.getBadgeDetails).toHaveBeenCalled();
    expect(component.badgeService.getAllBadgeList).toHaveBeenCalledWith(mockResponse.badgeSearchRequestData);
    expect(component.allBadgeList).toBeDefined();
    expect(component.allBadgeList.length).toBeGreaterThanOrEqual(2);
  });


  // it('should call assign method and make service call, should return success response', () => {
  //   const userService:any = TestBed.inject(UserService);
  //   const badgeService = TestBed.inject(ContentBadgeService);
  //   const resourceService = TestBed.inject(ResourceService);
  //   resourceService.messages = mockResponse.resourceBundle.messages;
  //   const toasterService:any = TestBed.inject(ToasterService);
  //   userService._userData$.next({ err: null, userProfile: mockResponse.userMockData as IUserProfile });
  //   component.allBadgeList = mockResponse.badgeSuccessResponse.result.badges;
  //   spyOn(badgeService, 'addBadge').and.callFake(() => observableOf(mockResponse.returnValue));
  //   spyOn(component, 'assignBadge').and.callThrough();
  //   spyOn(toasterService, 'success').and.callThrough();
  //   spyOn(component.contentBadgeService, 'setAssignBadge').and.callThrough();
  //   component.assignBadge(mockResponse.badgeSuccessResponse.result.badges);
  //   component.contentBadgeService.setAssignBadge(mockResponse.setbadgesData);
  //   expect(component.assignBadge).toHaveBeenCalledWith(mockResponse.badgeSuccessResponse.result.badges);
  //   expect(component.data.length).toBeLessThanOrEqual(1);
  //   expect(component.contentBadgeService.setAssignBadge).toHaveBeenCalledWith(mockResponse.setbadgesData);
  //   expect(toasterService.success).toHaveBeenCalledWith(resourceService.messages.smsg.m0044);
  // });
  // it('should call assign method and make service call, should throw error', () => {
  //   const userService:any = TestBed.inject(UserService);
  //   const badgeService = TestBed.inject(ContentBadgeService);
  //   const resourceService = TestBed.inject(ResourceService);
  //   resourceService.messages = mockResponse.resourceBundle.messages;
  //   const toasterService:any = TestBed.inject(ToasterService);
  //   userService._userData$.next({ err: null, userProfile: mockResponse.userMockData as IUserProfile });
  //   spyOn(badgeService, 'addBadge').and.callFake(() => observableThrowError({}));
  //   spyOn(toasterService, 'error').and.callThrough();
  //   component.assignBadge(mockResponse.badgeSuccessResponse.result.badges);
  //   toasterService.error(resourceService.messages.fmsg.m0079);
  //   expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.fmsg.m0079);
  // });
  // it('should call assign method and make service call, should emit the event', () => {
  //   const userService:any = TestBed.inject(UserService);
  //   const badgeService = TestBed.inject(ContentBadgeService);
  //   const resourceService = TestBed.inject(ResourceService);
  //   resourceService.messages = mockResponse.resourceBundle.messages;
  //   const toasterService:any = TestBed.inject(ToasterService);
  //   userService._userData$.next({ err: null, userProfile: mockResponse.userMockData as IUserProfile});
  //   component.allBadgeList = mockResponse.badgeSuccessResponse.result.badges;
  //   spyOn(badgeService, 'addBadge').and.callFake(() => observableOf(mockResponse.returnValue));
  //   spyOn(badgeService, 'setAssignBadge').and.callThrough();
  //   spyOn(toasterService, 'success').and.callThrough();
  //   component.assignBadge(mockResponse.badgeSuccessResponse.result.badges);
  //   expect(toasterService.success).toHaveBeenCalledWith(resourceService.messages.smsg.m0044);
  // });
  // it('should call setBadge and return the badges  ', () => {
  //   spyOn(component, 'setBadge').and.callThrough();
  //   component.setBadge(mockResponse.setbadgesData);
  //   expect(component.setBadge).toHaveBeenCalledWith(mockResponse.setbadgesData);
  //   expect(component.badge).toBe(mockResponse.setbadgesData);
  // });
  // it('should unsubscribe from all observable subscriptions', () => {
  //   component.ngOnInit();
  //   spyOn(component.unsubscribe, 'complete');
  //   component.ngOnDestroy();
  //   expect(component.unsubscribe.complete).toHaveBeenCalled();
  // });
});


