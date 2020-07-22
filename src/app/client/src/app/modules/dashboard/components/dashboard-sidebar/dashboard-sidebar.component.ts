import { ResourceService } from '@sunbird/shared';
import { Subject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-sidebar',
  templateUrl: './dashboard-sidebar.component.html',
  styleUrls: ['./dashboard-sidebar.component.scss']
})
export class DashboardSidebarComponent implements OnInit, OnDestroy {
  public unsubscribe$ = new Subject<void>();
  constructor(public resourceService: ResourceService, public router: Router) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
