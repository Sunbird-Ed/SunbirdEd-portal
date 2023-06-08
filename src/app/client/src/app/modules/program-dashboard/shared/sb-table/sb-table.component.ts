import { Component, Input, OnChanges, OnInit, SimpleChanges,ViewChild} from '@angular/core';
import * as _ from "lodash-es";
import { PdServiceService } from '../services/pd-service/pd-service.service';
import { ResourceService } from '@sunbird/shared';
@Component({
  selector: 'app-sb-table',
  templateUrl: './sb-table.component.html',
  styleUrls: ['./sb-table.component.scss']
})
export class SbTableComponent implements OnInit, OnChanges {
  @Input() table;
  @Input() hideElements = false;
  tableData;
  globalData;
  globalChange;
  filtered;
  unfiltered;
  @Input() appliedFilters;
  globalFilters;
  keys = ['district_externalId', 'organisation_id', 'program_id', 'solution_id', 'programId', 'solutionId','block_externalId']
  @ViewChild('lib', { static: false }) lib: any;
  constructor(
    public filterService:PdServiceService,
    private resourceService: ResourceService
  ) {
      // This is intentional
   }

  ngOnInit(): void {
    this.tableData = this.table?.data;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.tableData = this.table?.data;
    this.checkForGlobalChanges();
  }

  exportToCsv() {
    this.lib.instance.exportAs('csv',{strict:true});
  }

  checkFilters(){
    const result = _.omitBy(this.appliedFilters, (value, key) => {
      if (_.includes(this.table.config.filters.map(fil => fil.reference), key)) {
        return true;
      }
    });      
    const tempGlobalFilters = _.cloneDeep(this.globalFilters)
    this.globalFilters = _.omit(tempGlobalFilters, Object.keys(result))
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
      this.globalData = this.filterService.getFilteredData(this.tableData,this.globalFilters);
      this.filtered = this.globalData.map(({ _district_externalId, _organisation_id, _program_id, _solution_id, _programId, _solutionId,block_externalId, ...data }) => data)
      this.globalChange = true;
      this.lib.instance.update({data:this.filtered})
    } else {
      this.globalChange = false;
      this.unfiltered = this.tableData.map(({ _district_externalId, _organisation_id, _program_id, _solution_id, _programId, _solutionId,block_externalId, ...data }) => data)
    }
  }
}