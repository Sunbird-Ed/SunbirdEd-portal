import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { PublicDataService, UserService } from '@sunbird/core';
import { ConfigService } from '@sunbird/shared';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-chapter-list',
  templateUrl: './chapter-list.component.html',
  styleUrls: ['./chapter-list.component.scss']
})
export class ChapterListComponent implements OnInit {

  @Input() selectedAttributes: any;
  @Input() topicList: any;
  @Output() selectedQuestionTypeTopic = new EventEmitter<any>();
  public textBookChapters: Array<any> = [];
  private questionType = ['vsa', 'sa', 'la', 'mcq'];
  constructor(public publicDataService: PublicDataService, private configService: ConfigService, private userService: UserService) {
  }
  ngOnInit() {
    const apiRequest = [...this.questionType.map(fields => this.searchQuestionsByType(fields)),
    ...this.questionType.map(fields => this.searchQuestionsByType(fields, this.userService.userid))];
    forkJoin(apiRequest).subscribe(data => {
      this.textBookChapters = _.map(this.topicList, topic => {
        const results = { name: topic.name };
        _.forEach(this.questionType, (type: string, index) => {
          results[type] = {
            name: type.toUpperCase(),
            total: this.getResultCount(data[index], topic.name),
            me: this.getResultCount(data[index + this.questionType.length], topic.name)
          };
        });
        return results;
      });
    }, error => {
      console.log('error in fork', error); // TODO:: handle error properly
    });
  }

  public getResultCount(data, topic: string) {
    const topicData = _.find(data, { name: topic.toLowerCase() });
    return topicData ? topicData.count : 0;
  }

  public searchQuestionsByType(questionType: string, createdBy?: string) {
    const req = {
      url: `${this.configService.urlConFig.URLS.COMPOSITE.SEARCH}`,
      data: {
        'request': {
          'filters': {
            'objectType': 'AssessmentItem',
            'board': this.selectedAttributes.board,
            'framework': 'NCFCOPY',
            'gradeLevel': this.selectedAttributes.gradeLevel,
            'subject': this.selectedAttributes.subject,
            'medium': this.selectedAttributes.medium,
            'type': questionType,
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
