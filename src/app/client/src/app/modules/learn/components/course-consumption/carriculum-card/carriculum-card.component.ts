import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { ToasterService, ResourceService } from '@sunbird/shared';
@Component({
  selector: 'app-carriculum-card',
  templateUrl: './carriculum-card.component.html',
  styleUrls: ['./carriculum-card.component.css']
})
export class CarriculumCardComponent implements OnInit {
  @Input() curriculum: any;

  public resourceService: ResourceService;
  constructor(resourceService: ResourceService) {
    this.resourceService = resourceService;
   }

  ngOnInit() {
  }

}
