import { LearnerService, IPageSection  } from '@sunbird/core';
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PageApiService } from './page-api.service';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '@sunbird/shared';
import {testData } from './page-api.service.spec.data';
describe('PageSectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PageApiService, ConfigService, LearnerService]
    });
  });
  it('should be created', inject([PageApiService, LearnerService], (service: PageApiService, learnerService: LearnerService) => {
    const param = {source: 'web', name: 'Resource'};
    spyOn(learnerService, 'post').and.callFake(() => Observable.of(testData.successData));
    const apiRes = service.getPageData(param);
    expect(service).toBeTruthy();
    expect(learnerService.post).toHaveBeenCalled();
  }));
});
