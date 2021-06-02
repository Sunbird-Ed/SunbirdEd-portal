import { Component, OnInit, ViewChild, Output } from '@angular/core';
import { UtilService } from '../../services/util/util.service';
import { TelemetryService } from '@sunbird/telemetry';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-telemetry-error-modal',
  templateUrl: './telemetry-error-modal.component.html',
  styleUrls: ['./telemetry-error-modal.component.scss']
})
export class TelemetryErrorModalComponent implements OnInit {

  constructor(private utilService: UtilService, private telemetryService: TelemetryService) { }

  @Output() close = new EventEmitter();

  // Array of telemetry errors events 
  telemetryEventsArr = [];
  columns = [
    { name: 'eid', isSortable: true, prop: 'eid' },
    { name: 'ets', isSortable: true, prop: 'ets' },
    { name: 'edata.traceid', isSortable: false, prop: 'edata.traceid', placeholder: 'Filter error code' },
    { name: 'edata.err', isSortable: false, prop: 'edata.err', placeholder: 'Filter error code' },
    { name: 'edata.errType', isSortable: false, prop: 'edata.errType', placeholder: 'Filter by type' },
    { name: 'edata.stacktrace', isSortable: false, prop: 'edata.stacktrace', placeholder: 'Filter by string' }
  ];

  CONSTANTS = {
    TEL_ERROR: "ERROR"
  }
  

  // Latest event pushed to telemetryEventsArr. This is to avoid duplication of events adding to telemetryEventsArr
  latestEvent = undefined;

  ngOnInit() {
    // this.listenTelemetryEvents();          
    this.telemetryEventsArr = this.telemetryService.telemetryEvents;
  }
}
