import { BaseReportService } from '@sunbird/core';
import { Injectable } from '@angular/core';
import { ConfigService } from '@sunbird/shared';
import { pluck } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatasetService {

  constructor(public config: ConfigService, private baseReportService: BaseReportService) {
  }

  public getDataSet({ datasetId, from, to, header = null }: {
    datasetId: string, from: string; to:
      string; header?: { [key: string]: string | string[] }
  }) {
    const req = {
      url: `${this.config.urlConFig.URLS.DATASET.READ}/${datasetId}?from=${from}&to=${to}`,
      ...(header && { header })
    };
    return this.baseReportService.get(req).pipe(pluck('result'));
  }
}
