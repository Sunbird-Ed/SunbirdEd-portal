import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TocCardType } from '@project-sunbird/common-consumption';
import { PublicPlayerService } from '@sunbird/public';
import { ConfigService, NavigationHelperService, ResourceService } from '@sunbird/shared';
import { IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-explore-curriculum-course-details',
  templateUrl: './explore-curriculum-course-details.component.html',
  styleUrls: ['./explore-curriculum-course-details.component.scss']
})
export class ExploreCurriculumCourseDetailsComponent implements OnInit {

  contentType: string;
  courseId: string;
  showLoader: boolean;
  errorMessage: string;
  showError: boolean;
  unsubscribe$ = new Subject<void>();
  course: any;
  cardType: TocCardType = TocCardType.COURSE;
  showLoginModal = false;
  courseFallbackImg = './../../../../../assets/images/book.png';

  signInInteractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;

  constructor(
    public resourceService: ResourceService,
    public navigationHelperService: NavigationHelperService,
    public activatedRoute: ActivatedRoute,
    public playerService: PublicPlayerService,
    public configService: ConfigService,
    private router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.courseId = params.courseId;
      this.setTelemetryData();

      /* istanbul ignore else */
      if (this.courseId) {
        this.getCourseHierarchy(this.courseId).subscribe((response: any) => {
          this.course = response;
        }, error => {
          console.error('Error', error);
        });
      }
    });
  }

  goBack() {
    this.navigationHelperService.goBack();
  }

  closeLoginModal() {
    this.showLoginModal = false;
  }

  showSignInModal() {
    this.showLoginModal = true;
  }

  getCoursePlayerUrl() {
    return `/resources/play/curriculum-course/${this.courseId}`;
  }

  setTelemetryData() {
    this.signInInteractEdata = {
      id: 'signin',
      type: 'click',
      pageid: 'explore-course',
    };
    this.telemetryInteractObject = {
      id: this.courseId,
      type: 'explore-course',
      ver: '1.0'
    };
  }

  private getCourseHierarchy(collectionId: string): Observable<any> {
    const option: any = { params: {} };
    option.params = this.configService.appConfig.PublicPlayer.contentApiQueryParams;
    return this.playerService.getCollectionHierarchy(collectionId, option).pipe(
      map((response: any) => {
        const collectionData = response.result.content;
        collectionData.children = _.orderBy(collectionData.children, ['createdOn'], ['desc']);
        return collectionData;
      }));
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
