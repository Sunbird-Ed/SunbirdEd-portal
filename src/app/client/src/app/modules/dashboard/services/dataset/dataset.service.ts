import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService, PublicDataService } from '@sunbird/core';
import { ConfigService } from '@sunbird/shared';
import { pluck } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatasetService extends DataService {

  baseUrl: string;

  constructor(public config: ConfigService, public http: HttpClient) {
    super(http);
    this.config = config;
    this.baseUrl = this.config.urlConFig.URLS.DATASET.PREFIX;
  }

  public getDataSet({ datasetId, from, to, since = null }: { datasetId: string, from: string; to: string; since?: string }) {

    const req = {
      url: `${this.config.urlConFig.URLS.DATASET.READ}/${datasetId}?from=${from}&to=${to}`
    };

    return super.get(req)
      .pipe(
        pluck('result')
      );

  }

}
