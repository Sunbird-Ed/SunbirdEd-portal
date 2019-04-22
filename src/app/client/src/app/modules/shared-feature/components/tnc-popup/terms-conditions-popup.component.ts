import { Component, OnInit, Input, EventEmitter, Output, OnDestroy, ViewChild } from '@angular/core';
import { UserService,  TenantService} from '@sunbird/core';
import { Subscription, Subject } from 'rxjs';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { IUserProfile, ILoaderMessage } from '@sunbird/shared';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-tnc-popup',
  templateUrl: './terms-conditions-popup.component.html',
  styleUrls: ['./terms-conditions-popup.component.scss']
})

export class TermsAndConditionsPopupComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal;
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
    public sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.userSubscription = this.userService.userData$.subscribe(
      (user: any) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
          this.tncLatestVersionUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.userProfile.tncLatestVersionUrl );
        } else if (user.err) {
          this.toasterService.error(this.resourceService.messages.emsg.m0005);
        }
      });
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
        version: this.userProfile.tncLatestVersion
       }
    };
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
  }

  ngOnDestroy() {
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
