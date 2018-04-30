import { Component, OnInit } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  /**
* sign up form name
*/
  signUpForm: FormGroup;
  /**
* Contains reference of FormBuilder
*/
  sbFormBuilder: FormBuilder;

  constructor(formBuilder: FormBuilder, public resourceService: ResourceService) {
    this.sbFormBuilder = formBuilder;
  }

  ngOnInit() {
    this.signUpForm = this.sbFormBuilder.group({
      userName: ['', null],
      password: ['', null],
      firstName: ['', null],
      lastName: ['', null],
      phone: ['', null],
      email: ['', null],
      language: ['', null]
    });
  }
  redirect() {
    console.log('here');
  }
  onSubmitForm() {
    console.log('form values', this.signUpForm.value);
  }

}
