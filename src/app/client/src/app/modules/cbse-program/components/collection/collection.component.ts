import { Component, OnInit, Input } from '@angular/core';
import { ConfigService, UtilService, ToasterService } from '@sunbird/shared';
import { PublicDataService } from '@sunbird/core';

import * as _ from 'lodash-es';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CbseProgramService } from '../../services';


interface ICollectionComponentInput {
  programDetails?: any;
  userProfile?: any;
}

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {

  @Input() collectionComponentInput: ICollectionComponentInput;

  public programDetails: any;
  public userProfile: any;
  public textbookList: Array<any>;
  showLoader = true;

  constructor(private configService: ConfigService, public publicDataService: PublicDataService,
    private cbseService: CbseProgramService, public utilService: UtilService) { }

  ngOnInit() {
    this.programDetails = _.get(this.collectionComponentInput, 'programDetails');
    this.userProfile = _.get(this.collectionComponentInput, 'userProfile');
    this.searchCollection();
  }

  objectKey(obj) {
    return Object.keys(obj);
  }

  searchCollection() {
    const req = {
      url: `${this.configService.urlConFig.URLS.COMPOSITE.SEARCH}`,
      data: {
        'request': {
          'filters': {
            'objectType': 'content',
            'board': 'NCERT',
            'framework': 'NCFCOPY',
            // 'gradeLevel': 'Kindergarten',
            // 'subject': 'Hindi',
            'medium': 'English',
            'programId': '31ab2990-7892-11e9-8a02-93c5c62c03f1',
            'status': ['Draft', 'Live'],
            'contentType': 'TextBook'
          }
        }
      }
    };
    this.publicDataService.post(req).pipe(catchError(err => {
      const errInfo = { errorMsg: 'Question creation failed' };
      this.showLoader = false;
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));


    })).subscribe((res) => {
      const filteredTextbook = [];

      const { constantData, metaData, dynamicFields } = this.configService.appConfig.LibrarySearch;
      const filterArr = _.groupBy(res.result.content, 'identifier');

      _.forEach(filterArr, (collection) => {
        if (collection.length > 1) {
          const groupedCollection = _.find(collection, (item) => {
            return item.status === 'Draft';
          });
          filteredTextbook.push(groupedCollection);
        } else {
          filteredTextbook.push(collection[0]);
        }
      });
      this.textbookList = this.utilService.getDataForCard(filteredTextbook, constantData, dynamicFields, metaData);
      this.textbookList = _.groupBy(this.textbookList, 'subject');
      const textbook = this.textbookList;
      this.showLoader = false;
    });
  }

  cardClickHandler(event) {
    console.log(event);
  }

}
