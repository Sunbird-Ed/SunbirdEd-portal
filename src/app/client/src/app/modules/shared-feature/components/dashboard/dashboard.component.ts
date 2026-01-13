import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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

  rows: any[] = [];
  ngxColumns: Array<{ prop: string; name: string }> = [];
  columnConfig: IColumnConfig;

  @Output() downloadCsv: EventEmitter<{}> = new EventEmitter();

  constructor(
    private toasterService: ToasterService,
    public groupService: GroupsService,
    public resourceService: ResourceService
  ) { }

  ngOnInit(): void {
    // this.columnConfig = { columnConfig: this.dashletData.columns };
    this.ngxColumns = this.dashletData.columns.map((c: any) => ({ prop: c.data, name: c.title }));

    this.rows = this.dashletData.rows.map(row => {
      const newRow = { ...row };
      this.ngxColumns.forEach(col => {
        const val = newRow[col.prop];
        if (val === null || val === undefined || val === '') {
          newRow[col.prop] = 'NA';
        }
      });
      return newRow;
    });
  }

  /**
   *
   * @description- Download CSV file.
   */
  downloadCSV() {
    this.downloadCsv.emit();
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
          rowData[col.prop] = (val === null || val === undefined || val === 'NA') ? '' : val;
        });
        return rowData;
      });
      const csvExporter = new ExportToCsv(options);
      csvExporter.generateCsv(csvData || []);

    } catch (err) {
      this.toasterService.error(this.resourceService.messages.fmsg.m0085);
    }
  }
}