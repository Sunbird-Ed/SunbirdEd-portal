import { Injectable, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { ContentService } from '@sunbird/core';
import { DeleteParam } from './../interfaces/delteparam';

@Injectable()
export class WorkSpaceService {
  /**
  * reference of config service.
  */
  public config: ConfigService;

  /**
   * Reference of content service.
  */
  public content: ContentService;

  /**
    * Constructor - default method of AnnouncementService class
    *
    * @param {ConfigService} config ConfigService reference
    * @param {HttpClient} http HttpClient reference
  */
  constructor(config: ConfigService, content: ContentService) {
    this.content = content;
    this.config = config;
  }
  deleteContent(requestParam: DeleteParam): Observable<ServerResponse> {
    const option = {
      url: this.config.urlConFig.URLS.CONTENT.RETIRE,
      data: {
        'request': {
          'contentIds': requestParam.contentIds
        }
      }
    };
    return this.content.delete(option);
  }

}
