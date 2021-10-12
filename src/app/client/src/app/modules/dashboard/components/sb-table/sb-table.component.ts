// import { Component, OnInit } from '@angular/core';
import { IColDefination, IDataTableOptions } from './../../interfaces';
import { Component, Input, AfterViewInit, Output, EventEmitter,ChangeDetectorRef } from '@angular/core';
import * as $ from 'jquery';
import 'datatables.net';
import * as naturalSortDataTablePlugin from './../../../../../assets/libs/naturalSortDataTablePlugin';
import * as moment from 'moment';
const GRADE_HEADER = 'Grade';
import * as _ from 'lodash-es';


@Component({
  selector: 'app-sb-table',
  templateUrl: './sb-table.component.html',
  styleUrls: ['./sb-table.component.scss']
})
export class SbTableComponent implements AfterViewInit  {
  @Input() rowsData: Array<string[]>;
  @Input() columnConfig:any;
  @Input() filters:any;
  @Input() gridConfig:Object;
  load:boolean=false;
  data = {};
  config :any;

  constructor(private cdRef : ChangeDetectorRef) { }

  loadTable(){
    this.config = {
      ...this.gridConfig,
      filters: this.filters,
      columnConfig:this.columnConfig,
    }


    this.data = {
      values:this.rowsData
    }
    console.log("this.data -- ",this.config );
    this.load =true;
    this.cdRef.detectChanges();
    
  }
  ngAfterViewInit() {


    this.loadTable();

    // this.rowsData = this.tableConfig['json']['data'];
    
  }

  reset(){
    console.log("-------reset");
    this.load=false;
    this.data = {
      values:[]
    }
    // this.data = {
    //   values:this.rowsData
    // }
    // this.load=true;
    this.loadTable()
    this.cdRef.detectChanges();
  }

}
