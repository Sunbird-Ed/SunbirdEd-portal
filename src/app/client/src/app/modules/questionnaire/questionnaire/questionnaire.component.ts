import { Component, OnInit } from "@angular/core";
import {
  COLUMN_TYPE,
  LayoutService,
  ResourceService,
  ConfigService,
} from "@sunbird/shared";
import { FormGroup, FormBuilder } from "@angular/forms";
import { QuestionnaireService } from "../questionnaire.service";
import { ActivatedRoute } from "@angular/router";
import { ObservationService } from "@sunbird/core";
import { Location } from "@angular/common";
import {
  AssessmentInfo,
  Evidence,
  IAssessmentDetails,
  Section,
} from "../Interface/assessmentDetails";
import { ObservationUtilService } from "../../observation/service";
import { ComponentDeactivate } from "../guard/can-deactivate.guard";

@Component({
  selector: "app-questionnaire",
  templateUrl: "./questionnaire.component.html",
  styleUrls: ["./questionnaire.component.scss"],
})
export class QuestionnaireComponent
  extends ComponentDeactivate
  implements OnInit
{
  pageTitleSrc: string = "Observation Form";
  svgToDisplay: string = "textbooks-banner-img.svg";
  layoutConfiguration: any;
  FIRST_PANEL_LAYOUT;
  SECOND_PANEL_LAYOUT;
  questionnaireForm: FormGroup;
  sections: Section[];
  evidence: Evidence;
  queryParams: any;
  assessmentInfo: AssessmentInfo;
  canLeave: boolean = false;
  constructor(
    public layoutService: LayoutService,
    public fb: FormBuilder,
    public qService: QuestionnaireService,
    public resourceService: ResourceService,
    private activatedRoute: ActivatedRoute,
    private config: ConfigService,
    private observationService: ObservationService,
    private location: Location,
    private observationUtilService: ObservationUtilService
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
    // this.evidence = this.data.result.assessment.evidences[0];
    // this.sections = this.evidence.sections;
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
        this.assessmentInfo = this.qService.mapSubmissionToAssessment(
          this.assessmentInfo
        );
        this.qService.setSubmissionId(
          this.assessmentInfo.assessment.submissionId
        );
        this.evidence = data.result.assessment.evidences[0];
        this.evidence.startTime = Date.now();
        this.sections = this.evidence.sections;
      },
      (error) => {}
    );
  }

  private initConfiguration() {
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
    let msg = save
      ? this.resourceService.frmelmnts.alert.saveConfirm
      : this.resourceService.frmelmnts.alert.submitConfirm;
    let userConfirm = await this.openAlert(msg, true);
    if (!userConfirm) {
      return;
    }
    let evidenceData = this.qService.getEvidenceData(
      this.evidence,
      this.questionnaireForm.value
    );

    save ? (evidenceData["status"] = "draft") : null;
    let payload = { evidence: evidenceData };

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
      (data) => {
        if (payload.evidence.status == "draft") {
          this.backOrContinue();
          return;
        }
        this.openAlert(
          this.resourceService.frmelmnts.alert.successfullySubmitted
        );
        this.canLeave = true;
        this.location.back();
      },
      (error) => {
        this.openAlert(
          payload.evidence.status == "draft"
            ? this.resourceService.frmelmnts.alert.failedToSave
            : this.resourceService.frmelmnts.alert.submissionFailed
        );
        console.log(error);
      }
    );
  }

  async backOrContinue() {
    let alertMetaData = await this.observationUtilService.getAlertMetaData();
    alertMetaData.content.body.data =
      this.resourceService.frmelmnts.alert.successfullySaved;
    alertMetaData.content.body.type = "text";
    alertMetaData.size = "mini";
    alertMetaData.footer.buttons.push({
      type: "accept",
      returnValue: true,
      buttonText: this.resourceService.frmelmnts.btn.back,
    });
    alertMetaData.footer.buttons.push({
      type: "cancel",
      returnValue: false,
      buttonText: this.resourceService.frmelmnts.lbl.continue,
    });
    alertMetaData.footer.className = "double-btn";

    const response = await this.observationUtilService.showPopupAlert(alertMetaData);
    if (response) {
      this.canLeave = true;
      this.location.back();
    }
  }

  async openAlert(msg, showCancel = false) {
    let alertMetaData = await this.observationUtilService.getAlertMetaData();
    alertMetaData.content.body.data = msg;
    alertMetaData.content.body.type = "text";
    alertMetaData.content.title = "";

    alertMetaData.size = "mini";
    alertMetaData.footer.buttons.push({
      type: "accept",
      returnValue: true,
      buttonText: showCancel
        ? this.resourceService.frmelmnts.btn.yes
        : this.resourceService.frmelmnts.btn.ok,
    });
    alertMetaData.footer.className = "single-btn";

    if (showCancel) {
      alertMetaData.footer.buttons.push({
        type: "cancel",
        returnValue: false,
        buttonText: this.resourceService.frmelmnts.btn.no,
      });
      alertMetaData.footer.className = "double-btn";
    }
    return this.observationUtilService.showPopupAlert(alertMetaData);
  }

  scrollToContent(id) {
    document
      .getElementById(id)
      .scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
