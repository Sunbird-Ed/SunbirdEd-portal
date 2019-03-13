import { ActivatedRoute } from '@angular/router';
import { ResourceService, ConfigService } from '../../services/index';
import { Component,  Input, EventEmitter, Output , OnDestroy, Inject, ViewChild} from '@angular/core';
import {ICaraouselData} from '../../interfaces/caraouselData';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import * as _ from 'lodash';
import { IInteractEventObject, IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
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
  inviewLogs = [];
  cardIntractEdata: IInteractEventEdata;

  @ViewChild('slickModal') slickModal;
  /**
  * section is used to render ICaraouselData value on the view
  */
  @Input() section: ICaraouselData;

  @Input() cardType: string;

  /**
  * section is used to render ICaraouselData value on the view
  */
  @Output() playEvent = new EventEmitter<any>();
  /**
  * section is used to render ICaraouselData value on the view
  */
  @Output() visits = new EventEmitter<any>();

  @Output() viewAll = new EventEmitter<any>();

  public config: ConfigService;

  private resourceDataSubscription: Subscription;

  /**
  * This is slider setting
  */
  slideConfig: object = {};

  /**The previous or next value of the button clicked
   * to generate interact telemetry data */
  btnArrow: string;
  pageid: string;
  constructor(config: ConfigService, public activatedRoute: ActivatedRoute, public resourceService: ResourceService,
    @Inject(DOCUMENT) private _document: any) {
    this.resourceService = resourceService;
    this.config = config;
  }
  playContent(event) {
    event.section = this.section.name;
    this.playEvent.emit(event);
  }
  ngOnInit() {
    this.resourceDataSubscription = this.resourceService.languageSelected$.subscribe(item => {
      this.selectedLanguageTranslation(item.value);
    });
    const id = _.get(this.activatedRoute, 'snapshot.data.telemetry.env');
    this.pageid = _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid');
    if (id && this.pageid) {
      this.cardIntractEdata = {
        id: this.cardType === 'batch' ? 'batch-card' : 'content-card',
        type: 'click',
        pageid: this.pageid
      };
    }
  }
  selectedLanguageTranslation(data) {
    this.slideConfig = this.cardType === 'batch' ? this.config.appConfig.CourseBatchPageSection
    .slideConfig : this.config.appConfig.CoursePageSection.slideConfig;
    if (data === 'ur') {
      this.slideConfig['rtl'] = true;
    } else {
      this.slideConfig['rtl'] = false;
    }
    if (this.slickModal) {
      this.slickModal.unslick();
      this.slickModal.initSlick(this.slideConfig);
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
  /**
   * get inviewChange
  */
  inviewChange(contentList, event) {
    const visits = [];
    const slideData = contentList;
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
  checkSlide(event) {
    if (event.currentSlide < event.nextSlide) {
      this.btnArrow = 'next-button';
    } else if (event.currentSlide > event.nextSlide) {
      this.btnArrow = 'prev-button';
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
