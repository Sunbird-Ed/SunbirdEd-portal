import { Component, OnInit } from '@angular/core';
// import * as  myEventFilter from './event-view-type.component-filterdata';
import * as  MyCalendarList  from '../../interface/MyCalendarList';
import {EventListService, EventFilterService} from 'ngtek-event-library';
import { EventCreateService } from 'ngtek-event-library';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import { FrameworkService, UserService } from '@sunbird/core';
import {CalendarEvent} from 'angular-calendar';
import { LibraryFiltersLayout } from '@project-sunbird/common-consumption-v9';
import * as MyEventLFilter from '../../interface/MyEventLFilter';
import {ToasterService,LayoutService, COLUMN_TYPE}from '@sunbird/shared';
import { map, tap, switchMap, skipWhile, takeUntil, catchError, startWith } from 'rxjs/operators';
import { cloneDeep, get, find, map as _map, pick, omit, groupBy, sortBy, replace, uniqBy, forEach, has, uniq, flatten, each, isNumber, toString, partition, toLower, includes } from 'lodash-es';
import { forkJoin, Subject, Observable, BehaviorSubject, merge, of, concat, combineLatest } from 'rxjs';

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
  EventCount: any;
  url;
  currentPage;
  today = new Date();
  todayDate = this.today.getFullYear() + '-' + ('0' + (this.today.getMonth() + 1)).slice(-2) + '-' + ('0' + (this.today.getDate())).slice(-2);
  yesterdayDate = this.today.getFullYear() + '-' + ('0' + (this.today.getMonth() + 1)).slice(-2) + '-' + ('0' + (this.today.getDate()-1)).slice(-2);
  tommorrowDate = this.today.getFullYear() + '-' + ('0' + (this.today.getMonth() + 1)).slice(-2) + '-' + ('0' + (this.today.getDate()+1)).slice(-2);

  query: any;
  layoutConfiguration: any;
  FIRST_PANEL_LAYOUT;
  SECOND_PANEL_LAYOUT;
  isDesktopApp = false;
  formData: any;
  defaultTab = 'Textbook';
  public subscription$;
  public unsubscribe = new Subject<void>();



  eventListCount : any;
  myEventsCount : any;

  constructor(public eventListService: EventListService,
    public eventFilterService: EventFilterService,
    private eventCreateService: EventCreateService,
    // private eventDetailService: EventDetailService,
    private router: Router,public userService: UserService,
    public frameworkService:FrameworkService,
    public toasterService:ToasterService,
    public activatedRoute: ActivatedRoute,
    public layoutService: LayoutService,) { }

  ngOnInit() {
    this.initLayout();
    // this.eventtype();
    this.showMyEventListPage();
    // console.log('showMyEventListPage');
    this.showEventListPage();
// console.log('eventList - ', this.eventList);
    this.showFilters();
    // this.showCalenderEvent(MyCalendarList);
    this.showCalenderEvent();
    this.setEventConfig();
  }

  initLayout() {
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

  public getPageData(input) {
    const contentTypes = _.sortBy(this.formData, 'index');
    // this.defaultTab = _.find(contentTypes, ['default', true]);
    return find(this.formData, data => data.contentType === input);
  }

  public getCurrentPageData() {
    return this.getPageData(get(this.activatedRoute, 'snapshot.queryParams.selectedTab') || _.get(this.defaultTab, 'contentType') || 'textbook');
  }

  showEventListPage(){
    this.Filterdata = {
      "status":["live"],
      "objectType": "Event"
      };

      this.eventListService.getEventList(this.Filterdata).subscribe((data:any)=>{
      // console.log("listdata = ", data);

      this.EventCount= data.result?.count;
      this.eventListCount= data.result.count;
      this.eventList = data.result?.Event;

      this.eventList.forEach((item, index) => {
        var array = JSON.parse("[" + item.venue + "]");
        this.eventList[index].venue = array[0].name;
      });



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
        appIcon: obj.appIcon,
      }));

    })
  }

  showFilters() {
    // this.filterConfig = myEventFilter.myEventFilter.result.form.data.fields;
    this.eventListService.getFilterFormConfig().subscribe((data: any) => {
      this.filterConfig = data.result['form'].data.fields;
      this.isLoading = false;

      // console.log('eventfilters = ',data.result['form'].data.fields);
    },
    (err: any) => {
      console.log('err = ', err);
    });
  }

  eventtype($event){
    // console.log($event);

    if($event.data.text=='ListView'){
      this.tab = 'list';
    } else {
      this.tab = 'calender';
    }
  }

  setEventConfig() {
    // console.log("userId: userService.userProfile.userId ", this.userService.userProfile);
    // console.log("userId: userService.userProfile.userId ", this.userService);
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

 getFilteredData(event) {
   if(event.search) {
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
   // console.log("listdata-filter = ", data);

     if (data.responseCode == "OK") {
        this.isLoading=false;
        this.EventCount= data.result.count;
        this.eventList = data.result.Event;
        this.eventListCount= data.result.count;

        this.eventList.forEach((item, index) => {
          var array = JSON.parse("[" + item.venue + "]");
          this.eventList[index].venue = array[0].name;
         });

        // For calendar events
        if(data.result.count > 0) {
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
            appIcon: obj.appIcon,
          }));
        } else {
          this.events = [];
        }
    }
   }, (err) => {
       this.isLoading=false;
       this.toasterService.error('Something went wrong, please try again later...');

   });
 }

  Openview(view) {

    var listProperty = document.getElementById("list");
    var calendarProperty = document.getElementById("calendar");

    if (view == 'list') {
      this.tab = 'list';
      listProperty.style.backgroundColor = "#008840";
      calendarProperty.style.backgroundColor = "#ffffff";
    } else if (view == 'calender') {
      this.tab = 'calender';
      calendarProperty.style.backgroundColor = "#008840";
      listProperty.style.backgroundColor = "#ffffff";
    }
  }

  handleEvent() {
    this.url = '/explore';
    if (this.userService.loggedIn) {
      this.url = _.get(this.currentPage, 'loggedInUserRoute.route');
    } else {
      this.url = _.get(this.currentPage, 'anonumousUserRoute.route');
    }
    this.router.navigate([this.url], { queryParams: { selectedTab: 'all' } });
  }

  /**
   * For get List of events
   */
   showMyEventListPage()
   {
     let eventIds = [];

     this.eventListService.getMyEventList(this.userService.userid).subscribe((data:any)=>{

       let  eventsList=  data.result.courses;
       console.log('My Events eventsList : ', eventsList);

       Array.prototype.forEach.call(data.result.courses, child => {
         eventIds.push(child.courseId);
       });

       if (eventsList.length != 0)
       {
         this.Filterdata ={
           "status":["live"],
           "objectType": "Event",
           "identifier": eventIds
         };

         this.eventListService.getEventList(this.Filterdata).subscribe((data) =>{
           if (data.responseCode == "OK")
             {
              this.myEventsCount = data.result.count;
               this.myEvents = data.result.Event;
               this.myEvents.forEach((item, index) => {
                var array = JSON.parse("[" + item.venue + "]");
                this.myEvents[index].venue = array[0].name;
               });

              //  console.log('My Events this.myEvents : ', this.myEvents);
             }
           }, (err) => {
             this.isLoading=false;
           });
       }
       else
       {
           this.myEvents = [];
       }
     });
 }
 navToEventDetail(event){
  this.router.navigate(['/explore-events/detail'],
  { queryParams:  { eventId: event.identifier } });
 }
}
