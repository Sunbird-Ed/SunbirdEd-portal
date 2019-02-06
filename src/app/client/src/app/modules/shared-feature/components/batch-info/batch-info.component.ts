import { Component, OnInit } from '@angular/core';
import { ResourceService, ToasterService } from '@sunbird/shared';

@Component({
  selector: 'app-batch-info',
  templateUrl: './batch-info.component.html',
  styleUrls: ['./batch-info.component.scss']
})
export class BatchInfoComponent implements OnInit {

  constructor(public resourceService: ResourceService) { }

  ngOnInit() {
  }

}
