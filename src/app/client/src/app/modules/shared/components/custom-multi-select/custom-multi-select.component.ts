import { Component, OnInit, ChangeDetectorRef, Input,  EventEmitter, Output, OnChanges } from '@angular/core';
import * as _ from 'lodash';
@Component({
  selector: 'app-custom-multi-select',
  templateUrl: './custom-multi-select.component.html',
  styleUrls: ['./custom-multi-select.component.css']
})
export class CustomMultiSelectComponent implements OnInit {
  @Input() inputData: Array<string>;
  @Input() field: object;
  checkBox: object;
  selectAllCheckBox = false;
  refresh = true;
  @Output('selectedValue')
  selectedValue = new EventEmitter<any>();

  constructor( private cdr: ChangeDetectorRef) { }
  checkbox(name) {
    if (this.checkBox[name]) {
      this.checkBox[name] = false;
      this.selectAllCheckBox = false;
    } else {
      this.checkBox[name] = true;
    }
  }
  selectAll(code) {
    this.inputData = [];
    this.selectAllCheckBox = !this.selectAllCheckBox;
    if (this.selectAllCheckBox) {
      _.forEach(this.field['range'], (value) => {
        this.inputData.push(value.name);
        this.checkBox[value.name] = true;
      });
    } else {
      this.inputData = [];
      _.forEach(this.field['range'], (value) => {
        this.checkBox[value.name] = false;
      });
    }
    this.selectedValue.emit( this.inputData);
    this.refresh = false;
    this.cdr.detectChanges();
    this.refresh = true;
  }
  selectedOption(event) {
    const fieldName = [];
    _.forEach(this.field['range'], (value, key) => {
      fieldName.push(value.name);
    });
    if (fieldName.length === event.length) {
      this.selectAllCheckBox = true;
    }
    this.selectedValue.emit(event);
  }
  ngOnInit() {
    this.checkBox = {};
    const name = [];
    if (this.inputData) {
      _.forEach(this.field['range'], (value, key) => {
        name.push(value.name);
      });
      if (name.length === this.inputData.length) {
        this.selectAllCheckBox = true;
      }
      _.forEach(this.inputData, (value) => {
        this.checkBox[value] = true;
      });
    }
  }
}
