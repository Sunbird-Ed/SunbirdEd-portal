import { Component, OnInit, Input, EventEmitter, Output, OnDestroy, ViewChild } from '@angular/core';
import { UserService,  TenantService} from '@sunbird/core';
import { Subscription, Subject } from 'rxjs';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { IUserProfile, ILoaderMessage } from '@sunbird/shared';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import * as _ from 'lodash-es';
import { PopupControlService } from '../../../../service/popup-control.service';

@Component({
  selector: 'app-tnc-popup',
  templateUrl: './terms-conditions-popup.component.html',
  styleUrls: ['./terms-conditions-popup.component.scss']
})

export class TermsAndConditionsPopupComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal;
  @Input() tncUrl: string;
  @Input() showAcceptTnc: boolean;
  @Input() adminTncVersion: any;
  @Output() close = new EventEmitter<any>();

  /**
   * user profile details.
   */
  private userProfile: IUserProfile;
  public unsubscribe = new Subject<void>();
  tenantDataSubscription: Subscription;
  userSubscription: Subscription;
  logo: string;
  tenantName: string;
  tncLatestVersionUrl: any;
  tncChecked = false;
  disableContinueBtn = false;
  showLoader = true;
  loaderMessage: ILoaderMessage = {
    'loaderMessage': this.resourceService.messages.stmsg.m0129
  };

  constructor(public userService: UserService, public resourceService: ResourceService,
    public toasterService: ToasterService, public tenantService: TenantService,
    public sanitizer: DomSanitizer, public popupControlService: PopupControlService) {
  }

  ngOnInit() {
    this.popupControlService.changePopupStatus(false);
    if (this.tncUrl) {
      this.tncLatestVersionUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.tncUrl);
    } else {
      this.userSubscription = this.userService.userData$.subscribe(
        (user: any) => {
          if (user && !user.err) {
            this.userProfile = user.userProfile;
            this.tncLatestVersionUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.userProfile.tncLatestVersionUrl );
          } else if (user.err) {
            this.toasterService.error(this.resourceService.messages.emsg.m0005);
          }
        });
    }
    this.tenantDataSubscription = this.tenantService.tenantData$.subscribe(
      data => {
        if (data && !data.err) {
          this.logo = data.tenantData.logo;
          this.tenantName = data.tenantData.titleName;
        }
      }
    );
  }

  /**
   * This method used to submit terms and conditions acceptance
   */
  public onSubmitTnc() {
    const requestBody = {
      request: {
        version: _.get(this.userProfile, 'tncLatestVersion')
      }
    };
    if (this.userService.userProfile.managedBy) {
      requestBody.request['userId'] = this.userService.userid;
    }
    if (this.adminTncVersion) {
      requestBody.request['version'] = this.adminTncVersion;
      requestBody.request['tncType'] = 'orgAdminTnc';
    }
    this.disableContinueBtn = true;
    this.userService.acceptTermsAndConditions(requestBody).subscribe(res => {
      this.onClose();
    }, err => {
      this.disableContinueBtn = false;
      this.toasterService.error(this.resourceService.messages.fmsg.m0085);
    });
  }

  public onClickCheckbox(tncChecked) {
    this.disableContinueBtn = !tncChecked;
  }

  public onClose() {
    this.modal.deny();
    this.close.emit();
    this.popupControlService.changePopupStatus(true);
  }

  ngOnDestroy() {
    this.popupControlService.changePopupStatus(true);
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.tenantDataSubscription) {
      this.tenantDataSubscription.unsubscribe();
    }
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
