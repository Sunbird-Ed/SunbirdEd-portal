import { filter } from 'rxjs/operators';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ExportToCsv } from 'export-to-csv';
import * as _ from 'lodash-es';
import * as dayjs from 'dayjs';
import { ResourceService } from '@sunbird/shared';
import { Subject } from 'rxjs';

export const multiFilter = (arr: Object[], filters: Object) => {
  const filterKeys = Object.keys(filters);
  return arr.filter(eachObj => {
    return filterKeys.every(eachKey => {
      if (!filters[eachKey]) {
        return true;
      } else if (!filters[eachKey].length) {
        return true;
      }
        if (typeof (eachObj[eachKey]) === 'string' && eachObj[eachKey] !== null && eachObj[eachKey] !== undefined) {
          const each = eachObj[eachKey].toLowerCase();
          return each.includes(filters[eachKey].toLowerCase().trim());
        } else {
          return filters[eachKey].includes(eachObj[eachKey]);
        }
    });
  });
};

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
  keyUp = new Subject<object>();
  listFilter = {};
  filterModel = {};
  messages = {
      emptyMessage: 'No Data to display'
    }
  constructor() { }

  ngOnInit() {
      this.keyUp
      .subscribe(obj => {
        this.onColumnFilter(obj['key'], obj['value']);
      });
  }

  onColumnFilter(key, value) {
    if (value) {
      this.listFilter[key] = value;
    } else {
      delete this.listFilter[key];
    }
    this.filterDataTable();
  }

  filterDataTable() {
    this.tableData = multiFilter(this.data, this.listFilter);
  }
  ngOnChanges() {
    this.tableData = _.cloneDeep(this.data);
    _.forEach(this.columns, (x) => {
      this.filterModel[x.prop] = ''
    })
  }

  sort(column) {
    if(column.isSortable){
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      this.sortField = column.prop;
      this.tableData = _.orderBy(this.tableData, [this.sortField], [this.sortOrder]);
    }
  }

  clearSearch() {
    this.searchData = '';
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
