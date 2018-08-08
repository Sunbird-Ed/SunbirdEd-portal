import { Component, Input } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
@Component({
  selector: 'app-carriculum-card',
  templateUrl: './carriculum-card.component.html',
  styleUrls: ['./carriculum-card.component.css']
})
export class CarriculumCardComponent {
  @Input() curriculum: any;

  public resourceService: ResourceService;
  constructor(resourceService: ResourceService) {
    this.resourceService = resourceService;
  }

}
