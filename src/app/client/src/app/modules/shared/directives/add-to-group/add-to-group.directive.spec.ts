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
import { AddToGroupDirectiveMockData } from './add-to-group.directive.spec.data';
import { of as observableOf, throwError } from 'rxjs';
import * as _ from 'lodash-es';
import { configureTestSuite } from '@sunbird/test-util';
import { CsGroupAddableBloc } from '@project-sunbird/client-services/blocs';

describe('AddToGroupDirective', () => {
  let directive: AddToGroupDirective;
  configureTestSuite();

  const resourceBundleStub = {
    messages: {
      groups: {
        emsg: {
          m003: 'You have exceeded the maximum number of activities that can be added for the group',
        }
      },
      imsg: {
        activityAddedSuccess: 'Activity added successfully'
      },
      emsg: {
        activityAddedToGroup: 'You have added this activity previously for the group',
        noAdminRole: 'You are not authorised to add activities'
      },
      stmsg: {
        activityAddFail: 'Could not add the activity. Try again later'
      }
    }
  };

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url: '/add-to-group';
  }

  const fakeActivatedRoute = {
    snapshot : {
      params: {groupId: '123'}
    }
  };

  const elementRefStub = {
    nativeElement: {
      'lang': 'en',
      'dir': 'ltr',
      style: {
        display: 'none'
      }
    }
  };

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
        { provide: ResourceService, useValue: resourceBundleStub },
        { provide: ElementRef, useValue: elementRefStub },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: 'CS_GROUP_SERVICE', useFactory: csGroupServiceFactory }
      ]
    });
    directive = TestBed.get(AddToGroupDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should not add activity to the group if it is already been added', () => {
    /** Arrange */
    const toasterService = TestBed.get(ToasterService);
    directive.identifier = 'do_1130958935577886721105';
    spyOn(directive, 'sendInteractData').and.stub();
    directive.groupAddableBlocData = {
      pageIds: ['course'],
      groupId: ['SOME_GROUP_ID'],
      params: {
        searchQuery: '{"request":{"filters":{"contentType":["Course"],"status":["Live"],"objectType":["Content"]}}}',
        groupData: AddToGroupDirectiveMockData.groupData,
        contentType: 'Course'
      }
    };
    spyOn(directive, 'goBack').and.stub();
    spyOn(toasterService, 'error').and.stub();

    /** Act */
    directive.addActivityToGroup();

    /** Assert */
    expect(directive.sendInteractData).toHaveBeenCalled();
    expect(directive.goBack).toHaveBeenCalled();
    expect(toasterService.error).toHaveBeenCalledWith('You have added this activity previously for the group');
  });

  it('should add activity to the group if it is not added', () => {
    /** Arrange */
    const toasterService = TestBed.get(ToasterService);
    directive.identifier = 'do_12345';
    spyOn(directive, 'sendInteractData').and.stub();
    directive.groupAddableBlocData = {
      pageIds: ['course'],
      groupId: ['SOME_GROUP_ID'],
      params: {
        searchQuery: '{"request":{"filters":{"contentType":["Course"],"status":["Live"],"objectType":["Content"]}}}',
        groupData: AddToGroupDirectiveMockData.groupData,
        contentType: 'Course'
      }
    };
    spyOn(directive, 'goBack').and.stub();
    spyOn(directive['csGroupService'], 'addActivities').and.returnValue(observableOf({}));
    spyOn(toasterService, 'success').and.stub();

    /** Act */
    directive.addActivityToGroup();

    /** Assert */
    expect(directive.sendInteractData).toHaveBeenCalled();
    expect(directive.goBack).toHaveBeenCalled();
    expect(toasterService.success).toHaveBeenCalledWith('Activity added successfully');
  });

  it('should show a toaster message if add activity api fail', () => {
    /** Arrange */
    const toasterService = TestBed.get(ToasterService);
    directive.identifier = 'do_12345';
    spyOn(directive, 'sendInteractData').and.stub();
    directive.groupAddableBlocData = {
      pageIds: ['course'],
      groupId: ['SOME_GROUP_ID'],
      params: {
        searchQuery: '{"request":{"filters":{"contentType":["Course"],"status":["Live"],"objectType":["Content"]}}}',
        groupData: AddToGroupDirectiveMockData.groupData,
        contentType: 'Course'
      }
    };
    spyOn(directive, 'goBack').and.stub();
    spyOn(directive['csGroupService'], 'addActivities').and.callFake(() => throwError({}));
    spyOn(toasterService, 'error').and.stub();

    /** Act */
    directive.addActivityToGroup();

    /** Assert */
    expect(directive.sendInteractData).toHaveBeenCalled();
    expect(directive.goBack).toHaveBeenCalled();
    expect(toasterService.error).toHaveBeenCalledWith('Could not add the activity. Try again later');
  });

  it('should navigate to last url', () => {
    /** Arrange*/
    const navigationHelperService = TestBed.get(NavigationHelperService);
    spyOn(navigationHelperService, 'navigateToLastUrl').and.stub();

    /** Act */
    directive.goBack();

    /** Assert */
    expect(navigationHelperService.navigateToLastUrl).toHaveBeenCalled();
  });

  it('should send interact data', () => {
    /** Arrange */
    const telemetryService = TestBed.get(TelemetryService);
    directive.groupAddableBlocData = {
      pageIds: ['course'],
      groupId: ['SOME_GROUP_ID'],
      params: {
        searchQuery: '{"request":{"filters":{"contentType":["Course"],"status":["Live"],"objectType":["Content"]}}}',
        groupData: AddToGroupDirectiveMockData.groupData,
        contentType: 'Course'
      }
    };
    directive.identifier = 'do_12345';
    directive.pageId = 'course';
    const telemetryData = {
      context: {
        env: 'groups',
        cdata: [{
          type: 'Group',
          id: '123'
        },
        {
          type: 'Activity',
          id: 'do_12345',
        }
      ]
      },
      edata: {
        id: 'add-to-group-button',
        type: 'select-activity',
        pageid: directive.pageId
      },
      object: {
        type: _.get(directive.groupAddableBlocData, 'params.contentType'),
        id: directive.identifier,
        ver: '1.0'
      }
    };
    spyOn(telemetryService, 'interact');

    /** Act */
    directive.sendInteractData('add-to-group-button', {type: 'select-activity'});

    /** Assert */
    expect(telemetryService.interact).toHaveBeenCalledWith(telemetryData);
  });

  it('should show the "Add to group button" if state has been set previously for a particular content type', () => {
    /** Arrange */
    const stateData = {
      pageIds: ['course'],
      groupId: ['SOME_GROUP_ID'],
      params: {
        searchQuery: '{"request":{"filters":{"contentType":["Course"],"status":["Live"],"objectType":["Content"]}}}',
        groupData: AddToGroupDirectiveMockData.groupData,
        contentType: 'Course'
      }
    };
    directive['ref'] = TestBed.get(ElementRef);
    directive.pageId = 'course';
    spyOnProperty<any>(CsGroupAddableBloc.instance, 'initialised').and.returnValue(true);
    spyOnProperty<any>(CsGroupAddableBloc.instance, 'state$').and.returnValue(observableOf(stateData));

    /** Act */
    directive.ngOnInit();

    /** Assert */
    expect(directive['ref'].nativeElement.style.display).toEqual('block');
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
      expect(directive.showErrorMsg).toHaveBeenCalledWith(resourceBundleStub.messages.groups.emsg.m003);
    });
  });

  it ('should throw error msg on EXCEEDED_ACTIVITY_MAX_LIMIT', () => {
    spyOn(directive.toasterService, 'error');
    directive.showErrorMsg(resourceBundleStub.messages.groups.emsg.m003);
    expect(directive.toasterService.error).toHaveBeenCalledWith(resourceBundleStub.messages.groups.emsg.m003);
  });
});
