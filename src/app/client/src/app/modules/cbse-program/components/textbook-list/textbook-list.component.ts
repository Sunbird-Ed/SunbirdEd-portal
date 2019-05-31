import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConfigService, UtilService, ToasterService } from '@sunbird/shared';
import { PublicDataService } from '@sunbird/core';
import { Router } from '@angular/router';
import * as _ from 'lodash-es';

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
  constructor(private configService: ConfigService, public publicDataService: PublicDataService,
  public utilService: UtilService, public toasterService: ToasterService, public router: Router) { }

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
            'medium': this.selectedAttributes.medium,
            'programId': this.selectedAttributes.programId,
            'status': ['Draft']
          }
        }
      }
    };
    this.publicDataService.post(req).subscribe((res) => {
      this.showLoader = false;
      const { constantData, metaData, dynamicFields } = this.configService.appConfig.LibrarySearch;
      this.textbookList = this.utilService.getDataForCard(res.result.content, constantData, dynamicFields, metaData);
    }, error => {
      this.showLoader = false;
      this.toasterService.error(_.get(error, 'error.params.errmsg') || 'Fetching TextBook failed');
    });
  }

  showTopics(event) {
    console.log(event);

    this.selectedTextbookEvent.emit(event.data.metaData.identifier);
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
