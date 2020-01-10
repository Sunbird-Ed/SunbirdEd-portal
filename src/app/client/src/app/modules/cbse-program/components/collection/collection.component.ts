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
  public programContext: any;
  public userProfile: any;
  public sharedContext: any = {};
  public collectionComponentConfig: any;
  public stageSubscription: any;
  public collectionList: Array<any>;
  public collection;
  public collectionsWithCardImage;
  public role: any = {};
  public mediums;
  public classes;
  public board;
  public filters;
  public implecitFileters: Array<any>;
  isMediumClickable = false;
  showLoader = true;
  public state: InitialState = {
    stages: []
  };
  public showStage;
  public currentStage: any;
  _slideConfig = {'slidesToShow': 10, 'slidesToScroll': 1, 'variableWidth': true};
  constructor(private configService: ConfigService, public publicDataService: PublicDataService,
    private cbseService: CbseProgramService, public programStageService: ProgramStageService,
    public utilService: UtilService, public contentService: ContentService) { }

  ngOnInit() {
    this.stageSubscription = this.programStageService.getStage().subscribe(state => {
      this.state.stages = state.stages;
      this.changeView();
    });

    this.currentStage = 'collectionComponent';
    this.userProfile = _.get(this.collectionComponentInput, 'userProfile');
    this.collectionComponentConfig = _.get(this.collectionComponentInput, 'config');
    this.programContext = _.get(this.collectionComponentInput, 'programContext');
    this.sharedContext = this.collectionComponentInput.programContext.config.sharedContext.reduce((obj, context) => {
      return {...obj, [context]: this.getSharedContextObjectProperty(context)};
    }, {});
    this.sessionContext = _.assign(this.collectionComponentInput.sessionContext, {
      currentRole: _.get(this.programContext, 'userDetails.roles[0]'),
      bloomsLevel: _.get(this.programContext, 'config.scope.bloomsLevel'),
      programId: '31ab2990-7892-11e9-8a02-93c5c62c03f1' || _.get(this.programContext, 'programId'),
      program: _.get(this.programContext, 'name'),
      onBoardSchool: _.get(this.programContext, 'userDetails.onBoardingData.school'),
      collectionType: _.get(this.collectionComponentConfig, 'collectionType'),
      collectionStatus: _.get(this.collectionComponentConfig, 'status')
    }, this.sharedContext);
    this.filters = this.getImplecitFilters();
    this.searchCollection();
    const getCurrentRoleId = _.find(this.programContext.config.roles, {'name': this.sessionContext.currentRole});
    this.sessionContext.currentRoleId = (getCurrentRoleId) ? getCurrentRoleId.id : null;
    this.role.currentRole = this.sessionContext.currentRole;
    this.classes = _.find(this.collectionComponentConfig.config.filters.explicit, {'code': 'gradeLevel'}).range;
    this.mediums = _.find(this.collectionComponentConfig.config.filters.implicit, {'code': 'medium'}).defaultValue;
    this.board = _.find(this.collectionComponentConfig.config.filters.implicit, {'code': 'board'}).defaultValue;
    (_.size(this.mediums) > 1) ? this.isMediumClickable = true : this.isMediumClickable = false;
  }

  getImplecitFilters(): string[] {
    const sharedcontext = this.collectionComponentInput.programContext.config.sharedContext,
    implicitFilter = this.collectionComponentConfig.config.filters.implicit,
    avilableFileters = this.filterByCollection(implicitFilter, 'code', sharedcontext);
    return avilableFileters;
  }

  getSharedContextObjectProperty(property) {
    if (property === 'channel') {
       return _.get(this.programContext, 'config.scope.channel');
    } else if ( property === 'topic' ) {
      return null;
    } else {
      const filters =  this.collectionComponentConfig.config.filters;
      const explicitProperty =  _.find(filters.explicit, {'code': property});
      const implicitProperty =  _.find(filters.implicit, {'code': property});
      return (implicitProperty) ? implicitProperty.range || implicitProperty.defaultValue :
       explicitProperty.range || explicitProperty.defaultValue;
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
    const req = {data: {request: { filters: ''}, }, url: ''};
    req.url = `${this.configService.urlConFig.URLS.COMPOSITE.SEARCH}`;
    req.data.request.filters = this.generateSearchFilterRequestData();
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
      this.collectionsWithCardImage = _.forEach(collectionCards, collection => this.addCardImage(collection));
      this.filterCollectionList(this.classes);
      this.showLoader = false;
    });
  }

  generateSearchFilterRequestData() {
    let payloadArray = [];
    payloadArray = [{
      objectType: 'content',
      programId: this.sessionContext.programId,
      status: this.sessionContext.collectionStatus || ['Draft', 'Live'],
      contentType: this.sessionContext.collectionType || 'Textbook'
    }];
    this.filters.forEach( (element) => {
      payloadArray[0][element['code']] = element['defaultValue'];
  });
    return payloadArray[0];
}

  groupCollectionList(groupValue?: string) {
    if (groupValue) {
      this.collectionList = this.groupByCollection(this.collectionsWithCardImage, { 'subject' : groupValue } );
    } else {
      this.collectionList = this.groupByCollection(this.collectionList, 'subject');
    }
    return this.collectionList;
  }

  groupByCollection(collection, arg) {
    return _.groupBy(collection, arg);
  }

  filterCollectionList(filterValue?: any, filterby = 'gradeLevel') {
    let filterValueItem: any[];
    if (Array.isArray(filterValue)) {
      filterValueItem = filterValue;
    } else {
      const filterArray = [];
      filterArray.push(filterValue);
      filterValueItem = filterArray;
    }
    this.collectionList = this.filterByCollection(this.collectionsWithCardImage, filterby, filterValueItem);
    this.groupCollectionList();
  }

  filterByCollection(collection: any[], filterBy: string, filterValue: any[]) {
    return collection.filter( (el) => {
      return filterValue.some((f: any) => {
        if ( Array.isArray(el[filterBy])) {
          return f === _.intersectionBy(el[filterBy], filterValue).toString();
        } else {
          return f === el[filterBy];
        }
      });
    });
  }

  addCardImage(collection) {
    collection.cardImg = collection.image;
    return collection;
  }

  collectionClickHandler(event) {
    this.sharedContext = this.collectionComponentInput.programContext.config.sharedContext.reduce((obj, context) => {
      return {...obj, [context]: event.data[context] || this.sharedContext[context]};
    }, this.sharedContext);
    if (this.sharedContext.gradeLevel) {
      // tslint:disable-next-line:max-line-length
      this.sharedContext.gradeLevel = _.isArray(this.sharedContext.gradeLevel) ? this.sharedContext.gradeLevel : [this.sharedContext.gradeLevel];
    }
    this.sessionContext = _.assign(this.sessionContext, this.sharedContext);
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

  viewMoreClickHandler(event) {
    console.log(event);
  }

  ngOnDestroy() {
    this.stageSubscription.unsubscribe();
  }

}
