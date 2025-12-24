import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { GroupsService } from '@sunbird/groups';
import { ToasterService, ResourceService } from '@sunbird/shared';
// import 'datatables.net';
import { ExportToCsv } from 'export-to-csv';


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
  // Aliases/compatibility for templates that expect ngx-datatable-style inputs
  // tableData: any[] = [];
  columns: Array<{ prop: string; name: string; isSortable?: boolean; placeholder?: string }> = [];
  isColumnsSearchable = false;
  keyUp: Subject<any> = new Subject<any>();
  // Keep a Dashlet-shaped wrapper for backward compatibility with sb-dashlet
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
    this.rows = this.dashletData.rows;
    console.log("DashletRowData values:", this.rows);
    this.columnConfig = { columnConfig: this.dashletData.columns };
    this.ngxColumns = this.dashletData.columns.map((c: any) => ({ prop: c.data, name: c.title }));
    this.columns = this.ngxColumns.map(c => ({ name: c.name, prop: c.prop, isSortable: true, placeholder: '' }));
  }

  /**
   *
   * @description- Download CSV file.
   */
  downloadCSV($event) {
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
      const csvData = this.rows.map(row => {
        const rowData = {};
        this.ngxColumns.forEach(col => {
          const val = row[col.prop];
          rowData[col.prop] = (val === null || val === undefined) ? '' : val;
        });
        return rowData;
      });
      const csvExporter = new ExportToCsv(options);
      const csvOutput = csvExporter.generateCsv(csvData || []);
   

    } catch (err) {
      this.toasterService.error(this.resourceService.messages.fmsg.m0085);
    }
  }
}