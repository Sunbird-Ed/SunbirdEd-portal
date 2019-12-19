import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { FrameworkService } from '@sunbird/core';
import { ToasterService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { first } from 'rxjs/operators';
import {Subject} from 'rxjs';
import { QuestionListComponent  } from '../question-list/question-list.component';
import { ContentUploaderComponent } from '../content-uploader/content-uploader.component';
import {QuestionPreviewComponent} from '../question-preview/question-preview.component';


interface IProgramContext {
    textBookUnitIdentifier?: any;
    lastOpenedUnit?: any;
    framework?: string;
    channel?: string;
    board?: string;
    medium?: string;
    gradeLevel?: string;
    subject?: string;
    textbook?: string;
    topic?: string;
    questionType?: string;
    programId?: string;
    program?: string;
    currentRole?: string;
    bloomsLevel?: Array<any>;
    topicList?: Array<any>;
    onBoardSchool?: string;
    selectedSchoolForReview?: string;
    resourceIdentifier?: string;
    hierarchyObj?: any;
    textbookName?: any;
}

@Component({
  selector: 'app-cbse',
  templateUrl: './cbse.component.html',
  styleUrls: ['./cbse.component.scss']
})
export class CbseComponent implements OnInit, OnDestroy {

  @ViewChild('modal') private modal;
  @Input() collectionComponentInput: any;
  // @Input() programDetails: any;
  // @Input() userProfile: any;
  formFieldOptions: Array<any>;
  public programDetails: any;
  public userProfile: any;
  public showLoader: boolean = false;
  public showDashboard: boolean = false;
  public publishInProgress = false;
  public programContext: IProgramContext = {};
  public stages: Array<string> = ['chooseClass', 'chooseTextbook', 'topicList', 'createQuestion', 'uploadContent', 'certificate'];
  public currentStage = 0;
  public role: any = {};
  public resourceName: string;
  public resourceNameInput: string;
  public typeOptions = [
    {value: 'Best School Certificate'},
    {value: 'Best Student Certificate'}
  ];
  public showCertDashboard = false;
  public slug ;
  public selectedOption;
  public showCertificate = false;
  public showModal = false;
  public dynamicComponent: any;
  public selectedComponent: any;
  public templateDetails: any;
  constructor(public frameworkService: FrameworkService, public toasterService: ToasterService) { }
  private questionTypeName = {
    vsa: 'Very Short Answer',
    sa: 'Short Answer',
    la: 'Long Answer',
    mcq: 'Multiple Choice Question',
    curiosity: 'Curiosity Question'
  };
  private creationComponentsList = {
    ExplanationResource: ContentUploaderComponent,
    ExperientialResource: ContentUploaderComponent,
    PracticeQuestionSet: QuestionListComponent,
    CuriosityQuestionSet: QuestionListComponent,
    ContentPreview: QuestionPreviewComponent
  };

  public inputs: any;
  public outputs: any;
  public contentData: any;
  ngOnInit() {
    this.programDetails = _.get(this.collectionComponentInput, 'programDetails');
    this.userProfile = _.get(this.collectionComponentInput, 'userProfile');
    this.programContext = {
      currentRole: _.get(this.programDetails, 'userDetails.roles[0]'),
      framework: _.get(this.programDetails, 'config.scope.framework'),
      channel: _.get(this.programDetails, 'config.scope.channel'),
      board: _.get(this.programDetails, 'config.scope.board[0]'),
      medium: _.get(this.programDetails, 'config.scope.medium[0]'),
      bloomsLevel: _.get(this.programDetails, 'config.scope.bloomsLevel'),
      programId: _.get(this.programDetails, 'programId'),
      program: _.get(this.programDetails, 'name'),
      onBoardSchool: _.get(this.programDetails, 'userDetails.onBoardingData.school')
    };
    this.role.currentRole = this.programContext.currentRole;
    this.formFieldOptions = _.get(this.programDetails, 'config.onBoardForm.fields');
    this.fetchFrameWorkDetails();
    this.programContext.lastOpenedUnit = 0;
    this.slug = _.get(this.userProfile, 'rootOrg.slug') || (<HTMLInputElement>document.getElementById('defaultTenant')).value;
    if (_.includes(_.get(this.programDetails, 'userDetails.roles'), 'CERTIFICATE_ISSUER')) {
      this.showCertificate = true;
      (<HTMLInputElement>document.getElementById('workspace')).style.display = 'none';
      (<HTMLInputElement>document.getElementById('curiosity')).style.display = 'none';
    }
  }

  public issueCertificate() {
    this.showModal = false;
    setTimeout(() => {
      this.showModal = true;
    }, 500);

    this.outputs = {
      contentDataHandler: (event) => {
        this.contentData =  event.contentData;
        this.selectedComponent = this.creationComponentsList[event.templateDetails];
        this.inputs = {
          questionMetaData: this.contentData,
          programContext: this.programContext
        };
      }
    };
  }



  public selectedClassSubjectHandler(event) {
    this.programContext.gradeLevel =  event.gradeLevel;
    this.programContext.subject =  event.subject;
    this.navigate('next');
  }

  public selectedTextbookHandler(event) {
    this.programContext.textbook =  event.metaData.identifier;
    this.programContext.textbookName = event.name;
    this.navigate('next');
  }
  public publishButtonStatusHandler(event) {
    this.publishInProgress = event;
  }

  public selectedQuestionTypeTopic(event) {
    this.programContext.topic =  event.topic;
    this.programContext.questionType =  event.questionType;
    this.programContext.textBookUnitIdentifier =  event.textBookUnitIdentifier;
    this.programContext.resourceIdentifier =  event.resourceIdentifier;
    this.programContext.lastOpenedUnit = event.textBookUnitIdentifier;
    // tslint:disable-next-line:max-line-length
    this.resourceName = event.resourceName || `${this.questionTypeName[this.programContext.questionType]} - ${this.programContext.topic}`;
    this.navigate('next');
  }

  handleRoleChange(component?: string) {
    this.role = Object.assign({}, {currentRole : this.programContext.currentRole});
    this.showDashboard = (component === 'Dashboard');
    if (component === 'certificatedashboard') {
      this.showCertDashboard = true;
      this.selectedOption = '';
    } else {
      this.showCertDashboard = false;
    }
  }
  public fetchFrameWorkDetails() {
    this.frameworkService.initialize(this.programContext.framework);
    this.frameworkService.frameworkData$.pipe(first()).subscribe((frameworkDetails: any) => {
      if (frameworkDetails && !frameworkDetails.err) {
        const frameworkData = frameworkDetails.frameworkdata[this.programContext.framework].categories;
        this.programContext.topicList = _.get(_.find(frameworkData, { code: 'topic' }), 'terms');
      }
    });
  }


  public onResourceNameChange(event) {
    this.resourceName = this.removeSpecialChars(event.target.value);
  }
  private removeSpecialChars(text) {
    if (text) {
      const iChars = '!`~@#$^*+=[]\\\'{}|\"<>%';
      for (let i = 0; i < text.length; i++) {
        if (iChars.indexOf(text.charAt(i)) !== -1) {
          this.toasterService.error(`Special character ${text.charAt(i)} is not allowed`);
        }
      }
       // tslint:disable-next-line:max-line-length
      text = text.replace(/[^\u0600-\u06FF\uFB50-\uFDFF\uFE70-\uFEFF\uFB50-\uFDFF\u0980-\u09FF\u0900-\u097F\u0D00-\u0D7F\u0A80-\u0AFF\u0C80-\u0CFF\u0B00-\u0B7F\u0A00-\u0A7F\u0B80-\u0BFF\u0C00-\u0C7F\w:&_\-.(\),\/\s]/g, '');
      return text;
    }
  }



  public sendResourceName(event) {
    this.showLoader = true;
    this.resourceNameInput = this.resourceName;
  }



  /**
   * @description - sets textBookUnitIdentifier to 0 while coming backwards from any stage >2
   * @input  step {String} : if it is a backward stage
   * @input  currentStage {Integer} : any
   */

  setLastOpenedTopic(step, currentStage) {
    if (currentStage === 2 && step === 'prev') {
      this.programContext.lastOpenedUnit = 0;
    }
  }
  selectedTemplatehandler(event) {
    this.templateDetails = event.template;
    this.selectedComponent = this.creationComponentsList[event.template.contentType];
    if (_.includes(event.template.mimeType, 'application/vnd.ekstep.ecml-archive')) {
      this.inputs = {
        programContext: this.programContext,
        role: {
          currentRole: this.programContext.currentRole
        },
        resourceName: this.resourceName,
        templateDetails: this.templateDetails
      }
    } else {
      this.inputs = {
        programContext: this.programContext,
        templateDetails: this.templateDetails
      };
    }
    this.navigate('next');
  }
  navigate(step) {
    if (step === 'next') {
      this.currentStage = this.currentStage + 1;
    } else if (step === 'prev') {
      this.setLastOpenedTopic(step, this.currentStage);
      this.currentStage = this.currentStage - 1;
    }
  }
  ngOnDestroy() {
    if (this.modal && this.modal.deny) {
      this.modal.deny();
    }
  }
}
