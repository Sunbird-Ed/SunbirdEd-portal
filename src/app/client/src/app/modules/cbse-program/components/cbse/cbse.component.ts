import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { FrameworkService } from '@sunbird/core';
import { ToasterService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { first } from 'rxjs/operators';
import {Subject} from 'rxjs';

interface ISelectedAttributes {
    textBookUnitIdentifier?: any;
    lastOpenedUnit?: any;
    framework?: string;
    channel?: string;
    board?: string;
    mediumArray?: Array<any>; // To fetch all textbooks of mutiple medium
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
  @Input() programDetails: any;
  @Input() userProfile: any;
  formFieldOptions: Array<any>;
  public showLoader: boolean = false;
  public showDashboard: boolean = false;
  public publishInProgress = false;
  public selectedAttributes: ISelectedAttributes = {};
  public stages: Array<string> = ['chooseClass', 'chooseTextbook', 'topicList', 'createQuestion', 'certificate'];
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
  public showModal: boolean = false;
  constructor(public frameworkService: FrameworkService, public toasterService: ToasterService) { }
  private questionTypeName = {
    vsa: 'Very Short Answer',
    sa: 'Short Answer',
    la: 'Long Answer',
    mcq: 'Multiple Choice Question',
    curiosity: 'Curiosity Question'
  };
  ngOnInit() {
    this.selectedAttributes = {
      currentRole: _.get(this.programDetails, 'userDetails.roles[0]'),
      framework: _.get(this.programDetails, 'config.scope.framework'),
      channel: _.get(this.programDetails, 'config.scope.channel'),
      board: _.get(this.programDetails, 'config.scope.board[0]'),
      mediumArray: _.get(this.programDetails, 'config.scope.medium'),
      bloomsLevel: _.get(this.programDetails, 'config.scope.bloomsLevel'),
      programId: _.get(this.programDetails, 'programId'),
      //programId: '31ab2990-7892-11e9-8a02-93c5c62c03f1',
      program: _.get(this.programDetails, 'name'),
      onBoardSchool: _.get(this.programDetails, 'userDetails.onBoardingData.school')
    };
    this.role.currentRole = this.selectedAttributes.currentRole;
    this.formFieldOptions = _.get(this.programDetails, 'config.onBoardForm.fields');
    this.fetchFrameWorkDetails();
    this.selectedAttributes.lastOpenedUnit = 0;
    this.slug = _.get(this.userProfile, 'rootOrg.slug') || (<HTMLInputElement>document.getElementById('defaultTenant')).value
    if(_.includes(_.get(this.programDetails,'userDetails.roles'),"CERTIFICATE_ISSUER")){
      this.showCertificate = true;
      (<HTMLInputElement>document.getElementById('workspace')).style.display= "none";
      (<HTMLInputElement>document.getElementById('curiosity')).style.display= "none";
    }
  }

  public issueCertificate() {
    this.showModal = false;
    setTimeout(() => {
      this.showModal = true;
    }, 500);
  }

  public selectedClassSubjectHandler(event) {
    this.selectedAttributes.gradeLevel =  event.gradeLevel;
    this.selectedAttributes.subject =  event.subject;
    this.navigate('next');
  }

  public selectedTextbookHandler(event) {
    this.selectedAttributes.textbook =  event.metaData.identifier;
    this.selectedAttributes.textbookName = event.name;
    this.navigate('next');
  }
  public publishButtonStatusHandler(event) {
    this.publishInProgress = event;
  }

  public selectedQuestionTypeTopic(event) {
    this.selectedAttributes.topic =  event.topic;
    this.selectedAttributes.questionType =  event.questionType;
    this.selectedAttributes.textBookUnitIdentifier =  event.textBookUnitIdentifier;
    this.selectedAttributes.resourceIdentifier =  event.resourceIdentifier;
    this.selectedAttributes.lastOpenedUnit = event.textBookUnitIdentifier;
    // tslint:disable-next-line:max-line-length
    this.resourceName = event.resourceName || `${this.questionTypeName[this.selectedAttributes.questionType]} - ${this.selectedAttributes.topic}`;
    this.navigate('next');
  }

  handleRoleChange(component?:string) {
    this.role = Object.assign({}, {currentRole : this.selectedAttributes.currentRole});
    this.showDashboard = (component === 'Dashboard');
    if(component === 'certificatedashboard'){
      this.showCertDashboard = true;
      this.selectedOption = "";
    } else{
      this.showCertDashboard = false;
    }
  }
  public fetchFrameWorkDetails() {
    this.frameworkService.initialize(this.selectedAttributes.framework);
    this.frameworkService.frameworkData$.pipe(first()).subscribe((frameworkDetails: any) => {
      if (frameworkDetails && !frameworkDetails.err) {
        const frameworkData = frameworkDetails.frameworkdata[this.selectedAttributes.framework].categories;
        this.selectedAttributes.topicList = _.get(_.find(frameworkData, { code: 'topic' }), 'terms');
      }
    });
  }


  public onResourceNameChange(event) {
    this.resourceName = this.removeSpecialChars(event.target.value);
  }
  private removeSpecialChars(text) {
    if (text) {
      const iChars = "!`~@#$^*+=[]\\\'{}|\"<>%"
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
      this.selectedAttributes.lastOpenedUnit = 0;
    }
  }

  navigate(step) {
    if (step === 'next') {
      this.currentStage = this.currentStage + 1;
    } else if (step === 'prev') {
      this.setLastOpenedTopic(step,this.currentStage);
      this.currentStage = this.currentStage - 1;
    }
  }
  ngOnDestroy() {
    if (this.modal && this.modal.deny) {
      this.modal.deny();
    }
  }
}
