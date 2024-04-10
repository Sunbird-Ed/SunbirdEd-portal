import { Injectable } from '@angular/core';
import { ConfigService, ToasterService } from '@sunbird/shared';
import { KendraService, CloudService } from '@sunbird/core';
import { SlUtilsService } from '@shikshalokam/sl-questionnaire';
@Injectable({
  providedIn: 'root',
})
export class QuestionnaireService {
  constructor(
    private config: ConfigService,
    private kendraService: KendraService,
    private cloudServ: CloudService,
    private slUtils: SlUtilsService,
    private toastService: ToasterService
  ) {
    this.slUtils.getPreSingedUrls = this.getPreSingedUrls.bind(this);
    this.slUtils.cloudStorageUpload = this.cloudStorageUpload.bind(this);
    this.slUtils.error = this.toastService.error.bind(this.toastService);
  }

  getPreSingedUrls(payload) {
    const paramOptions = {
      url: this.config.urlConFig.URLS.KENDRA.PRESIGNED_URLS,
      data: payload,
    };
    return this.kendraService.post(paramOptions);
  }

  cloudStorageUpload(payload) {
    const paramOptions = {
      url: 'upload',
      data: payload,
    };
    return this.cloudServ.put(paramOptions);
  }
}
