import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-select-textbook',
  templateUrl: './select-textbook.component.html',
  styleUrls: ['./select-textbook.component.scss']
})
export class SelectTextbookComponent implements OnInit {

  @Input() config: any;
  @Input() selectedAttributes: any;
  @Output() selectedClassSubjectEvent = new EventEmitter<any>();
  public filtersDetails: any;
  public selectedOptions: any = {};
  telemetryImpression = {};
  telemetryInteract = {};

  constructor(public router: Router) { }

  ngOnInit() {
    this.filtersDetails = {
      gradeLevel: _.map(_.get(this.config, 'scope.gradeLevel'), item => ({ name: item, code: item })),
      subject: _.map(_.get(this.config, 'scope.subject'), item => ({ name: item, code: item }))
    };
    this.selectedOptions = {
      gradeLevel: this.selectedAttributes.gradeLevel,
      subject: this.selectedAttributes.subject
    };
    this.setTelemetryImpression();
    this.telemetryInteract = {
      id: 'search-textbook',
      type: 'click',
      pageid: 'search-textbooks',
      extra: this.selectedOptions
    };
  }

  emitSelectedTextbook() {
    this.selectedClassSubjectEvent.emit(this.selectedOptions);
  }

  private setTelemetryImpression() {
    this.telemetryImpression = {
      context: {
        env: 'cbse_program'
      },
      edata: {
        type: 'view',
        pageid: 'search_textbook',
        uri: this.router.url,
      }
    };
  }
}
