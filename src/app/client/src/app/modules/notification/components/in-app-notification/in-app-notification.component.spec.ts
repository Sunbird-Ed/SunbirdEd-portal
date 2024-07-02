import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationServiceImpl } from '../../services/notification/notification-service-impl';
import * as _ from 'lodash-es';
import { UserFeedStatus } from '@project-sunbird/client-services/models';
import { NotificationViewConfig } from '@project-sunbird/common-consumption';
import { ResourceService } from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';
import { takeUntil, delay } from 'rxjs/operators';
import { of } from 'rxjs';
import { ConnectionService } from '../../../shared/services/connection-service/connection.service';
import { InAppNotificationComponent } from './in-app-notification.component'

describe('InAppNotificationComponent', () => {
  let component: InAppNotificationComponent;
  const mockNotificationServiceImpl: Partial<NotificationServiceImpl> = {
    showNotificationModel$: jest.fn().mockReturnValue(of({ response: true }) as any) as any
  };
  const mockRouter: Partial<Router> = {
    events: of({ id: 1, url: 'sample-url' }) as any,
    navigate: jest.fn()
  };
  const mockResourceService: Partial<ResourceService> = {};
  const mockTelemetryService: Partial<TelemetryService> = {
    interact: jest.fn()
  };
  const mockActivatedRoute: Partial<ActivatedRoute> = {
    queryParams: of({})
  };
  const mockConnectionService: Partial<ConnectionService> = {
    monitor: jest.fn()
  };
  beforeAll(() => {
    component = new InAppNotificationComponent(
      mockNotificationServiceImpl as NotificationServiceImpl,
      mockRouter as Router,
      mockResourceService as ResourceService,
      mockTelemetryService as TelemetryService,
      mockActivatedRoute as ActivatedRoute,
      mockConnectionService as ConnectionService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be create a instance of component', () => {
    expect(component).toBeTruthy();
  });
  xit('should call ngOnInit', () => {
    jest.spyOn(mockConnectionService, 'monitor').mockReturnValue(of(true))
    jest.spyOn(component, 'fetchNotificationList');
    component.ngOnInit();
    expect(mockConnectionService.monitor).toHaveBeenCalled();
    expect(component.isConnected).toBeTruthy();
    expect(component.fetchNotificationList).toHaveBeenCalled();
  });
  describe("ngOnDestroy", () => {
    it('should destroy sub', () => {
      component.unsubscribe$ = {
        next: jest.fn(),
        complete: jest.fn()
      } as any;
      component.ngOnDestroy();
      expect(component.unsubscribe$.next).toHaveBeenCalled();
      expect(component.unsubscribe$.complete).toHaveBeenCalled();
    });
  });
  describe('handleShowMore', () => {
    it('should generate telemetry event on showmore event is true', () => {
      //  arrange
      const event = true;
      jest.spyOn(component, 'generateInteractEvent');
      // act
      component.handleShowMore(event);
      // assert
      expect(component.generateInteractEvent).toHaveBeenCalledWith('see-more');
    });

    it('should not generate telemetry event on showmore event is false', () => {
      //  arrange
      const event = false;
      jest.spyOn(component, 'generateInteractEvent');
      // act
      component.handleShowMore(event);
      // assert
      expect(component.generateInteractEvent).not.toHaveBeenCalledWith('see-more');
    });
  });
  describe('handleShowLess', () => {
    it('should generate telemetry event on showless event is true', () => {
      //  arrange
      const event = true;
      jest.spyOn(component, 'generateInteractEvent');
      // act
      component.handleShowLess(event);
      // assert
      expect(component.generateInteractEvent).toHaveBeenCalledWith('see-less');
    });

    it('should not generate telemetry event on showless event is false', () => {
      //  arrange
      const event = false;
      jest.spyOn(component, 'generateInteractEvent');
      // act
      component.handleShowLess(event);
      // assert
      expect(component.generateInteractEvent).not.toHaveBeenCalledWith('see-less');
    });
  });
  describe('toggleInAppNotifications', () => {
    it('should toggle ', () => {
      component.showNotificationModel = true;
      jest.spyOn(component, 'generateInteractEvent');
      component.toggleInAppNotifications();
      expect(component.generateInteractEvent).toHaveBeenCalled();
      expect(component.showNotificationModel).toBeFalsy();
    });
    it('should toggle ', () => {
      component.showNotificationModel = false;
      component.notificationList = [];
      component.toggleInAppNotifications();
    });
  });
});

