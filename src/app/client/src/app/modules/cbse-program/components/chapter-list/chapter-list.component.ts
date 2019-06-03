import { Component, OnInit, Input, EventEmitter, Output, OnChanges, OnDestroy } from '@angular/core';
import { PublicDataService, UserService, CollectionHierarchyAPI, ActionService } from '@sunbird/core';
import { ConfigService, ServerResponse, ContentData, ToasterService } from '@sunbird/shared';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
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

  public textBookChapters: Array<any> = [];
  private questionType = ['vsa', 'sa', 'la', 'mcq'];
  private textBookMeta: any;
  private questionTypeName = {
    vsa: 'Very Short Answer',
    sa: 'Short Answer',
    la: 'Long Answer',
    mcq: 'Multiple Choice Question'
  };
  telemetryImpression = {};
  private labels: Array<string>;
  public collectionData;
  showLoader = true;
  showError = false;
  constructor(public publicDataService: PublicDataService, private configService: ConfigService,
    private userService: UserService, public actionService: ActionService,
    public toasterService: ToasterService, public router: Router) {
  }
  private labelsHandler(){
    this.labels = (this.role.currentRole === 'REVIEWER') ? ['Up for Review', 'Accepted'] : ['Total', 'Created by me'] ;
    console.log(this.labels);
  }
  ngOnInit() {
    this.labelsHandler();
    this.telemetryImpression = {
      context: {
        env: 'cbse_program'
      },
      edata: {
        type: 'view',
        pageid: 'chapter_list',
        uri: this.router.url,
      }
    };
    this.getCollectionHierarchy(this.selectedAttributes.textbook);
  }
  ngOnChanges(changed: any) {
    this.labelsHandler();
    if (this.textBookMeta) {
      this.showChapterList( this.textBookMeta);
    }
  }

  public getCollectionHierarchy(identifier: string) {
    const req = {
      url: 'content/v3/hierarchy/' + identifier, // `${this.configService.urlConFig.URLS.COURSE.HIERARCHY}/${identifier}`,
      param: { 'mode': 'edit' }
    };
    this.actionService.get(req).subscribe((response) => {
      this.collectionData = response.result.content;
      const textBookMetaData = [];
        _.forEach(this.collectionData.children, data => {
          if (data.topic && data.topic[0]) {
            textBookMetaData.push({
              name : data.name,
              topic: data.topic[0]
            });
          }
        });
        this.textBookMeta = textBookMetaData;
        this.showChapterList(textBookMetaData);
    }, error => {
      this.showLoader = false;
      this.toasterService.error(_.get(error, 'error.params.errmsg') || 'Fetching TextBook details failed');
    });
  }

  public showChapterList(textBookMetaData) {
    let apiRequest;
    if (this.selectedAttributes.currentRole === 'CONTRIBUTOR') {
      apiRequest = [...this.questionType.map(fields => this.searchQuestionsByType(fields)),
        ...this.questionType.map(fields => this.searchQuestionsByType(fields, this.userService.userid))];
    } else if (this.selectedAttributes.currentRole === 'REVIEWER') {
      apiRequest = [...this.questionType.map(fields => this.searchQuestionsByType(fields,"",'Review')),
      ...this.questionType.map(fields => this.searchQuestionsByType(fields,"",'Live')) ];
    }
    if (!apiRequest) {
      this.showLoader = false;
      this.showError = true;
      this.toasterService.error(`You don't have permission to access this page`);
    }
    forkJoin(apiRequest).subscribe(data => {
      this.showLoader = true;
      this.textBookChapters = _.map(textBookMetaData, topicData => {
        const results = { name: topicData.name, topic:  topicData.topic };
        _.forEach(this.questionType, (type: string, index) => {
          results[type] = {
            name: type,
            total: this.getResultCount(data[index], topicData.topic),
            me: this.getResultCount(data[index + this.questionType.length], topicData.topic)
          };
        });
        this.showLoader = false;
        return results;
      });
    }, error => {
      this.showLoader = false;
      this.toasterService.error(_.get(error, 'error.params.errmsg') || 'Fetching TextBook details failed');
    });
  }

  public getResultCount(data, topic: string) {
    const topicData = _.find(data, { name: topic.toLowerCase() });
    return topicData ? topicData.count : 0;
  }

  public searchQuestionsByType(questionType: string, createdBy?: string , status?: any) {
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
            'category': questionType.toUpperCase(),
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
    }
    return this.publicDataService.post(req).pipe(
      map(res => _.get(res, 'result.facets[0].values')));
  }

  emitQuestionTypeTopic(type, topic) {
    this.selectedQuestionTypeTopic.emit({
      'questionType': type,
      'topic': topic
    });
  }

}
