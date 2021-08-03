import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {EventListService} from '@tekdi/ngtek-event-library';
import { EventCreateService } from '@tekdi/ngtek-event-library';
import { EventDetailService } from '@tekdi/ngtek-event-library';
import * as eventCreate from '../../interfaces/eventCreate';
// import { EventFilterService } from '@tekdi/ngtek-event-library';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  eventList : any;
  eventItem: any;
  tab :string= "detail";
  userId: any = "1001";
  formFieldProperties: any;
  filterConfig: any;
  isLoading: boolean =  true;
  myEvents: any;
  p: number = 1;
  collection: any[];

  constructor(  private eventListService:EventListService,
    private eventCreateService: EventCreateService,
    private eventDetailService: EventDetailService,
    private router: Router,
    // private eventFilterService: EventFilterService
 ) { }

  ngOnInit() {
    // this.showEventListPage();
    
    console.log("eventCreate",eventCreate.eventCreate);
    this.showEventCreatePage(eventCreate);
    // this.showFilters();
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

    })
  }

   /**
   * For get List of events
   */
    showMyEventListPage(){
      
      this.eventListService.getMyEventList(this.userId).subscribe((data:any)=>{
         console.log("mylistdata = ", data.result.events);
        this.myEvents = data.result.events;
        this.isLoading = false;
      },err=>{console.log("thissss",err);}
      )
    }

  /**
   * For subscibe click action on event card
   */
   navToEventDetail(event){
    this.router.navigate(['/play/event-detail'], {
      queryParams: {
        identifier: event.identifier
      }
    });

    console.log('Demo Component - ', event.identifier);
  }
  

  Openview(view)
  {
    this.isLoading = true;

    if(view == 'list' )
    {
      this.tab = 'list';
    }
    else if(view == 'detail')
    {
      this.tab = 'detail';
    }
    else
    {
      // this.tab = 'form';
      this.router.navigate(['/form'], {
        queryParams: {
          // identifier: event.identifier
        }
      });
    }

    this.isLoading = false;
  }


  showEventCreatePage(eventCreateFields) {
    // this.eventCreateService.getEventFormConfig().subscribe((data: any) => {
    //   console.log('EventCreatedata = ',data);
    //   this.formFieldProperties = data.result['form'].data.fields;
    //   this.isLoading = false;
    //   console.log('EventCreate = ',data.result['form'].data.fields);
    // },err=>{console.error("hi", err);}
    // )
      this.formFieldProperties = eventCreateFields.eventCreate.result['form'].data.fields;
      console.log('EventCreate.fields = ',this.formFieldProperties);

  }
  routeToCreate(){
    this.router.navigate(['workspace/content/create']);
  }

  // showFilters() {
  //   this.eventFilterService.getFilterFormConfig().subscribe((data: any) => {
  //     this.filterConfig = data.result['form'].data.fields;
  //     this.isLoading = false;

  //     console.log('eventfilters = ',data.result['form'].data.fields);
  //   },
  //   (err: any) => {
  //     console.log('err = ', err);
  //   });
  // }
  
  cancel(){
    //this.router.navigate(['/home']);
  }

  navAfterSave(res){
     //alert(res.result.identifier);
     this.eventDetailService.getEvent(res.result.identifier).subscribe((data: any) => {
      this.eventItem = data.result.event;
      this.tab = 'detail';
      this.isLoading = false;


      console.log(this.eventItem);
    },
      (err: any) => {
        console.log('err = ', err);
      });
   
  }


}
