import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { InAppNotificationComponent } from './in-app-notification.component';

import { configureTestSuite } from '@sunbird/test-util';
import { SuiModalModule, SuiModule } from 'ng2-semantic-ui';
import { SharedModule, ResourceService, ConnectionService } from '@sunbird/shared';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { NotificationServiceImpl } from '../../services/notification/notification-service-impl';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption-v8';
import { of as observableOf, of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { notificationList } from './in-app-notification.component.spec.data';
import { SbNotificationModule } from 'sb-notification';

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

  const MockNotificationServiceImpl = {
    fetchNotificationList() { return {} as any },
    handleNotificationClick() {},
    deleteNotification() { return false },
    clearAllNotifications() { return false },
    showNotificationModel$: observableOf(true),
    notificationList$: observableOf([]),
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InAppNotificationComponent],
      imports: [SuiModule, SuiModalModule, SharedModule.forRoot(), CommonConsumptionModule, HttpClientTestingModule, TelemetryModule.forRoot(), SbNotificationModule],
      providers: [
        NotificationServiceImpl,
        { provide: 'SB_NOTIFICATION_SERVICE', useValue: MockNotificationServiceImpl},
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

  it('should call ngOnInit', fakeAsync(() => {
    const connectionService = TestBed.get(ConnectionService);
    spyOn(connectionService, 'monitor').and.returnValue(of(true));
    spyOn(component, 'fetchNotificationList');
    component.ngOnInit();
    tick(2001);
    expect(connectionService.monitor).toHaveBeenCalled();
    expect(component.isConnected).toBeTruthy();
    expect(component.fetchNotificationList).toHaveBeenCalled();
  }));

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

  });

  describe('fetchNotificationList', () => {


    it('should fetch the notification list and get unread notification count', (done) => {
      // arrange
      const notificationService: NotificationServiceImpl = TestBed.get(NotificationServiceImpl);
      notificationService.showNotificationModel$.next(false);
      notificationService.notificationList$.next(notificationList);
      // act
      component.fetchNotificationList();
      // assert
      notificationService.notificationList$.subscribe(data => {
        expect(component.notificationCount).toEqual(0);
        done();
      })
    });

    it('should fetch the notification list and the list is empty', (done) => {
      // arrange
      const notificationService: NotificationServiceImpl = TestBed.get(NotificationServiceImpl);
      notificationService.showNotificationModel$.next(true);
      notificationService.notificationList$.next([]);
      // act
      component.fetchNotificationList();
      // assert
      notificationService.notificationList$.subscribe(data => {
        expect(component.notificationCount).toEqual(0);
        done()
      })
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

  describe('handleShowMore', async () => {
    it('should generate telemetry event on showmore event is true', async () => {
      //  arrange
      const event = true;
      spyOn(component, 'generateInteractEvent');
      // act
      await component.handleShowMore(event);
      // assert
      expect(component.generateInteractEvent).toHaveBeenCalledWith('see-more');
    });

    it('should not generate telemetry event on showmore event is false', async () => {
      //  arrange
      const event = false;
      spyOn(component, 'generateInteractEvent');
      // act
      await component.handleShowMore(event);
      // assert
      expect(component.generateInteractEvent).not.toHaveBeenCalledWith('see-more');
    });
  });

  describe('handleShowLess', async () => {
    it('should generate telemetry event on showless event is true', async () => {
      //  arrange
      const event = true;
      spyOn(component, 'generateInteractEvent');
      // act
      await component.handleShowLess(event);
      // assert
      expect(component.generateInteractEvent).toHaveBeenCalledWith('see-less');
    });

    it('should not generate telemetry event on showless event is false', async () => {
      //  arrange
      const event = false;
      spyOn(component, 'generateInteractEvent');
      // act
      await component.handleShowLess(event);
      // assert
      expect(component.generateInteractEvent).not.toHaveBeenCalledWith('see-less');
    });
  });


});
