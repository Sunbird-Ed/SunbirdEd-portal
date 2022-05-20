import { TestBed, inject } from '@angular/core/testing';

import { ChannelService } from './channel.service';
import {of as observableOf, throwError } from 'rxjs';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { serverRes } from './channel.service.spec.data';
import { PublicDataService } from './../public-data/public-data.service';
import { configureTestSuite } from '@sunbird/test-util';

// NEW xdescribe
xdescribe('ChannelService', () => {
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule, SharedModule.forRoot()],
      providers: [ChannelService]
    });
  });

  it('should be created', inject([ChannelService], (service: ChannelService) => {
    expect(service).toBeTruthy();
  }));
  it('Get a channel data', () => {
    const service = TestBed.inject(ChannelService);
    const publicDataService = TestBed.inject(PublicDataService);
    spyOn(publicDataService, 'post').and.callFake(() => observableOf(serverRes.successData));
    service.getFrameWork('01246944855007232011').subscribe(
      (apiResponse:any) => {
        expect(apiResponse).toBe(serverRes.successData.result.channel);
      }
    );
  });
  it(' should throw error Get a channel data', () => {
    const service = TestBed.inject(ChannelService);
    const publicDataService = TestBed.inject(PublicDataService);
    spyOn(publicDataService, 'post').and.callFake(() => throwError({}));
    service.getFrameWork('01246944855007232011').subscribe(
      (apiResponse:any) => {
        expect(apiResponse).toBe(serverRes.noResultData);
      }
    );
  });
});
