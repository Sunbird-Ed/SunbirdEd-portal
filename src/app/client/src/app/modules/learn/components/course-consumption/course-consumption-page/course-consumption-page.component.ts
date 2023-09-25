import { combineLatest, Subject, throwError, BehaviorSubject } from 'rxjs';
import { map, mergeMap, first, takeUntil, delay, switchMap } from 'rxjs/operators';
import { ResourceService, ToasterService, ConfigService, NavigationHelperService, LayoutService } from '@sunbird/shared';
import { CourseConsumptionService, CourseBatchService } from './../../../services';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import { CoursesService, PermissionService, GeneraliseLabelService } from '@sunbird/core';
import dayjs from 'dayjs';
import { GroupsService } from '../../../../groups/services/groups/groups.service';
import { CoursePageContentService } from "../../../services/course-page-content.service"
@Component({
  templateUrl: './course-consumption-page.component.html',
  styleUrls: ['./course-consumption-page.component.scss']
})
export class CourseConsumptionPageComponent implements OnInit, OnDestroy {
  public courseId: string;
  public batchId: string;
  public showLoader = true;
  public showError = false;
  public courseHierarchy: any;
  public unsubscribe$ = new Subject<void>();
  public enrolledBatchInfo: any;
  public groupId: string;
  public showAddGroup = null;
  layoutConfiguration;
  showBatchInfo: boolean;
  courseTabs: any;
  selectedCourseBatches: { onGoingBatchCount: any; expiredBatchCount: any; openBatch: any; inviteOnlyBatch: any; courseId: any; };
  obs$;
  private fetchEnrolledCourses$ = new BehaviorSubject<boolean>(true);
  config:any;
  configContent: any;
  tocList = []

  constructor(private activatedRoute: ActivatedRoute, private configService: ConfigService,
    private courseConsumptionService: CourseConsumptionService, private coursesService: CoursesService,
    public toasterService: ToasterService, public courseBatchService: CourseBatchService,
    private resourceService: ResourceService, public router: Router, private groupsService: GroupsService,
    public navigationHelperService: NavigationHelperService, public permissionService: PermissionService,
    public layoutService: LayoutService, public generaliseLabelService: GeneraliseLabelService, public coursePageContentService: CoursePageContentService) {
  }
  ngOnInit() {
    this.initLayout();
    this.fetchEnrolledCourses$.pipe(switchMap(this.handleEnrolledCourses.bind(this)))
      .subscribe(({ courseHierarchy, enrolledBatchDetails }: any) => {
        this.enrolledBatchInfo = enrolledBatchDetails;
        this.courseHierarchy = courseHierarchy;
        this.courseHierarchy['mimeTypeObjs'] = JSON.parse(this.courseHierarchy.mimeTypesCount);
        this.layoutService.updateSelectedContentType.emit(courseHierarchy.contentType);
        this.getGeneraliseResourceBundle();
        this.checkCourseStatus(courseHierarchy);
        this.updateBreadCrumbs();
        this.updateCourseContent()
        this.showLoader = false;
        this.config = {
          className:'dark-background',
          title: this.courseHierarchy.name, 
          description: this.courseHierarchy.description,
          contentType: this.courseHierarchy.contentType,
          image:this.courseHierarchy.appIcon || 'assets/common-consumption/images/abstract_02.svg',
          keywords: this.courseHierarchy.keywords,
          rating:4.2,
          numberOfRating:'123 ratings',
          duration:'12h'
        };
      }, err => {
        if (_.get(err, 'error.responseCode') && err.error.responseCode === 'RESOURCE_NOT_FOUND') {
          this.toasterService.error(this.generaliseLabelService.messages.emsg.m0002);
        } else {
          this.toasterService.error(this.resourceService.messages.fmsg.m0003); // fmsg.m0001 for enrolled issue
        }
        this.navigationHelperService.navigateToResource('/learn');
      });
      this.coursePageContentService.getCoursePageContent().subscribe((res:any) => {
        this.courseTabs = res.courseTabs.data;
        this.configContent = res;
    })
  }

  private handleEnrolledCourses() {
    return this.coursesService.enrolledCourseData$.pipe(first(),
      mergeMap(({ enrolledCourses }) => {
        const routeParams: any = { ...this.activatedRoute.snapshot.params, ...this.activatedRoute.snapshot.firstChild.params };
        const queryParams = this.activatedRoute.snapshot.queryParams;
        this.courseId = routeParams.courseId;
        this.groupId = queryParams.groupId;

        if (this.groupId) {
          this.getGroupData();
        } else {
          this.showAddGroup = false;
        }
        const paramsObj = { params: this.configService.appConfig.CourseConsumption.contentApiQueryParams };
        const enrollCourses: any = this.getBatchDetailsFromEnrollList(enrolledCourses, routeParams);
        if (routeParams.batchId && !enrollCourses) { // batch not found in enrolled Batch list
          return throwError('ENROLL_BATCH_NOT_EXIST');
        }
        if (enrollCourses) { // batch found in enrolled list
          this.batchId = enrollCourses.batchId;
          if (enrollCourses.batchId !== routeParams.batchId) { // if batch from route dint match or not present
            this.router.navigate([`learn/course/${this.courseId}/batch/${this.batchId}`]); // but course was found in enroll list
          }
        } else {
          // if query params has batch and autoEnroll=true then auto enroll to that batch
          if (queryParams.batch && queryParams.autoEnroll) {
            if (this.permissionService.checkRolesPermissions(['COURSE_MENTOR'])) {
              this.router.navigate([`learn/course/${this.courseId}`]); // if user is mentor then redirect to course TOC page
            } else {
              const reqParams = {
                queryParams: { autoEnroll: queryParams.autoEnroll }
              };
              this.router.navigate([`learn/course/${this.courseId}/enroll/batch/${queryParams.batch}`], reqParams);
            }
          }
        }
        return this.getDetails(paramsObj);
      }), delay(200),
      takeUntil(this.unsubscribe$));
  }

