import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConfigService, UtilService, ToasterService } from '@sunbird/shared';
import { PublicDataService } from '@sunbird/core';
import { Router } from '@angular/router';
import * as _ from 'lodash-es';
import { TelemetryService } from '@sunbird/telemetry';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CbseProgramService } from '../../services';


@Component({
  selector: 'app-textbook-list',
  templateUrl: './textbook-list.component.html',
  styleUrls: ['./textbook-list.component.scss']
})
export class TextbookListComponent implements OnInit {
  @Input() config: any;
  @Input() selectedAttributes: any;
  @Output() selectedTextbookEvent = new EventEmitter<any>();
  public textbookList = [];
  showLoader = true;
  telemetryImpression = {};
  telemetryInteract = {};
  constructor(private configService: ConfigService, public publicDataService: PublicDataService,private cbseService: CbseProgramService,
    public utilService: UtilService, public toasterService: ToasterService, public router: Router,
    public telemetryService: TelemetryService) { }

  ngOnInit() {
    const req = {
      url: `${this.configService.urlConFig.URLS.COMPOSITE.SEARCH}`,
      data: {
        'request': {
          'filters': {
            'objectType': 'content',
            'board': this.selectedAttributes.board,
            'framework': this.selectedAttributes.framework,
            'gradeLevel': this.selectedAttributes.gradeLevel,
            'subject': this.selectedAttributes.subject,
            'medium': this.selectedAttributes.mediumArray,
            'programId': this.selectedAttributes.programId,
            'status': ['Draft', 'Live'],
            'contentType': 'TextBook'
          }
        }
      }
    };
    this.publicDataService.post(req).pipe(catchError(err => {
      let errInfo = { errorMsg: 'Question creation failed' };
      this.showLoader = false;
      return throwError(this.cbseService.apiErrorHandling(err, errInfo))
    })).subscribe((res) => {
      var filteredTextbook = [];
      this.showLoader = false;
      const { constantData, metaData, dynamicFields } = this.configService.appConfig.LibrarySearch;

      // --> The textbook of either of status ['Live', 'Draft'] && In case of both 'Draft' is shown to avoid duplicate.
      let group_arr = _.groupBy(res.result.content, "identifier");
      _.forEach(group_arr, function (val) {
        if (val.length > 1) {
          let ab = _.find(val, function (v) {
            return v.status === "Draft"
          });
          filteredTextbook.push(ab);
        } else {
          filteredTextbook.push(val[0]);
        }
      });

      this.textbookList = this.utilService.getDataForCard(filteredTextbook, constantData, dynamicFields, metaData);
      this.telemetryInteract = {
        id: 'content_card',
        type: 'click',
        pageid: 'textbooklist'
      };
      this.telemetryImpression = {
        context: {
          env: 'cbse_program'
        },
        edata: {
          type: 'view',
          pageid: 'textbooklist',
          uri: this.router.url,
        }
      };

    });
  }

  showTopics(event) {
    console.log(event);

    this.selectedTextbookEvent.emit(event.data);
    this.selectedAttributes.medium = event.data.medium;
  }
  private setTelemetryImpression() {
    this.telemetryImpression = {
      context: {
        env: 'cbse_program'
      },
      edata: {
        type: 'view',
        pageid: 'texbook-list',
        uri: this.router.url,
      }
    };
  }
}
