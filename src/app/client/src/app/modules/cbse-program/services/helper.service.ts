import { Injectable } from '@angular/core';
import { ConfigService, ToasterService, ServerResponse, ResourceService } from '@sunbird/shared';
import { ContentService, ActionService, PublicDataService } from '@sunbird/core';
import { throwError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as _ from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private configService: ConfigService, private contentService: ContentService,
    private toasterService: ToasterService, private publicDataService: PublicDataService,
    private actionService: ActionService) { }

    getLicences(): Observable<any> {
      const req = {
        url: `${this.configService.urlConFig.URLS.COMPOSITE.SEARCH}`,
        data: {
            'request': {
                'filters': {
                    'objectType': 'license',
                    'status': ['Live']
            }
          }
        }
      };
      return this.contentService.post(req).pipe(map((res) => {
        return res.result;
      }), catchError( err => {
        const errInfo = { errorMsg: 'search failed' };
        return throwError(this.apiErrorHandling(err, errInfo));
      }));
  }

  updateContent(req, contentId): Observable<ServerResponse> {
    const option = {
      url: this.configService.urlConFig.URLS.CONTENT.UPDATE + '/' + contentId,
      data: {
        'request': req
      }
    };
    return this.actionService.patch(option);
  }

  reviewContent(contentId): Observable<ServerResponse>  {
    const option = {
      url: this.configService.urlConFig.URLS.CONTENT.REVIEW + '/' + contentId,
      data: {
        'request': {
          'content': {}
        }
      }
    };
    return this.actionService.post(option);
  }

  publishContent(contentId, userId) {
    const requestBody = {
      request: {
        content: {
          lastPublishedBy: userId
        }
      }
    };
    const option = {
      url: `${this.configService.urlConFig.URLS.CONTENT.PUBLISH}/${contentId}`,
      data: requestBody
    };
    return this.contentService.post(option);
  }

  submitRequestChanges(contentId, comment) {
    const requestBody = {
      request: {
        content: {
          rejectComment: _.trim(comment)
        }
      }
    };
    const option = {
      url: `${this.configService.urlConFig.URLS.CONTENT.REJECT}/${contentId}`,
      data: requestBody
    };
    return this.contentService.post(option);
  }

  apiErrorHandling(err, errorInfo) {
    this.toasterService.error(_.get(err, 'error.params.errmsg') || errorInfo.errorMsg);
  }
}
