import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { ICaraouselData } from '../../interfaces/caraouselData';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
/**
 * This display a a section
 */
@Component({
  selector: 'app-page-section',
  templateUrl: './page-section.component.html',
  styleUrls: ['./page-section.component.css']
})
export class PageSectionComponent {
  inviewLogs = [];
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
  /**
  * section is used to render ICaraouselData value on the view
  */
  @Output() visits = new EventEmitter<any>();
  /**
  * This is slider setting
  */
  slideConfig = { 'slidesToShow': 4, 'slidesToScroll': 4 , infinite: false };
  constructor(public activatedRoute: ActivatedRoute) {
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
  /**
   * get inview  Data
  */
  inview(event) {
    const visitsLength = this.inviewLogs.length;
    const visits = [];
    _.forEach(event.inview, (inview, key) => {
      const content = _.find(this.inviewLogs, (eachContent) => {
        if (inview.data.metaData.courseId) {
          return eachContent.metaData.courseId === inview.data.metaData.courseId;
        } else if (inview.data.metaData.identifier) {
          return eachContent.metaData.identifier === inview.data.metaData.identifier;
        }
      });
      if (content === undefined) {
        inview.data.section = this.section.name;
        this.inviewLogs.push(inview.data);
        visits.push(inview.data);
      }
    });
    if (visits.length > 0) {
      this.visits.emit(visits);
    }
  }
  /**
   * get inviewChange
  */
  inviewChange(contentList, event) {
    const visits = [];
    const slideData = contentList.slice(event.currentSlide + 1, event.currentSlide + 5);
    _.forEach(slideData, (slide, key) => {
      const content = _.find(this.inviewLogs, (eachContent) => {
        if (slide.metaData.courseId) {
          return eachContent.metaData.courseId === slide.metaData.courseId;
        } else if (slide.metaData.identifier) {
          return eachContent.metaData.identifier === slide.metaData.identifier;
        }
      });
      if (content === undefined) {
        slide.section = this.section.name;
        this.inviewLogs.push(slide);
        visits.push(slide);
      }
    });
    if (visits.length > 0) {
      this.visits.emit(visits);
    }
  }
}
