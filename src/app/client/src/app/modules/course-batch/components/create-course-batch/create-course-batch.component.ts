import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ResourceService } from '@sunbird/shared';
import * as moment from 'moment';
@Component({
  selector: 'app-create-course-batch',
  templateUrl: './create-course-batch.component.html',
  styleUrls: ['./create-course-batch.component.css']
})
export class CreateCourseBatchComponent implements OnInit {
  /*
   * Contains resource service ref
  */
  public resourceService: ResourceService;
  /**
   * form group for batchAddUserForm
  */
  createBatchForm: FormGroup;
  disableSubmitBtn = true;

  public pickerMinDate = new Date(new Date().setHours(0, 0, 0, 0));
  public pickerMinDateForEndDate = new Date(this.pickerMinDate.getTime() + (24 * 60 * 60 * 1000));
  constructor(resourceService: ResourceService) {
    this.resourceService = resourceService;
   }

  ngOnInit() {
  }
}
