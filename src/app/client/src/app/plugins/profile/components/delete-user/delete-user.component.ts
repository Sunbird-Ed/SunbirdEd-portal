import { Component, EventEmitter, OnInit, Output, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {InterpolatePipe, ResourceService, ToasterService, ServerResponse, UtilService, NavigationHelperService, LayoutService,IUserData } from '@sunbird/shared';
import { ProfileService } from '../../services';
import { UntypedFormBuilder, Validators, UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import * as _ from 'lodash-es';
import { takeUntil } from 'rxjs/operators';
import { IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import {
  OrgDetailsService,
  ChannelService,
  FrameworkService,
  UserService,
  FormService,
  TncService,
  ManagedUserService
} from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss']
})
export class DeleteUserComponent implements OnInit {

  userDetailsForm: UntypedFormGroup;
  sbFormBuilder: UntypedFormBuilder;
  enableSubmitBtn = false;
  instance: string;
  formData;
  showLoader = true;
  telemetryImpression: IImpressionEventInput;
  submitInteractEdata: IInteractEventEdata;
  submitCancelInteractEdata: IInteractEventEdata;
  layoutConfiguration: any;
  showContactPopup=false

  @Output() close = new EventEmitter();

  public unsubscribe = new Subject<void>();
  pageId = 'delete-managed-user';
  userProfile: any;

  constructor(public resourceService: ResourceService, public toasterService: ToasterService,
    public profileService: ProfileService, formBuilder: UntypedFormBuilder, public router: Router,
    public userService: UserService, public orgDetailsService: OrgDetailsService, public channelService: ChannelService,
    public frameworkService: FrameworkService, public utilService: UtilService, public formService: FormService,
    private activatedRoute: ActivatedRoute, public navigationhelperService: NavigationHelperService,
    public tncService: TncService, private managedUserService: ManagedUserService, public layoutService: LayoutService,
    public _sanitizer: DomSanitizer) {
    this.sbFormBuilder = formBuilder;
    this.userService.userData$.subscribe((user: IUserData) => {
      this.userProfile=user.userProfile;
    })
  }

  ngOnInit() {
   
    
      this.navigationhelperService.setNavigationUrl();
    this.setTelemetryData();
    this.instance = _.upperCase(this.resourceService.instance || 'SUNBIRD');

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
      id: 'submit-delete-managed-user',
      type: 'click',
      pageid: this.pageId
    };

    this.submitCancelInteractEdata = {
      id: 'cancel-delete-managed-user',
      type: 'click',
      pageid: this.pageId
    };
  }

  onCancel() {
    this.navigationhelperService.navigateToLastUrl();
  }

  onSubmitForm() {
    this.enableSubmitBtn = false;
    this.showContactPopup=true;
  }
}
