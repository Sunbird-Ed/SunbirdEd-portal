import { Injectable } from '@angular/core';
import { ConfigService } from '@sunbird/shared';
import { ExtPluginService } from '@sunbird/core';


@Injectable()
export class ReviewCommentsService {

  baseUrl: string;

  constructor(public configService: ConfigService, public extPluginService: ExtPluginService) {

  }
  private _contextDetails: any;
  getComments(data) {
    const option = {
      url: this.configService.urlConFig.URLS.REVIEW_COMMENT.READ,
      data: data
    };
    return this.extPluginService.post(option);
  }
  set contextDetails(contextDetails) {
    this._contextDetails = contextDetails;
  }
  get contextDetails() {
    return this._contextDetails;
  }
  createComment(data) {
    const option = {
      url: this.configService.urlConFig.URLS.REVIEW_COMMENT.CREATE,
      data: data
    };
    return this.extPluginService.post(option);
  }

  deleteComment(data) {
    const option = {
      url: this.configService.urlConFig.URLS.REVIEW_COMMENT.DELETE,
      data: data
    };
    return this.extPluginService.delete(option);
  }

}
