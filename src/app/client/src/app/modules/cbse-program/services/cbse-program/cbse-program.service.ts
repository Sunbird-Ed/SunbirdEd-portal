import { Injectable } from '@angular/core';
import { ConfigService } from '@sunbird/shared';
import { ActionService } from '@sunbird/core';

@Injectable({
  providedIn: 'root'
})
export class CbseProgramService {

  constructor(private configService: ConfigService, public actionService: ActionService) { }

  getQuestionDetails(questionId) {
    const req = {
      url: `${this.configService.urlConFig.URLS.ASSESSMENT.READ}/${questionId}`
    };
    return this.actionService.get(req);
  }
}
