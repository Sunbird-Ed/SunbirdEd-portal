import { Component, OnInit } from '@angular/core';
import * as  MyEventList from '../../interface/MyEventList';
import * as  MyCalendarList  from '../../interface/MyCalendarList';
import {EventListService, EventFilterService} from 'ngtek-event-library';
import { EventCreateService } from 'ngtek-event-library';
import { Router } from '@angular/router';

import {CalendarEvent} from 'angular-calendar';
import { LibraryFiltersLayout } from '@project-sunbird/common-consumption-v9';
import * as MyEventLFilter from '../../interface/MyEventLFilter'
const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  yellow: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
};


@Component({
  selector: 'app-event-view-type',
  templateUrl: './event-view-type.component.html',
  styleUrls: ['./event-view-type.component.scss']
})
export class EventViewTypeComponent implements OnInit {
  public filterLayout = LibraryFiltersLayout;
  tab: string = "list";
  eventList : any;
  events: CalendarEvent[];
  eventCalender:any;
  allValues = ['ListView','Calender'];
  filterConfig: any;
  myEvents: any;
  isLoading: boolean = true;
  userId: any = "1001";
  formFieldProperties: any;
            
              
  constructor(public eventListService: EventListService,
    public eventFilterService: EventFilterService,
    private eventCreateService: EventCreateService,
    // private eventDetailService: EventDetailService,
    private router: Router,) { }

  ngOnInit() {
     
    // this.eventtype();

    this.showEventListPage();
    this.showFilters();
    this.showCalenderEvent(MyCalendarList);
    this.showEventCreatePage();
  }

  showEventListPage(){
    this.eventListService.getEventList().subscribe((data:any)=>{
       console.log("listdata = ", data.result.events);
      this.eventList = data.result.events;
      this.isLoading = false;
    },
      (err: any) => {
        console.log('err = ', err);
      });
    // this.eventList = MyEventListData.MyEventList.result.events;
    // this.myEvents= MyEventListData.MyEventList.result.events;
    
  }


  showEventCreatePage() {
    this.eventCreateService.getEventFormConfig().subscribe((data: any) => {
      console.log('EventCreatedata = ',data);
      this.formFieldProperties = data.result['form'].data.fields;
      this.isLoading = false;
      console.log('EventCreate = ',data.result['form'].data.fields);
    },err=>{console.error("hi", err);}
    )
      // this.formFieldProperties = eventCreateFields.eventCreate.result['form'].data.fields;
      // console.log('EventCreate.fields = ',this.formFieldProperties);

  }

  showCalenderEvent(MyCalendarData) {
 
      console.log("data = ");
      this.eventCalender = MyCalendarData.MyCalendarList.result.content;
      console.log("2",this.eventCalender );
      console.log(this.eventCalender)
      this.events = this.eventCalender.map(obj => ({
        start: new Date(obj.startDate),
        title: obj.name,
        starttime: obj.startTime,
        end: new Date(obj.endDate),
        color: colors.red,
        cssClass: obj.color,
        status: obj.status,
        onlineProvider: obj.onlineProvider,
        audience: obj.audience,
        owner: obj.owner,
        identifier: "do_11322182566085427211",

      }));

     
    // })
  }
  showFilters() {
      this.eventFilterService.getFilterFormConfig().subscribe((data: any) => {
        this.filterConfig = data.result['form'].data.fields;
        this.isLoading = false;
  
        console.log('eventfilters = ',data.result['form'].data.fields);
      },
      (err: any) => {
        console.log('err = ', err);
      });
     }

  eventtype($event){
    console.log($event);
  if($event.data.text=='ListView'){
    this.tab = 'list';
  }
  else {
    this.tab = 'calender';
  }
  }


  // Openview(view) {  
  //   if (view == 'list') {    
  //   } 
  //    else if (view == 'calender') {
      
  //     //this.router.navigate(['/calender']);
  //    }
  //    //this.eventList = MyEventListData.MyEventList.result.events;

  // }

  
}
