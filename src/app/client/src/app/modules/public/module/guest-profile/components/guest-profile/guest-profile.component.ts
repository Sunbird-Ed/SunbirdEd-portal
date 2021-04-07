import { Component, OnInit, ViewChild } from '@angular/core';
import { DeviceRegisterService, UserService } from '@sunbird/core';
import { ResourceService, UtilService } from '@sunbird/shared';
import { IInteractEventEdata } from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LayoutService } from '../../../../../shared/services/layoutconfig/layout.service';

const USER_DETAILS_KEY = 'guestUserDetails';
@Component({
  selector: 'app-guest-profile',
  templateUrl: './guest-profile.component.html',
  styleUrls: ['./guest-profile.component.scss']
})

export class GuestProfileComponent implements OnInit {
  @ViewChild('frameworkModal', { static: false }) frameworkModal;
  avatarStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #fff',
    boxShadow: '0 0 6px 0 rgba(0,0,0,0.38)',
    borderRadius: '50%',
    color: '#9017FF',
    fontWeight: '700',
    fontFamily: 'inherit'
  };
  userName = 'Guest User';
  layoutConfiguration: any;
  showEdit = false;
  showEditUserDetailsPopup = false;
  guestUser;
  deviceProfile;
  isDesktop = false;

  editProfileInteractEdata: IInteractEventEdata;
  public unsubscribe$ = new Subject<void>();
  constructor(
    public resourceService: ResourceService,
    public layoutService: LayoutService,
    public deviceRegisterService: DeviceRegisterService,
    public utilService: UtilService,
    public userService: UserService
  ) { }

  ngOnInit() {
    this.isDesktop = this.utilService.isDesktopApp;
    this.getGuestUser();
    this.initLayout();
    this.getLocation();
    this.setInteractEventData();
  }

  getGuestUser() {
    if (this.isDesktop) {
      this.userService.getAnonymousUserPreference().subscribe((response) => {
        this.guestUser = _.get(response, 'result');
      });
    } else {
      const details = localStorage.getItem(USER_DETAILS_KEY);
      if (details) {
        this.guestUser = JSON.parse(details);
      }
    }
  }

  initLayout() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.layoutService.switchableLayout().pipe(takeUntil(this.unsubscribe$)).subscribe(layoutConfig => {
      /* istanbul ignore else */
      if (layoutConfig != null) {
        this.layoutConfiguration = layoutConfig.layout;
      }
    });
  }

  getLocation() {
    this.deviceRegisterService.fetchDeviceProfile().pipe(takeUntil(this.unsubscribe$)).subscribe((response) => {
      this.deviceProfile = _.get(response, 'result');
    });
  }

  updateProfile(event) {
    this.frameworkModal.modal.deny();
    this.showEdit = !this.showEdit;
    this.guestUser.framework = event;

    if (this.isDesktop) {
      this.updateGuestUser(this.guestUser);
    } else {
      localStorage.setItem(USER_DETAILS_KEY, JSON.stringify(this.guestUser));
      this.getGuestUser();
    }
  }

  updateGuestUser(user) {
    const req = { request: { ...user, identifier: user._id } };
    this.userService.updateAnonymousUserDetails(req).subscribe((response) => {
      this.getGuestUser();
    }, error => {
      console.error('Error while updating guest user', error);
    });
  }

  closeEditDetailsPopup() {
    this.getLocation();
    this.showEditUserDetailsPopup = !this.showEditUserDetailsPopup;
  }

  setInteractEventData() {
    this.editProfileInteractEdata = {
      id: 'guest-profile-edit',
      type: 'click',
      pageid: 'guest-profile-read'
    };
  }

  convertToString(value) {
    return _.isArray(value) ? _.join(value, ', ') : undefined;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
