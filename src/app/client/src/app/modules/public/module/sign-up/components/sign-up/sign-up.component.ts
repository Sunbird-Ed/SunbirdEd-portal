import { Component, OnInit } from '@angular/core';
import { NgForm, FormArray, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { takeUntil, map, filter } from 'rxjs/operators';
import { Subscription, Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  public unsubscribe = new Subject<void>();
  signUpForm: FormGroup;
  sbFormBuilder: FormBuilder;
  showContact = 'phone';
  disableSubmitBtn = true;
  showPassword = false;

  constructor(formBuilder: FormBuilder) {
    this.sbFormBuilder = formBuilder;
  }

  ngOnInit() {
    this.signUpForm = this.sbFormBuilder.group({
      name: new FormControl(null, [Validators.required, Validators.pattern('^[^(?! )][0-9]*[A-Za-z\\s]*(?!> )$')]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      phone: new FormControl(null, [Validators.required, Validators.pattern('^\\d{10}$')]),
      email: new FormControl(null, [Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,4}$/)]),
      contactType: new FormControl('phone')
    }, {
        validator: (formControl) => {
          const passCtrl = formControl.controls.password;
          const conPassCtrl = formControl.controls.confirmPassword;
          if (passCtrl.value !== conPassCtrl.value) {
            conPassCtrl.setErrors({ validatePasswordConfirmation: true });
          } else { conPassCtrl.setErrors(null); }
          return null;
        }
      });
    this.onContactTypeValueChanges();
    this.enableSignUpSubmitButton();
  }

  onContactTypeValueChanges(): void {
    const emailControl = this.signUpForm.get('email');
    const phoneControl = this.signUpForm.get('phone');
    this.signUpForm.get('contactType').valueChanges.subscribe(
      (mode: string) => {
        if (mode === 'email') {
          emailControl.setValidators([Validators.required, Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,4}$/)]);
          phoneControl.clearValidators();
        } else if (mode === 'phone') {
          emailControl.clearValidators();
          phoneControl.setValidators([Validators.required, Validators.pattern('^\\d{10}$')]);
        }
        emailControl.updateValueAndValidity();
        phoneControl.updateValueAndValidity();
      });
  }

  enableSignUpSubmitButton() {
    this.signUpForm.valueChanges.subscribe(val => {
      if (this.signUpForm.status === 'VALID') {
        this.disableSubmitBtn = false;
      } else {
        this.disableSubmitBtn = false;
      }
    });
  }

  displayPassword() {
    if (this.showPassword) {
      this.showPassword = false;
    } else {
      this.showPassword = true;
    }
  }

  onSubmitSignUpForm() {
    console.log(this.signUpForm);
  }



}
