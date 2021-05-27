import { Component, OnInit } from '@angular/core';
import { ObservationService } from '@sunbird/core';
import { ConfigService, ResourceService, ILoaderMessage, INoResultMessage } from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { ObservationUtilService } from "../../service";
@Component({
  selector: "app-observation-details",
  templateUrl: "./observation-details.component.html",
  styleUrls: ["./observation-details.component.scss"],
})
export class ObservationDetailsComponent implements OnInit {
  config;
  entities;
  programId;
  solutionId;
  solution;
  payload;
  observationId;
  selectedEntity: any;
  submissions;
  showDownloadModal: boolean = false;
  openEditModal = {
    show: false,
    data: ''
  };
  showLoader: boolean = false;
  public loaderMessage: ILoaderMessage;
  public noResultMessage: INoResultMessage;


  constructor(
    private observationService: ObservationService,
    config: ConfigService,
    private router: Router,
    private routerParam: ActivatedRoute,
    public resourceService: ResourceService,
    public observationUtilService: ObservationUtilService
  ) {
    this.config = config;
    routerParam.queryParams.subscribe(data => {
      console.log(data, "parameters");
      this.programId = data.programId;
      this.solutionId = data.solutionId;
      this.observationId = data.observationId;
      this.solution = data.solutionName
    })
  }

  ngOnInit() {
    this.getProfileData();
  }
  getProfileData() {
    this.observationUtilService.getProfileDataList().then(data => {
      this.payload = data;
      this.getEntities();
    })
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
        this.selectedEntity = this.entities.entities[0];
        this.observationId = this.entities._id;
        this.getObservationForm();
      } else {
        this.entities = [];
      }

    }, error => {
      this.showLoader = false;
    })
  }

  getObservationForm() {
    this.showLoader = true;
    const paramOptions = {
      url: this.config.urlConFig.URLS.OBSERVATION.GET_OBSERVATION_SUBMISSIONS + `${this.observationId}?entityId=${this.selectedEntity._id}`,
      param: {},
      data: this.payload,
    };
    this.observationService.post(paramOptions).subscribe(data => {
      this.showLoader = false;
      this.submissions = data.result;
    }, error => {
      this.showLoader = false;
    })
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
    this.router.navigate(['/observation']);
  }

  async observeAgain() {
    let metaData = await this.observationUtilService.getAlertMetaData();
    metaData.content.body.data = this.resourceService.frmelmnts.lbl.createObserveAgain;
    metaData.content.body.type = "text";
    metaData.content.title = this.resourceService.frmelmnts.btn.observeAgain;
    metaData.size = "mini";
    metaData.footer.buttons.push({
      type: "cancel",
      returnValue: false,
      buttonText: this.resourceService.frmelmnts.btn.no
    });
    metaData.footer.buttons.push({
      type: "accept",
      returnValue: true,
      buttonText: this.resourceService.frmelmnts.btn.yes
    })
    metaData.footer.className = "double-btn-circle";
    let returnData = await this.observationUtilService.showPopupAlert(metaData);
    if (returnData) {
      this.showLoader = true;
      const paramOptions = {
        url: this.config.urlConFig.URLS.OBSERVATION.OBSERVATION_SUBMISSION_CREATE + `${this.observationId}?entityId=${this.selectedEntity._id}`,
        param: {},
        data: this.payload,
      };
      this.observationService.post(paramOptions).subscribe(data => {
        console.log(data, "data 122");
        this.showLoader = false;
        this.getObservationForm();
      }, error => {
        this.showLoader = false;
      })
    }
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

  async delete(entity) {
    let metaData = await this.observationUtilService.getAlertMetaData();
    metaData.content.body.data = this.resourceService.frmelmnts.lbl.deleteConfirm;
    metaData.content.body.type = "text";
    metaData.content.title = this.resourceService.frmelmnts.btn.delete;
    metaData.size = "mini";
    metaData.footer.buttons.push({
      type: "cancel",
      returnValue: false,
      buttonText: this.resourceService.frmelmnts.btn.no
    });
    metaData.footer.buttons.push({
      type: "accept",
      returnValue: true,
      buttonText: this.resourceService.frmelmnts.btn.yes
    })
    metaData.footer.className = "double-btn-circle";
    let returnData = await this.observationUtilService.showPopupAlert(metaData);
    if (returnData) {
      this.showLoader = true;
      this.payload.data = [
        entity._id
      ]
      const paramOptions = {
        url: this.config.urlConFig.URLS.OBSERVATION.OBSERVATION_UPDATE_ENTITES + this.observationId,
        param: {},
        data: this.payload,
      };
      this.observationService.delete(paramOptions).subscribe(data => {
        console.log(data, "data 122");
        this.showLoader = false;
        this.getEntities();
      }, error => {
        this.showLoader = false;
      })
    }
  }

  openEditSubmission(event) {
    this.openEditModal.show = true;
    this.openEditModal.data = event;
  }

  async deleteSubmission(event) {
    let metaData = await this.observationUtilService.getAlertMetaData();
    metaData.content.body.data = this.resourceService.frmelmnts.lbl.deleteSubmission;
    metaData.content.body.type = "text";
    metaData.content.title = this.resourceService.frmelmnts.btn.delete;
    metaData.size = "mini";
    metaData.footer.buttons.push({
      type: "cancel",
      returnValue: false,
      buttonText: this.resourceService.frmelmnts.btn.no
    });
    metaData.footer.buttons.push({
      type: "accept",
      returnValue: true,
      buttonText: this.resourceService.frmelmnts.btn.yes
    })
    metaData.footer.className = "double-btn-circle";
    let returnData = await this.observationUtilService.showPopupAlert(metaData);
    console.log(returnData, "returnData");
    if (returnData) {
      this.showLoader = true;
      const config = {
        url: this.config.urlConFig.URLS.OBSERVATION.OBSERVATION_SUBMISSION_UPDATE + `${event._id}`,
        param: {},
        payload: this.payload,
      };
      this.observationService.delete(config).subscribe(data => {
        console.log(data, "data 122");
        this.showLoader = false;
        this.getEntities();
      }, error => {
        this.showLoader = false;
      })
    }
  }

  closeEditModal(event?) {
    this.openEditModal.show = false;
    event ? this.updateSubmission(event) : '';
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
    })
  }
}