  getGeneraliseResourceBundle() {
    this.resourceService.languageSelected$.pipe(takeUntil(this.unsubscribe$)).subscribe(item => {
      this.generaliseLabelService.initialize(this.courseHierarchy, item.value);
    });
  }

  initLayout() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.layoutService.switchableLayout().
      pipe(takeUntil(this.unsubscribe$)).subscribe(layoutConfig => {
        if (layoutConfig != null) {
          this.layoutConfiguration = layoutConfig.layout;
        }
      });
  }
  private getBatchDetailsFromEnrollList(enrolledCourses = [], { courseId, batchId }) {
    this.showBatchInfo = false;
    const allBatchesOfCourse = _.filter(enrolledCourses, { courseId })
      .sort((cur: any, prev: any) => dayjs(cur.enrolledDate).valueOf() > dayjs(prev.enrolledDate).valueOf() ? -1 : 1);
    const curBatch = _.find(allBatchesOfCourse, { batchId }); // find batch matching route batchId
    if (curBatch) { // activateRoute batch found
      return curBatch;
    }

    const { onGoingBatchCount, expiredBatchCount, openBatch, inviteOnlyBatch } = this.coursesService.findEnrolledCourses(courseId);
    if (!expiredBatchCount && !onGoingBatchCount) {
      return _.get(allBatchesOfCourse, '[0]') || null;
    } else {
      if (onGoingBatchCount === 1) {
        return _.get(openBatch, 'ongoing.length') ? _.get(openBatch, 'ongoing[0]') : _.get(inviteOnlyBatch, 'ongoing[0]');
      } else {
        this.selectedCourseBatches = { onGoingBatchCount, expiredBatchCount, openBatch, inviteOnlyBatch, courseId };
        this.showBatchInfo = true;
        return _.get(allBatchesOfCourse, '[0]') || null;
      }
    }
  }
  private getDetails(queryParams) {
    if (this.batchId) {
      return combineLatest(
        this.courseConsumptionService.getCourseHierarchy(this.courseId, queryParams),
        this.courseBatchService.getEnrolledBatchDetails(this.batchId)
      ).pipe(map(result => ({ courseHierarchy: result[0], enrolledBatchDetails: result[1] })));
    } else {
      return this.courseConsumptionService.getCourseHierarchy(this.courseId, queryParams)
        .pipe(map(courseHierarchy => ({ courseHierarchy })));
    }
  }
  private checkCourseStatus(courseHierarchy) {
    if (!['Live', 'Unlisted', 'Flagged'].includes(courseHierarchy.status)) {
      this.toasterService.warning(this.generaliseLabelService.messages.imsg.m0026);
      this.router.navigate(['/learn']);
    }
  }
  private updateBreadCrumbs() {
    if (this.batchId) {
      // this.breadcrumbsService.setBreadcrumbs([{
      //   label: this.courseHierarchy.name,
      //   url: '/learn/course/' + this.courseId + '/batch/' + this.batchId
      // }]);
    } else {
      // this.breadcrumbsService.setBreadcrumbs([{
      //   label: this.courseHierarchy.name,
      //   url: '/learn/course/' + this.courseId
      // }]);
    }
  }

  getGroupData() {
    this.groupsService.getGroupById(this.groupId, true, true).pipe(takeUntil(this.unsubscribe$)).subscribe(groupData => {
      this.groupsService.groupData = _.cloneDeep(groupData);
      this.showAddGroup = _.get(this.groupsService.addGroupFields(groupData), 'isAdmin');
    }, err => {
      this.showAddGroup = false;
      this.toasterService.error(this.resourceService.messages.emsg.m002);
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  refreshComponent(isRouteChanged: boolean) {
    this.showBatchInfo = false;
    isRouteChanged && this.fetchEnrolledCourses$.next(true); // update component only if batch is changed.
  }

  addWishList(){
    console.log('Add to wish list');
  }

  updateCourseContent() {
    this.courseHierarchy.children.forEach((resource:any) => {
     let toc = {
            header:{
              title:resource.name,
              progress:75,
              totalDuration:'00m'
            },
            body: []
          }
        toc.body = resource.children.map((c:any) => {
          return {
            name:c.name,
            mimeType:c.contentType,
            durations:'00m',
            selectedContent: c.identifier,
            children: c
          }
        });
        this.tocList.push(toc)
    })
  }

  contentClicked(event: any) {
    this.router.navigate(['/learn/course/play',this.courseHierarchy.identifier], 
    { 
      queryParams: { 
        courseId: this.courseHierarchy.identifier,
        courseName: this.courseHierarchy.name,
        selectedContent:  event.content.selectedContent
      } 
    });
  }
}
