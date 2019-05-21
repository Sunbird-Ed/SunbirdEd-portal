import { Router } from '@angular/router';
import { ResourceService } from '@sunbird/shared';
import { Component, OnInit, AfterViewInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';


@Component({
  selector: 'app-watch-video',
  templateUrl: './watch-video.component.html',
  styleUrls: ['./watch-video.component.scss']
})
export class WatchVideoComponent {

  @ViewChild('modal') modal;
  @Output() closeVideoModal = new EventEmitter<any>();
  WatchVideoIntractEdata: IInteractEventEdata;
  DownloadPdfInteractEdata: IInteractEventEdata;
  CloaseVideoModal: IInteractEventEdata;
  public telemetryInteractObject: IInteractEventObject;
  constructor(public resourceService: ResourceService, public router: Router, ) { }

  closeModal() {
    this.closeVideoModal.emit('success');
  }
  modalClose() {
    this.modal.deny();
  }
}
