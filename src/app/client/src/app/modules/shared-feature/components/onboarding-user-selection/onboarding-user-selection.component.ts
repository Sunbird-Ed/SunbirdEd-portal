import { ResourceService, ToasterService } from '@sunbird/shared';
import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { TenantService, FormService, UserService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { IImpressionEventInput, TelemetryService, IInteractEventEdata, IAuditEventInput } from '@sunbird/telemetry';
import { Router, ActivatedRoute } from '@angular/router';
import { NavigationHelperService } from '@sunbird/shared';
import { ITenantData } from './../../../core/services/tenant/interfaces/tenant';
import { ProfileService } from '@sunbird/profile';
import { BehaviorSubject, merge, empty, of, Subject } from 'rxjs';
import { switchMap, retry, tap, skipWhile, catchError, takeUntil, concatMap, take, skip } from 'rxjs/operators';
import { PopupControlService } from '../../../../service/popup-control.service';

interface IGuest {
  code: string;
  name: string;
  label: string;
  icon: string;
  isActive: boolean;
  searchFilter: string[];
}

@Component({
  selector: 'app-onboarding-user-selection',
  templateUrl: './onboarding-user-selection.component.html',
  styleUrls: ['./onboarding-user-selection.component.scss']
})
export class OnboardingUserSelectionComponent implements OnInit, OnDestroy {

  @Input() tenantInfo: ITenantData;
  @Output() userSelect = new EventEmitter<boolean>();
  @Input() isStepper: boolean = false;

  guestList: IGuest[] = [];
  selectedUserType: IGuest;
  telemetryImpression: IImpressionEventInput;
  userSelectionInteractEdata: IInteractEventEdata;

  private updateUserSelection$ = new BehaviorSubject<string>(undefined);
  public unsubscribe$ = new Subject<void>();
  isUserTypeEnabled = true;

  constructor(
    public resourceService: ResourceService,
    public tenantService: TenantService,
    public router: Router,
    public navigationHelperService: NavigationHelperService,
    public telemetryService: TelemetryService,
    public activatedRoute: ActivatedRoute,
    private formService: FormService,
    private profileService: ProfileService,
    private userService: UserService,
    private toasterService: ToasterService,
    private popupControlService: PopupControlService
  ) { }

  ngOnInit() {
    /**
      * @description - popupcontrol service returned value is used to enable/disable the usertype popup based on the isvisible value
    */
    this.popupControlService.getOnboardingData().subscribe((formResponsedata) => {
        this.isUserTypeEnabled = formResponsedata?.userTypePopup ? formResponsedata?.userTypePopup?.isVisible : true;
        if (!(this.isUserTypeEnabled)) {
          localStorage.setItem('userType', formResponsedata?.userTypePopup?.defaultUserType);
          localStorage.setItem('guestUserType', formResponsedata?.userTypePopup?.defaultGuestUserType);
      }
    });
    this.setPopupInteractEdata();
    this.initialize().subscribe();
    if(this.isStepper) {
      this.tenantService.tenantData$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        if (_.get(data, 'tenantData')) {
          this.tenantInfo = data.tenantData;
          this.tenantInfo.titleName = data.tenantData.titleName || this.resourceService.instance;
        }
      });
    }
  }

  private initialize() {
    return merge(this.getFormConfig().pipe(
      tap((fields: object[]) => {
        this.guestList = this.prepareGuestList(fields);
      })
    ), this.updateUserSelection()).pipe(takeUntil(this.unsubscribe$));
  }

  private prepareGuestList(fields = []) {
    return _.reduce(_.sortBy(fields, ['index']), (result, field) => {
      const { name = null, visibility = true, image = 'guest-img3.svg', searchFilter = [], code = null, label = null, translations = null } = field || {};
      if (visibility) {
        result.push({
          name, searchFilter, code, isActive: false, icon: `assets/images/${image}`,
          label: _.get(this.resourceService, label || translations)
        });
      }
      return result;
    }, []);
  }

  private getFormConfig() {
    const formServiceInputParams = {
      formType: 'config',
      formAction: 'get',
      contentType: 'userType',
      component: 'portal'
    };
    return this.formService.getFormConfig(formServiceInputParams).pipe(
      retry(5),
      catchError(err => {
        this.userSelect.emit(true);
        return of([]);
      })
    );
  }

  private updateUserSelection() {
    return this.updateUserSelection$
      .pipe(
        skipWhile(data => data === undefined || data === null),
        switchMap(userType => {
          const payload = {
            userId: _.get(this.userService, 'userid'),
            profileUserTypes: [{
              'type': userType.toLowerCase()
            }]
          };
          return this.profileService.updateProfile(payload)
            .pipe(
              retry(5),
              concatMap(() => {
                return this.userService.userData$.pipe(
                  skip(1),
                  take(1)
                ).pipe(
                  tap(v => { console.log(v); this.userSelect.emit(true); }),
                );
              }),
              catchError(err => {
                this.toasterService.error(_.get(this.resourceService, 'messages.emsg.m0005'));
                return empty();
              })
            );
        })
      );
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: 'user-type'
        },
        edata: {
          type: 'view',
          pageid: 'user-type-popup',
          uri: this.router.url,
          duration: this.navigationHelperService.getPageLoadTime()
        }
      };
    });
  }

  selectUserType(selectedGuest: IGuest) {
    this.selectedUserType = selectedGuest;
    this.guestList.forEach(guest => {
      guest.isActive = guest === selectedGuest;
    });
  }

  submit() {
    const { code } = this.selectedUserType;
    localStorage.setItem('userType', code);
    if (this.userService.loggedIn) {
      this.updateUserSelection$.next(code);
    } else {
      const { name } = this.selectedUserType;
      localStorage.setItem('guestUserType', name);
      this.userSelect.emit(true);
    }
    this.logAuditEvent(code);
  }
  logAuditEvent(code: any) {
    const auditEventInput: IAuditEventInput = {
      'context': {
        'env': 'onboarding',
        'cdata': [
          { id: code, type: 'UserType' },
        ]
      },
      'object': {
        'id': code,
        'type': '',
        'ver': ''
      },
      'edata': {
        'state': 'Updated',
        'props': [
          'profile_type'
        ],
        'type': 'set-usertype',
        'prevstate': 'set-usertype',
      }
    };
    this.telemetryService.audit(auditEventInput);
  }

  setPopupInteractEdata() {
    this.userSelectionInteractEdata = {
      id: 'user-type-select',
      type: 'click',
      pageid: _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid') || this.router.url.split('/')[1]
    };
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
