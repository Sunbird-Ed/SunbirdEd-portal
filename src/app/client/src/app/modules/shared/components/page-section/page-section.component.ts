import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import {ICaraouselData} from '../../interfaces/caraouselData';
import {  IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';

/**
 * This display a a section
 */
@Component({
  selector: 'app-page-section',
  templateUrl: './page-section.component.html',
  styleUrls: ['./page-section.component.css']
})
export class PageSectionComponent implements OnInit  {
  /**
  * section is used to render ICaraouselData value on the view
  */
  @Input() section: ICaraouselData;
  /**
  * section is used to render ICaraouselData value on the view
  */
  @Output() playEvent = new EventEmitter<any>();
  resourcesIntractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  /**
  * This is slider setting
  */
  slideConfig = { 'slidesToShow': 4, 'slidesToScroll': 4 , infinite: false };

  playContent(event) {
    this.playEvent.emit(event);
  }

  ngOnInit() {
    console.log(this.section);

    this.resourcesIntractEdata = {
      id: 'home',
      type: 'click',
      pageid: 'home'
   };
   this.telemetryInteractObject =  {
     id: '',
     type: 'user',
     ver: '1.0'
   };
  }
}
