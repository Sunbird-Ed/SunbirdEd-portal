import { Component, OnInit } from '@angular/core';
// import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService,EventDetailService } from 'ngtek-event-library';
import { FrameworkService, UserService } from '@sunbird/core';
import {ToasterService,LayoutService, COLUMN_TYPE}from '@sunbird/shared';
import { map, tap, switchMap, skipWhile, takeUntil, catchError, startWith } from 'rxjs/operators';
import { forkJoin, Subject, Observable, BehaviorSubject, merge, of, concat, combineLatest } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-event-report',
  templateUrl: './event-report.component.html',
  styleUrls: ['./event-report.component.scss']
})
export class EventReportComponent implements OnInit {
  enrollData: any;
  queryParams:any;
  userData: any;
  attendanceList: any;
  eventUserEnrollData: any;
  libEventConfig: any;
  eventItem: any;
  layoutConfiguration: any;
  FIRST_PANEL_LAYOUT;
  SECOND_PANEL_LAYOUT;
  isLoading: boolean =  true;
  tab :string= "list";
  p: number = 1;
  public unsubscribe = new Subject<void>();

  constructor( private route: ActivatedRoute,
    private eventService: EventService,
    private router: Router,
    public userService: UserService,
    public layoutService: LayoutService,
    public location:Location,
    private eventDetailService: EventDetailService) { }

  ngOnInit(): void {
    this.initConfiguration();
    // Get the url (query) params
    this.route.queryParams.subscribe((params) => {
      this.queryParams = params;
    });

    // Subsribe to the event detail service and get single event data
    this.eventDetailService.getEvent(this.queryParams.identifier)
        .subscribe((data: any) => {
          this.eventItem = data.result.event;
          this.isLoading = false;
    },(err: any) => {
      console.log('err = ', err);
    });

    this.getAttendanceDetails();
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
  getAttendanceDetails()
  {
    this.eventService.getAttendanceList(this.queryParams.identifier,this.queryParams.batchid).subscribe((data) => {
      this.attendanceList = data.result.content;
      this.getEnrollEventUsersData(this.attendanceList);
    });
  }

  convert(event) {
    var date = new Date(event),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);

    var datestr = [date.getFullYear(), mnth, day].join("/");

    return datestr;
  }
   navigateToEventPage(){
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/explore-events/published']);
    }
 }
  getEnrollEventUsersData(list){
    this.attendanceList.forEach(item => {
      console.log("getAttendanceList Details : ", item);
      this.eventService.convertDate(item.enrolledDate);
      if(item.duration)
      {
        const sec = parseInt(item.duration, 10);
        let hours   = Math.floor(sec / 3600);
        let minutes = Math.floor((sec - (hours * 3600)) / 60);
        let seconds = sec - (hours * 3600) - (minutes * 60);
        item.duration= hours+'HH'+':'+minutes + 'MM' +':'+seconds+'SS'
      }
    });
    this.eventUserEnrollData = this.attendanceList;
     console.log("eventUserEnrollData Details : ", this.eventUserEnrollData);
  }
  // navToDetailedAttendance($event)
  navToDetailedAttendance(event){
    this.router.navigate(['/explore-events/detailed-user-report'],
    { queryParams:  { "userDetails": JSON.stringify({event})} });
  }
}
