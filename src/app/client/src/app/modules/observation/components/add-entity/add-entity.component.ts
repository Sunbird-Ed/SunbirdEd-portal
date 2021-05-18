import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { ObservationService, KendraService } from '@sunbird/core';
import { ConfigService } from '@sunbird/shared';
import * as _ from 'underscore';
@Component({
    selector: 'add-entity',
    templateUrl: './add-entity.component.html',
    styleUrls: ['./add-entity.component.scss']
})
export class AddEntityComponent implements OnInit {
    @ViewChild('modal', { static: false }) modal;
    @Output() closeEvent = new EventEmitter<any>();
    @Input() observationId;
    @Input() solutionId;
    config;
    targetEntity;
    searchQuery;
    limit = 10;
    page = 1;
    count = 0;
    entities;
    showDownloadModal : boolean = true;
    constructor(private observationService: ObservationService,
        private kendraService: KendraService,
        config: ConfigService) {
        this.config = config;
        this.search = _.debounce(this.search, 1000)
    }
    ngOnInit() {
        this.getTargettedEntityType();
    }
    public closeModal() {
        this.modal.approve();
        this.showDownloadModal = false;
        this.closeEvent.emit();
    }
    getTargettedEntityType() {
        const paramOptions = {
            url: this.config.urlConFig.URLS.KENDRA.TARGETTED_ENTITY_TYPES + this.solutionId,
            param: {},
            data: {
                block: "0abd4d28-a9da-4739-8132-79e0804cd73e",
                district: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
                role: "DEO",
                school: "8be7ecb5-4e35-4230-8746-8b2694276343",
                state: "bc75cc99-9205-463e-a722-5326857838f8",
            },
        };
        this.kendraService.post(paramOptions).subscribe(data => {
            // this.entities = data.result;
            console.log(data, "59");
            this.targetEntity = data.result;
            this.search();
        }, error => {
        })

    }
    selectEntity(event) {
        event.selected = !event.selected;
        console.log(event.selected, ".isChecked");
        console.log(this.entities, "this.entities");
    }
    onEnter(key) {
        console.log(key, "key");
    }
    search() {
        console.log(this.targetEntity, "this.targetEntity", "this.searchQuery");
        let url = this.config.urlConFig.URLS.OBSERVATION.SEARCH_ENTITY + '?observationId=' + this.observationId + '&search=' + encodeURIComponent(this.searchQuery ? this.searchQuery : '') + '&page=' + this.page + '&limit=' + this.limit;
        const paramOptions = {
            url: url + `&parentEntityId=${encodeURIComponent(
                this.targetEntity._id
            )}`,
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
            // this.entities = data.result;
            console.log(data, "97");
            for (let i = 0; i < data.result[0].data.length; i++) {
                data.result[0].data[i].isSelected = data.result[0].data[i].selected;
                data.result[0].data[i].preSelected = data.result[0].data[i].selected ? true : false;
            }
            this.entities = data.result[0].data;
            this.count = data.result[0].count
        }, error => {
        })
    }

    submit() {
        let selectedSchools = [];
        this.entities.forEach((element) => {
            if (element.selected && !element.preSelected) {
                selectedSchools.push(element._id);
            }
        });
        console.log(selectedSchools, "selectedSchools");
        const paramOptions = {
            url: this.config.urlConFig.URLS.OBSERVATION.OBSERVATION_UPDATE_ENTITES + `${this.observationId}`,
            param: {},
            data: {
                block: "0abd4d28-a9da-4739-8132-79e0804cd73e",
                district: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
                role: "DEO",
                school: "8be7ecb5-4e35-4230-8746-8b2694276343",
                state: "bc75cc99-9205-463e-a722-5326857838f8",
                data: selectedSchools
            },
        };
        this.observationService.post(paramOptions).subscribe(data => {
            console.log(data, "data 4567");
            this.closeModal();
        }, error => {
        })
    }
}