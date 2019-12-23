import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ConfigService, UtilService, ToasterService } from '@sunbird/shared';
import { PublicDataService, ContentService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CbseProgramService } from '../../services';
import { ProgramStageService } from '../../../program/services';
import { ISessionContext, IChapterListComponentInput } from '../../interfaces';
import { InitialState } from '../../interfaces';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit, OnDestroy {

  @Input() collectionComponentInput: any;
  @Output() isCollectionSelected  = new EventEmitter<any>();
  public sessionContext: ISessionContext = {};
  public chapterListComponentInput: IChapterListComponentInput = {};
  public programDetails: any;
  public userProfile: any;
  public sharedContext: any = {};
  public programSession: any; // TODO: change to just programDetails after creating new program
  public collectionComponentConfig: any;
  public programContext: any;
  public stageSubscription: any;
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
    this.stageSubscription = this.programStageService.getStage().subscribe(state => {
      this.state.stages = state.stages;
      this.changeView();
    });

    this.currentStage = 'collectionComponent';
    this.programDetails = _.get(this.collectionComponentInput, 'programDetails');
    this.userProfile = _.get(this.collectionComponentInput, 'userProfile');
    this.collectionComponentConfig = _.get(this.collectionComponentInput, 'config');
    this.programContext = _.get(this.collectionComponentInput, 'programContext');

    this.sharedContext = this.collectionComponentInput.programContext.config.sharedContext.reduce((obj, context) => {
      return {...obj, [context]: this.getSharedContextObjectProperty(context)};
    }, {});
    this.sessionContext = _.assign(this.collectionComponentInput.sessionContext, {
      currentRole: _.get(this.programDetails, 'userDetails.roles[0]'),
      bloomsLevel: _.get(this.programDetails, 'config.scope.bloomsLevel'),
      programId: '31ab2990-7892-11e9-8a02-93c5c62c03f1' || _.get(this.programDetails, 'programId'),
      program: _.get(this.programDetails, 'name'),
      onBoardSchool: _.get(this.programDetails, 'userDetails.onBoardingData.school'),
      collectionType: _.get(this.collectionComponentConfig, 'collectionType'),
      collectionStatus: _.get(this.collectionComponentConfig, 'status')
    }, this.sharedContext);
    this.searchCollection();
    const getCurrentRoleId = _.find(this.programContext.config.roles, {'name': this.sessionContext.currentRole});
    this.sessionContext.currentRoleId = (getCurrentRoleId) ? getCurrentRoleId.id : null;
    this.role.currentRole = this.sessionContext.currentRole;
  }


  getSharedContextObjectProperty(property) {
    if (property === 'channel') {
       return _.get(this.programDetails, 'config.scope.channel');
    } else if ( property === 'topic' ) {
      return null;
    } else {
      const filters =  this.collectionComponentConfig.config.filters;
      const explicitProperty =  _.find(filters.explicit, {'code': property});
      const implicitProperty =  _.find(filters.implicit, {'code': property});
      return (implicitProperty) ? implicitProperty.value || implicitProperty.defaultValue :
       explicitProperty.value || explicitProperty.defaultValue;
    }
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
            'board': this.sessionContext.board,
            'framework': this.sessionContext.framework,
            // 'gradeLevel': 'Kindergarten',
            // 'subject': 'Hindi',
            'medium': this.sessionContext.medium,
            'programId': this.sessionContext.programId,
            'status': this.sessionContext.collectionStatus || ['Draft', 'Live'],
            'contentType': this.sessionContext.collectionType || 'Textbook'
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
    this.sessionContext.collection =  event.data.metaData.identifier;
    this.sessionContext.collectionName = event.data.name;
    this.collection = event.data;
    this.chapterListComponentInput = {
      sessionContext: this.sessionContext,
      collection: this.collection,
      config: _.find(this.programContext.config.components, {'id': 'ng.sunbird.chapterList'}),
      programContext: this.programContext,
      role: this.role
    };
    this.isCollectionSelected.emit(event.data.metaData.identifier ? true : false);
    this.programStageService.addStage('chapterListComponent');
  }

  ngOnDestroy() {
    this.stageSubscription.unsubscribe();
  }

}
