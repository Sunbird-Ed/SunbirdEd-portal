import { Component, OnInit } from '@angular/core';
import { ResourceService, ToasterService, ServerResponse, UtilService, NavigationHelperService } from '@sunbird/shared';
import { ProfileService } from './../../services';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import * as _ from 'lodash-es';
import { IInteractEventObject, IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import { OrgDetailsService, ChannelService, FrameworkService, UserService, FormService, TncService } from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, throwError, of, forkJoin, Subject, merge, concat } from 'rxjs';
import { mergeMap, switchMap, map, retry, catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  userProfile: any;
  userDetailsForm: FormGroup;
  sbFormBuilder: FormBuilder;
  enableSubmitBtn = false;
  tncLatestVersion: any;
  termsAndConditionLink: any;
  showTncPopup = false;
  instance: string;
  formData;
  showLoader = true;
  telemetryImpression: IImpressionEventInput;
  telemetryInteractObject: IInteractEventObject;
  submitInteractEdata: IInteractEventEdata;
  pageId = 'user-create';

  constructor(public resourceService: ResourceService, public toasterService: ToasterService,
    public profileService: ProfileService, formBuilder: FormBuilder, public router: Router,
    public userService: UserService, public orgDetailsService: OrgDetailsService, public channelService: ChannelService,
    public frameworkService: FrameworkService, public utilService: UtilService, public formService: FormService,
    private activatedRoute: ActivatedRoute, public navigationhelperService: NavigationHelperService,
    public tncService: TncService) {
    this.sbFormBuilder = formBuilder;
  }

  ngOnInit() {
    this.setTelemetryData();
    this.instance = _.upperCase(this.resourceService.instance || 'SUNBIRD');
    this.fetchTncData();
    this.getFormDetails();
    this.userProfile = this.userService.userProfile;
  }

  setTelemetryData() {
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      object: {
        id: this.userService.userid,
        type: 'User',
        ver: '1.0'
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
      id: 'submit-create-user',
      type: 'click',
      pageid: this.pageId
    };

    this.telemetryInteractObject = {
      id: this.userService.userid,
      type: 'User',
      ver: '1.0'
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

  fetchTncData() {
    this.tncService.getTncConfig()
      .pipe(map((data) => {
        const response = _.get(data, 'result.response.value');
        return this.utilService.parseJson(response);
      })).subscribe((tncConfig) => {
        this.tncLatestVersion = _.get(tncConfig, 'latestVersion') || {};
        this.termsAndConditionLink = tncConfig[this.tncLatestVersion].url;
      }, (err) => {
        this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0004'));
      });
  }

  showAndHidePopup(mode: boolean) {
    this.showTncPopup = mode;
  }

  initializeFormFields() {
    const formGroupObj = {};
    for (const key of this.formData) {
      if (key.visible && key.required) {
        formGroupObj[key.code] = new FormControl(null, [Validators.required]);
      } else if (key.visible) {
        formGroupObj[key.code] = new FormControl(null);
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


  onSubmitForm() {
    const createUserRequest = {
      request: {
        firstName: this.userDetailsForm.value.name,
        managedBy: this.userService.userid/*,
        framework: this.userProfile.framework,
        userLocations: this.userProfile.userLocations*/
      }
    };
    // this.userService.registerUser(createUserRequest).subscribe((resp: ServerResponse) => {
    //   const requestBody = {
    //     request: {
    //       version: this.userProfile.tncLatestVersion,
    //       userId: resp.result.userId
    //     }
    //   };
    //   this.userService.acceptTermsAndConditions(requestBody).subscribe(res => {
    //     this.router.navigate(['/profile/choose-user']);
    //   }, err => {
    //     this.toasterService.error(this.resourceService.messages.fmsg.m0085);
    //   });
    // },
    //   (err) => {
    //     this.toasterService.error(this.resourceService.messages.fmsg.m0085);
    //   }
    // );
  }
}
