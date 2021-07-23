import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { ObservationService, KendraService } from '@sunbird/core';
import { ConfigService, ResourceService, ILoaderMessage, INoResultMessage } from '@sunbird/shared';
import { ObservationUtilService } from '../../service';
import { debounceTime, map } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { LocationStrategy } from '@angular/common';

@Component({
    selector: 'add-entity',
    templateUrl: './add-entity.component.html',
    styleUrls: ['./add-entity.component.scss']
})
export class AddEntityComponent implements OnInit {
    @ViewChild('modal') modal;
    @Output() closeEvent = new EventEmitter<any>();
    @Input() observationId;
    @Input() solutionId;
    public throttle = 50;
    public scrollDistance = 1;
    config;
    targetEntity;
    selectedListCount = 0;
    searchQuery;
    limit = 25;
    page = 1;
    count = 0;
    entities;
    payload;
    showDownloadModal = true;
    showLoaderBox = false;
    public loaderMessage: ILoaderMessage;
    public noResultMessage: INoResultMessage;
    showDownloadSuccessModal;
    selectedEntities = [];
    constructor(
        private observationService: ObservationService,
        private kendraService: KendraService,
        public resourceService: ResourceService,
        public observationUtilService: ObservationUtilService,
        config: ConfigService, public location: LocationStrategy,) {
        this.config = config;
        this.location.onPopState(() => {
            this.modal.approve();
         });
    }
    ngOnInit() {
        const searchBox = document.getElementById('entitySearch');
        const keyup$ = fromEvent(searchBox, 'keyup');
        keyup$.pipe(
            map((i: any) => i.currentTarget.value),
            debounceTime(500)
        )
            .subscribe((text: string) => this.searchEntity());
        this.getProfileData();
    }
    getProfileData() {
        this.observationUtilService.getProfileDataList().then(data => {
            this.payload = data;
            this.getTargettedEntityType();
        });
    }
    public closeModal() {
        this.modal.approve();
        this.showDownloadModal = false;
        this.closeEvent.emit();
    }
    getTargettedEntityType() {
        this.showLoaderBox = true;
        const paramOptions = {
            url: this.config.urlConFig.URLS.KENDRA.TARGETTED_ENTITY_TYPES + this.solutionId,
            param: {},
            data: this.payload,
        };
        this.kendraService.post(paramOptions).subscribe(data => {
            this.showLoaderBox = false;
            this.targetEntity = data.result;
            this.entities = [];
            this.search();
        }, error => {
            this.showLoaderBox = false;
        });

    }
    selectEntity(event) {
        if (this.selectedEntities.includes(event._id)) {
            const i = this.selectedEntities.indexOf(event._id);
            this.selectedEntities.splice(i, 1);
        } else {
            this.selectedEntities.push(event._id);
        }
        if (!event.isSelected) {
            event.selected = !event.selected;
        }
        event.selected ? this.selectedListCount++ : this.selectedListCount--;
    }
    search() {
        this.showLoaderBox = true;
        const url = this.config.urlConFig.URLS.OBSERVATION.SEARCH_ENTITY + '?observationId=' + this.observationId + '&search=' + encodeURIComponent(this.searchQuery ? this.searchQuery : '') + '&page=' + this.page + '&limit=' + this.limit;
        const paramOptions = {
            url: url + `&parentEntityId=${encodeURIComponent(
                this.targetEntity._id
            )}`,
            param: {},
            data: this.payload,
        };
        this.observationService.post(paramOptions).subscribe(data => {
            this.showLoaderBox = false;
            const resp = data.result[0];
            if (resp.data.length) {
                for (let i = 0; i < resp.data.length; i++) {
                    resp.data[i].isSelected = resp.data[i].selected;
                    resp.data[i].preSelected = resp.data[i].selected ? true : false;
                }
                this.entities = this.entities.concat(resp.data);
                this.count = resp.count;
            }
        }, error => {
            this.showLoaderBox = false;
        });
    }

    searchEntity() {
        this.page = 1;
        this.entities = [];
        this.search();
    }
    loadMore() {
        if (this.count > this.entities.length) {
            this.page = this.page + 1;
            this.search();
        }
    }
    submit() {
        this.payload.data = this.selectedEntities;
        const paramOptions = {
            url: this.config.urlConFig.URLS.OBSERVATION.OBSERVATION_UPDATE_ENTITES + `${this.observationId}`,
            param: {},
            data: this.payload,
        };
        this.observationService.post(paramOptions).subscribe(data => {
            this.closeModal();
        }, error => {
        });
    }
}
