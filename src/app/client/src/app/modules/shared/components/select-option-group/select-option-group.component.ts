import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-select-option-group',
  templateUrl: './select-option-group.component.html',
  styleUrls: ['./select-option-group.component.scss']
})
export class SelectOptionGroupComponent implements OnInit {
  @Input() optionData: Array<{}>;
  @Input() selectedOption: { label: string, value: string, selectedOption: string };
  @Output() selectedValue = new EventEmitter<{ label: string, value: string, selectedOption: string }>();
  public preSelectedValue: string;

  ngOnInit() {
    this.choosedValue();
  }

  /**
  * @description Function to emit selected value
  * @since release-3.1.0
  */
  onChange(option) {
    this.selectedValue.emit(option);
  }

  /**
   * @description Function to prepare the selected value
   * @since release-3.1.0
   */
  choosedValue() {
    if (this.selectedOption.label === 'Publisher') {
      const publisher = _.find(this.optionData, ['label', 'Publisher']);
      if (publisher) {
        _.forEach(publisher.option, value => {
          if (value.value === this.selectedOption.selectedOption) {
            this.preSelectedValue = value.name;
          }
        });
      }
    } else {
      this.preSelectedValue = this.selectedOption.selectedOption;
    }
  }
}
