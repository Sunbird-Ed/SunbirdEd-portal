import { Component, OnInit } from '@angular/core';
import { ObservationService } from '@sunbird/core';
import { ConfigService } from '@sunbird/shared';

@Component({
  selector: 'app-observation-details',
  templateUrl: './observation-details.component.html',
  styleUrls: ['./observation-details.component.scss']
})
export class ObservationDetailsComponent implements OnInit {
  config;
  entities;
  programId;
  solutionId ='609d28adb2f70d503e36f354';
  observationId;
  selectedEntity: any;
  submissions;
  showDownloadModal: boolean = false;
  constructor(
    private observationService: ObservationService,
    config: ConfigService) {
    this.config = config;
  }

  ngOnInit() {
    this.getEntities();
  }
  getEntities() {
    const paramOptions = {
      url: this.config.urlConFig.URLS.OBSERVATION.OBSERVATION_ENTITIES,
      param: {
        solutionId: '609d28adb2f70d503e36f354'
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
        solutionId: '609d28adb2f70d503e36f354',
        programId: '607d320de9cce45e22ce90c0',
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
}