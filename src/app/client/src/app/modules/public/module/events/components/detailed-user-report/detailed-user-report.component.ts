import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { EventService,EventDetailService } from 'ngtek-event-library';
import { map, tap, switchMap, skipWhile, takeUntil, catchError, startWith } from 'rxjs/operators';
import { forkJoin, Subject, Observable, BehaviorSubject, merge, of, concat, combineLatest } from 'rxjs';
import { FrameworkService, UserService } from '@sunbird/core';
import {ToasterService,LayoutService, COLUMN_TYPE}from '@sunbird/shared';

@Component({
  selector: 'app-detailed-user-report',
  templateUrl: './detailed-user-report.component.html',
  styleUrls: ['./detailed-user-report.component.scss']
})
export class DetailedUserReportComponent implements OnInit {
  queryParams: any;
  userEnrollEventDetails: any;
  paginateLimit: number = 5;
  eventUserEnrollData: any;
  eventItem: any;
  attendanceList: any;
  libEventConfig: any;
  layoutConfiguration: any;
  FIRST_PANEL_LAYOUT;
  SECOND_PANEL_LAYOUT;
  public unsubscribe = new Subject<void>();


  constructor(private activatedRoute: ActivatedRoute,
    private eventService: EventService,
     public location:Location,
     private router:Router,
     public userService: UserService,
     public layoutService: LayoutService,
     private eventDetailService: EventDetailService) { }

  ngOnInit(): void {
    this.initConfiguration();
    this.activatedRoute.queryParams.subscribe((params) => {
      this.queryParams =  params;
      console.log("this.queryparames", JSON.parse(this.queryParams.userDetails).event);
    });
    if (this.queryParams) {
       this.attendanceList = JSON.parse(this.queryParams.userDetails).event;
       this.getEnrollEventUsersData(this.attendanceList);
    }
  }

  private initConfiguration() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.redoLayout();
    this.layoutService.switchableLayout().
    pipe(takeUntil(this.unsubscribe)).subscribe(layoutConfig => {
      if (layoutConfig != null) {
        this.layoutConfiguration = layoutConfig.layout;
      }
      this.redoLayout();
    });
   }
 
   redoLayout() {
    if (this.layoutConfiguration != null) {
      // Joyful Theme
      this.FIRST_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(0, this.layoutConfiguration, COLUMN_TYPE.threeToNine, true);
      this.SECOND_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(1, this.layoutConfiguration, COLUMN_TYPE.threeToNine, true);
      // console.log('296 FIRST_PANEL_LAYOUT - ', this.FIRST_PANEL_LAYOUT);
      // console.log('296 SECOND_PANEL_LAYOUT - ', this.SECOND_PANEL_LAYOUT);

    } else {
        // Classic Theme
        this.FIRST_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(0, null, COLUMN_TYPE.fullLayout);
        this.SECOND_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(1, null, COLUMN_TYPE.fullLayout);
        // console.log('302 FIRST_PANEL_LAYOUT - ', this.FIRST_PANEL_LAYOUT);
        // console.log('302 SECOND_PANEL_LAYOUT - ', this.SECOND_PANEL_LAYOUT);

    }
   }
  navigateToEventPage(){
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/explore-events/published']);
    }
 }

 setEventConfig() {
  this.libEventConfig = {
    context: {
      user:this.userService.userProfile,
      identifier: '',
      channel: this.userService.channel,
      authToken: '',
      sid: this.userService.sessionId,
      uid: this.userService.userid,
      additionalCategories: 'additionalCategories',
    },
    config: {
      mode: 'list'
    }
  };
}

getEnrollEventUsersData(list){
  this.attendanceList.joinedLeftHistory.forEach(item => {
    this.eventService.convertDate(item.joinedDateTime);
    this.eventService.convertDate(item.leftDateTime);
    if(item.duration)
    {
      const sec = parseInt(item.duration, 10);
      let hours   = Math.floor(sec / 3600);
      let minutes = Math.floor((sec - (hours * 3600)) / 60);
      let seconds = sec - (hours * 3600) - (minutes * 60);
      item.duration= hours+'HH'+':'+minutes + 'MM' +':'+seconds+'SS'
    }
  });
  this.userEnrollEventDetails = this.attendanceList;
   console.log("eventUserEnrollData Details : ", this.userEnrollEventDetails);
}
}
