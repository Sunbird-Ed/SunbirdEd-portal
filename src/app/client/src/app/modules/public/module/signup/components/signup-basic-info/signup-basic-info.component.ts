import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-signup-basic-info',
  templateUrl: './signup-basic-info.component.html',
  styleUrls: ['./signup-basic-info.component.scss']
})
export class SignupBasicInfoComponent implements OnInit {

  @Output() triggerNext = new EventEmitter();
  
  constructor() { }

  ngOnInit(): void {
  }

  next() {
    this.triggerNext.emit();
  }

}
