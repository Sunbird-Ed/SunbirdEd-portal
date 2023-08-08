import { Component, OnInit, HostListener } from '@angular/core';
import { LayoutService } from '@sunbird/shared';
import * as publicService from '../../services';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  configContent:any = {}
  CAROUSEL_BREAKPOINT = 768;
  carouselDisplayMode = 'multiple';
  
  layoutConfiguration;

  constructor(public layoutService: LayoutService, private landingPageContentService:publicService.LandingPageContentService) { }

  ngOnInit() {
    // alert()
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.landingPageContentService.getPageContent().subscribe(res => {
      this.configContent = res;
    })
  }

  slideConfig = { slidesToShow: 3, slidesToScroll: 3 };

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
