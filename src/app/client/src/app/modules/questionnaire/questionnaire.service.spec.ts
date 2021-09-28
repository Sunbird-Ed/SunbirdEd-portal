import { TestBed } from '@angular/core/testing';

import { QuestionnaireService } from './questionnaire.service';
import { KendraService, CloudService } from '@sunbird/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';
import { Router } from '@angular/router';
import { ConfigService, ResourceService } from '@sunbird/shared';
import { PayloadData } from './questionnaire.service.mock';
import * as _ from 'lodash-es';
import { SuiModalModule } from 'ng2-semantic-ui-v9';
import { ToasterService } from '@sunbird/shared';

describe('QuestionnaireService', () => {
  let baseHref, kendraService;
  let service: QuestionnaireService;
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        HttpClient,
        KendraService,
        CloudService,
        ConfigService,
        { provide: APP_BASE_HREF, useValue: baseHref },
        { provide: Router },
        { provide: ResourceService },
        ToasterService,
      ],
      imports: [HttpClientTestingModule, SuiModalModule],
    })
  );
  beforeEach(() => {
    service = TestBed.get(QuestionnaireService);
    kendraService = TestBed.get(KendraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Should fetch pre signed url', () => {
    spyOn(service, 'getPreSingedUrls').and.callThrough();
    service.getPreSingedUrls(PayloadData);
    expect(service.getPreSingedUrls).toHaveBeenCalled();
  });

  it('Should upload to cloud', () => {
    spyOn(service, 'cloudStorageUpload').and.callThrough();
    service.cloudStorageUpload(PayloadData);
    expect(service.cloudStorageUpload).toHaveBeenCalled();
  });
});
