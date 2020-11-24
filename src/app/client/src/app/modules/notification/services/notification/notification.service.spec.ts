import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { SharedModule } from '@sunbird/shared';
import { NotificationService } from './notification.service';
import { of as observableOf, throwError as observableThrowError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule } from '@sunbird/core';

import { notificationData, notificationList } from './notification.service.spec.data';

describe('NotificationService', () => {
  configureTestSuite();

  const MockCSService = {
    getUserFeed() { return observableOf({}); },
    updateUserFeedEntry() { return observableOf({}); },
    deleteUserFeedEntry() { return observableOf({}); }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule],
      providers: [
        NotificationService,
        { provide: 'CS_USER_SERVICE', useValue: MockCSService }
      ]
    });
  });

  it('should be created', () => {
    const service: NotificationService = TestBed.get(NotificationService);
    expect(service).toBeTruthy();
  });

  describe('fetchInAppNotifications()', () => {

    it('should return the user feed notifications', async () => {
      // arrange
      const service: NotificationService = TestBed.get(NotificationService);
      const csUserService = TestBed.get('CS_USER_SERVICE');
      spyOn(csUserService, 'getUserFeed').and.returnValue(observableOf(notificationList));
      // act
      const resp = await service.fetchInAppNotifications();
      // assert
      expect(csUserService.getUserFeed).toHaveBeenCalled();
      expect(resp).toEqual([notificationData] as any);
    });

    it('should return empty array when an error is occured while fetching notificationList', async () => {
      // arrange
      const service: NotificationService = TestBed.get(NotificationService);
      const csUserService = TestBed.get('CS_USER_SERVICE');
      spyOn(csUserService, 'getUserFeed').and.returnValue(observableThrowError({ message: 'error' }));
      // act
      const resp = await service.fetchInAppNotifications();
      // assert
      expect(csUserService.getUserFeed).toHaveBeenCalled();
      expect(resp).toEqual([] as any);
    });

  });

  describe('updateNotificationRead()', () => {

    it('should return true when notification status is updated as read', async () => {
      // arrange
      const service: NotificationService = TestBed.get(NotificationService);
      const csUserService = TestBed.get('CS_USER_SERVICE');
      spyOn(csUserService, 'updateUserFeedEntry').and.returnValue(observableOf({message: 'success'}));
      // act
      const resp = await service.updateNotificationRead('notification_id');
      // assert
      expect(csUserService.updateUserFeedEntry).toHaveBeenCalled();
      expect(resp).toEqual(true);
    });

    it('should return false when an error is occured while updating', async () => {
      // arrange
      const service: NotificationService = TestBed.get(NotificationService);
      const csUserService = TestBed.get('CS_USER_SERVICE');
      spyOn(csUserService, 'updateUserFeedEntry').and.returnValue(observableThrowError({ message: 'error' }));
      // act
      const resp = await service.updateNotificationRead('notification_id');
      // assert
      expect(csUserService.updateUserFeedEntry).toHaveBeenCalled();
      expect(resp).toEqual(false);
    });

  });

  describe('deleteNotification()', () => {

    it('should return true when notification is deleted', async () => {
      // arrange
      const service: NotificationService = TestBed.get(NotificationService);
      const csUserService = TestBed.get('CS_USER_SERVICE');
      spyOn(csUserService, 'deleteUserFeedEntry').and.returnValue(observableOf({message: 'success'}));
      // act
      const resp = await service.deleteNotification('notification_id');
      // assert
      expect(csUserService.deleteUserFeedEntry).toHaveBeenCalled();
      expect(resp).toEqual(true);
    });

    it('should return false when an error is occured while deleting', async () => {
      // arrange
      const service: NotificationService = TestBed.get(NotificationService);
      const csUserService = TestBed.get('CS_USER_SERVICE');
      spyOn(csUserService, 'deleteUserFeedEntry').and.returnValue(observableThrowError({ message: 'error' }));
      // act
      const resp = await service.deleteNotification('notification_id');
      // assert
      expect(csUserService.deleteUserFeedEntry).toHaveBeenCalled();
      expect(resp).toEqual(false);
    });

  });

  describe('deleteAllNotifications()', () => {

    it('should return true when all notifications are deleted', async () => {
      // arrange
      const service: NotificationService = TestBed.get(NotificationService);
      const csUserService = TestBed.get('CS_USER_SERVICE');
      spyOn(csUserService, 'deleteUserFeedEntry').and.returnValue(observableOf({message: 'success'}));
      spyOn(service, 'deleteNotification').and.returnValue(true);
      // act
      const resp = await service.deleteAllNotifications(notificationList);
      // assert
      expect(service.deleteNotification).toHaveBeenCalled();
      expect(resp).toEqual(true);
    });

  });

});

