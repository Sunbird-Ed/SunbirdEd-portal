import { Injectable } from '@angular/core';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { LearnerService } from '@sunbird/core';
@Injectable()
export class ContentBadgeService {
  /**
   * reference of config service.
   */
  public config: ConfigService;
    /**
   * reference of lerner service.
   */
  public learner: LearnerService;
  /**
   * constructor
   * @param {ConfigService} config ConfigService reference
   * @param {LearnerService} learner LearnerService reference
   */
  constructor(config: ConfigService, learner: LearnerService) {
    this.config = config;
    this.learner = learner;
  }

  public addBadge(req) {
    const option = {
      url: this.config.urlConFig.URLS.BADGE.CREATE,
      data: { request: req }
    };
    return this.learner.post(option);
  }

}
