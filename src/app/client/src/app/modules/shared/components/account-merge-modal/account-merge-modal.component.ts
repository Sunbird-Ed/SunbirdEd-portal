import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ResourceService} from '../../services';
import {Router} from '@angular/router';
import {IInteractEventEdata} from '@sunbird/telemetry';
import {HttpOptions} from '@sunbird/shared';
import {HttpClient} from '@angular/common/http';

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


  constructor(public resourceService: ResourceService, public router: Router,
              public http: HttpClient) {
    this.http = http;
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

  initiateMerge() {
    const httpOptions: HttpOptions = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    this.http.get('/user/session/save?redirectUri=' + this.router.url)
      .subscribe((data: any) => {
        if (data.responseCode === 'OK' && data.result && data.result.status === 'SUCCESS' && data.result.redirectUrl) {
          this.redirect(data.result.redirectUrl);
        } else {
          this.closeModal();
        }
      }, (error) => {
        this.closeModal();
      });
  }

  redirect(redirectUrl) {
    this.closeModal();
    window.location.href = redirectUrl;
  }
}
