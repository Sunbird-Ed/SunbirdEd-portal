import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { OnboardingService } from '../../../offline/services/onboarding/onboarding.service';
import { ResourceService } from '@sunbird/shared';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
  ) { }
  ngOnInit() {
    this.getUserDate();
  }
  getUserDate() {
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
      this.getUserDate();
    }
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
