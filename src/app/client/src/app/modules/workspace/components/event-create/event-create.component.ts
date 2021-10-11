import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {  UserService } from '@sunbird/core';

// import {EventListService} from 'ngtek-event-library';
import { EventCreateService } from 'ngtek-event-library';
// import { EventDetailService } from 'ngtek-event-library';
// import * as eventCreate from '../../interfaces/eventCreate';
// import { EventFilterService } from 'ngtek-event-library';
@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.scss']
})
export class EventCreateComponent implements OnInit {

  // eventList : any;
  // eventItem: any;
  // tab :string= "detail";
  formFieldProperties: any;
  // filterConfig: any;
  isLoading: boolean =  true;
  // myEvents: any;
  // p: number = 1;
  // collection: any[];
  libEventConfig:any;

  constructor( 
    //  private eventListService:EventListService,
    private eventCreateService: EventCreateService,
    // private eventDetailService: EventDetailService,
    private router: Router, private userService:UserService
    // private eventFilterService: EventFilterService
 ) { }

  ngOnInit() {
    // this.showEventListPage();
    
    // console.log("eventCreate",eventCreate.eventCreate);
    this.showEventCreatePage();
    // this.showFilters();
    // this.showMyEventListPage();
  }

  // /**
  //  * For get List of events
  //  */
  //  showEventListPage(){
  //   this.eventListService.getEventList().subscribe((data:any)=>{
  //      console.log("listdata = ", data.result.events);
  //     this.eventList = data.result.events;
  //     this.isLoading = false;
  //   })
  // }

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

  // /**
  //  * For subscibe click action on event card
  //  */
  //  navToEventDetail(event){
  //   this.router.navigate(['/play/event-detail'], {
  //     queryParams: {
  //       identifier: event.identifier
  //     }
  //   });

  //   console.log('Demo Component - ', event.identifier);
  // }
  

  // Openview(view)
  // {
  //   this.isLoading = true;

  //   if(view == 'list' )
  //   {
  //     this.tab = 'list';
  //   }
  //   else if(view == 'detail')
  //   {
  //     this.tab = 'detail';
  //   }
  //   else
  //   {
  //     // this.tab = 'form';
  //     this.router.navigate(['/form'], {
  //       queryParams: {
  //         // identifier: event.identifier
  //       }
  //     });
  //   }

  //   this.isLoading = false;
  // }


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
  routeToCreate(){
    this.router.navigate(['workspace/content/create']);
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
  cancel(event){
    //this.router.navigate(['/home']);
  }

  navAfterSave(res){
     alert(res.result.identifier);
    //  this.eventDetailService.getEvent(res.result.identifier).subscribe((data: any) => {
    //   this.eventItem = data.result.event;
    //   this.tab = 'detail';
    //   this.isLoading = false;


    //   console.log(this.eventItem);
    // },
    //   (err: any) => {
    //     console.log('err = ', err);
    //   });
   
  }
}



