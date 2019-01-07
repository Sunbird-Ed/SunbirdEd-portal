import { Component, Input } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
@Component({
  selector: 'app-public-curriculum-card',
  templateUrl: './public-curriculum-card.component.html',
  styleUrls: ['./public-curriculum-card.component.css']
})
export class PublicCurriculumCardComponent {
  @Input() curriculum: any;

  public resourceService: ResourceService;
  constructor(resourceService: ResourceService) {
    this.resourceService = resourceService;
  }

}
