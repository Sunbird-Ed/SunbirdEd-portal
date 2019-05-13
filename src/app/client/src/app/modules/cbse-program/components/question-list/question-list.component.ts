import { Component, OnInit, AfterViewInit, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import {  ConfigService, IUserProfile, IUserData } from '@sunbird/shared';
import { UserService, PublicDataService, ActionService } from '@sunbird/core';
import * as _ from 'lodash-es';
@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css']
})
export class QuestionListComponent implements OnInit, AfterViewInit {
  @Input() selectedAttributes: any;
  public userProfile: IUserProfile;
  public  questionTabs = [];
  public selectedQuestion: any;
  public active: boolean[] = [];
  public emptyState = true;
  public questionMetaData: any;
  public editorMode: any;
  public enableCreateButton = true;
  public tabs: { header: string; content: string }[] = [
      { header: 'Q', content: '' }
  ];
  public publicDataService: PublicDataService;
  public refresh = true;
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    publicDataService: PublicDataService,
    public actionService: ActionService,
    private cdr: ChangeDetectorRef
  ) {
    this.configService = configService;
    this.userService = userService;
    this.publicDataService = publicDataService;
  }

  ngOnInit() {
    console.log('selectedAttributes ', this.selectedAttributes);
    this.userService.userData$.subscribe(
        (user: IUserData) => {
            if (user && !user.err) {
            this.userProfile = user.userProfile;
            }
    });
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
                    'type': this.selectedAttributes.questionType,
                    'topic': this.selectedAttributes.topic,
                    'createdBy': this.userProfile.userId,
                    'version': 3,
                    'status' : []
                },
                'sort_by': {'createdOn': 'ASC'}
            }
        }
    };
    this.publicDataService.post(req).subscribe((res) => {
        console.log('res ', res.result.items, res.result.count);
        _.map(res.result.items, (item) => {
            this.questionTabs.push({identifier: item.identifier, status: item.status});
        });
        if (this.questionTabs.length > 0) {
            this.editorMode = 'view';
            this.getQuestion(this.questionTabs[0].identifier);
            this.activateClass(0);
        }
        console.log('questionTabs ', this.questionTabs);
    });
  }

  ngAfterViewInit() {

  }
  public activateClass(tab) {
    this.selectedQuestion  = tab;
  }
  public getQuestion(questionId) {
    const req = {
        url: `${this.configService.urlConFig.URLS.ASSESSMENT.READ}/${questionId}`
    };
    this.actionService.get(req).subscribe((res) => {
        this.emptyState = false;
        this.questionMetaData = {
            mode : this.editorMode,
            data : res.result.assessment_item
        };
        this.enableCreateButton = true;
        this.hardRefreshFilter();
       console.log('Question res', res);
    });
  }

  private hardRefreshFilter() {
    this.refresh = false;
    this.cdr.detectChanges();
    this.refresh = true;
  }

  public createButtonHandler(event) {
    this.enableCreateButton = event;
  }
  public createNewQuestion(): void {
    this.emptyState = false;
    this.enableCreateButton = false;
    this.editorMode = 'create';
    this.questionMetaData = {
        mode : this.editorMode,
    };
    this.hardRefreshFilter();
    // this.active.push(true);
    // console.log(this.tabs.length);
    // console.log(document.querySelector( '#editor' ));
 }
public questionStatusHandler(result) {
        if (result.status === 'failed') {
            console.log('FAILEEDDDDD');
        } else {
            this.editorMode = 'view';
            this.getQuestion(result.identifier);
            this.enableCreateButton = true;
            this.questionTabs.push({identifier : result.identifier, status: 'Review'});
            this.activateClass(this.questionTabs.length - 1);
        }
  }
  public removeTab(): void {
        this.active.pop();
        this.tabs.pop();
  }

}
