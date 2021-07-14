import { Component, OnInit } from '@angular/core';
import { ObservationService } from '@sunbird/core';
import { ConfigService, ResourceService, ILoaderMessage, INoResultMessage, LayoutService, ToasterService } from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { ObservationUtilService } from '../../service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-observation-details',
  templateUrl: './observation-details.component.html',
  styleUrls: ['./observation-details.component.scss'],
})
export class ObservationDetailsComponent implements OnInit {
  config;
  entities;
  programId;
  solutionId;
  solution;
  payload;
  observationId;
  selectedEntity: any = {};
  layoutConfiguration: any;
  submissions;
  programName;
  actions = [{
    name: this.resourceService.frmelmnts.lbl.edit,
    icon: 'pencil alternate large icon',
    type: 'edit'
  },
  {
    name: this.resourceService.frmelmnts.lbl.delete,
    icon: 'trash  large icon',
    type: 'delete'
  }];
  showDownloadModal = false;
  openEditModal = {
    show: false,
    data: ''
  };
  showLoader = false;
  public loaderMessage: ILoaderMessage;
  public noResultMessageForEntity: INoResultMessage = {
    'messageText': 'frmelmnts.msg.noEntityFound'
  };

  constructor(
    private observationService: ObservationService,
    config: ConfigService,
    private router: Router,
    private routerParam: ActivatedRoute,
    public resourceService: ResourceService,
    public observationUtilService: ObservationUtilService,
    public layoutService: LayoutService,
    private location: Location,
    public toasterService: ToasterService,
  ) {
    this.config = config;
    routerParam.queryParams.subscribe(data => {
      this.programId = data.programId;
      this.solutionId = data.solutionId;
      this.observationId = data.observationId;
      this.solution = data.solutionName;
      this.programName = data.programName;
    });
  }

