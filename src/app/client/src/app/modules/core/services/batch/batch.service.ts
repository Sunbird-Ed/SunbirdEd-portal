import { Injectable } from '@angular/core';
import { SearchService } from './../search/search.service';
@Injectable()
export class BatchService {

  constructor(public searchService: SearchService) { }
  getBatchDetails(searchParams) {
    return this.searchService.batchSearch(searchParams);
  }
  getUserDetails(searchParams) {
    return this.searchService.getUserList(searchParams);
  }
}
