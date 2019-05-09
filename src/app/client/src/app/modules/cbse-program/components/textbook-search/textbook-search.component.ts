import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-textbook-search',
  templateUrl: './textbook-search.component.html',
  styleUrls: ['./textbook-search.component.scss']
})
export class TextbookSearchComponent implements OnInit {

  @Input() config: any;
  @Input() selectedAttributes: any;
  @Output() selectedTextbookEvent = new EventEmitter<any>();
  public filtersDetails: any;
  public selectedOptions: any = {};

  constructor() { }

  ngOnInit() {
    this.filtersDetails = {
      gradeLevel: _.map(_.get(this.config, 'scope.gradeLevel'), item => ({ name: item, code: item })),
      subject: _.map(_.get(this.config, 'scope.subject'), item => ({ name: item, code: item }))
    };
    this.selectedOptions = {
      gradeLevel: this.selectedAttributes.gradeLevel,
      subject: this.selectedAttributes.subject
    };
  }

  emitSelectedTextbook() {
    this.selectedTextbookEvent.emit(this.selectedOptions);
  }
}
