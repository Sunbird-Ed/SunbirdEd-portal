import { IPageSection } from './../../interfaces/index';
import { Injectable } from '@angular/core';
import { ConfigService } from '@sunbird/shared';
import { LearnerService } from './../learner/learner.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PageSectionService {

  learnerService: LearnerService;
  config: ConfigService;

  constructor(config: ConfigService, learnerService: LearnerService) {
     this.config = config;
     this.learnerService = learnerService;
   }

   getPageData(requestParam: IPageSection) {
    const option = {
      url: this.config.urlConFig.URLS.PAGE_PREFIX,
      data: {
        'request': {
          'source': requestParam.source,
          'name': requestParam.name,
          'filters': requestParam.filters,
          'sort_by': requestParam.sort_by,
        }
      }
    };
    return this.learnerService.post(option);
  }
   }


