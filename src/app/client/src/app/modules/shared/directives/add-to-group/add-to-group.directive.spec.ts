import { of } from 'rxjs';
import { TelemetryService } from '@sunbird/telemetry';
import { ConfigService, ResourceService, NavigationHelperService, ToasterService } from '@sunbird/shared';
import { AddToGroupDirective, csGroupServiceFactory } from './add-to-group.directive';
import { TestBed } from '@angular/core/testing';
import { HttpHandler } from '@angular/common/http';
import { CacheService } from 'ng2-cache-service';
import { BrowserCacheTtlService, UtilService } from '../../services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

describe('AddToGroupDirective', () => {
  let directive: AddToGroupDirective;

  const resourceBundle = {
    messages: {
      groups: {
        emsg: {
          m003: 'You have exceeded the maximum number of activities that can be added for the group',
        }
      },
      imsg: {
        activityAddedSuccess: 'Activity added successfully'
      }
    },

  };

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url: '/add-to-group';
  }

  const fakeActivatedRoute = {

  };

  const elementRefStub = { nativeElement: { 'lang': 'en', 'dir': 'ltr' } };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ ],
      providers: [
        HttpClientTestingModule,
        HttpHandler,
        CacheService,
        BrowserCacheTtlService,
        AddToGroupDirective,
        ConfigService,
        NavigationHelperService,
        UtilService,
        ToasterService,
        TelemetryService,
        { provide: ResourceService, useValue: resourceBundle },
        { provide: ElementRef, useValue: elementRefStub },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute},
        { provide: 'CS_GROUP_SERVICE', useFactory: csGroupServiceFactory}
      ]
    });
    directive = TestBed.get(AddToGroupDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should throw error while adding member to group', () => {
    const response = {
        'error': {
          'activities': [
            {
              'errorMessage': 'Exceeded the activity max size limit',
              'errorCode': 'EXCEEDED_ACTIVITY_MAX_LIMIT'
            }
          ]
      }
    };
    directive.groupAddableBlocData = {params: {groupData: {activities: [{id: '124'}]}}};
    directive.identifier = '123';
    spyOn(directive['csGroupService'], 'addActivities').and.returnValue(of (response));
    spyOn(directive, 'showErrorMsg');
    directive.addActivityToGroup();
    directive['csGroupService'].addActivities('', {activities: [{id: '', type: ''}]}).subscribe(data => {
      expect(directive.showErrorMsg).toHaveBeenCalledWith(resourceBundle.messages.groups.emsg.m003);
    });
  });

  it ('should throw error msg on EXCEEDED_ACTIVITY_MAX_LIMIT', () => {
    spyOn(directive.toasterService, 'error');
    directive.showErrorMsg(resourceBundle.messages.groups.emsg.m003);
    expect(directive.toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.groups.emsg.m003);
  });

});
