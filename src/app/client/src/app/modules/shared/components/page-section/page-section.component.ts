import { IImpressionEventInput } from '@sunbird/telemetry';
import { Component,  Input, EventEmitter, Output } from '@angular/core';
import {ICaraouselData} from '../../interfaces/caraouselData';
import * as _ from 'lodash';
/**
 * This display a a section
 */
@Component({
  selector: 'app-page-section',
  templateUrl: './page-section.component.html',
  styleUrls: ['./page-section.component.css']
})
export class PageSectionComponent  {
  /**
  * section is used to render ICaraouselData value on the view
  */
  @Input() section: ICaraouselData;
  /**
  * section is used to render ICaraouselData value on the view
  */
  @Output() playEvent = new EventEmitter<any>();
  @Output() telemetryData = new EventEmitter<any>();
  /**
  * This is slider setting
  */
  slideConfig = { 'slidesToShow': 4, 'slidesToScroll': 4 , infinite: false };
  inviewLogs = [];
  telemetryImpression: IImpressionEventInput;

    inview(event) {
      this.telemetryData.emit(event);
    }

    inviewChange(content, event) {
      const slideData = content.slice(event.currentSlide , event.currentSlide + 3);
      const data = {inview: slideData};
      this.telemetryData.emit(data);
      }

  playContent(event) {
    this.playEvent.emit(event);
  }
}
