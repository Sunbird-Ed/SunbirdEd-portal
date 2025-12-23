import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ExportToCsv } from 'export-to-csv';
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
  // Rows and columns shaped for ngx-datatable
  rows: any[] = [];
  ngxColumns: Array<{ prop: string; name: string }> = [];
  // Keep a Dashlet-shaped wrapper for backward compatibility with sb-dashlet
  DashletRowData = { values: [] };
  columnConfig: IColumnConfig;
  @Output() downloadCsv: EventEmitter<{}> = new EventEmitter(); // emit the event once the download csv button click


  constructor(
    private toasterService: ToasterService,
    public groupService: GroupsService,
    public resourceService: ResourceService
  ) { }

  ngOnInit(): void {
    // Initialize the data for ngx-datatable
    this.rows = Array.isArray(this.dashletData && this.dashletData.rows) ? this.dashletData.rows : [];
    // dashletData.columns is expected to be array of { title, data }
    const cols = Array.isArray(this.dashletData && this.dashletData.columns) ? this.dashletData.columns : [];
    this.ngxColumns = cols.map((c: any) => ({ prop: c.data, name: c.title }));
    this.columnConfig = { columnConfig: cols };
    // keep legacy dashlet shape in sync
    this.DashletRowData.values = this.rows;
  }

  /**
   *
   * @description- Download CSV file.
   */
  downloadCSV(_event?: any) {
    this.downloadCsv.emit(); // emit the event to parent component to generate telemetry events
    const fileName = this.fileName + '.csv';
    try {
      const options = {
        filename: this.fileName,
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: false,
        headers: this.ngxColumns.map(c => c.name)
      };
      const csvExporter = new ExportToCsv(options);
      // Pass rows (array of objects) similar to other components in the repo
      csvExporter.generateCsv(this.rows || []);
    } catch (err) {
      this.toasterService.error(this.resourceService.messages.fmsg.m0085);
    }
  }
}
