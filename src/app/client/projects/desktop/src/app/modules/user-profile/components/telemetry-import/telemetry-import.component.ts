import { Component, OnInit, OnDestroy } from '@angular/core';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { ElectronDialogService } from '../../../offline/services';
import { TelemetryActionsService } from './../../../offline/services';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as _ from 'lodash-es';
import { ActivatedRoute } from '@angular/router';
import { TelemetryService } from '@sunbird/telemetry';
@Component({
  selector: 'app-telemetry-import',
  templateUrl: './telemetry-import.component.html',
  styleUrls: ['./telemetry-import.component.scss']
})
export class TelemetryImportComponent implements OnInit, OnDestroy {
  importFilesList = [];
  public unsubscribe$ = new Subject<void>();
  importedFilesSize = 0;
  constructor(public resourceService: ResourceService,
    public telemetryActionsService: TelemetryActionsService,
    private telemetryService: TelemetryService,
    private toasterService: ToasterService,
    private activatedRoute: ActivatedRoute,
    private electronDialogService: ElectronDialogService) {
      document.addEventListener('telemetry:import', (event) => {
      this.getImportedFilesList();
      });
     }

  ngOnInit() {
    this.getImportedFilesList();
  }
  openImportTelemetryDialog() {
    this.setImportTelemetry();
    this.electronDialogService.showTelemetryImportDialog();
  }
  getImportedFilesList() {
    this.telemetryActionsService.telemetryImportList().pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.importFilesList = _.get(data, 'result.response');
      this.getTotalSizeImportedFiles();
    });
  }
  getTotalSizeImportedFiles() {
    _.forEach(this.importFilesList, data => {
      this.importedFilesSize += data.totalSize;
    });
  }
  setImportTelemetry() {
    const interactData = {
      context: {
        env: _.get(this.activatedRoute.snapshot.data.telemetry, 'env') || 'telemetry',
        cdata: []
      },
      edata: {
        id: 'import_telemetry_file',
        type: 'click',
        pageid: _.get(this.activatedRoute.snapshot.data.telemetry, 'pageid'),
        extra: {}
      }
    };
    this.telemetryService.interact(interactData);
  }
  reyTryTelemetryImport(fileDetails) {
    this.setRetryImportTelemetry(fileDetails);
    this.telemetryActionsService.reyTryTelemetryImport(fileDetails).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
    }, error => {
      this.toasterService.error(this.resourceService.messages.desktop.etmsg.telemetryImportError);
    });
  }
  setRetryImportTelemetry(fileDetails) {
    const interactData = {
      context: {
        env: _.get(this.activatedRoute.snapshot.data.telemetry, 'env') || 'telemetry',
        cdata: []
      },
      edata: {
        id: fileDetails.id,
        type: 'click',
        pageid: _.get(this.activatedRoute.snapshot.data.telemetry, 'pageid'),
        extra: {
          size: fileDetails['totalSize'],
        }
      }
    };
    this.telemetryService.interact(interactData);
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
