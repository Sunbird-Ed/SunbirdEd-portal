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
  tableData: any[] = [];
  columns: Array<{ prop: string; name: string; isSortable?: boolean; placeholder?: string }> = [];
  tableMessage: any = {};
  filterModel: { [key: string]: any } = {};
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

    this.rows = Array.isArray(this.dashletData && this.dashletData.rows) ? this.dashletData.rows : [];
    const cols = Array.isArray(this.dashletData && this.dashletData.columns) ? this.dashletData.columns : [];
    this.rows.forEach(row => {
      cols.forEach(col => {
        if (row[col.data] === null || row[col.data] === undefined || row[col.data] === '') {
          row[col.data] = 'NA';
        }
      });
    });
    this.ngxColumns = cols.map((c: any) => ({ prop: c.data, name: c.title }));
    this.columnConfig = { columnConfig: cols };
    this.DashletRowData.values = this.rows;

    // Populate compatibility aliases so the new ngx-datatable markup works with existing data
    this.tableData = this.rows;
    this.columns = this.ngxColumns.map(c => ({ name: c.name, prop: c.prop, isSortable: false, placeholder: '' }));
    this.tableMessage = { emptyMessage: (this.resourceService && this.resourceService?.frmelmnts && this.resourceService?.frmelmnts?.msg?.noRecordsFound) || 'No records found' };
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
      const csvExporter = new ExportToCsv(options);
      const csvOutput = csvExporter.generateCsv(this.rows || []);
      console.log("CSV output:", csvOutput);

    } catch (err) {
      this.toasterService.error(this.resourceService.messages.fmsg.m0085);
    }
  }
}