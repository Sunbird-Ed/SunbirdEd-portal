import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-signup-email-password',
  templateUrl: './signup-email-password.component.html',
  styleUrls: ['./signup-email-password.component.scss']
})
export class SignupEmailPasswordComponent implements OnInit {

  @Output() triggerNext = new EventEmitter();
  
  constructor() { }

  ngOnInit(): void {
  }

  next() {
    this.triggerNext.emit();
  }
}
