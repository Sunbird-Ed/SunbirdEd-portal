import { Component, OnInit, Input } from '@angular/core';
import { ConfigService, UtilService, ToasterService } from '@sunbird/shared';
import { PublicDataService, ContentService } from '@sunbird/core';

import * as _ from 'lodash-es';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CbseProgramService } from '../../services';

interface ISelectedAttributes { // TODO: remove any 'textbook' reference
  textBookUnitIdentifier?: any;
  collectionUnitIdentifier?: any;
  lastOpenedUnit?: any;
  framework?: string;
  channel?: string;
  board?: string;
  medium?: string;
  gradeLevel?: string;
  subject?: string;
  textbook?: string;
  collection?: string;
  topic?: string;
  questionType?: string;
  programId?: string;
  program?: string;
  currentRole?: string;
  bloomsLevel?: Array<any>;
  topicList?: Array<any>;
  onBoardSchool?: string;
  selectedSchoolForReview?: string;
  resourceIdentifier?: string;
  hierarchyObj?: any;
  textbookName?: any;
  collectionName?: any;
  collectionType?: any;
  collectionStatus?: any;
}

interface IChapterListComponentInput {
  config?: any;
  selectedAttributes?: any;
  role?: any;
  collection?: any;
  entireConfig?: any;
}

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {

  @Input() collectionComponentInput: any;

  public selectedAttributes: ISelectedAttributes = {};
  public chapterListComponentInput: IChapterListComponentInput = {};
  public programDetails: any;
  public userProfile: any;

  public programSession: any; // TODO: change to just programDetails after creating new program
  public collectionComponentConfig: any;
  public entireConfig: any;
  public collectionList: Array<any>;
  public collection;
  public role: any = {};
  showLoader = true;

  constructor(private configService: ConfigService, public publicDataService: PublicDataService,
    private cbseService: CbseProgramService, public utilService: UtilService, public contentService: ContentService) { }

  ngOnInit() {
    this.programDetails = _.get(this.collectionComponentInput, 'programDetails');
    this.userProfile = _.get(this.collectionComponentInput, 'userProfile');
    this.collectionComponentConfig = _.get(this.collectionComponentInput, 'config');
    this.entireConfig = _.get(this.collectionComponentInput, 'entireConfig');
    this.selectedAttributes = {
      currentRole: _.get(this.programDetails, 'userDetails.roles[0]'),
      framework: _.find(this.collectionComponentConfig.config.filters.implicit, {'code': 'framework'}).defaultValue,
      channel: _.get(this.programDetails, 'config.scope.channel'),
      board: _.find(this.collectionComponentConfig.config.filters.implicit, {'code': 'board'}).defaultValue,
      medium: _.find(this.collectionComponentConfig.config.filters.implicit, {'code': 'medium'}).defaultValue,
      bloomsLevel: _.get(this.programDetails, 'config.scope.bloomsLevel'),
      programId: '31ab2990-7892-11e9-8a02-93c5c62c03f1' || _.get(this.programDetails, 'programId'),
      program: _.get(this.programDetails, 'name'),
      onBoardSchool: _.get(this.programDetails, 'userDetails.onBoardingData.school'),
      collectionType: _.get(this.collectionComponentConfig, 'collectionType'),
      collectionStatus: _.get(this.collectionComponentConfig, 'status')
    };
    this.searchCollection();
    this.role.currentRole = this.selectedAttributes.currentRole;
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
            'board': this.selectedAttributes.board,
            'framework': this.selectedAttributes.framework,
            // 'gradeLevel': 'Kindergarten',
            // 'subject': 'Hindi',
            'medium': this.selectedAttributes.medium,
            'programId': this.selectedAttributes.programId,
            'status': this.selectedAttributes.collectionStatus || ['Draft', 'Live'],
            'contentType': this.selectedAttributes.collectionType || 'Textbook'
          }
        }
      }
    };
    this.contentService.post(req)
      .pipe(catchError(err => {
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
      const collectionCards = this.utilService.getDataForCard(filteredTextbook, constantData, dynamicFields, metaData);
      const collectionsWithCardImage = _.forEach(collectionCards, collection => this.addCardImage(collection));
      this.collectionList = this.groupByCollection(collectionsWithCardImage, 'subject');
      this.showLoader = false;
    });
  }

  addCardImage(collection) {
    collection.cardImg = collection.image;
    return collection;
  }

  groupByCollection(collection, arg) {
    return _.groupBy(collection, arg);
  }

  collectionClickHandler(event) {
    console.log(event);
    this.selectedAttributes.collection =  event.data.metaData.identifier;
    this.selectedAttributes.collectionName = event.data.name;
    this.collection = event.data;
    this.chapterListComponentInput = {
      selectedAttributes: this.selectedAttributes,
      collection: this.collection,
      config: _.find(this.entireConfig.components, {'id': 'ng.sunbird.chapterList'}),
      entireConfig: this.entireConfig,
      role: this.role
    };
  }

}
