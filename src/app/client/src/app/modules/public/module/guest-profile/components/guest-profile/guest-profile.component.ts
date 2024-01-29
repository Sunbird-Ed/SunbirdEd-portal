import { Component, OnInit } from '@angular/core';
import { DeviceRegisterService, UserService } from '@sunbird/core';
import { ResourceService, UtilService, NavigationHelperService, ToasterService, ConfigService} from '@sunbird/shared';
import { IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LayoutService } from '../../../../../shared/services/layoutconfig/layout.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CslFrameworkService } from '../../../../../public/services/csl-framework/csl-framework.service';

const USER_DETAILS_KEY = 'guestUserDetails';
@Component({
  selector: 'app-guest-profile',
  templateUrl: './guest-profile.component.html',
  styleUrls: ['./guest-profile.component.scss']
})

export class GuestProfileComponent implements OnInit {
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
  userRole: string;
  transFormGuestUser;
  frameworkCategories;
  frameworkCategoriesObject;
  avatarConfig = {
    size: this.config.constants.SIZE.LARGE,
    view: this.config.constants.VIEW.VERTICAL,
    isTitle:false
  };
  editProfileInteractEdata: IInteractEventEdata;
  editFrameworkInteractEData: IInteractEventEdata;
  telemetryImpression: IImpressionEventInput;
  public unsubscribe$ = new Subject<void>();
  isFullScreenView: any;
  constructor(
    public activatedRoute: ActivatedRoute,
    public resourceService: ResourceService,
    public layoutService: LayoutService,
    public deviceRegisterService: DeviceRegisterService,
    public utilService: UtilService,
    public userService: UserService,
    public router: Router,
    public navigationHelperService: NavigationHelperService,
    public toasterService: ToasterService,
    public config: ConfigService,
    private cslFrameworkService: CslFrameworkService
  ) { }

  ngOnInit() {
    this.frameworkCategories = this.cslFrameworkService.getAllFwCatName();
    this.frameworkCategoriesObject = this.cslFrameworkService.getFrameworkCategoriesObject();
    this.isDesktop = this.utilService.isDesktopApp;
    this.getGuestUser();
    this.initLayout();
    this.getLocation();
    this.setInteractEventData();
  }

  getGuestUser() {
    this.userService.getGuestUser().subscribe((response) => {
      this.guestUser = response;
      this.transFormGuestUser = this.cslFrameworkService.frameworkLabelTransform(this.frameworkCategoriesObject, this.guestUser);
      this.userRole = this.isDesktop && _.get(this.guestUser, 'role') ? this.guestUser.role : localStorage.getItem('guestUserType');
    });
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
    // this.showEdit = !this.showEdit;
    this.guestUser.framework = event;

    if (window['TagManager']) {
      window['TagManager'].SBTagService.pushTag(this.guestUser, 'USERFRAMEWORK_', true);
    }

    if (this.isDesktop) {
      this.updateGuestUser(this.guestUser);
    } else {
      localStorage.setItem(USER_DETAILS_KEY, JSON.stringify(this.guestUser));
      this.getGuestUser();
      this.toasterService.success(_.get(this.resourceService, 'messages.smsg.m0058'));
    }
  }

  updateGuestUser(user) {
    const req = { request: { ...user, identifier: user._id } };
    this.userService.updateAnonymousUserDetails(req).subscribe((response) => {
      this.getGuestUser();
      this.toasterService.success(_.get(this.resourceService, 'messages.smsg.m0058'));
    }, error => {
      console.error('Error while updating guest user', error);
    });
  }

  closeEditDetailsPopup() {
    this.getGuestUser();
    this.getLocation();
    this.showEditUserDetailsPopup = !this.showEditUserDetailsPopup;
  }

  setInteractEventData() {
    this.editProfileInteractEdata = {
      id: 'guest-profile-edit',
      type: 'click',
      pageid: 'guest-profile-read'
    };
    this.editFrameworkInteractEData = {
      id: 'guest-profile-framework-edit',
      type: 'click',
      pageid: 'guest-profile-read'
    };
    this.telemetryImpression = {
      context: {
        env: _.get(this.activatedRoute, 'snapshot.data.telemetry.env')
      },
      object: {
        id: 'guest',
        type: 'User',
        ver: '1.0'
      },
      edata: {
        type: _.get(this.activatedRoute, 'snapshot.data.telemetry.type'),
        pageid: _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid'),
        subtype: _.get(this.activatedRoute, 'snapshot.data.telemetry.subtype'),
        uri: this.router.url,
        duration: this.navigationHelperService.getPageLoadTime()
      },
    };
  }

  convertToString(value) {
    return _.isArray(value) ? _.join(value, ', ') : undefined;
  }

  ngOnDestroy() {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }

  goBack() {
    this.navigationHelperService.goBack();
  }
  
}
