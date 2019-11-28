import { Component, OnInit, Input, EventEmitter, Output, OnChanges, OnDestroy } from '@angular/core';
import { PublicDataService, UserService, CollectionHierarchyAPI, ActionService, ContentService } from '@sunbird/core';
import { ConfigService, ServerResponse, ContentData, ToasterService } from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';
import { CbseProgramService } from '../../services';
import { map, catchError } from 'rxjs/operators';
import { forkJoin, of, throwError } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { inspect } from 'util';

@Component({
  selector: 'app-chapter-list',
  templateUrl: './chapter-list.component.html',
  styleUrls: ['./chapter-list.component.scss']
})
export class ChapterListComponent implements OnInit, OnChanges {

  @Input() selectedAttributes: any;
  @Input() topicList: any;
  @Input() role: any;
  @Output() selectedQuestionTypeTopic = new EventEmitter<any>();
  @Input() selectedSchool: any;

  public textBookChapters: Array<any> = [];
  private questionType: Array<any> = [];
  private textBookMeta: any;
  public hierarchyObj = {};
  public collectionHierarchy;
  public countData: Array<any> = [];
  public levelOneChapterList: Array<any> = [];
  public selectdChapterOption: any = {};
  public showResourceTemplatePopup = false;
  public showContentUploader = false;
  public templateDetails;

  private questionTypeName = {
    vsa: 'Very Short Answer',
    sa: 'Short Answer',
    la: 'Long Answer',
    mcq: 'Multiple Choice Question',
    curiosity: 'Curiosity Question'
  };
  telemetryImpression = {};
  private labels: Array<string>;
  public collectionData;
  showLoader = true;
  showError = false;
  public routerQuestionCategory: any;
  public questionPattern: Array<any> = [];
  constructor(public publicDataService: PublicDataService, private configService: ConfigService,
    private userService: UserService, public actionService: ActionService, public telemetryService: TelemetryService,
    private cbseService: CbseProgramService, public toasterService: ToasterService, public router: Router,
    public activeRoute: ActivatedRoute, private contentService: ContentService) {
  }
  private labelsHandler() {
    this.labels = (this.role.currentRole === 'REVIEWER') ? ['Up for Review', 'Accepted'] :
    (this.role.currentRole === 'PUBLISHER') ? ['Total', 'Accepted', 'Published'] : ['Total', 'Created by me', 'Needs attention'];
  }
  ngOnInit() {
    /**
     * @description : this will fetch question Category configuration based on currently active route
     */
    this.activeRoute.data
      .subscribe((routerData) => {
        this.routerQuestionCategory = routerData.config.question_categories;
        this.questionType = this.routerQuestionCategory;

        routerData.config.question_categories.map(category => {
          if (category !== 'mcq') {
            this.questionPattern.push('reference');
          } else {
            this.questionPattern.push('mcq');
          }
        });
      });
    this.labelsHandler();
    this.telemetryImpression = {
      context: {
        env: 'cbse_program'
      },
      edata: {
        type: 'view',
        pageid: 'chapterlist',
        uri: this.router.url,
      }
    };
    this.levelOneChapterList.push({
      identifier: 'all',
      name: 'All Chapters'
    });
    this.selectdChapterOption = 'all';
    this.getCollectionHierarchy(this.selectedAttributes.textbook, undefined);
    // clearing the selected questionId when user comes back from question list
    delete this.selectedAttributes['questionList'];
  }
  ngOnChanges(changed: any) {
    this.labelsHandler();
    if (this.textBookMeta) {
      if (changed.selectedSchool &&
        changed.selectedSchool.currentValue !== changed.selectedSchool.previousValue) {
        this.selectedAttributes.selectedSchoolForReview = changed.selectedSchool.currentValue;
        this.showChapterList(this.textBookMeta);
      } else {
        this.showChapterList(this.textBookMeta);
      }
    }
  }

  public getCollectionHierarchy(identifier: string, unitIdentifier: string) {
    const instance = this;
    let hierarchy;
    let hierarchyUrl = 'content/v3/hierarchy/' + identifier;
    if (unitIdentifier) {
      hierarchyUrl = hierarchyUrl + '/' + unitIdentifier;
    }
    const req = {
      url: hierarchyUrl,
      param: { 'mode': 'edit' }
    };
    this.actionService.get(req).pipe(catchError(err => {
      const errInfo = { errorMsg: 'Fetching TextBook details failed' }; this.showLoader = false;
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
    }))
      .subscribe((response) => {
        this.collectionData = response.result.content;
        const textBookMetaData = [];
        instance.countData['total'] = 0;
        instance.countData['review'] = 0;
        instance.countData['reject'] = 0;
        instance.countData['mycontribution'] = 0;
        this.collectionHierarchy = this.getUnitWithChildren(this.collectionData, identifier);
        hierarchy = instance.hierarchyObj;
        this.selectedAttributes.hierarchyObj = { hierarchy };
        this.showLoader = false;
        this.showError = false;
      });
  }

