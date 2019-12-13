import { Component, OnInit, Output, EventEmitter, Input, ViewChild, OnDestroy } from '@angular/core';
import { OnboardingService } from '../../../offline/services/onboarding/onboarding.service';
import * as _ from 'lodash-es';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-update-location',
  templateUrl: './update-location.component.html',
  styleUrls: ['./update-location.component.scss']
})
export class UpdateLocationComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal;
  stateList = [];
  districtList = [];
  selectedState: any;
  selectedDistrict: any;
  @Output() dismissed = new EventEmitter<any>();
  public unsubscribe$ = new Subject<void>();
  @Input() userLocationData;
  constructor(
    public userService: OnboardingService,
    public resourceService: ResourceService,
    public toasterService: ToasterService,
  ) { }
  ngOnInit() {
    this.selectedState = this.userLocationData.state;
    this.selectedDistrict = this.userLocationData.city;
    this.getAllStates();
  }

  closeModal(status) {
    this.modal.deny();
    this.dismissed.emit(status);
  }

  getAllStates() {
    this.userService.searchLocation({ type: 'state' })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        this.stateList = _.get(data, 'result.response');
        this.selectedState = _.find(this.stateList, { name: this.selectedState['name'] });
      });
    this.onStateChanges();
  }

  onStateChanges() {
    this.userService.searchLocation({ type: 'district', parentId: this.selectedState.id })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        this.districtList = _.get(data, 'result.response');
        this.selectedDistrict = _.find(this.districtList, { name: this.selectedDistrict['name'] });
      });
  }
  updateUserLocation() {
    const requestParams = {
      request: {
        state: this.selectedState,
        city: this.selectedDistrict,
      }
    };
    this.userService.saveLocation(requestParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.closeModal('SUCCESS');
        this.toasterService.success(this.resourceService.messages.smsg.m0060);
      }, error => {
        this.toasterService.error(this.resourceService.messages.emsg.m0024);
        this.closeModal('ERROR');
      });
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
