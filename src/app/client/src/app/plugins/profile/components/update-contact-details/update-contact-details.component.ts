import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ResourceService } from '@sunbird/shared';

@Component({
  selector: 'app-update-contact-details',
  templateUrl: './update-contact-details.component.html',
  styleUrls: ['./update-contact-details.component.scss']
})
export class UpdateContactDetailsComponent implements OnInit {

  @Input() contactType: string;
  @Output() redirectToParent = new EventEmitter();
  @Output() close = new EventEmitter<any>();
  contactTypeForm: FormGroup;

  constructor(public resourceService: ResourceService) { }

  ngOnInit() {
    if (this.contactType === 'phone') {
      this.contactTypeForm = new FormGroup({
        phone: new FormControl('', [Validators.required, Validators.pattern('^\\d{10}$')])
      });
    } else if (this.contactType === 'email') {
      this.contactTypeForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,4}$/)])
      });
    }
  }

  closeModal(contactTypeModal) {
    contactTypeModal.deny();
    this.close.emit();
  }

  enableSubmitButton() {
    // subscribe value changes and enable/disable submit button
  }

  vaidateUserContact() {
    // call look up API
  }

  onPhoneChange() {
    // on phone change
  }

  onEmailChange() {
    // on email change
  }

  onSubmitForm() {
    this.generateOTP();
  }

  generateOTP() {
    // generate OTP and open otp popup
  }
}
