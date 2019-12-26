import { Injectable } from '@angular/core';
import { ConfigService, ToasterService } from '@sunbird/shared';
import { ContentService, ActionService } from '@sunbird/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as _ from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class ItemsetService {

  constructor(private configService: ConfigService, private contentService: ContentService,
    private toasterService: ToasterService, private actionService: ActionService) { }

  createItemset(itemset) {
    const requestBody = {
      request: {
        itemset: itemset
      }
    };
    const option = {
      url: `${this.configService.urlConFig.URLS.ITEMSET.CREATE}`,
      data: requestBody
    };

    return this.actionService.post(option).pipe(map((res: any) => {
      return res.result;
    }), catchError( err => {
      const errInfo = { errorMsg: 'Itemset creation failed' };
      return throwError(this.apiErrorHandling(err, errInfo));
    }));
  }

  updateItemset(itemset, itemSetIdentifier) {
    const requestBody = {
      request: {
        itemset: itemset
      }
    };
    const option = {
      url: `${this.configService.urlConFig.URLS.ITEMSET.UPDATE}/${itemSetIdentifier}`,
      data: requestBody
    };

    return this.actionService.patch(option).pipe(map((res: any) => {
      return res.result;
    }), catchError( err => {
      const errInfo = { errorMsg: 'Itemset updation failed' };
      return throwError(this.apiErrorHandling(err, errInfo));
    }));
  }

  readItemset(itemSetIdentifier) {
    const option = {
      url: `${this.configService.urlConFig.URLS.ITEMSET.READ}/${itemSetIdentifier}`,
    };

    return this.actionService.get(option).pipe(map((res: any) => {
      return res.result;
    }), catchError( err => {
      const errInfo = { errorMsg: 'Itemset read failed' };
      return throwError(this.apiErrorHandling(err, errInfo));
    }));
  }

  reviewItemset(itemSetIdentifier) {
    const option = {
      url: `${this.configService.urlConFig.URLS.ITEMSET.REVIEW}/${itemSetIdentifier}`,
    };

    return this.actionService.get(option).pipe(map((res: any) => {
      return res.result;
    }), catchError( err => {
      const errInfo = { errorMsg: 'Itemset review failed' };
      return throwError(this.apiErrorHandling(err, errInfo));
    }));
  }

  apiErrorHandling(err, errorInfo) {
    this.toasterService.error(_.get(err, 'error.params.errmsg') || errorInfo.errorMsg);
  }
}
