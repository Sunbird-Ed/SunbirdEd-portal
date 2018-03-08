import { ResourceService } from '../../services/index';
import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-content-card',
  templateUrl: './content-card.component.html',
  styleUrls: ['./content-card.component.css']
})
export class ContentCardComponent implements OnInit {
  resourceService: ResourceService;
  @Input() content;
  constructor(resourceService: ResourceService) {
    this.resourceService = resourceService;
   }

  ngOnInit() {
  }

}
