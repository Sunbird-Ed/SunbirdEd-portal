import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dummy-test-component',
  templateUrl: './dummy-test-component.component.html',
  styleUrls: ['./dummy-test-component.component.scss']
})
export class DummyTestComponentComponent implements OnInit {

dummyTestVariable;
  constructor() { }

  ngOnInit() {
    this.dummyTestVariable = 'dummyValue';
    this.dummyMethod();
  }

  dummyMethod() {
  }

}
