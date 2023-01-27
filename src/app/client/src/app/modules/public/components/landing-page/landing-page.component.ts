import { Component, OnInit } from '@angular/core';
import { LayoutService, ServerResponse } from '@sunbird/shared';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  layoutConfiguration;
  UserArticle:{}
  userCalender:{}
  showUserArticle:boolean = true;
  showUserCalender:boolean = true;
  showAnnoucements: boolean = true;

  constructor(public layoutService: LayoutService) { }

  ngOnInit() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.getUserContentconfig()
  }

  getUserContentconfig(){
    const formInputParams = {
      formType: 'user',
      subType: 'content',
      formAction: 'display',
      component:'portal',
    };

    this.layoutService.getFormData(formInputParams).subscribe(
      (data:ServerResponse)=>{
        if(data.result.form.data){
          this.UserArticle= data.result.form.data?.fields[0]
          this.showUserArticle = this.UserArticle['showFeatureArticle']
          if(!this.showUserArticle){
              this.showAnnoucements = false
          }
          this.userCalender = data.result?.form.data?.fields[1]
          this.showUserCalender = this.userCalender['showCalender']
        }   
      },
      (err:ServerResponse)=>{
        this.showUserArticle = true
        this.showUserCalender = true
        this.showAnnoucements = true

      }
    )
  }

}
