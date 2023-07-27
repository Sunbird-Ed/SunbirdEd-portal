import { Component, OnInit } from '@angular/core';
import { LayoutService } from '@sunbird/shared';
import * as publicService from '../../services';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  configContent:any = {}
  layoutConfiguration;

  constructor(public layoutService: LayoutService, private landingPageContentService:publicService.LandingPageContentService) { }

  ngOnInit() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.landingPageContentService.getPageContent().subscribe(res => {
      this.configContent = res;
    })
  }

}
