import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-select-option-group',
  templateUrl: './select-option-group.component.html',
  styleUrls: ['./select-option-group.component.scss']
})
export class SelectOptionGroupComponent implements OnInit {
  @Input() optionData: Array<{ name: string, value: string }>;
  @Input() selectedOption: { label: string, value: string, selectedOption: string };
  @Output() selectedValue = new EventEmitter<{ label: string, value: string, selectedOption: string }>();
  public preSelectedValue: string;

  ngOnInit() {
    this.preSelectedValue = this.selectedOption.selectedOption;
  }

  /**
  * @description Function to emit selected value
  * @since release-3.1.0
  */
  onChange(option) {
    this.selectedValue.emit(option);
  }
}
