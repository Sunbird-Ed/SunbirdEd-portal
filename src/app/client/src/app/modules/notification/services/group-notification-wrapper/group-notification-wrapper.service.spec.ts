import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import {of as observableOf } from 'rxjs';
import { groupData, MockResponse, modifiedActivities, notificationData } from './group-notification-wrapper.spec.data';

import { GroupNotificationWrapperService } from './group-notification-wrapper.service';
import { ConfigService, ResourceService, ToasterService, SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

describe('GroupNotificationWrapperService', () => {
  let service: GroupNotificationWrapperService;

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  const resourceBundle = {
    languageSelected$: of ({}),
    frmelmnts: {
      lbl: {
        you: 'You',
        ACTIVITY_COURSE_TITLE: 'Courses',
        ACTIVITY_TEXTBOOK_TITLE: 'Textbooks'
      },

    }
  };

  const fakeActivatedRoute = {
    snapshot: {
      data: {
      }
    },
    queryParams: observableOf({ })
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ SharedModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      providers: [GroupNotificationWrapperService, ConfigService, ResourceService, ToasterService,
        { provide: ResourceService, useValue: resourceBundle },
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: Router, useClass: RouterStub},
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ]
    });
    service = TestBed.inject(GroupNotificationWrapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call navigateToActivityToc()', () => {
    const service = TestBed.get(GroupNotificationWrapperService);
    spyOn(service, 'getGroupById').and.returnValue(of());
    spyOn(service, 'groupContentsByActivityType').and.returnValue({showList:  true});
    spyOn(service, 'playContent');
    service.navigateToActivityToc('123', true, true, true);
    service.getGroupById('123', true, true, true).subscribe((data) => {
      expect(service.groupContentsByActivityType).toHaveBeenCalledWith(false,
        {id: '123', name: 'groupName', members: [], createdBy: '1', isCreator: false, isAdmin: false, initial: 'g',
        description: '', membershipType: 'invite_only'});
      expect(service.playContent).toHaveBeenCalled();
    });
  });

  it('should call navigateNotification()', () => {
    const service = TestBed.get(GroupNotificationWrapperService);
    const additionalInfo = notificationData.data.action.additionalInfo;
    const accepted = service.navigateNotification(notificationData, additionalInfo);
    expect(accepted).toEqual({ path: 'my-groups/group-details/2ae1e555-b9cc-4510-9c1d-2f90e94ded90' });
  });
  
  it('should navigate to course player if trackable object is not available', fakeAsync(() => {
    const service = TestBed.get(GroupNotificationWrapperService);
    const router = TestBed.get(Router);
    service.playContent(MockResponse.contentMetadata);
    tick(50);
    expect(router.navigate).toHaveBeenCalledWith(['/learn/course', MockResponse.contentMetadata.identifier], { queryParams: undefined });
  }));

  it('should navigate to collection player if trackable object is not available and content type is other then course', fakeAsync(() => {
    const service = TestBed.get(GroupNotificationWrapperService);
    const router = TestBed.get(Router);
    const mockData = MockResponse.contentMetadata;
    mockData.contentType = 'TextBook';
    mockData.primaryCategory = 'TextBook';
    service.playContent(mockData);
    tick(50);
    expect(router.navigate).toHaveBeenCalledWith(['/resources/play/collection', MockResponse.contentMetadata.identifier],
    {queryParams: {contentType: MockResponse.contentMetadata.contentType}});
  }));

  it('should navigate to collection player if course is not trackable', fakeAsync(() => {
    const service = TestBed.get(GroupNotificationWrapperService);
    const router = TestBed.get(Router);
    MockResponse.contentMetadata['trackable'] = { 'enabled': 'No' };
    service.playContent(MockResponse.contentMetadata);
    tick(50);
    expect(router.navigate).toHaveBeenCalledWith(['/resources/play/collection', MockResponse.contentMetadata.identifier],
    {queryParams: {contentType: MockResponse.contentMetadata.contentType}});
  }));

  it('should navigate to course player if collection is trackable', fakeAsync(() => {
    const service = TestBed.get(GroupNotificationWrapperService);
    const router = TestBed.get(Router);
    MockResponse.contentMetadata['trackable'] = { 'enabled': 'Yes' };
    service.playContent(MockResponse.contentMetadata);
    tick(50);
    expect(router.navigate).toHaveBeenCalledWith(['/learn/course', MockResponse.contentMetadata.identifier], { queryParams: undefined });
  }));

  it('should navigate to course player with batch id if collection is trackable and enrolled course', fakeAsync(() => {
    const service = TestBed.get(GroupNotificationWrapperService);
    const router = TestBed.get(Router);
    MockResponse.contentMetadata['trackable'] = { 'enabled': 'Yes' };
    MockResponse.contentMetadata['batchId'] = '123';
    service.playContent(MockResponse.contentMetadata);
    tick(50);
    expect(router.navigate).toHaveBeenCalledWith(['/learn/course', MockResponse.contentMetadata.identifier, 'batch', '123'],
      { queryParams: undefined });
  }));

  it('should navigate to resource player if content mime type is not collection', fakeAsync(() => {
    const service = TestBed.get(GroupNotificationWrapperService);
    const router = TestBed.get(Router);
    MockResponse.contentMetadata['mimeType'] = 'pdf';
    service.playContent(MockResponse.contentMetadata);
    tick(50);
    expect(router.navigate).toHaveBeenCalledWith(['/resources/play/content', MockResponse.contentMetadata.identifier]);
  }));

  it('should navigate to resource player if content mime type is ecml', fakeAsync(() => {
   const router = TestBed.get(Router);
    MockResponse.contentMetadata.mimeType = 'application/vnd.ekstep.ecml-archive';
    service.playContent(MockResponse.contentMetadata);
    tick(50);
    expect(router.navigate).toHaveBeenCalledWith(['/resources/play/content', MockResponse.contentMetadata.identifier]);
  }));

  it('should call groupCs getById', () => {
    const service = TestBed.get(GroupNotificationWrapperService);
    spyOn(service['groupCservice'], 'getById');
    service.getGroupById('123', true, true, true);
    expect(service['groupCservice'].getById).toHaveBeenCalledWith('123',
    { includeMembers: true, includeActivities: true, groupActivities: true });
  });
  
  it ('should return activityList and showList value', () => {
    const service = TestBed.get(GroupNotificationWrapperService);
    const response = service.groupContentsByActivityType(false, groupData);
    expect(response.showList).toBe(true);
    expect(response.activities).toEqual(modifiedActivities);
  });

  it ('should return activityList and showList value = FALSE', () => {
    const service = TestBed.get(GroupNotificationWrapperService);
    const response = service.groupContentsByActivityType(false, {});
    expect(response.showList).toBe(false);
    expect(response.activities).toEqual({});
  });

});


