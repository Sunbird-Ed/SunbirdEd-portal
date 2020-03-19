import { TestBed } from '@angular/core/testing';
import { FrameworkService, UserService, CoreModule, PublicDataService } from '@sunbird/core';
import { ContentSearchService } from './content-search.service';
import { SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule, ActivatedRoute } from '@angular/router';

describe('ContentSearchService', () => {
  beforeEach(() =>  TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule, RouterModule.forRoot([])],
  }));

  it('should be created', () => {
    const service: ContentSearchService = TestBed.get(ContentSearchService);
    expect(service).toBeTruthy();
  });
});
