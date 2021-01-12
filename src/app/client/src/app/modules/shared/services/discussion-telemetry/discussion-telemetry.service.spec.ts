import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from './../../shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { NavigationHelperService } from './../navigation-helper/navigation-helper.service';
import { TestBed, inject } from '@angular/core/testing';

import { DiscussionTelemetryService } from './discussion-telemetry.service';

const event = {
  context: {
    env: 'discussion',
    cdata: [{id: '1', type: 'Category'}, {id: 'courseId', type: 'Course'}, {id: 'batchId', type: 'Batch'}]
  },
  edata: {
    id: 'category-card',
    type: 'CLICK',
    pageid: 'discussion'
  },
  object: {
    id: '1',
    type: 'Category',
    ver: '1',
    rollup: {}
  }
};

describe('DiscussionTelemetryService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [NavigationHelperService, TelemetryService],
    imports: [RouterTestingModule, SharedModule.forRoot(), HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: DiscussionTelemetryService = TestBed.get(DiscussionTelemetryService);
    expect(service).toBeTruthy();
  });

  xit ('should call impression()',  inject([DiscussionTelemetryService, TelemetryService, NavigationHelperService ],
    (service: DiscussionTelemetryService, telemetryService: TelemetryService, navigationHelperService: NavigationHelperService) => {
    spyOn(telemetryService, 'impression');
    spyOn(navigationHelperService, 'getPageLoadTime').and.returnValue(2.0);
    service.logTelemetryEvent({eid: 'IMPRESSION', context: {
      cdata: [{id: '1', type: 'Category'}], object: {id: '1', type: 'Category', ver: '1', rollup: {}}},
      edata: {id: 'category-card', type: 'view', pageid: 'discussion'}})
    event.edata['duration'] = 2.0;
    event.edata.type = 'view'
    expect(telemetryService.impression).toHaveBeenCalledWith(event);
    expect(navigationHelperService.getPageLoadTime).toHaveBeenCalled();
  }));

  it ('should call interact()', inject([DiscussionTelemetryService, TelemetryService ],
    (service: DiscussionTelemetryService, telemetryService: TelemetryService) => {
      spyOn(telemetryService, 'interact');
      event.edata.type = 'CLICK';
      delete event.edata['duration'];
      service.logTelemetryEvent({eid: 'INTERACT', context: {
        cdata: [{id: '1', type: 'Category'}], object: {id: '1', type: 'Category', ver: '1', rollup: {}}},
        edata: {id: 'category-card', type: 'CLICK', pageid: 'discussion'}})
      expect(telemetryService.interact).toHaveBeenCalledWith(event);
  }));


});
