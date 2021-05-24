import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { ObservationService, KendraService } from '@sunbird/core';
import { ConfigService, ResourceService, ILoaderMessage, INoResultMessage } from '@sunbird/shared';
import * as _ from 'underscore';
import { ObservationUtilService } from '../../service';
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
    payload;
    showDownloadModal: boolean = true;
    showLoader: boolean = true;
    public loaderMessage: ILoaderMessage;
    public noResultMessage: INoResultMessage;
    constructor(private observationService: ObservationService,
        private kendraService: KendraService,
        public resourceService: ResourceService,
        public observationUtilService: ObservationUtilService,
        config: ConfigService) {
        this.config = config;
        this.search = _.debounce(this.search, 1000)
    }
    ngOnInit() {
        this.getProfileData();
    }
    getProfileData() {
        this.observationUtilService.getProfileDataList().then(data => {
            this.payload = data;
            this.getTargettedEntityType();
        })
    }
    public closeModal() {
        this.modal.approve();
        this.showDownloadModal = false;
        this.closeEvent.emit();
    }
    getTargettedEntityType() {
        this.showLoader = true;
        const paramOptions = {
            url: this.config.urlConFig.URLS.KENDRA.TARGETTED_ENTITY_TYPES + this.solutionId,
            param: {},
            data:this.payload,
        };
        this.kendraService.post(paramOptions).subscribe(data => {
            this.targetEntity = data.result;
            this.entities = [];
            this.search();

        }, error => {
            this.showLoader = false;
        })

    }
    selectEntity(event) {
        if (!event.isSelected) {
            event.selected = !event.selected;
        }
    }
    search() {
        this.showLoader = true;
        let url = this.config.urlConFig.URLS.OBSERVATION.SEARCH_ENTITY + '?observationId=' + this.observationId + '&search=' + encodeURIComponent(this.searchQuery ? this.searchQuery : '') + '&page=' + this.page + '&limit=' + this.limit;
        const paramOptions = {
            url: url + `&parentEntityId=${encodeURIComponent(
                this.targetEntity._id
            )}`,
            param: {},
            data: this.payload,
        };
        this.observationService.post(paramOptions).subscribe(data => {
            // this.entities = data.result;
            for (let i = 0; i < data.result[0].data.length; i++) {
                data.result[0].data[i].isSelected = data.result[0].data[i].selected;
                data.result[0].data[i].preSelected = data.result[0].data[i].selected ? true : false;
            }
            this.entities = this.entities.concat(data.result[0].data);
            this.count = data.result[0].count;
            this.showLoader = false;
        }, error => {
            this.showLoader = false;
        })
    }

    searchEntity() {
        this.entities = [];
        this.search();
    }
    loadMore() {
        this.page = this.page + 1;
        this.search();
    }
    submit() {
        this.showLoader = true;
        let selectedSchools = [];
        this.entities.forEach((element) => {
            if (element.selected && !element.preSelected) {
                selectedSchools.push(element._id);
            }
        });
        const paramOptions = {
            url: this.config.urlConFig.URLS.OBSERVATION.OBSERVATION_UPDATE_ENTITES + `${this.observationId}`,
            param: {},
            data:this.payload,
        };
        this.observationService.post(paramOptions).subscribe(data => {
            this.closeModal();
            this.showLoader = false;
        }, error => {
            this.showLoader = false;
        })
    }
}