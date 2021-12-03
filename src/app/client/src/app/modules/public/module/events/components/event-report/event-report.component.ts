import { Component, OnInit } from '@angular/core';
// import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService,EventDetailService } from 'ngtek-event-library';
import { FrameworkService, UserService } from '@sunbird/core';
import {ToasterService,LayoutService, COLUMN_TYPE}from '@sunbird/shared';
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

  constructor( private route: ActivatedRoute,
    private eventService: EventService,
    private router: Router,
    public userService: UserService,
    public layoutService: LayoutService,
    private eventDetailService: EventDetailService) { }

  ngOnInit(): void {
    this.initConfiguration();
    // Get the url (query) params
    this.route.queryParams.subscribe((params) => {
      this.queryParams = params;
      console.log("queryParams", this.queryParams);
    });

    // Subsribe to the event detail service and get single event data
    this.eventDetailService.getEvent(this.queryParams.identifier)
        .subscribe((data: any) => {
          this.eventItem = data.result.event;
          this.isLoading = false;
          console.log('Event Dash bord - ', this.eventItem);
    },(err: any) => {
      console.log('err = ', err);
    });

    this.getAttendanceDetails();
  }

  private initConfiguration() {
   this.layoutConfiguration = this.layoutService.initlayoutConfig();
   this.redoLayout();
  }

  redoLayout() {
    this.FIRST_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(0, this.layoutConfiguration, COLUMN_TYPE.threeToNine, true);
    this.SECOND_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(1, this.layoutConfiguration, COLUMN_TYPE.threeToNine, true);
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

  // getEnrollEventUsersData(list){
  //   this.attendanceList.forEach(item => {
  //     this.eventService.convertDate(item.enrolledDate);
  //   });
  //   this.eventUserEnrollData = this.attendanceList;
  // }
  convert(event) {
    var date = new Date(event),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);

    var datestr = [date.getFullYear(), mnth, day].join("/");

    return datestr;
  }
  navigateToEventPage(){
     this.router.navigate(['/explore-events/published']);
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
        console.log(hours+':'+minutes +':'+seconds);
        item.duration = hours +':'+ minutes +':'+ seconds;
      }
    });
    this.eventUserEnrollData = this.attendanceList;
     console.log("eventUserEnrollData Details : ", this.eventUserEnrollData);
  }
}
