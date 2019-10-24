import { ActivatedRoute } from '@angular/router';
import { ResourceService, ConfigService } from '../../services';
import { Component, Input, EventEmitter, Output, OnDestroy, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ICaraouselData } from '../../interfaces';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import * as _ from 'lodash-es';
import { IInteractEventEdata } from '@sunbird/telemetry';
import { Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/platform-browser';
import { environment } from '@sunbird/environment';

/**
 * This display a a section
 */
@Component({
  selector: 'app-page-section',
  templateUrl: './page-section.component.html'
})
export class PageSectionComponent implements OnInit, OnDestroy {

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

  contentList = [];

  maxSlide = 0;

  isOffline: boolean = environment.isOffline;

  constructor(public config: ConfigService, public activatedRoute: ActivatedRoute, public resourceService: ResourceService,
    private cdr: ChangeDetectorRef) {
    this.pageid = _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid');
  }
  playContent(event) {
    event.section = this.section.name;
    this.playEvent.emit(event);
  }
  ngOnInit() {
    this.updateSlick();
    this.slideConfig = this.cardType === 'batch'
      ? _.cloneDeep(this.config.appConfig.CourseBatchPageSection.slideConfig)
      : _.cloneDeep(this.config.appConfig.CoursePageSection.slideConfig);
    this.resourceDataSubscription = this.resourceService.languageSelected$.subscribe(item => {
      this.selectedLanguageTranslation(item.value);
    });
    if (this.pageid) {
      this.cardInteractEdata = {
        id: this.cardType === 'batch' ? 'batch-card' : 'content-card',
        type: 'click',
        pageid: this.pageid
      };
    }
  }
  updateSlick() {
    if (this.contentList.length && this.contentList.length < this.section.contents.length) {
      const upperLimit = _.get(this.config, 'appConfig.CoursePageSection.slideConfig.slidesToScroll') || 4;
      this.contentList.push(...this.section.contents.slice(this.contentList.length, this.contentList.length + upperLimit));
    } else if (this.contentList.length === 0) {
      const upperLimit = (_.get(this.config, 'appConfig.CoursePageSection.slideConfig.slidesToScroll') || 4) * 2 - 1;
      this.contentList.push(...this.section.contents.slice(0, upperLimit));
    }
  }
  selectedLanguageTranslation(data) {
    if (data === 'ur' && !this.slideConfig['rtl']) { // other language to urdu
      this.slideConfig['rtl'] = true;
      this.reInitSlick();
    } else if (data !== 'ur' && this.slideConfig['rtl']) { // urdu to other language
      this.slideConfig['rtl'] = false;
      this.reInitSlick();
    } else { // other language to other language
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
    this.contentList = [];
    this.updateSlick();
    this.maxSlide = 0;
    this.refresh = false;
    this.cdr.detectChanges();
    this.refresh = true;
  }
  handleAfterChange(event) {
    if (event.currentSlide > this.maxSlide) {
      this.maxSlide = event.currentSlide;
      this.updateSlick();
    }
  }
  updateContentViewed() {
    const visits = _.map(this.contentList, content => {
      content.section = this.section.name;
      return content;
    });
    if (visits.length > 0) {
      this.visits.emit(visits);
    }
  }
  navigateToViewAll(section) {
    this.viewAll.emit(section);
  }
  ngOnDestroy() {
    this.updateContentViewed();
    if (this.resourceDataSubscription) {
      this.resourceDataSubscription.unsubscribe();
    }
  }
  getObjectRollup(content) {
    const rollup = {};
    const contentType = _.get(content, 'contentType') || _.get(content, 'metaData.contentType');
    if (_.lowerCase(contentType) === 'course') {
      rollup['l1'] = _.get(content, 'metaData.courseId') || _.get(content, 'metaData.identifier');
    }
    return rollup;
  }
}
