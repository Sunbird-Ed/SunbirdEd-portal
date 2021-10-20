import { TestBed } from '@angular/core/testing';
import { PlayerService } from '@sunbird/core';
import { of } from 'rxjs';
import { notificationData } from './group-notification-wrapper.spec.data';

import { GroupNotificationWrapperService } from './group-notification-wrapper.service';
import { ConfigService, ResourceService, ToasterService, SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';

describe('GroupNotificationWrapperService', () => {
  let service: GroupNotificationWrapperService;

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ SharedModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      providers: [PlayerService, GroupNotificationWrapperService, ConfigService, ResourceService, ToasterService,
        { provide: ResourceService, useValue: resourceBundle },
        { provide: APP_BASE_HREF, useValue: '/' },
      ]
    });
    service = TestBed.inject(GroupNotificationWrapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('should call navigateToActivityToc()', () => {
  //   const service = TestBed.get(GroupNotificationWrapperService);
  //   const playerService = TestBed.get(PlayerService);
  //   spyOn(service, 'getGroupById').and.returnValue(of());
  //   spyOn(service, 'groupContentsByActivityType').and.returnValue({showList:  true});
  //   spyOn(playerService, 'playContent');
  //   service.navigateToActivityToc('123', true, true, true);
  //   service.getGroupById('123', true, true, true).subscribe((data: CsGroup) => {
  //     expect(service.groupContentsByActivityType).toHaveBeenCalledWith(false,
  //       {id: '123', name: 'groupName', members: [], createdBy: '1', isCreator: false, isAdmin: false, initial: 'g',
  //       description: '', membershipType: 'invite_only'});
  //     expect(playerService.playContent).toHaveBeenCalled();
  //   });
  // });

  // it('should call navigateNotification()', () => {
  //   const service = TestBed.get(GroupNotificationWrapperService);
  //   const additionalInfo = notificationData.action.additionalInfo;
  //   const accepted = service.navigateNotification(notificationData, additionalInfo);
  //   expect(accepted).toEqual({ path: 'my-groups/group-details/2ae1e555-b9cc-4510-9c1d-2f90e94ded90' });
  // });
});
