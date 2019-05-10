import { Component, OnInit, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import {  ConfigService, IUserProfile, IUserData } from '@sunbird/shared';
import { UserService, PublicDataService, ActionService } from '@sunbird/core';
// tslint:disable-next-line:import-blacklist
import * as _ from 'lodash';
@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css']
})
export class QuestionListComponent implements OnInit, AfterViewInit {
  @Input() selectedAttributes: any;
  public userProfile: IUserProfile;
  public  questionTabs = [];
  public active: boolean[] = [];
  public emptyState = true;
  public questionMetaData: any;
  public editorMode: any;
  public enableCreateButton = true;
  public tabs: { header: string; content: string }[] = [
      { header: 'Q', content: '' }
  ];
  public publicDataService: PublicDataService;
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    publicDataService: PublicDataService,
    public actionService: ActionService
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
            this.questionTabs.push({identifier: item.identifier});
        });
        if (this.questionTabs.length > 0) {
            this.getQuestion(this.questionTabs[0].identifier);
        }
        console.log('questionTabs ', this.questionTabs);
    });
  }

  ngAfterViewInit() {

  }
  public activateClass(tab) {
    tab.active = !tab.active;
  }
  public getQuestion(questionId) {
    const req = {
        url: `${this.configService.urlConFig.URLS.ASSESSMENT.READ}/${questionId}`
    };
    this.actionService.get(req).subscribe((res) => {
        this.emptyState = false;
        this.editorMode = 'edit';
        this.questionMetaData = {
            mode : this.editorMode,
            data : res.result.assessment_item
        };
       console.log('Question res', res);
    });
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
            this.questionTabs.push({identifier : result.identifier});
        }
  }
  public removeTab(): void {
        this.active.pop();
        this.tabs.pop();
  }

}
