import { Component, OnInit, Input, EventEmitter, Output, OnChanges, OnDestroy } from '@angular/core';
import { PublicDataService, UserService, CollectionHierarchyAPI, ActionService } from '@sunbird/core';
import { ConfigService, ServerResponse, ContentData, ToasterService } from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';
import { CbseProgramService } from '../../services';
import { map, catchError } from 'rxjs/operators';
import { forkJoin, of, throwError } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';

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
  public collectionHierarchy: any;

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
    private userService: UserService, public actionService: ActionService, public telemetryService: TelemetryService, private cbseService: CbseProgramService,
    public toasterService: ToasterService, public router: Router, public activeRoute: ActivatedRoute) {
  }
  private labelsHandler() {
    this.labels = (this.role.currentRole === 'REVIEWER') ? ['Up for Review', 'Accepted'] : (this.role.currentRole === 'PUBLISHER') ? ['Total', 'Accepted', 'Published'] : ['Total', 'Created by me', 'Needs attention'];
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
    this.getCollectionHierarchy(this.selectedAttributes.textbook);
    //clearing the selected questionId when user comes back from question list
    delete this.selectedAttributes["questionList"];
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

  public getCollectionHierarchy(identifier: string) {
    let hierarchy;
    const req = {
      url: 'content/v3/hierarchy/' + identifier, // `${this.configService.urlConFig.URLS.COURSE.HIERARCHY}/${identifier}`,
      param: { 'mode': 'edit' }
    };
    this.actionService.get(req).pipe(catchError(err => {
      let errInfo = { errorMsg: 'Fetching TextBook details failed' }; this.showLoader = false;
      return throwError(this.cbseService.apiErrorHandling(err, errInfo))
    }))
      .subscribe((response) => {
        this.collectionData = response.result.content;
        hierarchy = this.getHierarchyObj(this.collectionData);
        this.selectedAttributes.hierarchyObj = { hierarchy };
        const textBookMetaData = [];
         this.collectionHierarchy =  this.getUnitWithChildren(this.collectionData.children);
        _.forEach(this.collectionData.children, data => {

          if (data.topic && data.topic[0]) {
            if (data.children) {
              let questionBankUnit: any;
              if (_.includes(this.questionType, 'curiosity')) {
                questionBankUnit = _.find(data.children, (val) => {
                  return val.name === 'Curiosity Questions';
                });
              } else {
                questionBankUnit = _.find(data.children, (val) => {
                  return val.name === 'Question Bank' || val.name === 'Practice Questions';
                });
              }
              textBookMetaData.push({
                name: data.name,
                topic: data.topic[0],
                identifier: questionBankUnit ? questionBankUnit.identifier : data.identifier
              });
            } else {
              textBookMetaData.push({
                name: data.name,
                topic: data.topic[0],
                identifier: data.identifier
              });
            }
          }
        });
        this.textBookMeta = textBookMetaData;

        this.showChapterList(textBookMetaData);
      });
  }

  getUnitWithChildren(data) {
    const self = this;
    const tree = data.map(child => {
      const treeItem = {
        identifier: child.identifier,
        name: child.name,
        contentType: child.contentType,
        topic: child.topic
      };
      const textbookUnit = _.find(child.children, ['contentType', 'TextBookUnit']);
      if (child.children) {
        const treeUnit =  self.getUnitWithChildren(child.children);
        const treeChildren = treeUnit.filter(item => item.contentType === 'TextBookUnit');
        const treeLeaf = treeUnit.filter(item => item.contentType !== 'TextBookUnit');
        treeItem['children'] = (treeChildren.length > 0) ? treeChildren : null;
        treeItem['leaf'] = (treeLeaf.length > 0) ? treeLeaf : null;
      }
      return treeItem;
    });
    return tree;
  }

  public getHierarchyObj(data) {
    const instance = this;
    if (data.identifier) {
      this.hierarchyObj[data.identifier] = {
        'name': data.name,
        'contentType': data.contentType,
        'children': _.map(data.children, (child) => {
          return child.identifier;
        }),
        'root': data.contentType === 'TextBook' ? true : false
      };

      _.forEach(data.children, (collection) => {
        instance.getHierarchyObj(collection);
      });
    }

    return this.hierarchyObj;
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
    return this.publicDataService.post(request).pipe(
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
        let errInfo = { errorMsg: 'Published Resource search failed' };
        return throwError(this.cbseService.apiErrorHandling(err, errInfo))
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
    return this.publicDataService.post(req).pipe(
      map(res => _.get(res, 'result.facets[0].values')), catchError((err) => {
        let errInfo = { errorMsg: 'Questions search by type failed' };
        return throwError(this.cbseService.apiErrorHandling(err, errInfo))
      }));
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
