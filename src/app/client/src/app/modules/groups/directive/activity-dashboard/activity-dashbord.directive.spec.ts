import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivityDashboardService, SharedModule } from '@sunbird/shared';
import { ConfigService, NavigationHelperService, ResourceService, ToasterService, UtilService } from '@sunbird/shared';
import { TelemetryService, TelemetryModule } from '@sunbird/telemetry';
import { CacheService } from 'ng2-cache-service';
import { CoreModule } from '@sunbird/core';
import { GroupsModule } from '../../../groups';
import { GroupsService } from '../../services';
import { ActivityDashboardDirective } from './activity-dashbord.directive';

describe('ActivityDashboardDirective', () => {
  let directive: ActivityDashboardDirective;

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  class ActivatedRouteStub {
    snapshot = {
      data: {
        telemetry: {
          env: 'get', pageid: 'get', type: 'edit', subtype: 'paginate'
        },
      },
      params: {
        courseId: 'do_212347136096788480178'
      }
    };
  }


  const resourceBundleStub = {
    messages: {
        emsg: {
          m003: 'Something went wrong, please try again later',
        }
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
      imports: [RouterModule, SharedModule, HttpClientTestingModule, RouterTestingModule, TelemetryModule, CoreModule],
      providers: [ActivityDashboardDirective, ActivityDashboardService,
        ConfigService,
        NavigationHelperService,
        UtilService,
        ToasterService,
        TelemetryService,
        CacheService,
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: Router, useClass: RouterStub },
        { provide: ElementRef, useValue: elementRefStub },
        { provide: ResourceService, useValue: resourceBundleStub },],
      schemas: [NO_ERRORS_SCHEMA]
    });
    directive = TestBed.get(ActivityDashboardDirective);
  });

  it('should call addTelemetry', () => {
    const groupService = TestBed.get(GroupsService);
    spyOn(groupService, 'addTelemetry');
    directive.addTelemetry('activity-detail', [], { query: 'test' }, {});
    expect(groupService.addTelemetry).toHaveBeenCalledWith({ id: 'activity-detail', extra: { query: 'test' } },
      { data: Object({ telemetry: Object({ env: 'get', pageid: 'get', type: 'edit', subtype: 'paginate' }) }), params: Object({ courseId: 'do_212347136096788480178' }) }, [], undefined, {});
  });

  it('should call navigateToActivityDashboard()', () => {
    directive.hierarchyData = { identifier: '123', primaryCategory: 'Course' }
    spyOn(directive, 'addTelemetry').and.stub();
    directive.navigateToActivityDashboard();
    expect(directive.addTelemetry).toHaveBeenCalled();
    expect(directive['router'].navigate).toHaveBeenCalledWith(['my-groups/group-details', undefined, 'activity-dashboard', '123'],
      {
        state: {
          hierarchyData: { identifier: '123', primaryCategory: 'Course' },
        }
      });
  });
});

