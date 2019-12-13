import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { OnboardingService } from '../../../offline/services/onboarding/onboarding.service';
import { ResourceService } from '@sunbird/shared';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IInteractEventEdata } from '@sunbird/telemetry';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  selectedComponent: any;
  userData: any;
  onClicklocationEditInteractEdata: IInteractEventEdata;
  onClickContentPreferencesEditInteractEdata: IInteractEventEdata;
  @Output() userLocationData = new EventEmitter<any>();
  @Output() userPreferenceData = new EventEmitter<any>();
  public unsubscribe$ = new Subject<void>();

  constructor(
    public userService: OnboardingService,
    public resourceService: ResourceService,
    public activatedRoute: ActivatedRoute
  ) { }
  ngOnInit() {
    this.getUserData();
    this.setTelemetryData();
  }
  getUserData() {
    this.userService.getUser()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(result => {
        this.userData = result;
      });
  }

  openModal(componentName) {
    this.selectedComponent = componentName;
  }
  handleDismissEvent(eventStatus) {
    this.selectedComponent = '';
    if (eventStatus === 'SUCCESS') {
      this.getUserData();
    }
  }
  setTelemetryData () {
    this.onClicklocationEditInteractEdata = {
      id: 'edit_location',
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };
    this.onClickContentPreferencesEditInteractEdata = {
      id: 'edit_content_preferences',
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
