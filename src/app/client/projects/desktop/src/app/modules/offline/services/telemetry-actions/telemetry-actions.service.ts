import { TelemetryService } from '@sunbird/telemetry';
import { mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PublicDataService } from '@sunbird/core';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { Injectable } from '@angular/core';
import { ElectronDialogService } from '../electron-dialog/electron-dialog.service';
@Injectable({
  providedIn: 'root'
})
export class TelemetryActionsService {
  constructor(public configService: ConfigService, public publicDataService: PublicDataService,
    private electronDialogService: ElectronDialogService,
    public telemetryService: TelemetryService) { }

  getTelemetryInfo(): Observable<ServerResponse> {
    const options = {
      url: this.configService.urlConFig.URLS.OFFLINE.TELEMTRY_INFO,
    };
    return this.publicDataService.get(options);
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
}
