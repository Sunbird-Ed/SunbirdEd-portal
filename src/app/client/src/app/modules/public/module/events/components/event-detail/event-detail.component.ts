
import { Component, OnInit } from '@angular/core';
import { LibEventService, EventDetailService, EventService } from 'ngtek-event-library';

import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import { FrameworkService, UserService } from '@sunbird/core';
import {ToasterService, LayoutService, COLUMN_TYPE}from '@sunbird/shared';
@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent implements OnInit {
  eventItem: any;
  eventList: any;

  userId: any;
  eventConfig: any;
  queryParams : any;
  eventDetailItem: any;
  libEventConfig: any;
  layoutConfiguration: any;
  FIRST_PANEL_LAYOUT;
  SECOND_PANEL_LAYOUT;
  batchId: any;
  constructor(private eventDetailService: EventDetailService ,
    private activatedRoute : ActivatedRoute,
    private eventService: EventService ,
    public userService: UserService,
    public frameworkService:FrameworkService,
    public layoutService: LayoutService,
    public router: Router
   ) { }


  showEventDetailPage(identifier) {
    this.eventDetailService.getEvent(identifier).subscribe((data: any) => {
      this.eventItem = data.result.event;
    },
      (err: any) => {
        console.log('err = ', err);
      });
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.queryParams = params;
      console.log( params);
    this.showEventDetailPage(params.eventId);
    this.userId=this.userService.userid;
     this.setEventConfig();
     this.initConfiguration();
     this.getBatch(params.eventId);
  });
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

private initConfiguration() {
  this.layoutConfiguration = this.layoutService.initlayoutConfig();
  this.redoLayout();
}

redoLayout() {
  this.FIRST_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(0, this.layoutConfiguration, COLUMN_TYPE.threeToNine, true);
  this.SECOND_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(1, this.layoutConfiguration, COLUMN_TYPE.threeToNine, true);
}
getBatch(identifier){
  let filters ={
    "courseId": identifier,
    "enrollmentType": "open"
    };
    this.eventService.getBatches(filters).subscribe((res) => {
      this.batchId = res.result.response.content[0].identifier;
      console.log("Batch Id -", this.batchId);
    });
}
navToDashbord(identifier){

  this.router.navigate(['/explore-events/report'],
  { queryParams:  {  identifier: identifier,
        batchid: this.batchId } });
 }

navigateToEventPage() {
  this.router.navigate(['/explore-events/published']);
}
navToEventDetail($event)
  { console.log("In src/event detail");
  this.router.navigate(['/explore-events/detail'],
    {
      queryParams: {
        eventId: $event.identifier
      }
    });

    setTimeout(function(){window.location.reload();
    }, 2000);
  }
}

