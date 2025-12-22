import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { GroupsService } from '@sunbird/groups';
import { ToasterService, ResourceService } from '@sunbird/shared';
// import 'datatables.net';

export interface IColumnConfig {
  columnConfig: [{
    title: string;
    data: string;
  }];
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @Input() lastUpdatedOn: string;
  @Input() dashletData: any;
  @Input() fileName: string;
  DashletRowData = { values: [] };
  columnConfig: IColumnConfig;

  @ViewChild('lib', { static: false }) lib: any;
  @Output() downloadCsv: EventEmitter<{}> = new EventEmitter(); // emit the event once the download csv button click


  constructor(
    private toasterService: ToasterService,
    public groupService: GroupsService,
    public resourceService: ResourceService
  ) { }

  ngOnInit(): void {
    // Initialize the data for dashlet library
    this.DashletRowData.values = this.dashletData.rows;
    this.columnConfig = { columnConfig: this.dashletData.columns };
  }

  /**
   *
   * @description- Download CSV file.
   */
  downloadCSV() {
    this.downloadCsv.emit(); // emit the event to parent component to generate telemetry events
    const fileName = this.fileName + '.csv';
    this.lib.instance.exportCsv({ 'strict': true }).then((csvData) => {
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.click();
    }).catch((err) => {
      this.toasterService.error(this.resourceService.messages.fmsg.m0085);
    });
  }
}
