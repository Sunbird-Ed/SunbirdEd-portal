import { Component, OnInit } from '@angular/core';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { ElectronDialogService } from '../../../offline/services';

@Component({
  selector: 'app-telemetry-import',
  templateUrl: './telemetry-import.component.html',
  styleUrls: ['./telemetry-import.component.scss']
})
export class TelemetryImportComponent implements OnInit {
  importFilesList = [];
  constructor( private resourceService: ResourceService,
     private electronDialogService: ElectronDialogService) { }

  ngOnInit() {
  }
  openImportTelemetryDialog() {
    this.electronDialogService.showTelemetryImportDialog();
  }
}
