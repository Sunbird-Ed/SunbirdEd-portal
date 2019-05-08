import { Injectable, EventEmitter } from '@angular/core';
import { ServerResponse, ConfigService } from '@sunbird/shared';
import { LearnerService } from '@sunbird/core';
// Rxjs
import { Observable } from 'rxjs';


import * as _ from 'lodash-es';

/**
 * Service to get course progress dashboard
 *
 * It responsible to make http call
 */
@Injectable()

/**
 * @class CourseProgressService
 */
export class CourseProgressService {

  /**
   * To get api urls
   */
  public config: ConfigService;

  constructor(private learnerService: LearnerService,
    config: ConfigService) {
    this.config = config;
  }

  /**
   * To method calls the batch list API
   */
  getBatches(requestParam) {
    const option = {
      url: this.config.urlConFig.URLS.BATCH.GET_BATCHS,
      data: {
        'request': {
          'filters': {
            'courseId': requestParam.courseId,
            'status': requestParam.status,
            'createdBy': requestParam.createdBy,
            'mentors': requestParam.mentors
          },
          'sort_by': { 'createdDate': 'desc' }
        }
      }
    };
    return this.learnerService.post(option);
  }

  /**
   * To method calls the get dashboard API
   */
  getDashboardData(requestParam) {
    const option = {
      url: this.config.urlConFig.URLS.DASHBOARD.COURSE_PROGRESS_V2 + '/' + requestParam.batchIdentifier,
      param: {
        limit: requestParam.limit,
        offset: requestParam.offset,
      }
    };
    if ( _.get(requestParam, 'sortBy')) {
      option.param['sortBy'] = requestParam.sortBy;
      option.param['sortOrder'] = requestParam.sortOrder;
    }
    if ( _.get(requestParam, 'username')) {
      option.param['userName'] = requestParam.username;
    }
    return this.learnerService.get(option);
  }

  /**
   * This method calls the download API
   */
  downloadDashboardData(requestParam) {
    const option = {
      url: this.config.urlConFig.URLS.DASHBOARD.COURSE_PROGRESS + '/' + requestParam.batchIdentifier + '/export',
    };
    return this.learnerService.get(option);
  }

  /**
   * This method takes the result and formats it
   */
  parseDasboardResponse(data) {
    let tableData = [];
    _.forEach(data.series, (seriesData, key) => {
      if (key === 'course.progress.course_progress_per_user.count') {
        _.forEach(seriesData, (bucketData, bucketKey) => {
          if (bucketKey === 'buckets') {
            tableData = bucketData;
          }
        });
      }
    });
    return tableData;
  }
}
