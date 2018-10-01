import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ResourceService } from '@sunbird/shared';
import * as moment from 'moment';
@Component({
  selector: 'app-update-course-batch',
  templateUrl: './update-course-batch.component.html',
  styleUrls: ['./update-course-batch.component.css']
})
export class UpdateCourseBatchComponent implements OnInit {
  /*
   * Contains resource service ref
  */
  public resourceService: ResourceService;
  public pickerMinDate = new Date(new Date().setHours(0, 0, 0, 0));
  public pickerMinDateForEndDate = new Date(this.pickerMinDate.getTime() + (24 * 60 * 60 * 1000));
  constructor(resourceService: ResourceService) {
    this.resourceService = resourceService;
   }

  ngOnInit() {
  }

}
