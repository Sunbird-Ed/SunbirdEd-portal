import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {LayoutService} from '@sunbird/shared';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html'
})
export class WorkspaceComponent implements OnInit {
  layoutConfiguration;
  constructor(public router: Router,public layoutService: LayoutService) {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  ngOnInit() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
  }

}
