import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, SearchService } from '@sunbird/core';
import { ResourceService, ToasterService, LayoutService, UtilService, ConfigService } from '@sunbird/shared';
import { IImpressionEventInput } from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import { combineLatest, Subject } from 'rxjs';
import { concatMap, debounceTime, delay, map, takeUntil, tap } from 'rxjs/operators';
import { GroupsService } from './../../../services';
import { IActivity } from '../activity-list/activity-list.component';
import { PublicPlayerService } from '@sunbird/public';
import { ACTIVITY_DASHBOARD, MY_GROUPS, GROUP_DETAILS } from '../../../interfaces/routerLinks';
@Component({
  selector: 'app-activity-details',
  templateUrl: './activity-details.component.html',
  styleUrls: ['./activity-details.component.scss']
})
export class ActivityDetailsComponent implements OnInit, OnDestroy {

  @ViewChild('searchInputBox', {static: false}) searchInputBox;
  unsubscribe$ = new Subject<void>();
  showLoader = true;
  queryParams;
  activityId: string;
  groupId: string;
  groupData;
  activity: IActivity;
  memberListToShow = [];
  showSearchResults = false;
  memberCardConfig = { size: 'small', isBold: false, isSelectable: false, view: 'horizontal' };
  enrolmentCount: number;
  leafNodesCount: number;
  membersCount: number;
  members;
  telemetryImpression: IImpressionEventInput;
  loaderMessage = _.get(this.resourceService.messages.fmsg, 'm0087');
  layoutConfiguration: any;
  memberListUpdatedOn: string;
  nestedCourses = [];
  selectedCourse;
  dropdownContent = true;
  parentId: string;
  public csvExporter: any;
  activityType: string;

  constructor(
    public resourceService: ResourceService,
    private activatedRoute: ActivatedRoute,
    private groupService: GroupsService,
    private toasterService: ToasterService,
    private userService: UserService,
    private router: Router,
    private layoutService: LayoutService,
    private playerService: PublicPlayerService,
    private searchService: SearchService,
    private utilService: UtilService,
    private configService: ConfigService,
  ) { }

