
import{ UserService }from '@sunbird/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {EventListService} from 'ngtek-event-library';
// import { EventCreateService } from 'ngtek-event-library';
// import { EventDetailService } from 'ngtek-event-library';
import { EventFilterService } from 'ngtek-event-library';
import { from } from 'rxjs';
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
  selector: 'app-all-my-events',
  templateUrl: './all-my-events.component.html',
  styleUrls: ['./all-my-events.component.scss']
})
export class AllMyEventsComponent implements OnInit {

  eventList : any;
  // eventItem: any;
  // tab :string= "list";
  // userId: any = "1001";
  // formFieldProperties: any;
  filterConfig: any;
  isLoading: boolean =  true;
  myEvents: any[];
  // p: number = 1;
  // collection: any[];
  Filterdata: any; 
  libEventConfig:any; 
  dates: any;
  EventListCount: any;
  query: any;
  today = new Date();
  todayDate = this.today.getFullYear() + '-' + ('0' + (this.today.getMonth() + 1)).slice(-2) + '-' + ('0' + (this.today.getDate())).slice(-2);
  yesterdayDate = this.today.getFullYear() + '-' + ('0' + (this.today.getMonth() + 1)).slice(-2) + '-' + ('0' + (this.today.getDate()-1)).slice(-2);
  tommorrowDate = this.today.getFullYear() + '-' + ('0' + (this.today.getMonth() + 1)).slice(-2) + '-' + ('0' + (this.today.getDate()+1)).slice(-2);

  constructor( 
     private eventListService:EventListService,
    // private eventCreateService: EventCreateService,
    // private eventDetailService: EventDetailService,
    private router: Router,
    public userService: UserService,
    private eventFilterService: EventFilterService,
    private toasterService: ToasterService
    ) {
    
   }

  ngOnInit() {
    this.showEventListPage();
    this.showFilters();
    // this.showMyEventListPage();
  }

  /**
   * For get List of events
   */
   showEventListPage(){
    this.Filterdata = {
      "status":[],
      "objectType": "Event",
      "owner":this.userService.userid
      };
    this.eventListService.getEventList( this.Filterdata).subscribe((data:any)=>{
       console.log("listdata = ",data.result?.Event);
       this.eventList = data.result?.Event;
       this.EventListCount= data.result?.count;
      
      this.isLoading = false;
    },err=>{console.log("here",err);}
    )
  }


  /**
   * For subscibe click action on event card
   */
   navToEventDetail(event){
    this.router.navigate(['workspace/add/event'], {
      queryParams: {
        identifier: event.identifier
      }
    });
  }

  showFilters() {
    this.eventListService.getMyEventsFilterFormConfig().subscribe((data: any) => {
      this.filterConfig = data.result['form'].data.fields;
      this.isLoading = false;

      console.log('eventfilters = ',data.result['form'].data.fields);
    },
    (err: any) => {
      console.log('err = ', err);
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

 getFilteredData(event)
  {
    if(event.search)
    {
      this.Filterdata ={
        "status":[],
        "objectType": "Event",
      };
      this.query=event.target.value;
    }
    else if((event.filtersSelected.eventTime) && (event.filtersSelected.eventType) && (event.filtersSelected.eventStatus))
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
        "status":event.filtersSelected.eventStatus,
        "eventType" :event.filtersSelected.eventType,
        "startDate":this.dates,
        "objectType": "Event"
      };
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
        "status":[],
        "eventType" :event.filtersSelected.eventType,
        "startDate":this.dates,
        "objectType": "Event",
        "owner":this.userService.userid
      };
    }
    else if((event.filtersSelected.eventTime) && (event.filtersSelected.eventStatus))
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
        "status":event.filtersSelected.eventStatus,
        "startDate":this.dates,
        "objectType": "Event"
      };
    }
    else if((event.filtersSelected.eventType) && (event.filtersSelected.eventStatus))
    {     
      this.Filterdata ={
        "status":event.filtersSelected.eventStatus,
        "eventType" :event.filtersSelected.eventType,
        "objectType": "Event"
      };
    }
    else if(event.filtersSelected.eventType)
    {
        this.Filterdata ={
          "status":[],
          "eventType" :event.filtersSelected.eventType,
          "objectType": "Event",
          "owner":this.userService.userid
        };
    }
    else if(event.filtersSelected.eventStatus)
    {
        this.Filterdata ={
          "status":event.filtersSelected.eventStatus,
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
          "status":[],
          "startDate" :this.dates,
          "objectType": "Event",
          "owner":this.userService.userid
        };
    }
    else
    {
      this.Filterdata ={
        "status":[],
        "objectType": "Event",
        "owner":this.userService.userid
      };
    }

    this.eventListService.getEventList(this.Filterdata,this.query).subscribe((data) => {
      if (data.responseCode == "OK") 
        {
          this.isLoading=false;
         delete this.eventList;
         this.EventListCount= data.result?.count;
          this.eventList = data.result.Event;
         
        }
      }, (err) => {
        this.isLoading=false;
        this.toasterService.error(err.error.result.messages[0]);
     
      });
  }

}
