import { TestBed } from '@angular/core/testing';
import { FrameworkService, UserService, CoreModule, PublicDataService } from '@sunbird/core';
import { ContentSearchService } from './content-search.service';
import { SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { configureTestSuite } from '@sunbird/test-util';

describe('ContentSearchService', () => {
  configureTestSuite();
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule, RouterModule.forRoot([])],
  }));

  it('should be created', () => {
    const contentSearchService: ContentSearchService = TestBed.get(ContentSearchService);
    expect(contentSearchService).toBeTruthy();
  });
  it('should be  call initialize', () => {
    const contentSearchService: ContentSearchService = TestBed.get(ContentSearchService);
    const mockData = { channelId: '01285019302823526477', custodianOrg: false, defaultBoard: 'CBSE' };
    spyOn(contentSearchService, 'initialize');
    contentSearchService.initialize(mockData.channelId, mockData.custodianOrg, mockData.defaultBoard);
    expect(contentSearchService.initialize).toHaveBeenCalledWith(mockData.channelId, mockData.custodianOrg, mockData.defaultBoard);
  });
  it('should be  call fetchFilter', () => {
    const contentSearchService: ContentSearchService = TestBed.get(ContentSearchService);
    spyOn(contentSearchService, 'fetchFilter');
    contentSearchService.fetchFilter();
    expect(contentSearchService.fetchFilter).toHaveBeenCalled();
  });

  it('should map categories to new keys', () => {
    const input = { subject: [], medium: [], gradeLevel: [], board: [], contentType: 'course' };
    const contentSearchService: ContentSearchService = TestBed.get(ContentSearchService);
    const result = contentSearchService.mapCategories({ filters: input });
    expect(result).toEqual({ se_subjects: [], se_mediums: [], se_gradeLevels: [], se_boards: [], contentType: 'course' });
  });

});
