import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { PublicDataService, UserService } from '@sunbird/core';
import {  ConfigService, IUserData, IUserProfile } from '@sunbird/shared';
import { first, map } from 'rxjs/operators';
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
  public userProfile: IUserProfile;

  questionCount = new Map();
  public textBookChapters: any;
  public publicDataService: PublicDataService;
  constructor(publicDataService: PublicDataService,
    private configService: ConfigService,
    private userService: UserService) {
    this.userService = userService;
    this.publicDataService = publicDataService;
    this.configService = configService;
  }
  ngOnInit() {
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
        }
    });
    const apiArray = [];
    apiArray.push(this.searchQuestionsByType('vsa'));
    apiArray.push(this.searchQuestionsByType('sa'));
    apiArray.push(this.searchQuestionsByType('la'));
    apiArray.push(this.searchQuestionsByType('mcq'));
    apiArray.push(this.searchQuestionsByType('vsa', this.userProfile.userId));
    apiArray.push(this.searchQuestionsByType('sa', this.userProfile.userId));
    apiArray.push(this.searchQuestionsByType('la', this.userProfile.userId));
    apiArray.push(this.searchQuestionsByType('mcq', this.userProfile.userId));
    this.textBookChapters = [];
    forkJoin(apiArray).subscribe((data) => {
      console.log('forkjoin res', data);
      _.map(this.topicList, (topic) => {
        const topicObj = {
          name: topic.name,
          'vsa': {
            'name': 'VSA',
            'total': this.getCount(data[0], topic.name),
            'me': this.getCount(data[4], topic.name)
          },
          'sa': {
            'name': 'SA',
            'total': this.getCount(data[1], topic.name),
            'me': this.getCount(data[5], topic.name),
          },
          'la': {
            'name': 'LA',
            'total': this.getCount(data[2], topic.name),
            'me': this.getCount(data[6], topic.name),
          },
          'mcq': {
            'name': 'MCQ',
            'total': this.getCount(data[3], topic.name),
            'me': this.getCount(data[7], topic.name),
          }
        };
        this.textBookChapters.push(topicObj);
      });
    }, error => {
      // TODO:: handle error properly
      console.log('error in fork', error);
    });
  }

  public getCount(data, topic) {
    const topicData = _.find(data, (item) => {
      return item.name === topic.toLowerCase();
    });
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
            'status' : []
          },
          'limit': 0,
          'facets': ['topic']
        }
      }
    };
    if (createdBy) {
      req.data.request.filters['createdBy'] = createdBy;
    }
    return this.publicDataService.post(req).pipe(map((res) => {
        return _.get(res, 'result.facets[0].values');
    }));
  }

  emitQuestionTypeTopic(type, topic) {
    const selectedOptions = {
        'questionType': type,
        'topic': topic
      };
    this.selectedQuestionTypeTopic.emit(selectedOptions);
  }

}