  getUnitWithChildren(data, collectionId) {
    const self = this;
    this.hierarchyObj[data.identifier] = {
      'name': data.name,
      'contentType': data.contentType,
      'children': _.map(data.children, (child) => {
        return child.identifier;
      }),
      'root': data.contentType === 'TextBook' ? true : false
    };
    if (data.contentType !== 'TextBook' && data.contentType !== 'TextBookUnit') {
      this.countData['total'] = this.countData['total'] + 1;
      if (data.status === 'Review') {
        this.countData['review'] = this.countData['review'] + 1;
      }
    }
    const childData = data.children;
    if (childData) {
      const tree = childData.map(child => {
        if (child.parent && child.parent === collectionId) {
          self.levelOneChapterList.push({
            identifier: child.identifier,
            name: child.name
          });
        }
        const treeItem = {
          identifier: child.identifier,
          name: child.name,
          contentType: child.contentType,
          topic: child.topic,
          status: child.status
        };
        const treeUnit = self.getUnitWithChildren(child, collectionId);
        const treeChildren = treeUnit && treeUnit.filter(item => item.contentType === 'TextBookUnit');
        const treeLeaf = treeUnit && treeUnit.filter(item => item.contentType !== 'TextBookUnit');
        treeItem['children'] = (treeChildren && treeChildren.length > 0) ? treeChildren : null;
        treeItem['leaf'] = (treeLeaf && treeLeaf.length > 0) ? treeLeaf : null;
        return treeItem;
      });
      return tree;
    }
  }

  public getHierarchyObjforUnit(unitIdentifier) {
    const req = {
      url: 'content/v3/hierarchy/' + this.selectedAttributes.textbook + '/' + unitIdentifier,
      param: { 'mode': 'edit' }
    };
    this.actionService.get(req).pipe(catchError(err => {
      let errInfo = { errorMsg: 'Fetching TextBook details failed' }; this.showLoader = false;
      return throwError(this.cbseService.apiErrorHandling(err, errInfo))
    }))
    .subscribe((response) => {

    });
  }

  public showChapterList(textBookMetaData) {
    let apiRequest;
    if (this.selectedAttributes.currentRole === 'CONTRIBUTOR') {
      apiRequest = [...this.questionType.map(fields => this.searchQuestionsByType(fields)),
      ...this.questionType.map(fields => this.searchQuestionsByType(fields, this.userService.userid)),
      ...this.questionType.map(fields => this.searchQuestionsByType(fields, this.userService.userid, 'Reject'))];
    } else if (this.selectedAttributes.currentRole === 'REVIEWER') {
      apiRequest = [...this.questionType.map(fields => this.searchQuestionsByType(fields, '', 'Review')),
      ...this.questionType.map(fields => this.searchQuestionsByType(fields, '', 'Live'))];
    } else if (this.selectedAttributes.currentRole === 'PUBLISHER') {
      apiRequest = [...this.questionType.map(fields => this.searchQuestionsByType(fields)),
      ...this.questionType.map(fields => this.searchQuestionsByType(fields, '', 'Live')),
      ...this.questionType.map(type => this.searchResources(type))
      ];
    }

    if (!apiRequest) {
      this.showLoader = false;
      this.showError = true;
      this.toasterService.error(`You don't have permission to access this page`);
    }
    forkJoin(apiRequest).subscribe(data => {
      this.showLoader = true;
      this.textBookChapters = _.map(textBookMetaData, topicData => {
        const results = { name: topicData.name, topic: topicData.topic, identifier: topicData.identifier };
        _.forEach(this.questionType, (type: string, index) => {
          results[type] = {
            name: type,
            total: this.getResultCount(data[index], topicData.topic),
            me: this.getResultCount(data[index + this.questionType.length], topicData.topic),
            attention: this.getResultCount(data[index + (2 * this.questionType.length)], topicData.topic),
            buttonStatus: this.getButtonStatus(data[index + (2 * this.questionType.length)], topicData.topic),
            resourceName: this.getResourceName(data[index + (2 * this.questionType.length)], topicData.topic)
          };
        });
        this.showLoader = false;
         // text book-unit-id added
        results.identifier = topicData.identifier;
        return results;
      });
    }, error => {
      this.showLoader = false;
    });
  }

  public getResultCount(data, topic: string) {
    const topicData = _.find(data, { name: topic.toLowerCase() });
    return topicData ? topicData.count : 0;
  }

