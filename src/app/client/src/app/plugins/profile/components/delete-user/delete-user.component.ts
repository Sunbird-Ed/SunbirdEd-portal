import { Component, EventEmitter, OnInit, Output, ViewChildren } from '@angular/core';
import { ResourceService, ToasterService, NavigationHelperService, LayoutService, IUserData } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { takeUntil } from 'rxjs/operators';
import { IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import { UserService } from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss']
})
export class DeleteUserComponent implements OnInit {

  @ViewChildren('inputFields') inputFields;
  @Output() close = new EventEmitter();
  enableSubmitBtn = false;
  conditions = [];
  telemetryImpression: IImpressionEventInput;
  submitInteractEdata: IInteractEventEdata;
  submitCancelInteractEdata: IInteractEventEdata;
  layoutConfiguration: any;
  showContactPopup = false
  list = ['Personal Information: Your personal account information, including your profile and login details, will be permanently deleted, including your activity history. This information cannot be recovered',
    'Certificates: For certificate verification purposes, only your name will be stored. Access Loss: You will lose access to all features and services associated with this account, and any subscriptions or memberships may be terminated.',
    'Single Sign-On (SSO): If you use Single Sign-On (SSO) to sign in, be aware that a new account will be created the next time you sign in. This new account will not have any historical information.',
    'Resource Retention: Even after your account is deleted, any contributions, content, or resources you have created within the portal will not be deleted. These will remain accessible to other users as part of the collective content.You will no longer have control or management rights over them.',
    'Usage Reports: Usage reports will retain location data declared by you.',
    'Make sure you have backed up any important data and have considered the consequences before confirming account deletion and downloaded your certificates.']


  public unsubscribe = new Subject<void>();
  pageId = 'delete-user';
  userProfile: any;

  constructor(public resourceService: ResourceService, public toasterService: ToasterService, public router: Router,
    public userService: UserService,
    private activatedRoute: ActivatedRoute, public navigationhelperService: NavigationHelperService,
    public layoutService: LayoutService) {
    this.userService.userData$.subscribe((user: IUserData) => {
      this.userProfile = user.userProfile;
    })
  }

  ngOnInit() {
    this.navigationhelperService.setNavigationUrl();
    this.setTelemetryData();
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.layoutService.switchableLayout().
      pipe(takeUntil(this.unsubscribe)).subscribe(layoutConfig => {
        if (layoutConfig != null) {
          this.layoutConfiguration = layoutConfig.layout;
        }
      });
  }

  goBack() {
    this.navigationhelperService.goBack();
  }

  setTelemetryData() {
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.pageId,
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
        uri: this.router.url,
        duration: this.navigationhelperService.getPageLoadTime()
      }
    };

    this.submitInteractEdata = {
      id: 'submit-delete-user',
      type: 'click',
      pageid: this.pageId
    };

    this.submitCancelInteractEdata = {
      id: 'cancel-delete-user',
      type: 'click',
      pageid: this.pageId
    };
  }

  onCancel() {
    this.navigationhelperService.navigateToLastUrl();
  }

  onSubmitForm() {
    if (this.enableSubmitBtn) {
      this.enableSubmitBtn = false;
      this.showContactPopup = true;
      this.conditions = []
      this.inputFields.forEach((element) => {
        element.nativeElement.checked = false;
      });
    }
  }

  /**
    * This method checks whether the length of comments is greater than zero.
    * If both the validation is passed it enables the submit button
    */
  validateModal() {
    if ((this.inputFields && this.inputFields.length === this.conditions.length)) {
      this.enableSubmitBtn = true;
    } else {
      this.enableSubmitBtn = false;
    }
  }
  
  /**
   * This method pushes all the checked reason into a array
   */
  createCheckedArray(checkedItem) {
    if (checkedItem && (_.indexOf(this.conditions, checkedItem) === -1)) {
      this.conditions.push(checkedItem);
    } else if (checkedItem && (_.indexOf(this.conditions, checkedItem) !== -1)) {
      this.conditions.splice(_.indexOf(this.conditions, checkedItem), 1);
    }
    this.validateModal();
  }
}
