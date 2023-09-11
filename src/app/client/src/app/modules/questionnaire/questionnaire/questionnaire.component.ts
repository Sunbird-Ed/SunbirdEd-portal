import { Component, OnInit } from '@angular/core';
import {
  COLUMN_TYPE,
  LayoutService,
  ResourceService,
  ConfigService,
} from '@sunbird/shared';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ObservationService, ObservationUtilService } from '@sunbird/core';
import { Location } from '@angular/common';
import { ComponentDeactivate } from '../guard/can-deactivate.guard';
import { AssessmentInfo, Evidence, IAssessmentDetails, Section, SlQuestionnaireService } from '@shikshalokam/sl-questionnaire';
import { QuestionnaireService } from '../questionnaire.service';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss'],
})
export class QuestionnaireComponent
  extends ComponentDeactivate
  implements OnInit {
  pageTitleSrc = 'Observation Form';
  svgToDisplay = 'textbooks-banner-img.svg';
  layoutConfiguration: any;
  FIRST_PANEL_LAYOUT;
  SECOND_PANEL_LAYOUT;
  questionnaireForm: UntypedFormGroup;
  sections: Section[];
  evidence: Evidence;
  queryParams: any;
  assessmentInfo: AssessmentInfo;
  canLeave = false;
  constructor(
    public layoutService: LayoutService,
    public fb: UntypedFormBuilder,
    public resourceService: ResourceService,
    private activatedRoute: ActivatedRoute,
    private config: ConfigService,
    private observationService: ObservationService,
    private location: Location,
    private observationUtilService: ObservationUtilService,
    private slQService: SlQuestionnaireService,
    private questionnaireService: QuestionnaireService
  ) {
    super();
  }

  canDeactivate() {
    if (this.questionnaireForm) {
      if (this.questionnaireForm.dirty && !this.canLeave) {
        return false;
      } else {
        return true;
      }
    }
  }

  ngOnInit() {
    this.initConfiguration();
    this.activatedRoute.queryParams.subscribe((params) => {
      this.queryParams = params;
      this.getQuestionnare();
    });
    this.questionnaireForm = this.fb.group({});
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  getQuestionnare() {
    const paramOptions = {
      url:
        this.config.urlConFig.URLS.OBSERVATION.GET_ASSESSMENT +
        `${this.queryParams.observationId}?entityId=${this.queryParams.entityId}&submissionNumber=${this.queryParams.submissionNumber}&ecmMethod=${this.queryParams.evidenceCode}`,
    };
    this.observationService.post(paramOptions).subscribe(
      (data: IAssessmentDetails) => {
        this.assessmentInfo = data.result;
        this.assessmentInfo = this.slQService.mapSubmissionToAssessment(
          this.assessmentInfo
        );
        this.evidence = data.result.assessment.evidences[0];
        this.evidence.startTime = Date.now();
        this.sections = this.evidence.sections;
      },
      (error) => {}
    );
  }

  initConfiguration() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.redoLayout();
  }

  redoLayout() {
    if (this.layoutConfiguration != null) {
      this.FIRST_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(
        0,
        this.layoutConfiguration,
        COLUMN_TYPE.threeToNine,
        true
      );
      this.SECOND_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(
        1,
        this.layoutConfiguration,
        COLUMN_TYPE.threeToNine,
        true
      );
    } else {
      this.FIRST_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(
        0,
        null,
        COLUMN_TYPE.fullLayout
      );
      this.SECOND_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(
        1,
        null,
        COLUMN_TYPE.fullLayout
      );
    }
  }

  async onSubmit(save?) {
    const msg = save
      ? this.resourceService.frmelmnts.lbl.saveConfirm
      : this.resourceService.frmelmnts.lbl.submitConfirm;
    const userConfirm = await this.openAlert(msg, true);
    if (!userConfirm) {
      return;
    }
    const evidenceData = this.slQService.getEvidenceData(
      this.evidence,
      this.questionnaireForm.value
    );

    save ? (evidenceData['status'] = 'draft') : null;
    const profile: Object = await this.observationUtilService.getProfileDataList();
    if (!profile) {
      return;
    }
    const payload = {...profile, ...{evidence: evidenceData} };

    this.submitEvidence(payload);
  }

  submitEvidence(payload) {
    const paramOptions = {
      url:
        this.config.urlConFig.URLS.OBSERVATION.OBSERVATION_SUBMISSION_UPDATE +
        `${this.assessmentInfo.assessment.submissionId}`,
      data: payload,
    };
    this.observationService.post(paramOptions).subscribe(
      async (data) => {
        if (payload.evidence.status === 'draft') {
          this.backOrContinue();
          return;
        }
       const userResponse = await this.openAlert(
          this.resourceService.frmelmnts.lbl.successfullySubmitted
       );
        if (userResponse) {
          this.canLeave = true;
          this.location.back();
        }

      },
      (error) => {
        this.openAlert(
          payload.evidence.status === 'draft'
            ? this.resourceService.frmelmnts.lbl.failedToSave
            : this.resourceService.frmelmnts.lbl.submissionFailed
        );
      }
    );
  }

  async backOrContinue() {
    const alertMetaData = await this.observationUtilService.getAlertMetaData();
    alertMetaData.content.body.data =
      this.resourceService.frmelmnts.lbl.successfullySaved;
    alertMetaData.content.body.type = 'text';
    alertMetaData.size = 'mini';
    alertMetaData.footer.buttons.push({
      type: 'accept',
      returnValue: true,
      buttonText: this.resourceService.frmelmnts.btn.back,
    });
    alertMetaData.footer.buttons.push({
      type: 'cancel',
      returnValue: false,
      buttonText: this.resourceService.frmelmnts.lbl.continue,
    });
    alertMetaData.footer.className = 'double-btn';

    const response = await this.observationUtilService.showPopupAlert(
      alertMetaData
    );
    if (response) {
      this.canLeave = true;
      this.location.back();
    }
  }

  async openAlert(msg, showCancel = false) {
    const alertMetaData = await this.observationUtilService.getAlertMetaData();
    alertMetaData.content.body.data = msg;
    alertMetaData.content.body.type = 'text';
    alertMetaData.content.title = '';

    alertMetaData.size = 'mini';
    alertMetaData.footer.buttons.push({
      type: 'accept',
      returnValue: true,
      buttonText: showCancel
        ? this.resourceService.frmelmnts.btn.yes
        : this.resourceService.frmelmnts.btn.ok,
    });
    alertMetaData.footer.className = 'single-btn';

    if (showCancel) {
      alertMetaData.footer.buttons.push({
        type: 'cancel',
        returnValue: false,
        buttonText: this.resourceService.frmelmnts.btn.no,
      });
      alertMetaData.footer.className = 'double-btn';
    }
    return await this.observationUtilService.showPopupAlert(alertMetaData);
  }

  scrollToContent(id) {
    const element = document.getElementById(id);
    const headerOffset = 200;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition - headerOffset;
    window.scrollBy({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  goBack() {
    this.location.back();
  }
}
