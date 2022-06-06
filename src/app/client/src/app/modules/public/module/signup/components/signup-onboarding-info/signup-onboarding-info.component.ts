import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-signup-onboarding-info',
  templateUrl: './signup-onboarding-info.component.html',
  styleUrls: ['./signup-onboarding-info.component.scss']
})
export class SignupOnboardingInfoComponent implements OnInit {

  @Output() triggerNext = new EventEmitter();
  
  constructor() { }

  ngOnInit(): void {
  }

  next() {
    this.triggerNext.emit();
  }
}
