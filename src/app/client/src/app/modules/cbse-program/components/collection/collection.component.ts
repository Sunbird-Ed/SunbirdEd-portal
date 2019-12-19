import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConfigService, UtilService, ToasterService } from '@sunbird/shared';
import { PublicDataService, ContentService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CbseProgramService } from '../../services';
import { ProgramStageService } from '../../../program/services';
import { IProgramContext, IChapterListComponentInput } from '../../interfaces';
import { InitialState } from '../../interfaces';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {

  @Input() collectionComponentInput: any;
  @Output() isCollectionSelected  = new EventEmitter<any>();
  public programContext: IProgramContext = {};
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
  public state: InitialState = {
    stages: []
  };
  public showStage;
  public currentStage: any;

  constructor(private configService: ConfigService, public publicDataService: PublicDataService,
    private cbseService: CbseProgramService, public programStageService: ProgramStageService,
    public utilService: UtilService, public contentService: ContentService) { }

  ngOnInit() {
    this.programStageService.getStage().subscribe(state => {
      this.state.stages = state.stages;
      this.changeView();
    });

    this.currentStage = 'collectionComponent';
    this.programDetails = _.get(this.collectionComponentInput, 'programDetails');
    this.userProfile = _.get(this.collectionComponentInput, 'userProfile');
    this.collectionComponentConfig = _.get(this.collectionComponentInput, 'config');
    this.entireConfig = _.get(this.collectionComponentInput, 'entireConfig');
    this.programContext = {
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
    const getCurrentRoleId = _.find(this.entireConfig.config.roles, {'name': this.programContext.currentRole});
    this.programContext.currentRoleId = (getCurrentRoleId) ? getCurrentRoleId.id : null;
    this.role.currentRole = this.programContext.currentRole;
  }

  objectKey(obj) {
    return Object.keys(obj);
  }
  changeView() {
    if (!_.isEmpty(this.state.stages)) {
      this.currentStage  = _.last(this.state.stages).stage;
    }
  }

  searchCollection() {
    const req = {
      url: `${this.configService.urlConFig.URLS.COMPOSITE.SEARCH}`,
      data: {
        'request': {
          'filters': {
            'objectType': 'content',
            'board': this.programContext.board,
            'framework': this.programContext.framework,
            // 'gradeLevel': 'Kindergarten',
            // 'subject': 'Hindi',
            'medium': this.programContext.medium,
            'programId': this.programContext.programId,
            'status': this.programContext.collectionStatus || ['Draft', 'Live'],
            'contentType': this.programContext.collectionType || 'Textbook'
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
    this.programContext.collection =  event.data.metaData.identifier;
    this.programContext.collectionName = event.data.name;
    this.collection = event.data;
    this.chapterListComponentInput = {
      programContext: this.programContext,
      collection: this.collection,
      config: _.find(this.entireConfig.config.components, {'id': 'ng.sunbird.chapterList'}),
      entireConfig: this.entireConfig,
      role: this.role
    };
    this.isCollectionSelected.emit(event.data.metaData.identifier ? true : false);
    this.programStageService.addStage('chapterListComponent');
  }

}
