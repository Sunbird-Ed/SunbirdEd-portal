import { Location } from '@angular/common';
import { IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import { SearchService } from '@sunbird/core';
import { Component, OnInit } from '@angular/core';
import {
  ResourceService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-explore-curriculum-courses',
  templateUrl: './explore-curriculum-courses.component.html',
  styleUrls: ['./explore-curriculum-courses.component.scss']
})
export class ExploreCurriculumCoursesComponent implements OnInit {
  public defaultBg = false;
  public selectedCourse;
  public courseList: Array<{}> = [];
  public title: string;
  public telemetryImpression: IImpressionEventInput;

  constructor(private searchService: SearchService, private toasterService: ToasterService,
    public resourceService: ResourceService, public activatedRoute: ActivatedRoute,
    private router: Router, private navigationhelperService: NavigationHelperService, private telemetryService: TelemetryService,
    private location: Location) { }

    ngOnInit() {
      this.title = _.get(this.activatedRoute, 'snapshot.queryParams.title');
      const subjectThemeAndCourse = this.searchService.subjectThemeAndCourse;
      if (!_.isEmpty(_.get(subjectThemeAndCourse, 'contents'))) {
        this.courseList = _.get(subjectThemeAndCourse, 'contents');
        this.selectedCourse = _.omit(subjectThemeAndCourse, 'contents');
      } else {
        this.toasterService.error(this.resourceService.frmelmnts.lbl.fetchingContentFailed);
        this.location.back();
      }
      this.setTelemetryImpression();
    }

    setTelemetryImpression() {
      this.telemetryImpression = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env
        },
        edata: {
          type: this.activatedRoute.snapshot.data.telemetry.type,
          pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
          uri: this.router.url,
          subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
          duration: this.navigationhelperService.getPageLoadTime()
        }
      };
    }

    navigateToCourse(event) {
      this.router.navigate(['explore-course/course', event.data.identifier]);
    }

    goBack() {
      this.location.back();
    }

    getInteractData(event) {
      const cardClickInteractData = {
        context: {
          cdata: [],
          env: this.activatedRoute.snapshot.data.telemetry.env,
        },
        edata: {
          id: _.get(event, 'data.identifier'),
          type: 'click',
          pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        },
        object: {
            id: event.data.identifier,
            type: event.data.contentType || 'course',
            ver: event.data.pkgVersion ? event.data.pkgVersion.toString() : '1.0'
        }
      };
      this.telemetryService.interact(cardClickInteractData);
    }
}
