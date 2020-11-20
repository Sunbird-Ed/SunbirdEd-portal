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
import { notificationList } from './in-app-notification.component.spec.data';

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
    navigate = jasmine.createSpy('navigate');
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

});
