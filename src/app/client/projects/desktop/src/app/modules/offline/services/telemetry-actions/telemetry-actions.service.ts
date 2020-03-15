import { mergeMap } from 'rxjs/operators';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { PublicDataService } from '@sunbird/core';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { Injectable } from '@angular/core';
import { ElectronDialogService } from '../electron-dialog/electron-dialog.service';
import { map, catchError } from 'rxjs/operators';
import * as _ from 'lodash-es';
import {EventEmitter} from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class TelemetryActionsService {
  handledTelemetryList = 0;
  telemetryImportEvent = new EventEmitter<any>();
  constructor(public configService: ConfigService, public publicDataService: PublicDataService,
    private electronDialogService: ElectronDialogService) { }

  getTelemetryInfo(): Observable<ServerResponse> {
    return this.publicDataService.get({
      url: this.configService.urlConFig.URLS.OFFLINE.TELEMTRY_INFO,
    });
  }
  getSyncTelemetryStatus(): Observable<ServerResponse> {
    return this.publicDataService.get({
      url: this.configService.urlConFig.URLS.OFFLINE.TELEMTRY_INFO + '?syncConfig=true',
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
  telemetryImportList(): Observable<ServerResponse> {
    const requestParams = {
      url: this.configService.urlConFig.URLS.OFFLINE.IMPORT_TELEMETRY_LIST,
      data: {}
    };
    return this.publicDataService.post(requestParams).pipe(map((response: ServerResponse) => {
      let telemetryImportList = 0;
      _.forEach(response.result.response.items, data => {
        if (data.status === 'completed') {
          telemetryImportList ++;
        }
      });
      if (telemetryImportList > this.handledTelemetryList) {
       this.telemetryImportEvent.emit(); // emit this event when import new file and status is completed
      }
      this.handledTelemetryList = telemetryImportList;

      return response;
    }));
  }

  reTryTelemetryImport(importId) {
    const requestParams = {
      url: `${this.configService.urlConFig.URLS.OFFLINE.TELEMETRY_IMPORT_RETRY}/${importId}`,
      data: {}
    };
    return this.publicDataService.post(requestParams).pipe(map((response: ServerResponse) => {
      return response;
    }));
  }
    syncTelemtry(data): Observable<ServerResponse> {
    const requestParams = {
      url: this.configService.urlConFig.URLS.OFFLINE.TELEMETRY_SYNC,
      data: data
    };
    return this.publicDataService.post(requestParams).pipe(map((response: ServerResponse) => {
      return response;
    }));
  }
  updateSyncStatus(data): Observable<ServerResponse> {
    const requestParams = {
      url: this.configService.urlConFig.URLS.OFFLINE.TELEMTRY_CONFIG,
      data: data
    };
    return this.publicDataService.post(requestParams).pipe(map((response: ServerResponse) => {
      return response;
    }));
  }

}
