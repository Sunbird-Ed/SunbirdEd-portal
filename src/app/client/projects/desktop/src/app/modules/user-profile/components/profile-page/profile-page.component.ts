import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { OnboardingService } from '../../../offline/services/onboarding/onboarding.service';
import { ResourceService } from '@sunbird/shared';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TelemetryService } from '@sunbird/telemetry';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  selectedComponent: any;
  userData: any;
  @Output() userLocationData = new EventEmitter<any>();
  @Output() userPreferenceData = new EventEmitter<any>();
  public unsubscribe$ = new Subject<void>();

  constructor(
    public userService: OnboardingService,
    public resourceService: ResourceService,
    public activatedRoute: ActivatedRoute,
    public telemetryService: TelemetryService
  ) { }
  ngOnInit() {
    this.getUserData();
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
    if (this.selectedComponent === 'LOCATION') {
      this.setLocationTelemetryData();
    } else {
      this.setContentTelemetryData();
    }
  }
  handleDismissEvent(updatedUserData) {
    this.selectedComponent = '';
    if (updatedUserData) {
      this.userData = updatedUserData;
    }
  }
  setLocationTelemetryData() {
    const editLocationdata = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: []
      },
      edata: {
        id: 'edit_location',
        type: 'click',
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid
      }
    };

    this.telemetryService.interact(editLocationdata);
  }
  setContentTelemetryData() {
    const editContentPreferencesData = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: []
      },
      edata: {

        id: 'edit_content_preferences',
        type: 'click',
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid
      }
    };
    this.telemetryService.interact(editContentPreferencesData);

  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
