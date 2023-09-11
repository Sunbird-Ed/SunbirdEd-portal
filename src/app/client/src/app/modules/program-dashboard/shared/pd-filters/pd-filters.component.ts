import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import * as _ from "lodash-es";

@Component({
  selector: "app-pd-filters",
  templateUrl: "./pd-filters.component.html",
  styleUrls:["./pd-filters.component.scss"]
})
export class PdFiltersComponent implements OnInit {
  @Input() pdFilter: any;
  @Output() filterChanged = new EventEmitter();
  pdFiltersFormGroup: UntypedFormGroup;

  constructor(public fb: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.generateForm();
  }

  generateForm() {
    this.pdFiltersFormGroup = this.fb.group({});
    this.pdFiltersFormGroup.addControl(
      _.get(this.pdFilter, "reference"),
      this.fb.control(this.pdFilter?.defaultValue ? this.pdFilter.defaultValue:"")
    );
  }

  inputChange() {
    const dataToBeEmitted = {
      data:this.pdFiltersFormGroup.value,
      controlType:this.pdFilter.controlType
    }
    this.filterChanged.emit(dataToBeEmitted);
  }
}
