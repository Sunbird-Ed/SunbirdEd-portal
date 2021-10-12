import { Component, OnInit } from '@angular/core';
import * as  MyEventList from '../../interface/MyEventList';
import * as  MyCalendarList  from '../../interface/MyCalendarList';
import {EventListService, EventFilterService} from 'ngtek-event-library';
import { EventCreateService } from 'ngtek-event-library';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import { FrameworkService, UserService } from '@sunbird/core';
import {CalendarEvent} from 'angular-calendar';
import { LibraryFiltersLayout } from '@project-sunbird/common-consumption-v9';
import * as MyEventLFilter from '../../interface/MyEventLFilter';
import {ToasterService}from '@sunbird/shared';
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
  myEvents: any[];
  isLoading: boolean = true;
  userId: any = "1001";
  formFieldProperties: any;
  Filterdata: any;     
  libEventConfig:any; 
  dates: any;
  tommorrowDate:any;
  todayDate:any;
  yesterdayDate: any;
  query: any;
  constructor(public eventListService: EventListService,
    public eventFilterService: EventFilterService,
    private eventCreateService: EventCreateService,
    // private eventDetailService: EventDetailService,
    private router: Router,public userService: UserService,
    public frameworkService:FrameworkService, public toasterService:ToasterService) { }

  ngOnInit() {
     
    // this.eventtype();

    this.showEventListPage();
    this.showMyEventListPage();
    this.showFilters();
    // this.showCalenderEvent(MyCalendarList);
    this.showCalenderEvent();
    this.setEventConfig();
  }

  showEventListPage(){
    this.Filterdata = {
      "status":["live"],
      "objectType": "Event"
      };
      
      this.eventListService.getEventList(this.Filterdata).subscribe((data:any)=>{
        console.log("listdata = ", data);
      
      this.eventList = data.result?.Event;
      console.log("listdata = ",  this.eventList, "--------------", data['result']?.Event);
      this.isLoading = false;
   
    },
      (err: any) => {
        console.log('err = ', err);
      });

  }

    showCalenderEvent() {
      this.Filterdata ={
        "status":["live"],
        "objectType": "Event"
      };
  
      this.eventListService.getEventList(this.Filterdata).subscribe((data: any) => {
       this.eventCalender = data.result.Event;
  
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
          identifier: obj.identifier,
  
        }));
  
      })
    
     
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

  setEventConfig() {
    // tslint:disable-next-line:max-line-length
    // const additionalCategories = _.merge(this.frameworkService['_channelData'].contentAdditionalCategories, this.frameworkService['_channelData'].collectionAdditionalCategories) || this.config.appConfig.WORKSPACE.primaryCategory;
    this.libEventConfig = {
      context: {
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

 getFilteredData(event)
 {
   if(event.search)
   {
     this.Filterdata ={
       "status":["live"],
       "objectType": "Event",
     };
     this.query=event.target.value;
   }
   else if((event.filtersSelected.eventTime) && (event.filtersSelected.eventType))
   {
     switch (event.filtersSelected.eventTime) {
       case "Past":
         this.dates={ 
           "max":this.yesterdayDate
         }
           break;
       case "Upcoming":
         this.dates={ 
           "min":this.tommorrowDate
         }
           break;
       default:
         this.dates={ 
           "min":this.todayDate,
           "max":this.todayDate
         }
             break;
     } 
     this.Filterdata ={
       "status":["live"],
       "eventType" :event.filtersSelected.eventType,
       "startDate":this.dates,
       "objectType": "Event"
     };
   }
   else if(event.filtersSelected.eventType)
   {
       this.Filterdata ={
         "status":["live"],
         "eventType" :event.filtersSelected.eventType,
         "objectType": "Event"
       };
   }
   else if(event.filtersSelected.eventTime)
   { 
       switch (event.filtersSelected.eventTime) {
         case "Past":
           this.dates={ 
             "max":this.yesterdayDate
           }
             break;
         case "Upcoming":
           this.dates={ 
             "min":this.tommorrowDate
           }
             break;
         default:
           this.dates={ 
             "min":this.todayDate,
             "max":this.todayDate
           }
         break;
       } 
       this.Filterdata ={
         "status":["live"],
         "startDate" :this.dates,
         "objectType": "Event"
       };
   }
   else
   {
     this.Filterdata ={
       "status":["live"],
       "objectType": "Event"
     };
   }

   // Loader code
   this.tab == "list" ? this.isLoading = true : this.isLoading = false;

   this.eventListService.getEventList(this.Filterdata,this.query).subscribe((data) => {
    console.log("listdata-filter = ", data);
      
     if (data.responseCode == "OK") 
       {
          console.log("listdata = ", data);
      
         this.isLoading=false;
         this.eventList = data.result.Event;

         // For calendar events
         this.events = this.eventList.map(obj => ({
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
         identifier:obj.identifier,
         }));
       }
     }, (err) => {
       this.isLoading=false;
       this.toasterService.error('Something went wrong, please try again later...');
     
     });
 }
   Openview(view) {  
    if (view == 'list') {    
      this.tab = 'list';
    } 
     else if (view == 'calender') {
      this.tab = 'calender';
      //this.router.navigate(['/calender']);
     }
    
  }

  /**
   * For get List of events
   */
   showMyEventListPage()
   {
     let eventIds = [];
     this.eventListService.getMyEventList(this.userId).subscribe((data:any)=>{

       let  eventsList=  data.result.courses;
       Array.prototype.forEach.call(data.result.courses, child => {
         eventIds.push(child.courseId); 
       });

       console.log('My Events : ', eventsList);

       if (eventsList.length != 0)
       {
         this.Filterdata ={
           "status":["live"],
           "objectType": "Event",
           "identifier": eventIds
           // "owner":this.userId
         };

         this.eventListService.getEventList(this.Filterdata).subscribe((data) =>{
           if (data.responseCode == "OK") 
             {
               this.myEvents = data.result.Event;
               console.log('My Events this.myEvents : ', this.myEvents);
             }
           }, (err) => {
             this.isLoading=false;
            //  this.sbToastService.showIziToastMsg(err.error.result.messages[0], 'error');
           });
       }
       else
       {
           this.myEvents = [];
       }
     });
 }
 navToEventDetail(event){
  console.log("event-------",event);
  this.router.navigate(['/events/detail'], { queryParams:  { eventId: event.identifier } });
 }
}
