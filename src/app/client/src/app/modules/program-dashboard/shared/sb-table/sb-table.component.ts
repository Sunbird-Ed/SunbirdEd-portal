import { Component, Input, OnChanges, OnInit, SimpleChanges,ViewChild} from '@angular/core';
import * as _ from "lodash-es";
import { PdServiceService } from '../services/pd-service/pd-service.service';
@Component({
  selector: 'app-sb-table',
  templateUrl: './sb-table.component.html',
  styleUrls: ['./sb-table.component.scss']
})
export class SbTableComponent implements OnInit, OnChanges {
  @Input() tableToCsv;
  @Input() table;
  @Input() hideElements = false;
  tableData;
  globalData;
  globalChange;
  filtered;
  unfiltered;
  @Input() appliedFilters;
  globalFilters;
//  {
//     district_externalId:'2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03',
//     organisation_id:['0126796199493140480','0127920475840593920'] //testing for block data
// }
  keys = ['district_externalId', 'organisation_id', 'program_id', 'solution_id', 'programId', 'solutionId','block_externalId']
  @ViewChild('lib', { static: false }) lib: any;
  constructor(
    public filterService:PdServiceService
  ) {
      // This is intentional
   }

  ngOnInit(): void {
    this.tableData = this.table?.data;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.tableData = this.table?.data;

    if (changes['tableToCsv'] && !changes['tableToCsv'].isFirstChange()) {
      this.exportToCsv();
    }
    this.checkForGlobalChanges();
  }

  exportToCsv() {
    this.lib.instance.exportAs('csv',{strict:true});
  }

  checkFilters(){
    // if(this.globalFilters.hasOwnProperty('block_externalId') && !(_.some(this.table.config.filters, (fil) => fil.reference === 'block_externalId'))){
    //   delete this.globalFilters['block_externalId']
    //   console.log('filters applied in table',this.globalFilters)
    // }
    // _.omit(this.globalFilters, ['block_externalId'])

    const result = _.omitBy(this.appliedFilters, (value, key) => {
      if (_.includes(this.table.config.filters.map(fil => fil.reference), key)) {
        return true;
      }
    });      
    const tempGlobalFilters = _.cloneDeep(this.globalFilters)
    this.globalFilters = _.omit(tempGlobalFilters, Object.keys(result))
    console.log('result', result)
    console.log('glob filters',this.globalFilters )
   }

  checkForGlobalChanges() {
    this.globalFilters = _.cloneDeep(this.appliedFilters)
    _.remove(this.table.config
      ? this.table?.config?.columnConfig
      : this.table?.columnsConfiguration?.columnConfig, (col) => {
        return  _.find(this.keys, (key) => {
          return col['data'] === key
        });
      })

    if (Object.keys(this.globalFilters).length) {
      this.checkFilters();
      console.log('filters applied in table after omission if present',this.globalFilters)
      this.globalData = this.filterService.getFilteredData(this.tableData,this.globalFilters);
      console.log('global data from table', this.globalData)
      this.filtered = this.globalData.map(({ _district_externalId, _organisation_id, _program_id, _solution_id, _programId, _solutionId,block_externalId, ...data }) => data)
      this.globalChange = true;
      this.lib.instance.update({data:this.filtered})
    } else {
      this.globalChange = false;
      this.unfiltered = this.tableData.map(({ _district_externalId, _organisation_id, _program_id, _solution_id, _programId, _solutionId,block_externalId, ...data }) => data)

    }
  }
}