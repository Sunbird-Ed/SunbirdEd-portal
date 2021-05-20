import { Component, OnInit } from '@angular/core';
import { ObservationService } from '@sunbird/core';
import { ConfigService,  ResourceService} from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';

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
  observationId;
  selectedEntity: any;
  submissions;
  showDownloadModal: boolean = false;
  constructor(
    private observationService: ObservationService,
    config: ConfigService,
    private router : Router,
    private routerParam : ActivatedRoute,
    public resourceService: ResourceService
    ) {
    this.config = config;
    routerParam.queryParams.subscribe(data=>{
      console.log(data,"parameters");
        this.programId = data.programId;
        this.solutionId = data.solutionId;
        this.observationId = data.observationId;
        this.solution = data.solutionName
    })
  }

  ngOnInit() {
    this.getEntities();
  }
  getEntities() {
    const paramOptions = {
      url: this.config.urlConFig.URLS.OBSERVATION.OBSERVATION_ENTITIES,
      param: {
        solutionId: this.solutionId
      },
      data: {
        block: "0abd4d28-a9da-4739-8132-79e0804cd73e",
        district: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
        role: "DEO",
        school: "8be7ecb5-4e35-4230-8746-8b2694276343",
        state: "bc75cc99-9205-463e-a722-5326857838f8",
      },
    };
    this.observationService.post(paramOptions).subscribe(data => {
      this.entities = data.result;
      console.log(this.entities,"this.entities");
      console.log(this.entities.entities[0],"this.entities.entities[0]");
      this.selectedEntity = this.entities.entities[0];
      this.observationId = this.entities._id;
      this.getObservationForm();
    }, error => {
    })
  }

  getObservationForm() {
    const paramOptions = {
      url: this.config.urlConFig.URLS.OBSERVATION.GET_OBSERVATION_SUBMISSIONS + `${this.entities._id}?entityId=${this.selectedEntity._id}`,
      param: {
        solutionId: this.solutionId,
        programId: this.programId,
        observationId: this.entities._id,
        entityId: this.selectedEntity._id,
        entityName: this.selectedEntity.name,
      },
      data: {
        block: "0abd4d28-a9da-4739-8132-79e0804cd73e",
        district: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
        role: "DEO",
        school: "8be7ecb5-4e35-4230-8746-8b2694276343",
        state: "bc75cc99-9205-463e-a722-5326857838f8",
      },
    };
    this.observationService.post(paramOptions).subscribe(data => {
      this.submissions = data.result;
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
  goBack(){
    this.router.navigate(['/observation']);
  }

  observeAgain(){
    const paramOptions = { 
      url: this.config.urlConFig.URLS.OBSERVATION.OBSERVATION_SUBMISSION_CREATE + `${this.observationId}?entityId=${this.selectedEntity._id}`,
      param: {},
      data: {
        block: "0abd4d28-a9da-4739-8132-79e0804cd73e",
        district: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
        role: "DEO",
        school: "8be7ecb5-4e35-4230-8746-8b2694276343",
        state: "bc75cc99-9205-463e-a722-5326857838f8",
      },
    };
    this.observationService.post(paramOptions).subscribe(data => {
      console.log(data,"data 122");
     this.getObservationForm();
    })
  }
}