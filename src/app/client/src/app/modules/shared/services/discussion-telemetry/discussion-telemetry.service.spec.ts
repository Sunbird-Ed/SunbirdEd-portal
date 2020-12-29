import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from './../../shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { NavigationHelperService } from './../navigation-helper/navigation-helper.service';
import { TestBed } from '@angular/core/testing';

import { DiscussionTelemetryService } from './discussion-telemetry.service';

describe('DiscussionTelemetryService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [NavigationHelperService, TelemetryService],
    imports: [RouterTestingModule, SharedModule.forRoot(), HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: DiscussionTelemetryService = TestBed.get(DiscussionTelemetryService);
    expect(service).toBeTruthy();
  });
});
