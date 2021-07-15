import { Component, OnInit } from '@angular/core';
import { TelemetryService } from '@sunbird/telemetry';

/**
 * This is to show the telemetry events generated
 * Trigger the below command from broser console to enable/show the telemetry button
 *
 * document.dispatchEvent(new CustomEvent('TelemetryEvent:show', {detail: {show: true}}));
 */
@Component({
  selector: 'app-telemetry-error-modal',
  templateUrl: './telemetry-error-modal.component.html',
  styleUrls: ['./telemetry-error-modal.component.scss']
})
export class TelemetryErrorModalComponent implements OnInit {

  constructor( private telemetryService: TelemetryService) { }
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

  // To show/hide the telemetry events modal
  showTelemetryEventsModal = false;

  ngOnInit() {
    this.telemetryEventsArr = this.telemetryService.telemetryEvents;
  }

  /**
   * This is to close the modal window
   */
  openModal() {
    this.showTelemetryEventsModal = true;
  }

  /**
   * This is to close the modal window
   */
  closeModal() {
    // this.close.emit();
    this.showTelemetryEventsModal = false;
  }
}
