import { Injectable } from '@angular/core';
import { DataService } from './../../core/services/data/data.service';
import { HttpClient } from '@angular/common/http';
import { ContentService } from '@sunbird/core';
import { ConfigService } from '@sunbird/shared';


@Injectable({
  providedIn: 'root'
})
export class ReviewCommentsService extends DataService {

  baseUrl: string;

  constructor( http: HttpClient, public contentService: ContentService,
  public config: ConfigService) {
    super(http);
    this.baseUrl = '/review-comments';
  }

  getThreadList (data) {
    const option = {
      url: '/v1/thread/list',
      data: data
    };
    return this.post(option);
  }

  createThread (data) {
    const option = {
      url: '/v1/thread/create',
      data: data
    };
    return this.post(option);
  }

  userSearch(requestParam) {
    const option = {
      url: this.config.urlConFig.URLS.ADMIN.USER_SEARCH,
      data: {
        request: requestParam
      }
    };
    return this.contentService.post(option);
  }
}
