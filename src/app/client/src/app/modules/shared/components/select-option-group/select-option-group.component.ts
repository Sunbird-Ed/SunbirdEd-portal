import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-select-option-group',
  templateUrl: './select-option-group.component.html',
  styleUrls: ['./select-option-group.component.scss']
})
export class SelectOptionGroupComponent {
  @Input() optionData: Array<{ name: string, value: string }>;
  @Input() selectedOption: { label: string, value: string, selectedOption: string };
  @Output() selectedValue = new EventEmitter<{ label: string, value: string, selectedOption: string }>();

  /**
  * @description Function to set selected option. This method is required as ngModel not supporting
  * object as value in ngValue for getting selected. This method is not required if ngvalue is string
  * @since release-3.1.0
  */
  compareByObj(obj1, obj2) {
    return _.isEqual(obj1, obj2);
  }

  /**
  * @description Function to emit selected value
  * @since release-3.1.0
  */
  onChange() {
    this.selectedValue.emit(this.selectedOption);
  }
}
