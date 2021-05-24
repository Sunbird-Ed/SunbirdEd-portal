import { Component, OnInit } from '@angular/core';
import { ObservationService } from '@sunbird/core';
import { ConfigService, ResourceService, ILoaderMessage, INoResultMessage } from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { ObservationUtilService } from "../../service";
@Component({
  selector: 'app-observation-details',
  templateUrl: './observation-details.component.html',
  styleUrls: ['./observation-details.component.scss']
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
        solutionId: this.solutionId
      },
      data: this.payload,
    };
    this.observationService.post(paramOptions).subscribe(data => {
      this.showLoader = false;
      this.entities = data.result;
      this.selectedEntity = this.entities.entities[0];
      this.observationId = this.entities._id;
      this.getObservationForm();
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

  observeAgain() {
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
  openObservation() {
    this.router.navigate([`/questionnaire`], {
      queryParams: {
        observationId: this.observationId,
        entityId: this.selectedEntity._id,
        // submissionNumber: ""
        // evidenceCode:""
      }
    });
  }

  delete(entity) {
    let metaData=this.observationUtilService.getAlertMetaData();
    console.log(entity, "entity");
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