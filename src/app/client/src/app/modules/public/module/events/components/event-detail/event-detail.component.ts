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
import { LibEventService, EventDetailService } from 'ngtek-event-library';
// import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';

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
  constructor(private eventDetailService: EventDetailService ,
    private activatedRoute : ActivatedRoute,
    private libEventService: LibEventService 
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
    this.eventConfig = _.get(this.libEventService.eventConfig, 'context.user');
    this.userId=this.eventConfig.id;   
  });
}

}

