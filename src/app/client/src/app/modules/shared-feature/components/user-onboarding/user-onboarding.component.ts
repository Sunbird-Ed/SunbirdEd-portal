import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ResourceService, ToasterService, UtilService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { PopupControlService } from '../../../../service/popup-control.service';
import { Observable, of, Subject } from 'rxjs';
import { TenantService, UserService } from '@sunbird/core';
import { catchError, map, takeUntil, tap } from 'rxjs/operators';
import { IDeviceProfile } from '../../interfaces';
import { ITenantData } from './../../../core/services/tenant/interfaces/tenant';
import { CacheService } from '../../../shared/services/cache-service/cache.service';

export enum Stage {
  USER_SELECTION = 'user',
  LOCATION_SELECTION = 'location'
}

@Component({
  selector: 'app-user-onboarding',
  templateUrl: './user-onboarding.component.html',
  styleUrls: ['./user-onboarding.component.scss']
})
export class UserOnboardingComponent implements OnInit {

  @Input() deviceProfile: IDeviceProfile;
  @Input() isCustodianOrgUser: boolean;
  @Output() close = new EventEmitter<void>();
  @ViewChild('modal') modal;

  get Stage() { return Stage; }
  stage;
  tenantInfo: ITenantData;
  isIGotSlug = false;
  private unsubscribe$ = new Subject<void>();
  isGuestUser: boolean;

  constructor(
    public resourceService: ResourceService,
    public toasterService: ToasterService,
    public popupControlService: PopupControlService,
    public tenantService: TenantService,
    private cacheService: CacheService,
    private userService: UserService,
    private utilService: UtilService
  ) {
  }

  ngOnInit() {
    this.deviceProfile = { ipLocation: _.get(this.deviceProfile, 'ipLocation') };
    this.tenantService.tenantData$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        /* istanbul ignore else*/
        if (_.get(data, 'tenantData')) {
          this.tenantInfo = data.tenantData;
          this.tenantInfo.titleName = data.tenantData.titleName || this.resourceService.instance;
          const orgDetailsFromSlug = this.cacheService.get('orgDetailsFromSlug');

          // /* istanbul ignore else */
          // if (_.get(orgDetailsFromSlug, 'slug') === this.tenantService.slugForIgot) {
          //   this.tenantInfo.titleName = _.upperCase(orgDetailsFromSlug.slug);
          //   this.stage = Stage.LOCATION_SELECTION;
          // }
        }
      });
      this.selectStage().subscribe();
  }



  selectStage() {
    const loggedIn = _.get(this.userService, 'loggedIn');
    this.isGuestUser = !loggedIn;
    let role$: Observable<string | null>;

    if (!loggedIn && this.isDesktopApp()) {
      role$ = this.getRoleFromDesktopGuestUser();
    } else {
      role$ = this.getRoleFromLocalStorage();
    }

    return role$.pipe(
      takeUntil(this.unsubscribe$),
      tap(userType => {
        const showUserSelectionPopup = _.get(this.userService, 'loggedIn') ? (!_.get(this.userService, 'userProfile.profileUserType.type') || !userType) : !userType;
        this.stage = showUserSelectionPopup ? Stage.USER_SELECTION : Stage.LOCATION_SELECTION;
      }, _ => {
        this.stage = Stage.USER_SELECTION;
      })
    );
  }

  private getRoleFromDesktopGuestUser(): Observable<string | null> {
    const guestUserDetails$ = this.getGuestUserDetails();
    const role$ = guestUserDetails$.pipe(
      map(guestUser => _.get(guestUser, 'role')),
      catchError(_ => of(null))
    );
    return role$;
  }

  private getRoleFromLocalStorage(): Observable<string | null> {
    return of(localStorage.getItem('userType'));
  }

  private getGuestUserDetails(): Observable<any> {
    return this.userService.getGuestUser();
  }

  private isDesktopApp(): boolean {
    return this.utilService.isDesktopApp;
  }

  userTypeSubmit() {
    if(this.isGuestUser) {
      this.close.emit();
      this.modal.deny();
    } else {
      this.stage = Stage.LOCATION_SELECTION;
    }

  }

  locationSubmit() {
    this.popupControlService.changePopupStatus(true);
    this.close.emit();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
