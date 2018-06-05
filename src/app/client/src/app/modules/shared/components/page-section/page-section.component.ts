import { IImpressionEventInput } from '@sunbird/telemetry';
import { ActivatedRoute } from '@angular/router';
import { Component,  Input, EventEmitter, Output } from '@angular/core';
import {ICaraouselData} from '../../interfaces/caraouselData';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import * as _ from 'lodash';
/**
 * This display a a section
 */
@Component({
  selector: 'app-page-section',
  templateUrl: './page-section.component.html',
  styleUrls: ['./page-section.component.css']
})
export class PageSectionComponent implements OnInit {
  inviewLogs = [];
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
  }
  ngOnInit() {
  }
  /**
   * get inview  Data
  */
  inview(event) {
    if (this.activatedRoute.snapshot.data.telemetry.env === 'library') {
      this.telemetryData.emit(event);
    } else {
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
    } }
  }
  /**
   * get inviewChange
  */
  inviewChange(contentList, event) {
    if (this.activatedRoute.snapshot.data.telemetry.env === 'library') {
      const slideData = contentList.slice(event.currentSlide , event.currentSlide + 3);
      const data = {inview: slideData};
      this.telemetryData.emit(data);
    } else {
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
    } }
  }
}
