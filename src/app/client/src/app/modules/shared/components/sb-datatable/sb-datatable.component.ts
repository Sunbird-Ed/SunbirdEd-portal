import { Component, OnInit, Input, OnChanges,EventEmitter,Output } from '@angular/core';
import { ExportToCsv } from 'export-to-csv';
import * as _ from 'lodash-es';
import dayjs from 'dayjs';
import {ResourceService} from '../../services/resource/resource.service';
import { Subject } from 'rxjs';
import { TelemetryService } from '@sunbird/telemetry';

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
          const keys = eachKey.split('.');
          if(keys.length > 1){
            return filters[eachKey].includes(eachObj[keys[0]][keys[1]]);
          }else{
            return filters[eachKey].includes(eachObj[keys[0]]);
          }
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

  @Input() data;
  @Input() columns;
  @Input() downloadCSV;
  @Input() name;
  @Input() message;
  @Input() batch;
  @Input() isColumnsSearchable;
  @Output() downloadLink = new EventEmitter();
  public tableData = [];
  public searchData;
  public showLoader = false;
  public csvExporter: any;
  public keyUp = new Subject<object>();
  public listFilter = {};
  public filterModel = {};
  public tableMessage;

  constructor(public resourceService: ResourceService, public telemetryService: TelemetryService) {
  }

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
    this.tableMessage = {
      'emptyMessage': this.message
    }
    this.tableData = _.cloneDeep(this.data);
    _.forEach(this.columns, (x) => {
      this.filterModel[x.prop] = null
    });
  }

  downloadUrl(prop, row){
    if (prop === 'downloadUrls') {
      const isLinkExpired = new Date().getTime() > new Date(row.expiresAt).getTime();
      if (isLinkExpired) {
        this.downloadLink.emit(row)
      } else {
        window.open(row['downloadUrls'][0], '_blank');
      }
    }
  }

  clearSearch() {
    this.searchData = '';
  }

  setInteractEventData() {
    const downloadReports = {
      context: {
        env: 'reports',
        cdata: [
          {id: _.get(this.batch , 'courseId'), type: 'Course'},
          {id: _.get(this.batch , 'batchId'), type: 'Batch'}
        ]
      },
      edata: {
        id: 'download-summary-report',
        type: 'click',
        pageid: 'summary-report'
      }
    };
    this.telemetryService.interact(downloadReports);
  }


  downloadCSVFile() {
    this.setInteractEventData();
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
