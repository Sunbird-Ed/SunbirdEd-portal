import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { ICaraouselData } from '../../interfaces/caraouselData';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
import { ActivatedRoute } from '@angular/router';

/**
 * This display a a section
 */
@Component({
  selector: 'app-page-section',
  templateUrl: './page-section.component.html',
  styleUrls: ['./page-section.component.css']
})
export class PageSectionComponent {
  /**
  * section is used to render ICaraouselData value on the view
  */
  @Input() section: ICaraouselData;
  /**
  * section is used to render ICaraouselData value on the view
  */
  @Output() playEvent = new EventEmitter<any>();
  resourcesInteractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  activatedRoute: ActivatedRoute;
  /**
  * This is slider setting
  */
  slideConfig = { 'slidesToShow': 4, 'slidesToScroll': 4, infinite: false };

  constructor(activatedRoute: ActivatedRoute) {
    this.activatedRoute = activatedRoute;
  }

  playContent(event) {
    this.playEvent.emit(event);
    this.setTelemetryData(event);
  }

  public setTelemetryData(event) {
    if (this.activatedRoute.snapshot.data.telemetry.env === 'library') {
      this.resourcesInteractEdata = {
        id: event.data.metaData.contentType,
        type: 'click',
        pageid: 'library'
      };
      this.telemetryInteractObject = {
        id: event.data.metaData.identifier,
        type: 'library',
        ver: '1.0'
      };
    }
  }
}
