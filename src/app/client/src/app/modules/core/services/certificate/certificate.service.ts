import { LearnerService } from './../learner/learner.service';
import { Injectable } from '@angular/core';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { Observable } from 'rxjs';
import { SearchParam } from './../../interfaces/search';
import * as _ from 'lodash-es';


@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  constructor(public learnerService: LearnerService, public configService: ConfigService) {  }

  validateCertificate(data): Observable<ServerResponse> {
    const option = {
      url: this.configService.urlConFig.URLS.USER.VALIDATE_CERTIFICATE,
      data: data
    };
    return this.learnerService.post(option);

  }
}
