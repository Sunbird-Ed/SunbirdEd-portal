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
  CAROUSEL_BREAKPOINT = 768;
  carouselDisplayMode = 'multiple';
  courses:any = {};
  slideConfig = { slidesToShow: 3, slidesToScroll: 3 };

  constructor(public layoutService: LayoutService, private landingPageContentService:publicService.LandingPageContentService) { }

  ngOnInit() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.landingPageContentService.getPageContent().subscribe(res => {
      this.configContent = res;
    })
  }

  slickInit(e: any) {
    console.log('slick initialized');
  }
  breakpoint(e: any) {
    console.log('breakpoint');
  }
  afterChange(e: any) {
    console.log('afterChange');
  }
  beforeChange(e: any) {
    console.log('beforeChange');
  }

}
