import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import {SuiSelectModule} from 'ng2-semantic-ui';
import { of, throwError, Subscription } from 'rxjs';
import { FrameworkService, FormService, PermissionService, UserService, OrgDetailsService } from '@sunbird/core';
import {
  ConfigService, ResourceService, Framework, BrowserCacheTtlService, UtilService
} from '@sunbird/shared';
import * as _ from 'lodash-es';
import { first, mergeMap, map, tap, catchError, filter } from 'rxjs/operators';

@Component({
  selector: 'app-textbook-search',
  templateUrl: './textbook-search.component.html',
  styleUrls: ['./textbook-search.component.scss']
})
export class TextbookSearchComponent implements OnInit {

  objectKeys = Object.keys;
  @Input() hashTagId: string;
  @Input() defaultSelectedOptions: any;
  // @Input() frameworkName: string;
  @Output() selectedTextbookEvent = new EventEmitter<any>();

  public filtersDetails: any;
  public selectedSubject: any;
  public selectedClass: any;
  public topics: any;
  public selectedOptions: any;
  public frameworkName = 'NCFCOPY';
  public frameworkDetails: any;


  constructor(public frameworkService: FrameworkService) {}

  ngOnInit() {
    console.log(this.defaultSelectedOptions);
    this.filtersDetails = {
      'class': [],
      'subject': []
  };
  this.frameworkService.initialize(this.frameworkName, '');
  this.fetchFrameWorkDetails();
  }

  public setFilterInteractData(category) {
    const fr = JSON.parse(this.frameworkDetails.frameworkdata[this.frameworkName].fw_hierarchy);
    const frameworkData = fr.categories;
    // const frameworkData = this.frameworkDetails.frameworkdata[this.frameworkName].categories;
    const frameworkClass = _.find(frameworkData, {code: 'gradeLevel'});
    setTimeout(() => {
      if (category === 'class') {
        const selectedClass = this.selectedClass;
        const selectedClassObj = _.filter(frameworkClass.terms, o => {
            return o.code === selectedClass;
        });
        if (selectedClassObj[0] && selectedClassObj[0].associations) {
          this.selectedSubject = '';
          this.filtersDetails.subject = [];
          _.map(selectedClassObj[0].associations, (item) => {
            // acc[current.identifier] = current.name;
            if (item.category === 'subject') {
              this.filtersDetails.subject.push({name: item.name, code: item.code});
            }
          });
        } else {
          const frameworkSubject = _.find(frameworkData, {code: 'subject'});
          _.map(frameworkSubject.terms, (item) => {
            // acc[current.identifier] = current.name;
            this.filtersDetails.subject.push({name: item.name, code: item.code});
          });
        }
      } else {
        this.topics = _.find(frameworkData, {code: 'topic'});
      }
      this.selectedOptions = {
        'class': this.selectedClass,
        'subject': this.selectedSubject,
        'topics': this.topics && this.topics.terms
      };
    });
  }

  private fetchFrameWorkDetails() {
     this.frameworkService.frameworkData$.pipe(first()).subscribe(
      (frameworkDetails: any) => {
        if (frameworkDetails && !frameworkDetails.err) {
          this.frameworkDetails = frameworkDetails;
          this.filterTextbookForm();
        }
      }
    );
  }

  private filterTextbookForm() {
    const fr = JSON.parse(this.frameworkDetails.frameworkdata[this.frameworkName].fw_hierarchy);
    const frameworkData = fr.categories;
    // const frameworkData = this.frameworkDetails.frameworkdata[this.frameworkName].categories;
    const frameworkClass = _.find(frameworkData, {code: 'gradeLevel'});
    const frameworkSubject = _.find(frameworkData, {code: 'subject'});
    _.map(frameworkClass.terms, (item) => {
      this.filtersDetails.class.push({name: item.name, code: item.code});
    });
    _.map(frameworkSubject.terms, (item) => {
      // acc[current.identifier] = current.name;
      this.filtersDetails.subject.push({name: item.name, code: item.code});
    });
    console.log(this.filtersDetails, this.defaultSelectedOptions);
  }

  emitSelectedTextbook() {
    this.selectedTextbookEvent.emit(this.selectedOptions);
  }

}