  ngOnInit() {
    this.initLayout();
    this.fetchActivityOnParamChange();
    this.telemetryImpression = this.groupService.getImpressionObject(this.activatedRoute.snapshot, this.router.url);
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

  private fetchActivityOnParamChange() {
    combineLatest([this.activatedRoute.params, this.activatedRoute.queryParams])
      .pipe(debounceTime(5), // to sync params and queryParams events
        delay(10), // to trigger page exit telemetry event
        tap(data => {
          this.showLoader = true;
        }),
        map((result) => ({ params: { groupId: result[0].groupId, activityId: result[0].activityId }, queryParams: result[1] })),
        takeUntil(this.unsubscribe$))
        .subscribe(({ params, queryParams }) => {
        this.queryParams = { ...queryParams };
        this.groupId = params.groupId;
        this.activityId = params.activityId;
        this.activityType = _.get(this.queryParams, 'primaryCategory') || 'Course';
        this.fetchActivity(this.activityType);
      });
  }

  validateUser(group) {
    const user = _.find(_.get(group, 'members'), (m) => _.get(m, 'userId') === this.userService.userid);
    /* istanbul ignore else */
    if (!user || _.get(user, 'role') === 'member' || _.get(user, 'status') === 'inactive' || _.get(group, 'status') === 'inactive') {
      this.toasterService.warning(this.resourceService.messages.emsg.noAdminRoleActivity);
      this.groupService.goBack();
    }
  }

  fetchActivity(type: string) {
    const activityData = { id: this.activityId, type };
    this.groupService.getGroupById(this.groupId, true, true).pipe(tap(res => {
      this.validateUser(res);
    }), concatMap(res => {
        this.groupData = res;
        return this.groupService.getActivity(this.groupId, activityData, res);
    })).subscribe(data => {
        this.getActivityInfo();
        if (_.get(this.queryParams, 'mimeType') === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.collection) {
          this.checkForNestedCourses(data);
        } else {
          this.getContent(data);
        }
    }, err => {
      console.error('Error', err);
      this.navigateBack();
    });
  }

  navigateBack () {
    this.showLoader = false;
    this.toasterService.error(this.resourceService.messages.emsg.m0005);
    this.groupService.goBack();
  }
  search(searchKey: string) {
    searchKey = _.toLower(searchKey);
    if (searchKey.trim().length) {
      this.showSearchResults = true;
      this.memberListToShow = this.members.filter(item => _.toLower(item.title).includes(searchKey));
      this.addTelemetry('activity-dashboard-member-search', [], { query: searchKey });
    } else {
      this.showSearchResults = false;
      this.memberListToShow = _.cloneDeep(this.members);
    }
  }

  processData(aggResponse: any) {
    const enrolmentInfo = _.find(aggResponse.activity.agg, { metric: 'enrolmentCount' });
    this.leafNodesCount = _.get(this.selectedCourse, 'leafNodesCount') || 0;
    this.enrolmentCount = _.get(enrolmentInfo, 'value');
    this.membersCount = _.get(aggResponse, 'members.length');
    this.memberListUpdatedOn = _.max(_.get(aggResponse, 'activity.agg').map(agg => agg.lastUpdatedOn));
    this.members = aggResponse.members.map((item, index) => {
      /* istanbul ignore else */
      if (_.get(item, 'status') === 'active') {
        const completedCount = _.get(_.find(item.agg, { metric: 'completedCount' }), 'value');
        const userProgress = {
          title: _.get(item, 'userId') === this.userService.userid ?
          `${_.get(item, 'name')}(${this.resourceService.frmelmnts.lbl.you})` : _.get(item, 'name'),
          identifier: _.get(item, 'userId'),
          initial: _.get(item, 'name[0]'),
          indexOfMember: index
        };

        if (this.isContentTrackable(this.activity, _.get(this.activity, 'contentType'))) {
          const progress = completedCount ? _.toString(Math.round((completedCount / this.leafNodesCount) * 100)) || '0' : '0';
          userProgress['progress'] = progress >= 100 ? '100' : progress;
        }

        return userProgress;
      }
    });

    this.memberListToShow = this.getSortedMembers();
  }

  getSortedMembers() {
    // sorting by name - alpha order
    const sortedMembers = this.members.sort((a, b) =>
    ((a.title).toLowerCase() > (b.title).toLowerCase()) ? 1 : (((b.title).toLowerCase() > (a.title).toLowerCase()) ? -1 : 0));
    // const sortMembersByProgress = [];
    // const sortMembersByName = [];
    // _.map(_.cloneDeep(this.members), member => {
    //   if (_.get(member, 'identifier') !== this.userService.userid) {
    //     _.get(member, 'progress') > 0 ? sortMembersByProgress.push(member) :  sortMembersByName.push(member);
    //   }
    // });
    // const currentUser = _.find(this.members, {identifier: this.userService.userid});
    // const sortedMembers = _.sortBy(sortMembersByProgress, 'progress', 'dsc').concat(_.sortBy(sortMembersByName, 'title', 'asc'));
    // sortedMembers.unshift(currentUser);
    return sortedMembers || [];
  }

  getActivityInfo() {
    const activityData = _.find(this.groupData.activities, ['id', this.activityId]);
    this.activity = _.get(activityData, 'activityInfo');
  }

  addTelemetry(id, cdata, extra?, obj?) {
    this.groupService.addTelemetry({id, extra}, this.activatedRoute.snapshot, cdata, this.groupId, obj);
  }

  checkForNestedCourses(activityData) {
  this.playerService.getCollectionHierarchy(this.activityId, {})
  .pipe(takeUntil(this.unsubscribe$))
  .subscribe((data) => {
    const courseHierarchy = data.result.content;
    this.parentId = _.get(courseHierarchy, 'identifier');
    this.updateArray(courseHierarchy);
    const childCourses = this.flattenDeep(courseHierarchy.children).filter(c => c.contentType === 'Course');
    if (childCourses.length > 0) {
      childCourses.map((course) => {
        this.updateArray(course);
      });
    }
    this.processData(activityData);
    this.showLoader = false;
  }, err => {
    this.toasterService.error(this.resourceService.messages.fmsg.m0051);
    this.navigateBack();
    });
  }

  getContent(activityData) {
    this.playerService.getContent(this.activityId, {})
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((data) => {
      const courseHierarchy = data.result.content;
      this.updateArray(courseHierarchy);
      this.processData(activityData);
      this.showLoader = false;
    }, err => {
      this.toasterService.error(this.resourceService.messages.fmsg.m0051);
      this.navigateBack();
    });
  }

  updateArray(course) {
    this.nestedCourses.push({
    identifier: _.get(course, 'identifier'),
    name: _.get(course, 'name'),
    leafNodesCount: _.get(course, 'leafNodesCount') || 0,
    pkgVersion: _.get(course, 'pkgVersion') ? `${_.get(course, 'pkgVersion')}` : '1.0',
    primaryCategory: _.get(course, 'primaryCategory')
  });
    this.selectedCourse = this.nestedCourses[0];
  }

  flattenDeep(contents) {
    if (contents) {
      return contents.reduce((acc, val) => {
        if (val.children) {
          acc.push(val);
          return acc.concat(this.flattenDeep(val.children));
        } else {
          return acc.concat(val);
        }
      }, []);
    }
    return [];
  }

  handleSelectedCourse(course) {
    this.searchInputBox.nativeElement.value = '';
    this.selectedCourse = course;
    this.toggleDropdown();
    const activityData = { id: this.selectedCourse.identifier, type: 'Course'};
    this.groupService.getActivity(this.groupId, activityData, this.groupData)
      .subscribe((data) => {
        this.showLoader = false;
        this.processData(data);
      }, error => {
        this.showLoader = false;
        console.error('Error', error);
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
        this.groupService.goBack();
      });
  }
  toggleDropdown() {
    this.dropdownContent = !this.dropdownContent;
  }

  isContentTrackable (content, type) {
    return this.searchService.isContentTrackable(content, type);
  }

  showActivityType() {
    return _.lowerCase(_.get(this.queryParams, 'title'));
  }

  downloadCSVFile() {
    this.addTelemetry('download-csv', [], {},
    {id: _.get(this.selectedCourse, 'identifier'), type: _.get(this.selectedCourse, 'primaryCategory'), ver: _.get(this.selectedCourse, 'pkgVersion')});

    const data = _.map(this.memberListToShow, member => {
      const name = _.get(member, 'title');
      return {
        courseName: _.get(this.selectedCourse, 'name'),
        memberName: name.replace('(You)', ''),
        progress: _.get(member, 'progress') + '%'
      };
    });
    this.utilService.downloadCSV(this.selectedCourse, data);
  }


  /**
   * @description - navigate to activity dashboard page
   */
  navigateToActivityDashboard() {
    this.addTelemetry('activity-detail', [{id: _.get(this.activity, 'identifier'), type: _.get(this.activity, 'resourceType')}]);
    const options = { relativeTo: this.activatedRoute, queryParams: { primaryCategory: this.activityType,
    title: this.activityType, mimeType: _.get(this.activity, 'mimeType'), groupId: _.get(this.groupData, 'id')}};
    this.router.navigate([`${MY_GROUPS}/${GROUP_DETAILS}`, _.get(this.groupData, 'id'), `${ACTIVITY_DASHBOARD}`, _.get(this.activity, 'identifier')],
     {queryParams: options.queryParams});
}


  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
