import { Component, OnInit } from '@angular/core';
import { ResourceService } from '../../../../modules/shared';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements OnInit {

  public resourceService: ResourceService;

  public router: Router;

  constructor(resourceService: ResourceService, router: Router) {
    this.resourceService = resourceService;
    this.router = router;
  }

  ngOnInit() {
  }

}
