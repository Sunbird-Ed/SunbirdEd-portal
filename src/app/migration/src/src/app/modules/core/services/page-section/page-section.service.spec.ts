import { LearnerService } from '@sunbird/core';
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PageSectionService } from './page-section.service';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '@sunbird/shared';
import { IPageSection } from './../../interfaces/index';
import * as testData from './page-section.service.spec.data';
const mockRes = testData.mockRes;
describe('PageSectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PageSectionService, ConfigService, LearnerService]
    });
  });

  it('should be created', inject([PageSectionService], (service: PageSectionService) => {
    expect(service).toBeTruthy();
  }));

  it('should be created', inject([PageSectionService, LearnerService], (service: PageSectionService, learnerService: LearnerService) => {
    const param = {source: 'web', name: 'Resource'};
    spyOn(learnerService, 'post').and.callFake(() => Observable.of(mockRes.successData));
    const apiRes = service.getPageData(param);
    expect(service).toBeTruthy();
    expect(learnerService.post).toHaveBeenCalled();
  }));
});
