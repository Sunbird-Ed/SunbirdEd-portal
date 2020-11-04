import { combineLatest, Subject, throwError } from 'rxjs';
import { map, mergeMap, first, takeUntil, delay } from 'rxjs/operators';
import { ResourceService, ToasterService, ConfigService, NavigationHelperService, LayoutService } from '@sunbird/shared';
import { CourseConsumptionService, CourseBatchService } from './../../../services';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import { CoursesService, PermissionService } from '@sunbird/core';
import * as dayjs from 'dayjs';
import { GroupsService } from '../../../../groups/services/groups/groups.service';
@Component({
  templateUrl: './course-consumption-page.component.html'
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
  constructor(private activatedRoute: ActivatedRoute, private configService: ConfigService,
    private courseConsumptionService: CourseConsumptionService, private coursesService: CoursesService,
    public toasterService: ToasterService, public courseBatchService: CourseBatchService,
    private resourceService: ResourceService, public router: Router, private groupsService: GroupsService,
    public navigationHelperService: NavigationHelperService, public permissionService: PermissionService,
    public layoutService: LayoutService) {
  }
  ngOnInit() {
    this.initLayout();
    this.coursesService.enrolledCourseData$.pipe(first(),
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
        const paramsObj = {params: this.configService.appConfig.CourseConsumption.contentApiQueryParams};
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
      }), delay(200), takeUntil(this.unsubscribe$))
      .subscribe(({ courseHierarchy, enrolledBatchDetails }: any) => {
        this.enrolledBatchInfo = enrolledBatchDetails;
        this.courseHierarchy = courseHierarchy;
        this.checkCourseStatus(courseHierarchy);
        this.updateBreadCrumbs();
        this.showLoader = false;
      }, (err) => {
        if (_.get(err, 'error.responseCode') && err.error.responseCode === 'RESOURCE_NOT_FOUND') {
          this.toasterService.error(this.resourceService.messages.emsg.m0002);
        } else {
          this.toasterService.error(this.resourceService.messages.fmsg.m0003); // fmsg.m0001 for enrolled issue
        }
        this.navigationHelperService.navigateToResource('/learn');
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
    const allBatchesOfCourse = _.filter(enrolledCourses, { courseId })
      .sort((cur: any, prev: any) => dayjs(cur.enrolledDate).valueOf() > dayjs(prev.enrolledDate).valueOf() ? -1 : 1);
    const curBatch = _.find(allBatchesOfCourse, { batchId }); // find batch matching route batchId
    if (curBatch) { // activateRoute batch found
      return curBatch;
    }
    if (allBatchesOfCourse[0]) { // recently enrolled batch found
      return allBatchesOfCourse[0];
    }
    return; // no batch found
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
      this.toasterService.warning(this.resourceService.messages.imsg.m0026);
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
}
