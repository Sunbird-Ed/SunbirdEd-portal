import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import _ from 'lodash';
import { ACTIVITY_DASHBOARD, GROUP_DETAILS, MY_GROUPS } from '../../interfaces';
import { GroupsService } from '../../services/groups/groups.service';
import { ActivityDashboardService } from '../../../shared/services/activity-dashboard/activity-dashboard.service';

@Directive({
  selector: '[appActivityDashboard]'
})
export class ActivityDashboardDirective implements OnInit {
  @Input() hierarchyData: any;

  constructor(public router: Router,
    public groupService: GroupsService,
    public activatedRoute: ActivatedRoute,
    public ref: ElementRef,
    public activityDashboardService: ActivityDashboardService) { }

  @HostListener('click', ['$event'])
  onClick(event) {
    this.navigateToActivityDashboard();
  }

  ngOnInit() {
    const isAdded = this.activityDashboardService.isActivityAdded;
    (this.ref.nativeElement as HTMLButtonElement).style.display = isAdded ? 'block' : 'none';
  }
  /**
  * @description - navigate to groups activity dashboard page
  */
  navigateToActivityDashboard() {
    this.addTelemetry('activity-detail', [{ id: _.get(this.hierarchyData, 'identifier'), type: _.get(this.hierarchyData, 'primaryCategory') }]);
    this.router.navigate([`${MY_GROUPS}/${GROUP_DETAILS}`, _.get(this.groupService.groupData, 'id'), `${ACTIVITY_DASHBOARD}`, _.get(this.hierarchyData, 'identifier')],
      {
        state: {
          hierarchyData: this.hierarchyData,
        }
      });
  }

  /**
   * @param  {} id
   * @param  {} cdata
   * @param  {} extra?
   * @param  {} obj?
   */
  addTelemetry(id, cdata, extra?, obj?) {
    this.groupService.addTelemetry({ id, extra }, this.activatedRoute.snapshot, cdata, _.get(this.groupService.groupData, 'id'), obj);
  }
}
