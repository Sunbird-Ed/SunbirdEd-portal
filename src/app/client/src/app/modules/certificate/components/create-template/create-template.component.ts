import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-create-template',
  templateUrl: './create-template.component.html',
  styleUrls: ['./create-template.component.scss']
})
export class CreateTemplateComponent implements OnInit {

  public unsubscribe$ = new Subject<void>();

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  createCertTemplate() {

  }

  onTemplateChange() {

  }
}
