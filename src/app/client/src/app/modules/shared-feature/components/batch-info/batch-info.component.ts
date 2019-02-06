import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ResourceService, ToasterService } from '@sunbird/shared';
import * as _ from 'lodash';
@Component({
  selector: 'app-batch-info',
  templateUrl: './batch-info.component.html',
  styleUrls: ['./batch-info.component.scss']
})
export class BatchInfoComponent implements OnInit {

  @Input() enrolledBatchInfo: any;
  @Output() modelClose = new EventEmitter;

  constructor(public resourceService: ResourceService) { }

  ngOnInit() {
    console.log(this.enrolledBatchInfo);
  }

  handleModelClose() {
    this.modelClose.emit();
  }
}
