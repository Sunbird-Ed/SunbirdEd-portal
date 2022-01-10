import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {  UserService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { EventCreateService } from 'ngtek-event-library';
import { Location } from '@angular/common';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.scss']
})
export class EventCreateComponent implements OnInit {

  formFieldProperties: any;
  isLoading: boolean =  true;
  libEventConfig:any;

  constructor( 
    public location:Location,
    private eventCreateService: EventCreateService,
    private router: Router, private userService:UserService
 ) { }

  ngOnInit() {
    this.setEventConfig();
    this.showEventCreatePage();
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
   
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['workspace/content/create']);
    }  
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
  cancel(event){
    this.router.navigate(['/workspace/content/allmyevents']);
  }

  navAfterSave(res){
    this.router.navigate(['/workspace/content/create']);   
  }
}