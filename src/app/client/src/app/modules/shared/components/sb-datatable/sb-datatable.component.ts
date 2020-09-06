import { filter } from 'rxjs/operators';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ExportToCsv } from 'export-to-csv';
import * as _ from 'lodash-es';
import * as dayjs from 'dayjs';

@Component({
  selector: 'sb-datatable',
  templateUrl: './sb-datatable.component.html',
  styleUrls: ['./sb-datatable.component.scss']
})
export class SbDatatableComponent implements OnInit, OnChanges {

  @Input() searchFields;
  @Input() data;
  @Input() columns;
  @Input() downloadCSV;
  @Input() sortable;
  @Input() name;
  public tableData = [];
  public searchData;
  public sortOrder = 'asc';
  public sortField = 'state';
  public showLoader = false;
  public csvExporter: any;

  constructor() { }

  ngOnInit() {
    
  }

  ngOnChanges() {
    this.tableData = _.cloneDeep(this.data);
  }
  search() {
    if (this.searchFields && this.searchFields.length !== 0) {
      if (this.searchData) {
        this.tableData = this.filterData(this.data);
      } else {
        this.tableData = this.data
      }
    } else {
      this.tableData = _.filter(this.data, (row) => {
        return (_.lowerCase(JSON.stringify(row))).includes(_.lowerCase(this.searchData))
      })
    }

  }
  filterData(data) {
    let resultData = [];
    _.forEach(data, (row, index) => {
      _.forEach(this.searchFields, (field) => {
        if ((_.lowerCase(row[field])).includes(_.lowerCase(this.searchData))) {
          resultData.push(row)
        }
      })
    })
    return _.uniqWith(resultData, _.isEqual);;
  }

  sort(field) {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortField = field;
    this.tableData = _.orderBy(this.tableData, [this.sortField], [this.sortOrder]);
  }

  clearSearch() {
    this.searchData = '';
    this.search();
  }

  downloadCSVFile() {
    this.name = `${this.name}_${dayjs().format('YYYY-MM-DD_HH_mm')}`; 
    const options = {
      filename: this.name,
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: false,
      headers: _.map(this.columns, (column) => column.name)
    };
    this.csvExporter = new ExportToCsv(options);
    this.csvExporter.generateCsv(this.tableData)
  }
}
