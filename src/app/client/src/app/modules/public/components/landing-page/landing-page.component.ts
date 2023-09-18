import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from '@sunbird/shared';
import * as publicService from '../../services';
import { SearchService } from './../../../core/services/search/search.service';
import { TaxonomyService } from '../../../../service/taxonomy.service';
import { ResourceService } from '@sunbird/shared';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  configContent: any = {}
  // CAROUSEL_BREAKPOINT = 768;
  CAROUSEL_BREAKPOINT = 1400;
  carouselDisplayMode = 'multiple';
  courses: any = {};

  layoutConfiguration;
  taxonomyCategories:any = {};

  constructor(public layoutService: LayoutService, private landingPageContentService: publicService.LandingPageContentService, public search: SearchService, 
    private router: Router, @Inject(TaxonomyService) private taxonomyService: TaxonomyService, public resourceService: ResourceService) { }

  ngOnInit() {
    // alert()
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.landingPageContentService.getPageContent().subscribe(res => {
      this.configContent = res;
    })
    // this.search.compositeSearch({}).subscribe(res => {
    //   this.courses = res;
    //   console.log('Courses', this.courses);
    // })
    let requestData = {
      "request": {
        "filters": {
          "channel": "0138193046778920963",
          "primaryCategory": [
            "Collection",
            "Resource",
            "Content Playlist",
            "Course",
            "Course Assessment",
            "Digital Textbook",
            "eTextbook",
            "Explanation Content",
            "Learning Resource",
            "Lesson Plan Unit",
            "Practice Question Set",
            "Teacher Resource",
            "Textbook Unit",
            "LessonPlan",
            "FocusSpot",
            "Learning Outcome Definition",
            "Curiosity Questions",
            "MarkingSchemeRubric",
            "ExplanationResource",
            "ExperientialResource",
            "Practice Resource",
            "TVLesson",
            "Course Unit"
          ],
          "visibility": [
            "Default",
            "Parent"
          ]
        },
        "limit": 100,
        "sort_by": {
          "lastPublishedOn": "desc"
        },
        "fields": [
          "name",
          "appIcon",
          "mimeType",
          "gradeLevel",
          "identifier",
          "medium",
          "pkgVersion",
          "board",
          "subject",
          "resourceType",
          "primaryCategory",
          "contentType",
          "channel",
          "organisation",
          "trackable"
        ],
        "softConstraints": {
          "badgeAssertions": 98,
          "channel": 100
        },
        "mode": "soft",
        "facets": [
          "se_boards",
          "se_gradeLevels",
          "se_subjects",
          "se_mediums",
          "primaryCategory"
        ],
        "offset": 0
      }
    };
    this.landingPageContentService.getCourses(requestData).subscribe(res => {
      this.courses = res["result"]["content"];
      // console.log('Courses', this.courses);
    })

    this.taxonomyCategories = this.taxonomyService.getTaxonomyCategories();
    console.log('Taxonomy categories', this.taxonomyCategories);
  }

  slideConfig = { slidesToShow: 3, slidesToScroll: 3 };

  slickInit(e: any) {
    // console.log('slick initialized');
  }

  breakpoint(e: any) {
    // console.log('breakpoint');
  }

  afterChange(e: any) {
    // console.log('afterChange');
  }
  
  beforeChange(e: any) {
    // console.log('beforeChange');
  }

  loginClick = () => {
    window.location.href = '/resources';
  }

  registerClick = () => {
    this.router.navigateByUrl('/signup')
  }

}