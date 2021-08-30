import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import _ from 'lodash';
import { ACTIVITY_DASHBOARD, GROUP_DETAILS, MY_GROUPS } from '../../../groups/interfaces';
import { GroupsService } from '../../../groups/services/groups/groups.service'

@Directive({
  selector: '[appActivityDashbord]'
})
export class ActivityDashbordDirective implements OnInit {
  @Input() hierarchyData: any;

  constructor(public router: Router,
    public groupService: GroupsService,
    public activatedRoute: ActivatedRoute,
    public ref: ElementRef) { }

  @HostListener('click', ['$event'])
  onClick(event) {
    this.navigateToActivityDashboard();
  }

  ngOnInit() {
    console.log('hierarchyData', this.hierarchyData);
    const isAdded = this.groupService.isActivityAdded;
    console.log('isadded', isAdded);
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
