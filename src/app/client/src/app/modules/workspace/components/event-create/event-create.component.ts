import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {  UserService } from '@sunbird/core';
import * as _ from 'lodash-es';
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
    this.setEventConfig();
    this.showEventCreatePage();
    // this.showFilters();
    // this.showMyEventListPage();
  }


  showEventCreatePage() {
    this.eventCreateService.getEventFormConfig().subscribe((data: any) => {
      console.log('EventCreatedata = ',data);
      this.formFieldProperties = data.result['form'].data.fields;
      this.isLoading = false;
      console.log('EventCreate = ',data.result['form'].data.fields);
    },err=>{console.error("hi", err);}
    )
  }
  routeToCreate(){
    this.router.navigate(['workspace/content/create']);
  }

  setEventConfig() {
    // tslint:disable-next-line:max-line-length
    // const additionalCategories = _.merge(this.frameworkService['_channelData'].contentAdditionalCategories, this.frameworkService['_channelData'].collectionAdditionalCategories) || this.config.appConfig.WORKSPACE.primaryCategory;
    //  let fullName = !_.isEmpty(this.userService.userProfile.lastName) ? this.userService.userProfile.firstName + ' '  + this.userService.userProfile.lastName : this.userService.userProfile.firstName;
    //  let userData = this.userService.userProfile;
    //  userData['fullName']=  fullName;
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
  cancel(event){
    this.router.navigate(['/workspace/content/allmyevents']);
  }

  navAfterSave(res){
    this.router.navigate(['/workspace/content/create']);   
  }
}