  ngOnInit() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.getProfileData();
  }
  getProfileData() {
    this.observationUtilService.getProfileDataList().then(data => {
      this.payload = data;
      this.getEntities();
    }, error => {
    });
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  getEntities() {
    this.showLoader = true;
    const paramOptions = {
      url: this.config.urlConFig.URLS.OBSERVATION.OBSERVATION_ENTITIES,
      param: {
        solutionId: this.solutionId,
      },
      data: this.payload,
    };
    this.observationService.post(paramOptions).subscribe(data => {
      this.showLoader = false;
      if (data.result.entities && data.result.entities.length) {
        this.entities = data.result;
        if (!this.selectedEntity._id) {
          this.selectedEntity = this.entities.entities[0];
        }
        this.observationId = this.entities._id;
        this.getObservationForm();
      } else {
        this.entities = [];
      }

    }, error => {
      this.showLoader = false;
    });
  }

  getObservationForm() {
    // this.showLoader = true;
    const paramOptions = {
      url: this.config.urlConFig.URLS.OBSERVATION.GET_OBSERVATION_SUBMISSIONS + `${this.observationId}?entityId=${this.selectedEntity._id}`,
      param: {},
      data: this.payload,
    };
    this.observationService.post(paramOptions).subscribe(data => {
      this.showLoader = false;
      this.submissions = data.result;
      if (!this.submissions.length && !this.entities.allowMultipleAssessemts) {
        this.observeAgain();
      }
    }, error => {
      this.showLoader = false;
    });
  }

 actionOnEntity(event) {
    if (event.action == 'delete') {
      this.delete(event.data);
    } else if (event.action == 'change') {
      this.changeEntity(event.data);
    }
  }

  addEntity() {
    this.showDownloadModal = true;
  }
  changeEntity(event) {
    this.selectedEntity = event;
    this.getObservationForm();
  }
  modalClose() {
    this.showDownloadModal = false;
    this.getEntities();
  }
  goBack() {
   this.location.back();
  }

  async observeAgainConfirm() {
    const metaData = await this.observationUtilService.getAlertMetaData();
    metaData.content.body.data = this.resourceService.frmelmnts.lbl.createObserveAgain;
    metaData.content.body.type = 'text';
    metaData.content.title = this.resourceService.frmelmnts.btn.observeAgain;
    metaData.size = 'mini';
    metaData.footer.buttons.push({
      type: 'cancel',
      returnValue: false,
      buttonText: this.resourceService.frmelmnts.btn.no
    });
    metaData.footer.buttons.push({
      type: 'accept',
      returnValue: true,
      buttonText: this.resourceService.frmelmnts.btn.yes
    });
    metaData.footer.className = 'double-btn';
    const returnData = await this.observationUtilService.showPopupAlert(metaData);
    returnData ? this.observeAgain() : '';
  }
  observeAgain() {
    this.showLoader = true;
    const paramOptions = {
      url: this.config.urlConFig.URLS.OBSERVATION.OBSERVATION_SUBMISSION_CREATE + `${this.observationId}?entityId=${this.selectedEntity._id}`,
      param: {},
      data: this.payload,
    };
    this.observationService.post(paramOptions).subscribe(data => {
      this.showLoader = false;
      this.getEntities();
    }, error => {
      this.showLoader = false;
    });
  }

  redirectToQuestions(evidence) {
    this.router.navigate([`/questionnaire`], {
      queryParams: {
        observationId: this.observationId,
        entityId: this.selectedEntity._id,
        submissionNumber: evidence.submissionNumber,
        evidenceCode: evidence.code,
      },
    });
  }

  open(sbnum, data) {
    data.submissionNumber = sbnum;
    this.redirectToQuestions(data);
  }

  async delete(entity) {
    const metaData = await this.observationUtilService.getAlertMetaData();
    metaData.content.body.data = this.resourceService.frmelmnts.lbl.deleteConfirm;
    metaData.content.body.type = 'text';
    metaData.content.title = this.resourceService.frmelmnts.btn.delete;
    metaData.size = 'mini';
    metaData.footer.buttons.push({
      type: 'accept',
      returnValue: true,
      buttonText: this.resourceService.frmelmnts.btn.yes
    });
    metaData.footer.buttons.push({
      type: 'cancel',
      returnValue: false,
      buttonText: this.resourceService.frmelmnts.btn.no
    });
    metaData.footer.className = 'double-btn';
    const returnData = await this.observationUtilService.showPopupAlert(metaData);
    if (returnData) {
      this.showLoader = true;
      this.payload.data = [
        entity._id
      ];
      const paramOptions = {
        url: this.config.urlConFig.URLS.OBSERVATION.OBSERVATION_UPDATE_ENTITES + this.observationId,
        param: {},
        data: this.payload,
      };
      if (this.selectedEntity._id == entity._id) {
        this.selectedEntity = {};
      }
      this.observationService.delete(paramOptions).subscribe(data => {
        this.showLoader = false;
        this.getEntities();
      }, error => {
        this.showLoader = false;
      });
    }
  }

  openEditSubmission(event) {
    this.openEditModal.show = true;
    this.openEditModal.data = event;
  }

  async deleteSubmission(event) {
    const metaData = await this.observationUtilService.getAlertMetaData();
    metaData.content.body.data = this.resourceService.frmelmnts.lbl.deleteSubmission;
    metaData.content.body.type = 'text';
    metaData.content.title = this.resourceService.frmelmnts.btn.delete;
    metaData.size = 'mini';
    metaData.footer.buttons.push({
      type: 'cancel',
      returnValue: false,
      buttonText: this.resourceService.frmelmnts.btn.no
    });
    metaData.footer.buttons.push({
      type: 'accept',
      returnValue: true,
      buttonText: this.resourceService.frmelmnts.btn.yes
    });
    metaData.footer.className = 'double-btn';
    const returnData = await this.observationUtilService.showPopupAlert(metaData);
    if (returnData) {
      const config = {
        url: this.config.urlConFig.URLS.OBSERVATION.OBSERVATION_SUBMISSION_UPDATE + `${event._id}`,
        param: {},
        payload: this.payload,
      };
      this.observationService.delete(config).subscribe(data => {
        this.getObservationForm();
      }, error => {
        this.toasterService.error(error.error.message);
      });
    }
  }

  closeEditModal(event?) {
    this.openEditModal.show = false;
    if (event.data) { this.updateSubmission(event.data); }
  }

  updateSubmission(event) {
    this.showLoader = true;
    this.payload.title = event.title;
    const paramOptions = {
      url: this.config.urlConFig.URLS.OBSERVATION.OBSERVATION_SUBMISSION_UPDATE + event._id,
      param: {},
      data: this.payload,
    };
    this.observationService.post(paramOptions).subscribe(data => {
      this.showLoader = false;
      this.getEntities();
    }, error => {
      this.showLoader = false;
    });
  }

  actionOnSubmission(event) {
    event.action == 'edit' ? this.openEditSubmission(event.data) : this.deleteSubmission(event.data);
  }

  dropDownAction(submission, type) {
    const data = {
      action: type,
      data: submission
    };
    this.actionOnSubmission(data);
  }
}
