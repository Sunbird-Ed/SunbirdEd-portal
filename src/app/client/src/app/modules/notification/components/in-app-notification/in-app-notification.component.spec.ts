import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InAppNotificationComponent } from './in-app-notification.component';

import { configureTestSuite } from '@sunbird/test-util';
import { SuiModule } from 'ng2-semantic-ui';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { NotificationService } from '../../services/notification/notification.service';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { of as observableOf } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { notificationList, notificationData } from './in-app-notification.component.spec.data';

describe('InAppNotificationComponent', () => {
  let component: InAppNotificationComponent;
  let fixture: ComponentFixture<InAppNotificationComponent>;

  const resourceBundle = {
    frmelmnts: {
      lbl: {
        notification: 'Notification',
        newNotification: 'New Notification'
      },
      btn: {
        clear: 'Clear',
        seeMore: 'See more',
        seeLess: 'See less'
      }
    }
  };

  class RouterStub {
    navigateByUrl = jasmine.createSpy('navigate');
  }

  const fakeActivatedRoute = {};

  configureTestSuite();
  const MockCSService = {
    getUserFeed() { return observableOf({}); },
    updateUserFeedEntry() { return observableOf({}); },
    deleteUserFeedEntry() { return observableOf({}); }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InAppNotificationComponent],
      imports: [SuiModule, SharedModule.forRoot(), CommonConsumptionModule, HttpClientTestingModule, TelemetryModule.forRoot()],
      providers: [
        NotificationService,
        { provide: 'CS_USER_SERVICE', useValue: MockCSService },
        {
        provide: APP_BASE_HREF,
        useFactory: (s: PlatformLocation) => s.getBaseHrefFromDOM(),
        deps: [PlatformLocation]
        },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        {provide: ResourceService, useValue: resourceBundle}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InAppNotificationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('generateInteractEvent', () => {

    it('should generate the interact telemetry event with cdata empty', () => {
      // arrange
      const telemetryService: TelemetryService = TestBed.get(TelemetryService);
      const data = {
        context: {
          env: 'main-header',
          cdata: []
        },
        edata: {
          id: 'event_id',
          type: 'click',
          pageid: 'in-app-notification',
        }
      };
      spyOn(telemetryService, 'interact');
      // act
      component.generateInteractEvent('event_id');
      // assert
      expect(telemetryService.interact).toHaveBeenCalledWith(data);
    });

    it('should generate the interact telemetry event with valid cdata', () => {
      // arrange
      const telemetryService: TelemetryService = TestBed.get(TelemetryService);
      const data = {
        context: {
          env: 'main-header',
          cdata: [{ type: 'notificationId', id: 'notity_ID' }]
        },
        edata: {
          id: 'event_id',
          type: 'click',
          pageid: 'in-app-notification',
        }
      };
      spyOn(telemetryService, 'interact');
      // act
      component.generateInteractEvent('event_id', { type: 'notificationId', id: 'notity_ID' });
      // assert
      expect(telemetryService.interact).toHaveBeenCalledWith(data);
    });

  });

  describe('fetchNotificationList', () => {

    it('should fetch the notification list and get unread notification count', () => {
      // arrange
      const notificationService: NotificationService = TestBed.get(NotificationService);
      spyOn(notificationService, 'fetchInAppNotifications').and.returnValue(notificationList);
      // act
      component.fetchNotificationList();
      // assert
      expect(notificationService.fetchInAppNotifications).toHaveBeenCalled();
    });

    it('should fetch the notification list and when the list is empty', () => {
      // arrange
      const notificationService: NotificationService = TestBed.get(NotificationService);
      spyOn(notificationService, 'fetchInAppNotifications').and.returnValue([]);
      // act
      component.fetchNotificationList();
      // assert
      expect(notificationService.fetchInAppNotifications).toHaveBeenCalled();
      expect(component.notificationCount).toEqual(0);
    });

  });

  describe('toggleInAppNotifications', () => {

    it('should toggle ', () => {
      // arrange
      component.showNotificationModel = true;
      spyOn(component, 'generateInteractEvent');
      // act
      component.toggleInAppNotifications();
      // assert
      expect(component.generateInteractEvent).toHaveBeenCalled();
      expect(component.showNotificationModel).toBeFalsy();
    });

  });

  describe('markNotificationAsRead', async () => {
    it('should mark the notification as read status', async () => {
      // arrange
      spyOn(component, 'generateInteractEvent');
      const notificationService: NotificationService = TestBed.get(NotificationService);
      spyOn(notificationService, 'updateNotificationRead').and.returnValue(notificationList);
      // act
      await component.markNotificationAsRead(notificationData);
      // assert
      expect(component.generateInteractEvent).toHaveBeenCalledWith('notification-read',
        { id: notificationData.id, type: 'notificationId' });
      expect(notificationService.updateNotificationRead).toHaveBeenCalledWith(notificationData.id);
    });
  });

  describe('notificationHandler', async () => {
    it('should return null if the event data is null', async () => {
      //  arrange
      const event = {};
      // act
      const resp = await component.notificationHandler(event);
      // assert
      expect(resp).toBeFalsy();
    });

    it('should navigate to the url linked with notification', async () => {
      //  arrange
      const event = {
        data: {
          id: 'notification_id',
          data: {
            deepLink: 'https://url.com/resource/course'
          }
        }
      };
      const router = TestBed.get(Router);
      spyOn(component, 'markNotificationAsRead');
      spyOn(component, 'fetchNotificationList');
      // act
      await component.notificationHandler(event);
      // assert
      expect(component.showNotificationModel).toBeFalsy();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/resource/course');
      expect(component.markNotificationAsRead).toHaveBeenCalledWith(event.data);
      expect(component.fetchNotificationList).toHaveBeenCalled();
    });
  });

  describe('deleteNotificationHandler', async () => {
    it('should delete the notification', async () => {
      //  arrange
      const event = {
        data: {
          id: 'notification_id'
        }
      };
      const notificationService: NotificationService = TestBed.get(NotificationService);
      spyOn(notificationService, 'deleteNotification');
      spyOn(component, 'generateInteractEvent');
      spyOn(component, 'fetchNotificationList');
      // act
      await component.deleteNotificationHandler(event);
      // assert
      expect(component.showNotificationModel).toBeFalsy();
      expect(component.generateInteractEvent).toHaveBeenCalledWith('delete-notification',
        { id: event.data.id, type: 'notificationId' });
      expect(notificationService.deleteNotification).toHaveBeenCalledWith(event.data.id);
      expect(component.fetchNotificationList).toHaveBeenCalled();
    });
  });

  describe('clearAllNotifationsHandler', async () => {
    it('should delete all the notification', async () => {
      //  arrange
      const event = {
        data: notificationList
      };
      const notificationService: NotificationService = TestBed.get(NotificationService);
      spyOn(notificationService, 'deleteAllNotifications').and.returnValue(true);
      spyOn(component, 'generateInteractEvent');
      spyOn(component, 'fetchNotificationList');
      // act
      await component.clearAllNotifationsHandler(event);
      // assert
      expect(component.generateInteractEvent).toHaveBeenCalledWith('clear-all-notification');
      expect(component.showNotificationModel).toBeFalsy();
      expect(notificationService.deleteAllNotifications).toHaveBeenCalledWith(event.data);
    });

    it('should skip clear all notifications if there are no notifications', async () => {
      //  arrange
      const event = {
        data: []
      };
      const notificationService: NotificationService = TestBed.get(NotificationService);
      spyOn(component, 'generateInteractEvent');
      // act
      await component.clearAllNotifationsHandler(event);
      // assert
      expect(component.generateInteractEvent).toHaveBeenCalledWith('clear-all-notification');
    });
  });


});
