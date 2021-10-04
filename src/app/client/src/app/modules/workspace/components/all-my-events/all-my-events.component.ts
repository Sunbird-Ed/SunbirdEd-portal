// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-all-my-events',
//   templateUrl: './all-my-events.component.html',
//   styleUrls: ['./all-my-events.component.scss']
// })
// export class AllMyEventsComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {EventListService} from 'ngtek-event-library';
// import { EventCreateService } from 'ngtek-event-library';
// import { EventDetailService } from 'ngtek-event-library';
import { EventFilterService } from 'ngtek-event-library';

// import * as MyEventList from '../../interfaces/MyEventList';
// import * as MyEventLFilter from '../../interfaces/MyEventLFilter'
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
   myEvents: any;
  // p: number = 1;
  // collection: any[];  

  constructor( 
     private eventListService:EventListService,
    // private eventCreateService: EventCreateService,
    // private eventDetailService: EventDetailService,
    // private router: Router,
    private eventFilterService: EventFilterService
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
    this.eventListService.getEventList().subscribe((data:any)=>{
       console.log("listdata = ", data.result.events);
      this.eventList = data.result.events;
      this.isLoading = false;
    },err=>{console.log("here",err);}
    )
    // this.eventList = MyEventListData.MyEventList.result.events;
  }

  //  /**
  //  * For get List of events
  //  */
  //   showMyEventListPage(){
      
  //     this.eventListService.getMyEventList(this.userId).subscribe((data:any)=>{
  //        console.log("mylistdata = ", data.result.events);
  //       this.myEvents = data.result.events;
  //       this.isLoading = false;
  //     },err=>{console.log("thissss",err);}
  //     )
  //   }

  /**
   * For subscibe click action on event card
   */
   navToEventDetail(event){
    // this.router.navigate(['workspace/add/event'], {
    //   queryParams: {
    //     identifier: event.identifier
    //   }
    // });
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
  // console.log(myEventLFilter.myEventFilter);
  // this.filterConfig = MyEventLFilter.myEventFilter.result['form'].data.fields;
  }
}
