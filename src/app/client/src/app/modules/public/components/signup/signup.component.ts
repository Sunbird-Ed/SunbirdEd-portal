import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ResourceService, ConfigService, ToasterService } from '@sunbird/shared';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SignupService } from '../../services/signup.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IInteractEventObject, IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal;
  /**
	 * telemetryImpression
	*/
  telemetryImpression: IImpressionEventInput;
  /**
  * sign up form name
  */
  signUpForm: FormGroup;
  /**
  * Contains reference of FormBuilder
  */
  sbFormBuilder: FormBuilder;
  /**
  * Contains list of languages from config file
  */
  languages: Array<string>;
  /**
  * Boolean value to either show/hide app loader
  */
  showLoader = false;

  public unsubscribe$ = new Subject<void>();

  constructor(public resourceService: ResourceService, public configService: ConfigService, public activatedRoute: ActivatedRoute,
    public router: Router, public signupService: SignupService, public toasterService: ToasterService) {
    this.languages = this.configService.dropDownConfig.COMMON.languages;
  }
  /**
   * This method is used to create formgroup instance
   */
  ngOnInit() {
    this.signUpForm = new FormGroup({
      userName: new FormControl(null, [Validators.required, Validators.pattern('^[-\\w\.\\$@\*\\!]{5,256}$')]),
      password: new FormControl(null, [Validators.required, Validators.pattern('^[^(?! )][0-9]*[A-Za-z\\s@#!$?*^&0-9]*(?<! )$')]),
      firstName: new FormControl(null, [Validators.required, Validators.pattern('^[^(?! )][0-9]*[A-Za-z\\s]*(?<! )$')]),
      lastName: new FormControl(null),
      phone: new FormControl(null, [Validators.required, Validators.pattern('^\\d{10}$')]),
      email: new FormControl(null, [Validators.required,
      Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,4}$/)]),
      language: new FormControl(null, [Validators.required])
    });
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.router.url,
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype
      }
    };
  }
  /**
   * This method is used to navigate back
   */
  redirect() {
    this.router.navigate(['']);
  }
  /**
   * This method invokes signup servicec to create new user
   */
  onSubmitForm() {
    this.showLoader = true;
    this.signupService.signup(this.signUpForm.value).pipe(
    takeUntil(this.unsubscribe$))
    .subscribe(res => {
      this.modal.approve();
      this.showLoader = false;
      this.toasterService.success(this.resourceService.messages.smsg.m0039);
      this.router.navigate(['']);
    },
      err => {
        this.showLoader = false;
        this.toasterService.error(err.error.params.errmsg);
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
