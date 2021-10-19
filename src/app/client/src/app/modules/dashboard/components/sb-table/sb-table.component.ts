// import { Component, OnInit } from '@angular/core';
import { IColDefination, IDataTableOptions } from './../../interfaces';
import { Component, Input, AfterViewInit, Output, EventEmitter,ChangeDetectorRef,ViewChild } from '@angular/core';
import * as $ from 'jquery';
import 'datatables.net';
import * as naturalSortDataTablePlugin from './../../../../../assets/libs/naturalSortDataTablePlugin';
import * as moment from 'moment';
const GRADE_HEADER = 'Grade';
import * as _ from 'lodash-es';
import { ExportToCsv } from 'export-to-csv';


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
  @ViewChild('lib', { static: false }) lib: any;

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

  exportToCsv(){
    this.lib.instance.exportCsv({ 'strict': true }).then((csvData) => {
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', "csv");
      link.click();
    }).catch((err) => {
      // this.toasterService.error(this.resourceService.messages.fmsg.m0085);
    });

  }
  reset(){
    
    console.log("-------reset",this.lib.instance);
    
    this.load=false;

    // this.data = {
    //   values:[]
    // }

    // this.lib.instance.resetFilters();

    // this.data = {
    //   values:this.rowsData
    // }
    // this.load=true;

    this.loadTable()
    this.cdRef.detectChanges();
  }



}
