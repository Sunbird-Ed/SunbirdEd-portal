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
  allStates: any[];
  allDistricts: any[];
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
    this.selectBoardOption = [];

    this.selectClassOption = [];

  }

  ngOnInit() {
    this.activeSlide = 0;
    this.getAllStates();
  }
  showNextContent(ind: number) {
    this.activeSlide = ind;
  }
  onOptionChanges(option) {
    this.disableContinueBtn = this.activeSlide < 1 ? !!this.selectState && !!this.selectDistrict :
      this.activeSlide === 1 ? !!this.selectClass && !!this.selectMedium && !!this.selectBoard : false;
      this.setTelemetryData();
    if (option.type === 'state') {
      this.getAllDistricts(option.id);
    }
  }

  nextSlides() {
    this.disableContinueBtn = false;
    this.activeSlide = this.activeSlide + 1;
    if (this.activeSlide >= 2) {
      this.activeSlide = 2;
      this.selectedLocationValues.emit(true);
    }
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
  getAllStates() {
    const requestData = { request: { filters: { type: 'state' }}};
    this.userLocationService.getUserLocation(requestData).subscribe(data => {
      this.allStates = _.get(data, 'result.response');
    });
  }
  getAllDistricts(parentId) {
    const requestData = { request: { filters: { type: 'district', parentId: parentId }} };
    this.userLocationService.getUserLocation(requestData).subscribe(data => {
      this.allDistricts = _.get(data, 'result.response');
      this.disableContinueBtn = this.allDistricts.length <= 0;
    });
  }
}
