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
    cdata: [{id: '1', type: 'Category'}]
  },
  edata: {
    id: 'category-card',
    type: 'CLICK',
    pageId: 'discussion'
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

  it ('should call impression()',  inject([DiscussionTelemetryService, TelemetryService, NavigationHelperService ],
    (service: DiscussionTelemetryService, telemetryService: TelemetryService, navigationHelperService: NavigationHelperService) => {
    spyOn(telemetryService, 'impression');
    spyOn(navigationHelperService, 'getPageLoadTime').and.returnValue(2.0);
    service.generateImpressionObj({context: [{id: '1', type: 'Category'}], edata: {id: 'category-card', type: 'view', pageId: 'discussion'}})
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
      service.generateInteractObj({context: [{id: '1', type: 'Category'}], edata: {id: 'category-card', type: 'CLICK', pageId: 'discussion'}})
      expect(telemetryService.interact).toHaveBeenCalledWith(event);
  }));

});
