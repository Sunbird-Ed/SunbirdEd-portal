import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dummy-comp',
  templateUrl: './dummy-comp.component.html',
  styleUrls: ['./dummy-comp.component.scss']
})
export class DummyCompComponent implements OnInit {

  dummyTestVariable;
  constructor() { }

  ngOnInit() {
    this.dummyTestVariable = 'dummyValue';
    this.dummyMethod();
  }

  dummyMethod() {
  }

}
