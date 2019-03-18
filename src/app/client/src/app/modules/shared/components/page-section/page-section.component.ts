import { ActivatedRoute } from '@angular/router';
import { ResourceService, ConfigService } from '../../services';
import { Component, Input, EventEmitter, Output, OnDestroy, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ICaraouselData } from '../../interfaces';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import * as _ from 'lodash';
import { IInteractEventEdata } from '@sunbird/telemetry';
import { Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/platform-browser';
/**
 * This display a a section
 */
@Component({
  selector: 'app-page-section',
  templateUrl: './page-section.component.html',
  styleUrls: ['./page-section.component.scss']
})
export class PageSectionComponent implements OnInit, OnDestroy {

  inViewLogs = [];

  cardInteractEdata: IInteractEventEdata;

  refresh = true;

  @Input() section: ICaraouselData;

  @Input() cardType: string;

  @Output() playEvent = new EventEmitter<any>();

  @Output() visits = new EventEmitter<any>();

  @Output() viewAll = new EventEmitter<any>();

  private resourceDataSubscription: Subscription;

  slideConfig: object = {};

  pageid: string;

  constructor(public config: ConfigService, public activatedRoute: ActivatedRoute, public resourceService: ResourceService,
    private cdr: ChangeDetectorRef) {
      this.pageid = _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid');
    }
  playContent(event) {
    event.section = this.section.name;
    this.playEvent.emit(event);
  }
  ngOnInit() {
    this.slideConfig = this.cardType === 'batch' ? this.config.appConfig.CourseBatchPageSection
      .slideConfig : this.config.appConfig.CoursePageSection.slideConfig;
    this.resourceDataSubscription = this.resourceService.languageSelected$.subscribe(item => {
      this.selectedLanguageTranslation(item.value);
    });
    this.updateContentViewed();
    if (this.pageid) {
      this.cardInteractEdata = {
        id: this.cardType === 'batch' ? 'batch-card' : 'content-card',
        type: 'click',
        pageid: this.pageid
      };
    }
  }
  selectedLanguageTranslation(data) {
    if (data === 'ur' && !this.slideConfig['rtl']) {
      this.slideConfig['rtl'] = true;
      this.reInitSlick();
    } else if (data !== 'ur' && this.slideConfig['rtl']) {
      this.slideConfig['rtl'] = false;
      this.reInitSlick();
    } else {
      this.slideConfig['rtl'] = false;
    }
    try {
      if (this.section.name !== 'My Courses') {
        const display = JSON.parse(this.section['display']);
        if (_.has(display.name, data) && !_.isEmpty(display.name[data])) {
          this.section.name = display.name[data];
        } else {
          this.section.name = display.name['en'];
        }
      }
    } catch (err) {
    }
  }
  reInitSlick() {
    this.refresh = false;
    this.cdr.detectChanges();
    this.refresh = true;
  }
  handleAfterChange(event) {
    if (event.currentSlide) {
      this.updateContentViewed();
    }
  }
  updateContentViewed() {
    const visits = [];
    const slideData: any = this.section.contents;
    _.forEach(slideData, (slide, key) => {
      const content = _.find(this.inViewLogs, (eachContent) => {
        if (slide.metaData.courseId) {
          return eachContent.metaData.courseId === slide.metaData.courseId;
        } else if (slide.metaData.identifier) {
          return eachContent.metaData.identifier === slide.metaData.identifier;
        }
      });
      if (content === undefined) {
        slide.section = this.section.name;
        this.inViewLogs.push(slide);
        visits.push(slide);
      }
    });
    if (visits.length > 0) {
      this.visits.emit(visits);
    }
  }
  navigateToViewAll(section) {
    this.viewAll.emit(section);
  }
  ngOnDestroy() {
    if (this.resourceDataSubscription) {
      this.resourceDataSubscription.unsubscribe();
    }
  }
}
