import { Injectable, EventEmitter } from '@angular/core';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { LearnerService } from '@sunbird/core';
@Injectable()
export class ContentBadgeService {
  /**
   * An event emitter to emit dynamic data passed from a component.
   */
  badges: EventEmitter<any> = new EventEmitter();
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
  public setAssignBadge(badges) {
    this.badges.emit(badges);
  }
}
