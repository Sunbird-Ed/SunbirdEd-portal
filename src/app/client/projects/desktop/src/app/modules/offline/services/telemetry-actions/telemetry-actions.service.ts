import { mergeMap } from 'rxjs/operators';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { PublicDataService } from '@sunbird/core';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { Injectable } from '@angular/core';
import { ElectronDialogService } from '../electron-dialog/electron-dialog.service';
import { map, catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class TelemetryActionsService {
  constructor(public configService: ConfigService, public publicDataService: PublicDataService,
    private electronDialogService: ElectronDialogService) { }

  getTelemetryInfo(): Observable<ServerResponse> {
    return this.publicDataService.get({
      url: this.configService.urlConFig.URLS.OFFLINE.TELEMTRY_INFO,
    });
  }

  exportTelemetry(): Observable<ServerResponse> {
    const exportOptions: any = {
      url: `${this.configService.urlConFig.URLS.OFFLINE.EXPORT_TELEMETRY}`
    };
    return this.electronDialogService.showTelemetryExportDialog().pipe(mergeMap((response: any) => {
      if (response.destFolder) {
        exportOptions.param = {
          destFolder: response.destFolder
        };
      }
      return this.publicDataService.post(exportOptions);
    }));
  }
  getTelemetryImportList(): Observable<ServerResponse> {
    return this.publicDataService.get({
      url: this.configService.urlConFig.URLS.OFFLINE.IMPORT_TELEMETRY_LIST,
    });
  }
  telemetrySyncStatus(data): Observable<ServerResponse> {
    const requestParams = {
      url: this.configService.urlConFig.URLS.OFFLINE.TELEMETRY_SYNC_STATUS,
      data: data
    };
    return this.publicDataService.post(requestParams).pipe(map((response: ServerResponse) => {
      return response;
    }), catchError(err => {
      return observableThrowError(err);
    }));
  }
  syncTelemtry(data): Observable<ServerResponse> {
    const requestParams = {
      url: this.configService.urlConFig.URLS.OFFLINE.TELEMETRY_SYNC,
      data: data
    };
    return this.publicDataService.post(requestParams).pipe(map((response: ServerResponse) => {
      return response;
    }), catchError(err => {
      return observableThrowError(err);
    }));
  }
  reyTryTelemetryImport(data) {
    const requestParams = {
      url: this.configService.urlConFig.URLS.OFFLINE.TELEMETRY_IMPORT_RETRY,
      data: data
    };
    return this.publicDataService.post(requestParams).pipe(map((response: ServerResponse) => {
      return response;
    }), catchError(err => {
      return observableThrowError(err);
    }));
  }
}
