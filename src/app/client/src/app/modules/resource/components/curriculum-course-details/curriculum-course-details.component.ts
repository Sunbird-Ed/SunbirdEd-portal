import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicPlayerService } from '@sunbird/public';
import { ConfigService, NavigationHelperService, ResourceService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { Observable, of, Subject, throwError } from 'rxjs';
import { map, mergeMap, takeUntil } from 'rxjs/operators';
import { TocCardType } from '@project-sunbird/common-consumption';

@Component({
  selector: 'app-curriculum-course-details',
  templateUrl: './curriculum-course-details.component.html',
  styleUrls: ['./curriculum-course-details.component.scss']
})
export class CurriculumCourseDetailsComponent implements OnInit {

  contentType: string;
  courseId: string;
  showLoader: boolean;
  errorMessage: string;
  showError: boolean;
  unsubscribe$ = new Subject<void>();
  course: any;
  cardType: TocCardType = TocCardType.COURSE;
  courseFallbackImg = './../../../../../assets/images/book.png';

  constructor(
    public resourceService: ResourceService,
    public navigationHelperService: NavigationHelperService,
    public activatedRoute: ActivatedRoute,
    public playerService: PublicPlayerService,
    public configService: ConfigService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.courseId = params.courseId;
      this.setTelemetryData();

      /* istanbul ignore else */
      if (this.courseId) {
        this.getCourseHierarchy(this.courseId).subscribe((response: any) => {
          this.course = response.data;
        }, error => {
          console.error('Error', error);
        });
      }
    });
  }

  goBack() {
    this.navigationHelperService.goBack();
  }

  setTelemetryData() {

  }

  private getCourseHierarchy(collectionId: string): Observable<any> {
    const option: any = { params: {} };
    option.params = this.configService.appConfig.PublicPlayer.contentApiQueryParams;
    return this.playerService.getCollectionHierarchy(collectionId, option).pipe(
      map((response: any) => {
        const collectionData = response.result.content;
        return { data: response.result.content };
      }));
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
