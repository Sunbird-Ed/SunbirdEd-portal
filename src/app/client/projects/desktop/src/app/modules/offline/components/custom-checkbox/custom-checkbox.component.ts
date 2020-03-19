import { ResourceService } from '@sunbird/shared';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, OnChanges, AfterViewInit } from '@angular/core';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-custom-checkbox',
  templateUrl: './custom-checkbox.component.html',
  styleUrls: ['./custom-checkbox.component.scss']
})

export class CustomCheckboxComponent implements OnInit, OnChanges {
  @Input() inputData: Array<any>;
  @Input() placeholder;
  @Input() field: object;
  @Input() valueField = 'name';
  @Input() isDisabled;
  checkBox: object;
  selectAllCheckBox = false;
  refresh = true;
  checkValue = false;
  @Output() selectedValue = new EventEmitter<any>();

  constructor(private cdr: ChangeDetectorRef, public resourceService: ResourceService) { }

  checkbox(name) {
    if (this.checkBox[name]) {
      this.checkBox[name] = false;
      this.selectAllCheckBox = false;
    } else {
      this.checkBox[name] = true;
    }
  }

  ngOnChanges() {
    if (_.isEmpty(this.inputData)) {
      this.selectAllCheckBox = false;
    }
    this.modifyData();
  }

  selectAll() {
    this.inputData = [];
    this.selectAllCheckBox = !this.selectAllCheckBox;
    if (this.selectAllCheckBox) {
      _.forEach(this.field, (value) => {
        this.inputData.push(value);
        this.checkBox[value.name] = true;
      });
    } else {
      this.inputData = [];
      _.forEach(this.field, (value) => {
        this.checkBox[value.name] = false;
      });
    }
    this.refresh = false;
    this.cdr.detectChanges();
    this.refresh = true;
    this.selectedValue.emit(this.inputData);
  }

  selectedOption(event) {
    const fieldName = [];
    _.forEach(this.field, (value, key) => {
      fieldName.push(value.name);
    });
    if (fieldName.length === event.length) {
      this.selectAllCheckBox = true;
    }

    this.selectedValue.emit(event);
  }

  ngOnInit() {
    this.modifyData();
  }

  modifyData() {
    this.checkBox = {};
    const name = [];

    if (!_.isEmpty(this.inputData) && !_.isEmpty(this.field)) {
      _.forEach(this.field, (value, key) => {
        name.push(value.name);
      });
      if (name.length === this.inputData.length) {
        this.selectAllCheckBox = true;
      }
      _.forEach(this.inputData, (value) => {
        if (value) {
          this.checkBox[value.name] = true;
        }
      });
    }
  }
}