  public getResourceName(data, topic: string) {
    const topicData = _.find(data, { name: topic.toLowerCase() });
     // tslint:disable-next-line:max-line-length
    return topicData ? topicData.resourceName : false;
  }
  public getButtonStatus(data, topic: string) {
    const topicData = _.find(data, { name: topic.toLowerCase() });
    return topicData ? topicData.resourceId : 0;
  }

  public searchResources(qtype) {
    const request = {
      url: `${this.configService.urlConFig.URLS.COMPOSITE.SEARCH}`,
      data: {
        'request': {
          'filters': {
            'objectType': 'content',
            'contentType': qtype === 'curiosity' ? 'CuriosityQuestionSet' : 'PracticeQuestionSet',
            'mimeType': 'application/vnd.ekstep.ecml-archive',
            'board': this.selectedAttributes.board,
            'framework': this.selectedAttributes.framework,
            'gradeLevel': this.selectedAttributes.gradeLevel,
            'subject': this.selectedAttributes.subject,
            'medium': this.selectedAttributes.medium,
            'status': ['Live'],
            'questionCategories': (qtype === 'curiosity') ? 'CuriosityQuestion' : qtype.toUpperCase()
          },
          'sort_by': { 'createdOn': 'desc' },
          'fields': ['identifier', 'status', 'createdOn', 'topic', 'name', 'questions'],
          'facets': ['topic']
        }
      }
    };
    return this.contentService.post(request).pipe(
      map(res => {
        const content = _.get(res, 'result.content');
        const publishCount = [];
        _.forIn(_.groupBy(content, 'topic'), (value, key) => {
           // publishCount.push({name: key.toLowerCase(), count: _.uniq([].concat(..._.map(value, 'questions'))).length });
           // tslint:disable-next-line:max-line-length
          publishCount.push({ name: key.toLowerCase(), count: _.uniq(value[0].questions).length, resourceId: _.get(value[0], 'identifier'), resourceName: _.get(value[0], 'name') });

        });
        return publishCount;
      }),
      catchError((err) => {
        const errInfo = { errorMsg: 'Published Resource search failed' };
        return throwError(this.cbseService.apiErrorHandling(err, errInfo));
      }));
  }
  public searchQuestionsByType(questionType: string, createdBy?: string, status?: any) {
    const req = {
      url: `${this.configService.urlConFig.URLS.COMPOSITE.SEARCH}`,
      data: {
        'request': {
          'filters': {
            'objectType': 'AssessmentItem',
            'board': this.selectedAttributes.board,
            'framework': this.selectedAttributes.framework,
            'gradeLevel': this.selectedAttributes.gradeLevel,
            'subject': this.selectedAttributes.subject,
            'medium': this.selectedAttributes.medium,
            'programId': this.selectedAttributes.programId,
            'type': questionType === 'mcq' ? 'mcq' : 'reference',
            'category': questionType === 'curiosity' ? 'CuriosityQuestion' : questionType.toUpperCase(),
            'version': 3,
            'status': []
          },
          'limit': 0,
          'facets': ['topic']
        }
      }
    };
    if (createdBy) {
      req.data.request.filters['createdBy'] = createdBy;
    }
    if (status) {
      req.data.request.filters['status'] = status;
      req.data.request.filters['organisation'] = this.selectedAttributes.selectedSchoolForReview;
    }
    return this.contentService.post(req).pipe(
      map(res => _.get(res, 'result.facets[0].values')), catchError((err) => {
        const errInfo = { errorMsg: 'Questions search by type failed' };
        return throwError(this.cbseService.apiErrorHandling(err, errInfo));
      }));
  }

  onSelectChapterChange() {
    this.showLoader = true;
    this.getCollectionHierarchy(this.selectedAttributes.textbook ,
      this.selectdChapterOption === 'all' ? undefined :  this.selectdChapterOption);
  }

  handleTemplateSelection(event) {
    this.showResourceTemplatePopup = false;
    if (event.template) {
      this.showContentUploader = true;
      this.templateDetails = {
        name: 'Explanation',
        contentType: 'ExplanationResource',
        mimeType: [ 'application/pdf' ],
        filesAccepted: 'pdf',
        filesize: '50'
      };
    }
    console.log('handleTemplateSelection ', event);
  }

  showResourceTemplate(event) {
    this.showResourceTemplatePopup = event.showPopup;
  }

  emitQuestionTypeTopic(type, topic, topicIdentifier, resourceIdentifier, resourceName) {
    this.selectedQuestionTypeTopic.emit({
      'questionType': type,
      'topic': topic,
      'textBookUnitIdentifier': topicIdentifier,
      'resourceIdentifier': resourceIdentifier || false,
      'resourceName': resourceName
    });
  }

}
