import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ResourceService} from '../../services';
import {Router} from '@angular/router';
import {IInteractEventEdata} from '@sunbird/telemetry';

@Component({
  selector: 'app-account-merge-modal',
  templateUrl: './account-merge-modal.component.html'
})
export class AccountMergeModalComponent implements OnInit {
  @Output() closeAccountMergeModal = new EventEmitter<any>();
  @ViewChild('modal') modal;
  instance: string;
  mergeIntractEdata: IInteractEventEdata;
  public telemetryCdata: Array<{}> = [];

  constructor(public resourceService: ResourceService, public router: Router) {
    this.instance = (<HTMLInputElement>document.getElementById('instance'))
      ? (<HTMLInputElement>document.getElementById('instance')).value.toUpperCase() : 'SUNBIRD';
  }

  ngOnInit() {
    this.setTelemetryData();
  }

  closeModal() {
    this.closeAccountMergeModal.emit();
    this.modal.deny();
  }

  setTelemetryData() {
    this.telemetryCdata = [
      {id: 'user:account:merge', type: 'Feature'}, {id: 'SB-13927', type: 'Task'}
    ];
    this.mergeIntractEdata = {
      id: 'merge-account-button',
      type: 'click',
      pageid: this.router.url.split('/')[1],
    };
  }

  redirect() {
    this.closeModal();
    window.location.href = 'merge/account/initiate?redirectUri=' + this.router.url;
  }
}
