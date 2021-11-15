import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { SharedModule } from '@sunbird/shared';
import { NotificationServiceImpl } from './notification-service-impl';
import { of as observableOf, throwError as observableThrowError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule } from '@sunbird/core';
import { SbNotificationModule } from 'sb-notification';
import { notificationData, notificationList } from './notification-service-impl.spec.data';
import { RouterTestingModule } from '@angular/router/testing';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';

describe('NotificationServiceImpl', () => {
  configureTestSuite();

  const MockCSNotificationService = {
    notificationRead() { return observableOf({}); },
    notificationDelete() { return observableOf({}); },
    notificationUpdate() { return observableOf({}); }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule, SbNotificationModule, RouterTestingModule, TelemetryModule.forRoot()],
      providers: [ {provide: 'CS_NOTIFICATION_SERVICE', useValue: MockCSNotificationService }]
    });
  });

  it('should create NotificationServiceImpl', () => {
    const service: NotificationServiceImpl = TestBed.get(NotificationServiceImpl);
    expect(service).toBeTruthy();
  });

  describe('fetchNotificationList()', () => {

    it('should return the user feed notifications', async () => {
      // arrange
      const service: NotificationServiceImpl = TestBed.get(NotificationServiceImpl);
     
      spyOn(service['NotificationCsService'], 'notificationRead').and.returnValue(observableOf(notificationData));
      // act
      const resp = await service.fetchNotificationList();
      // assert
      expect(service['NotificationCsService'].notificationRead).toHaveBeenCalled();
    });

    it('should return empty array when an error is occured while fetching notificationList', async () => {
      // arrange
      const service: NotificationServiceImpl = TestBed.get(NotificationServiceImpl);
     
      spyOn(service['NotificationCsService'], 'notificationRead').and.returnValue(observableThrowError({ message: 'error' }));
      // act
      const resp = await service.fetchNotificationList();
      // assert
      expect(service['NotificationCsService'].notificationRead).toHaveBeenCalled();
      expect(resp).toEqual([] as any);
    });

    it('should return empty array if the getuserfeed does not return array', async () => {
      // arrange
      const service: NotificationServiceImpl = TestBed.get(NotificationServiceImpl);
     
      spyOn(service['NotificationCsService'], 'notificationRead').and.returnValue(observableOf({}));
      // act
      const resp = await service.fetchNotificationList();
      // assert
      expect(service['NotificationCsService'].notificationRead).toHaveBeenCalled();
      expect(resp).toEqual([] as any);
    });

  });

  describe('handleNotificationClick', () => {
    it('should return false if the notification data is empty', async () => {
      // arrage
      const service: NotificationServiceImpl = TestBed.get(NotificationServiceImpl);
      const data = {
        // data: notificationData
      };
      // act
      const resp = await service.handleNotificationClick(data);
      // assert
      expect(resp).toEqual(false);
    });

    it('if the notification data is not empty', async () => {
      // arrage
      const service: NotificationServiceImpl = TestBed.get(NotificationServiceImpl);
      spyOn(service, 'markNotificationAsRead').and.returnValue(observableOf({}));
      notificationData.action.type = 'member-added';
      // act
      await service.handleNotificationClick(notificationData);
      // assert
      expect(service.markNotificationAsRead).toHaveBeenCalled();
    });
  });

  describe('deleteNotification()', () => {

    it('should return false when notification data is empty', async () => {
      // arrange
      const data = {};
      const service: NotificationServiceImpl = TestBed.get(NotificationServiceImpl);
      // act
      const resp = await service.deleteNotification(data);
      // assert
      expect(resp).toEqual(false);
    });

    it('should delete the notification and return true', async () => {
      // arrange
      const data = {
        data: notificationData
      };
      const service: NotificationServiceImpl = TestBed.get(NotificationServiceImpl);
     
      const telemertyService = TestBed.get(TelemetryService);
      spyOn(telemertyService, 'interact');
      spyOn(service['NotificationCsService'], 'notificationDelete').and.returnValue(observableOf({ message: 'success' }));
      spyOn(service, 'fetchNotificationList');
      // act
      const resp = await service.deleteNotification(data);
      // assert
      expect(telemertyService.interact).toHaveBeenCalled();
      expect(service['NotificationCsService'].notificationDelete).toHaveBeenCalled();
      expect(service.fetchNotificationList).toHaveBeenCalled();
      expect(resp).toEqual(true);
    });

    it('should return false when an error is occured while deleting', async () => {
      // arrange
      const data = {
        data: notificationData
      };
      const service: NotificationServiceImpl = TestBed.get(NotificationServiceImpl);
     
      const telemertyService = TestBed.get(TelemetryService);
      spyOn(telemertyService, 'interact');
      spyOn(service['NotificationCsService'], 'notificationDelete').and.returnValue(observableThrowError({ message: 'error' }));
      spyOn(service, 'fetchNotificationList');
      // act
      const resp = await service.deleteNotification(data);
      // assert
      expect(resp).toEqual(false);
    });

  });

  describe('clearAllNotifications()', () => {

    it('should return false if the notification list is empty', async () => {
      // arrange
      const service: NotificationServiceImpl = TestBed.get(NotificationServiceImpl);
     
      const telemertyService = TestBed.get(TelemetryService);
      spyOn(telemertyService, 'interact');
      spyOn(service['NotificationCsService'], 'notificationDelete').and.returnValue(observableOf({message: 'success'}));
      spyOn(service, 'deleteNotification').and.returnValue(true);
      // act
      const resp = await service.clearAllNotifications({data: []});
      // assert
      expect(resp).toEqual(false);
    });

    it('should return true when all notifications are deleted', async () => {
      // arrange
      const service: NotificationServiceImpl = TestBed.get(NotificationServiceImpl);
     
      const telemertyService = TestBed.get(TelemetryService);
      spyOn(telemertyService, 'interact');
      spyOn(service['NotificationCsService'], 'notificationDelete').and.returnValue(observableOf({message: 'success'}));
      // act
      const resp = await service.clearAllNotifications({data: notificationList});
      // assert
      expect(resp).toEqual(true);
    });

    it('should return true when all notifications are deleted', async () => {
      // arrange
      const service: NotificationServiceImpl = TestBed.get(NotificationServiceImpl);
     
      const telemertyService = TestBed.get(TelemetryService);
      spyOn(telemertyService, 'interact');
      spyOn(service['NotificationCsService'], 'notificationDelete').and.returnValue(observableThrowError({ message: 'error' }));
      // act
      const resp = await service.clearAllNotifications({data: notificationList});
      // assert
      expect(resp).toEqual(true);
    });

  });
  describe('getNavigationPath()', async() => {
    it ('should call getNavigationPath()', async () => {
      const service: NotificationServiceImpl = TestBed.get(NotificationServiceImpl);

      const resp = await service.getNavigationPath({data: notificationData});

      expect(resp).toEqual({ path: 'my-groups/group-details/2ae1e555-b9cc-4510-9c1d-2f90e94ded90'});
    })

    it ('should fail call getNavigationPath()', async () => {
      const service: NotificationServiceImpl = TestBed.get(NotificationServiceImpl);

      const resp = await service.getNavigationPath({data: {action: {additionalInfo: {}}} });

      expect(resp).toEqual({});
    })
  });

});