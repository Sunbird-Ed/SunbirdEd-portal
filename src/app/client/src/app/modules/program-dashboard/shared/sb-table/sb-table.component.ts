import { Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import * as _ from "lodash-es";
@Component({
  selector: 'app-sb-table',
  templateUrl: './sb-table.component.html',
  styleUrls: ['./sb-table.component.scss']
})
export class SbTableComponent implements OnInit, OnChanges {
  @Input() tableToCsv;
  @Input() table;
  @Input() hideElements = false;
  @Input() globalDistrict;
  @Input() globalOrg;
  tableData;
  globalData;
  globalChange;
  filtered;
  unfiltered;
  keys = ['district_externalId', 'organisation_id', 'program_id', 'solution_id', 'programId', 'solutionId']
  @ViewChild('lib', { static: false }) lib: any;
  constructor() {
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
    this.lib.instance.exportAs('csv');
  }

  checkForGlobalChanges() {
    _.remove(this.table.config
      ? this.table?.config?.columnConfig
      : this.table?.columnsConfiguration?.columnConfig, (col) => {
        return  _.find(this.keys, (key) => {
          return col['data'] == key
        });
      })

    if (this.globalDistrict !== undefined || this.globalOrg !== undefined) {
      this.globalData = _.filter(this.tableData, (data) => {
        if(this.globalDistrict && this.globalOrg){
          return data?.district_externalId == this.globalDistrict && data?.organisation_id == this.globalOrg;
        }
        if(this.globalDistrict && !this.globalOrg){
          return  data?.district_externalId == this.globalDistrict;
         } 
         if(this.globalOrg && !this.globalDistrict){
          return data?.organisation_id == this.globalOrg
         }

        return data;
      });
      this.filtered = this.globalData.map(({ _district_externalId, _organisation_id, _program_id, _solution_id, _programId, _solutionId, ...data }) => data)
      this.globalChange = true;
      this.lib.instance.update({data:this.filtered})
    } else {
      this.globalChange = false;
      this.unfiltered = this.tableData.map(({ _district_externalId, _organisation_id, _program_id, _solution_id, _programId, _solutionId, ...data }) => data)

    }
  }
}
