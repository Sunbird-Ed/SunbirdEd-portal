import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {InterpolatePipe, ResourceService, ToasterService, ServerResponse, UtilService, NavigationHelperService, LayoutService } from '@sunbird/shared';
import { ProfileService } from './../../services';
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
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

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
  

  public unsubscribe = new Subject<void>();
  pageId = 'create-managed-user';

  constructor(public resourceService: ResourceService, public toasterService: ToasterService,
    public profileService: ProfileService, formBuilder: UntypedFormBuilder, public router: Router,
    public userService: UserService, public orgDetailsService: OrgDetailsService, public channelService: ChannelService,
    public frameworkService: FrameworkService, public utilService: UtilService, public formService: FormService,
    private activatedRoute: ActivatedRoute, public navigationhelperService: NavigationHelperService,
    public tncService: TncService, private managedUserService: ManagedUserService, public layoutService: LayoutService,
    public _sanitizer: DomSanitizer) {
    this.sbFormBuilder = formBuilder;
  }

  ngOnInit() {
    this.navigationhelperService.setNavigationUrl();
    this.setTelemetryData();
    this.instance = _.upperCase(this.resourceService.instance || 'SUNBIRD');
    this.getFormDetails();

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
      id: 'submit-create-managed-user',
      type: 'click',
      pageid: this.pageId
    };

    this.submitCancelInteractEdata = {
      id: 'cancel-create-managed-user',
      type: 'click',
      pageid: this.pageId
    };
  }

  getFormDetails() {
    const formServiceInputParams = {
      formType: 'user',
      formAction: 'create',
      contentType: 'child',
      component: 'portal'
    };
    this.formService.getFormConfig(formServiceInputParams, this.userService.hashTagId).subscribe((formData) => {
      this.formData = formData;
      this.initializeFormFields();
    }, (err) => {
      this.toasterService.error(_.get(this.resourceService, 'messages.emsg.m0005'));
      this.showLoader = false;
    });
  }

  initializeFormFields() {
    const formGroupObj = {};
    for (const key of this.formData) {
      if (key.visible && key.required) {
        formGroupObj[key.code] = new UntypedFormControl(null, [Validators.required]);
      } else if (key.visible) {
        formGroupObj[key.code] = new UntypedFormControl(null);
      }
    }

    this.userDetailsForm = this.sbFormBuilder.group(formGroupObj, {
      validator: (formControl) => {
        const nameCtrl = formControl.controls.name;
        if (_.trim(nameCtrl.value) === '') {
          nameCtrl.setErrors({ required: true });
        }
        return null;
      }
    });
    this.showLoader = false;
    this.enableSubmitBtn = (this.userDetailsForm.status === 'VALID');
    this.enableSubmitButton();
  }

  enableSubmitButton() {
    this.userDetailsForm.valueChanges.subscribe(val => {
      this.enableSubmitBtn = (this.userDetailsForm.status === 'VALID');
    });
  }

  onCancel() {
    this.navigationhelperService.navigateToLastUrl();
  }

  onSubmitForm() {
    this.enableSubmitBtn = false;
    this.userDetailsForm.value.name = _.trim(this._sanitizer.sanitize(SecurityContext.HTML,this.userDetailsForm.value.name));
    if (this.userDetailsForm.value.name !== '' && this.userDetailsForm.value.name !== null) {
      const createUserRequest = {
        request: {
          firstName: this.userDetailsForm.controls?.name.value,
          managedBy: this.managedUserService.getUserId()
        }
      };
      this.managedUserService.getParentProfile().subscribe((userProfileData) => {
        if (!_.isEmpty(_.get(userProfileData, 'userLocations'))) {
          createUserRequest.request['profileLocation'] = _.map(_.get(userProfileData, 'userLocations'), function (location) { return { code: location.code, type: location.type }; });
        }
        if (_.get(userProfileData, 'framework') && !_.isEmpty(_.get(userProfileData, 'framework'))) {
          createUserRequest.request['framework'] = _.get(userProfileData, 'framework');
        }
        this.registerUser(createUserRequest, userProfileData);
      });
    } else {
      return false;
    }
  }

  registerUser(createUserRequest, userProfileData) {
    this.userService.registerUser(createUserRequest).subscribe((resp: ServerResponse) => {
        this.managedUserService.updateUserList({
          firstName: this.userDetailsForm.controls?.name.value,
          identifier: _.get(resp, 'result.userId'),
          id: _.get(resp, 'result.userId'),
          managedBy: this.managedUserService.getUserId()
        });
        const filterPipe = new InterpolatePipe();
        const successMessage = filterPipe.transform(_.get(this.resourceService, 'messages.imsg.m0096'),
          '{firstName}', this.userDetailsForm.controls?.name.value);
        this.toasterService.custom({
          message: successMessage,
          class: 'sb-toaster sb-toast-success sb-toast-normal'
        });
        this.router.navigate(['/profile/choose-managed-user']);
      }, (err) => {
        if (_.get(err, 'error.params.status') === 'MANAGED_USER_LIMIT_EXCEEDED') {
          this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0100'));
        } else {
          this.toasterService.error(this.resourceService.messages.fmsg.m0085);
        }
        this.enableSubmitBtn = true;
      }
    );
  }
}
