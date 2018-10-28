import { ActivatedRoute } from '@angular/router';
import { ResourceService } from '../../services/index';
import { Component,  Input, EventEmitter, Output } from '@angular/core';
import {ICaraouselData} from '../../interfaces/caraouselData';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import * as _ from 'lodash';
import { IInteractEventObject, IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';

/**
 * This display a a section
 */
@Component({
  selector: 'app-page-section',
  templateUrl: './page-section.component.html',
  styleUrls: ['./page-section.component.scss']
})
export class PageSectionComponent implements OnInit {
  inviewLogs = [];
  cardIntractEdata: IInteractEventEdata;
  /**
  * section is used to render ICaraouselData value on the view
  */
  @Input() section: ICaraouselData;
  /**
  * section is used to render ICaraouselData value on the view
  */
  @Output() playEvent = new EventEmitter<any>();
  /**
  * section is used to render ICaraouselData value on the view
  */
  @Output() visits = new EventEmitter<any>();

  @Output() viewAll = new EventEmitter<any>();
  /**
  * This is slider setting
  */
 slideConfig = {
  'slidesToShow': 2,
  'slidesToScroll': 3,
  'variableWidth': true,
  'responsive': [
    {
      'breakpoint': 2800,
      'settings': {
        'slidesToShow': 8,
        'slidesToScroll': 2,
        'variableWidth': true
      }
    },
    {
      'breakpoint': 2200,
      'settings': {
        'slidesToShow': 6,
        'slidesToScroll': 2,
        'variableWidth': true
      }
    },
    {
      'breakpoint': 2000,
      'settings': {
        'slidesToShow': 5,
        'slidesToScroll': 2,
        'variableWidth': true
      }
    },
    {
      'breakpoint': 1400,
      'settings': {
        'slidesToShow': 3.5,
        'slidesToScroll': 2,
        'variableWidth': true
      }
    },
    {
      'breakpoint': 1200,
      'settings': {
        'slidesToShow': 3.5,
        'slidesToScroll': 2,
        'variableWidth': true
      }
    },
    {
      'breakpoint': 800,
      'settings': {
        'slidesToShow': 3,
        'slidesToScroll': 1,
        'variableWidth': true
      }
    },
    {
      'breakpoint': 600,
      'settings': {
        'slidesToShow': 2,
        'slidesToScroll': 1,
        'variableWidth': true
      }
    },
    {
      'breakpoint': 425,
      'settings': {
        'slidesToShow': 1,
        'slidesToScroll': 1,
        'variableWidth': true
      }
    }
  ],
  infinite: false,
};
  /**The previous or next value of the button clicked
   * to generate interact telemetry data */
  btnArrow: string;
  pageid: string;
  constructor(public activatedRoute: ActivatedRoute, public resourceService: ResourceService) {
    this.resourceService = resourceService;
  }
  playContent(event) {
    this.playEvent.emit(event);
  }
  ngOnInit() {
    const id = _.get(this.activatedRoute, 'snapshot.data.telemetry.env');
    this.pageid = _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid');
    if (id && this.pageid) {
      this.cardIntractEdata = {
        id: 'content-card',
        type: 'click',
        pageid: this.pageid
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
}
