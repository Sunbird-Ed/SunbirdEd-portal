// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-event-detail',
//   templateUrl: './event-detail.component.html',
//   styleUrls: ['./event-detail.component.scss']
// })
// export class EventDetailComponent implements OnInit {

//   constructor() { }

//   ngOnInit() {
//   }

// }
import { Component, OnInit } from '@angular/core';
import { LibEventService, EventDetailService, EventService } from 'ngtek-event-library';
// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';

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
  // userId: any = "999";
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
    // this.eventConfig = _.get(this.libEventService.eventConfig, 'context.user');
    this.userId=this.userService.userid;
     this.setEventConfig();
     this.initConfiguration();
     this.getBatch(params.eventId);
  });
}
setEventConfig() {
  // tslint:disable-next-line:max-line-length
  // const additionalCategories = _.merge(this.frameworkService['_channelData'].contentAdditionalCategories, this.frameworkService['_channelData'].collectionAdditionalCategories) || this.config.appConfig.WORKSPACE.primaryCategory;
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
  // this.defaultFilters = this.userService.defaultFrameworkFilters;
  // if (this.utilService.isDesktopApp) {
  //     this.setDesktopFilters(true);
  // }
  // this.numberOfSections = [get(this.configService, 'appConfig.SEARCH.SECTION_LIMIT') || 3];
  this.layoutConfiguration = this.layoutService.initlayoutConfig();
  this.redoLayout();
}

redoLayout() {
// const contentType = _.get(this.getCurrentPageData(), 'contentType');
// if (this.isDesktopApp) {
  this.FIRST_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(0, this.layoutConfiguration, COLUMN_TYPE.threeToNine, true);
  this.SECOND_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(1, this.layoutConfiguration, COLUMN_TYPE.threeToNine, true);
// } else {
//     if (this.layoutConfiguration != null && (contentType !== 'home' && contentType !== 'explore')) {
//         this.FIRST_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(0, this.layoutConfiguration, COLUMN_TYPE.threeToNine, true);
//         this.SECOND_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(1, this.layoutConfiguration, COLUMN_TYPE.threeToNine, true);
//     } else {
//         this.FIRST_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(0, null, COLUMN_TYPE.fullLayout);
//         this.SECOND_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(1, null, COLUMN_TYPE.fullLayout);
//     }
// }
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

}

