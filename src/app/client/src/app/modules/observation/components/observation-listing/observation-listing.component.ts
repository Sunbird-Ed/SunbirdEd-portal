import { Component, OnInit } from '@angular/core';
import { KendraService } from '@sunbird/core';
import {  ConfigService } from '@sunbird/shared';

@Component({
  selector: 'app-observation-listing',
  templateUrl: './observation-listing.component.html',
  styleUrls: ['./observation-listing.component.scss']
})
export class ObservationListingComponent implements OnInit {

  config;

  constructor( private kendraService: KendraService, config: ConfigService) {
    this.config = config;
   }

  ngOnInit() {
    // this.getMandatoryFields().subscribe(data => {
    //   debugger
    //   console.log("sampleee")
    // })
    this.getMandatoryFields();
  }

  getMandatoryFields() {
    
    const paramOptions = {
      url: this.config.urlConFig.URLS.OBSERVATION.MANDATORY_ENTITIES_FOR_SUB_ROLE ,
      param: {}
    };

    this.kendraService.get(paramOptions).subscribe(data => {
      debugger
      console.log("========================== observation lis ====================");
      console.log(data)
    }, error => {
      debugger
    })
  }

}
