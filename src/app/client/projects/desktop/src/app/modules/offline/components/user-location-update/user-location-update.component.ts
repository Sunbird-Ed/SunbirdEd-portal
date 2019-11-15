import { UserLocationUpdatesService } from './../../services';
import { IImpressionEventInput, IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
import { ToasterService } from '@sunbird/shared';
import { Component, OnInit, Renderer2, Inject, Output, EventEmitter, Input, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-user-location-update',
  templateUrl: './user-location-update.component.html',
  styleUrls: ['./user-location-update.component.scss']
})
export class UserLocationUpdateComponent implements OnInit, AfterViewInit {
  languageSelection: any[];
  selectMediumOption: any[];
  selectBoardOption: any[];
  selectClassOption: any[];
  selectStateOption: any[];
  selectDistrictOption: any[];
  showContent: any;
  radiobtnchecked: any;
  showNormalModal;
  @Input() selectClass;
  @Input() selectMedium;
  @Input() selectBoard;
  @Input() selectState;
  @Input() selectDistrict;
  activeSlide: number;
  slides: string[] = ['slide-1', 'slide-2'];
  @Output() selectedLocationValues = new EventEmitter();
  disableContinueBtn = false;
  telemetryImpressionData: IImpressionEventInput;
  telemetryInteractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;

  constructor(@Inject(DOCUMENT) private document: Document, private router: Router, private renderer: Renderer2,
    public toasterService: ToasterService, public activatedRoute: ActivatedRoute,
    public userLocationService: UserLocationUpdatesService
    ) {
    this.languageSelection = [];

    this.radiobtnchecked = this.languageSelection[0];

    this.selectMediumOption = [];

    this.selectDistrictOption = [];

    this.selectBoardOption = [];

    this.selectClassOption = [];

    this.selectStateOption = [];

  }

  ngOnInit() {
    this.activeSlide = 0;
    this.getStatesData();
  }
  showNextContent(ind: number) {
    this.activeSlide = ind;
  }
  onOptionChanges() {
    this.disableContinueBtn = this.activeSlide < 1 ? !!this.selectState && !!this.selectDistrict :
      this.activeSlide === 1 ? !!this.selectClass && !!this.selectMedium && !!this.selectBoard : false;
      this.setTelemetryData();
  }

  nextSlides() {
    this.disableContinueBtn = false;
    this.activeSlide = this.activeSlide + 1;
    if (this.activeSlide >= 2) {
      this.activeSlide = 2;
      this.selectedLocationValues.emit(true);
    }
    localStorage.setItem('userLocation', JSON.stringify({ state: this.selectState, district: this.selectDistrict }));
    localStorage.setItem('userContentFilters',
    JSON.stringify({Board: this.selectBoard, Class: this.selectClass, Medium: this.selectMedium }));
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.setTelemetryData();
    });
  }

  setTelemetryData() {
    this.telemetryImpressionData = {
      context: { env: 'offline'},
      edata: {
        type: 'view',
        pageid: 'user-location-update',
        uri: this.router.url
      }
    };
    console.log('thia.ac', this.activeSlide);
   this.telemetryInteractEdata = {
      id: this.activeSlide !== 1 ? 'location' : 'board-medium-class',
      type: 'click',
      pageid: 'user-location-update'
    };
    this.telemetryInteractObject = {
      id: this.activeSlide < 1 ? 'location' : 'board-medium-class',
      type: 'click',
      ver: '1.0'
    };
  }
  getStatesData() {
    const requestData = {'filters': {'type': 'state'}};
    this.userLocationService.getUserLocation(requestData).subscribe(response => {
    });
  }
}
