import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResourceService } from '@sunbird/shared';
import { combineLatest, Subject } from 'rxjs';
import { debounceTime, delay, map, takeUntil, tap } from 'rxjs/operators';
import { IActivity } from '../activity-list/activity-list.component';

@Component({
  selector: 'app-activity-dashboard',
  templateUrl: './activity-dashboard.component.html',
  styleUrls: ['./activity-dashboard.component.scss']
})
export class ActivityDashboardComponent implements OnInit {
  unsubscribe$ = new Subject<void>();
  showLoader = false;
  queryParams;
  activityId: string;
  groupId: string;
  activity: IActivity;
  groupMembers = [];
  memberCardConfig = { size: 'small', isBold: false, isSelectable: false, view: 'horizontal' };
  loaderMessage = this.resourceService.messages.fmsg.m0087;
  constructor(
    public resourceService: ResourceService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.fetchActivityOnParamChange();
  }

  private fetchActivityOnParamChange() {
    combineLatest([this.activatedRoute.params, this.activatedRoute.queryParams])
      .pipe(debounceTime(5), // to sync params and queryParams events
        delay(10), // to trigger pageexit telemetry event
        tap(data => {
          this.showLoader = true;
          // TODO set telemetry here
        }),
        map((result) => ({ params: { groupId: result[0].groupId, activityId: result[0].activityId }, queryParams: result[1] })),
        takeUntil(this.unsubscribe$))
      .subscribe(({ params, queryParams }) => {
        this.queryParams = { ...queryParams };
        this.groupId = params.groupId;
        this.activityId = params.activityId;
        this.fetchActivity();
      });
  }

  fetchActivity() {
    // this.groupService.getGroupById(this.groupId).pipe(takeUntil(this.unsubscribe$)).subscribe(groupData => {
    //   this.groupData = groupData;
    // }, err => {
    //   this.toasterService.error(this.resourceService.messages.emsg.m002);
    // });
    setTimeout(() => {
      this.showLoader = false;
      this.activity = {
        name: 'Social Science',
        identifier: 'do_123523212190',
        appIcon: 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3129265279296552961416/artifact/book_2_1491393340123.thumb_1577945304197.png',
        organisation: ['Pre-prod Custodian Organization'],
        subject: 'Social Science'
      };

      this.groupMembers = [
        {
          identifier: '1',
          initial: 'J',
          title: 'John Doe',
          isAdmin: true,
          isMenu: false,
          indexOfMember: 1,
          isCreator: true,
          progress: '0'
        },
        {
          identifier: '2',
          initial: 'P',
          title: 'Paul Walker',
          isAdmin: false,
          isMenu: true,
          indexOfMember: 5,
          isCreator: false,
          progress: 100
        }, {
          identifier: '6',
          initial: 'R',
          title: 'Robert Downey',
          isAdmin: true,
          isMenu: true,
          indexOfMember: 7,
          isCreator: true,
          progress: '37'
        }
      ];
    }, 10);
  }
}
