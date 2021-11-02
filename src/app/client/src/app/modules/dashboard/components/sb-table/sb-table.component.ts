import { Component, Input, AfterViewInit, ChangeDetectorRef,ViewChild } from '@angular/core';
import { ResourceService } from '@sunbird/shared';


@Component({
  selector: 'app-sb-table',
  templateUrl: './sb-table.component.html',
  styleUrls: ['./sb-table.component.scss']
})
export class SbTableComponent implements AfterViewInit  {
  @Input() rowsData: Array<Object>;
  data = {};
  @Input() config :Object;

  constructor(private cdRef : ChangeDetectorRef, private resourceService: ResourceService) { }
  @ViewChild('lib', { static: false }) lib: any;

  loadTable(){
 
    this.data = {
      values:this.rowsData
    }
    this.cdRef.detectChanges();
  }
  ngAfterViewInit() {
    this.loadTable();
  }

  exportToCsv(){
    this.lib.instance.exportAs('csv');
  }
  reset(){
    this.lib.instance.reset();
    this.loadTable();
  }
}
