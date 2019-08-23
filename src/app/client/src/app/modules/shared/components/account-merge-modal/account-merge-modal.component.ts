import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ResourceService} from '../../services';
import {Router} from '@angular/router';

@Component({
  selector: 'app-account-merge-modal',
  templateUrl: './account-merge-modal.component.html'
})
export class AccountMergeModalComponent implements OnInit {
  @Output() closeAccountMergeModal = new EventEmitter<any>();
  @ViewChild('modal') modal;
  instance: string;

  constructor(public resourceService: ResourceService, public router: Router) {
    this.instance = (<HTMLInputElement>document.getElementById('instance'))
      ? (<HTMLInputElement>document.getElementById('instance')).value : 'sunbird';
  }

  ngOnInit() {
  }

  closeModal() {
    this.closeAccountMergeModal.emit();
    this.modal.deny();
  }

  redirect() {
    this.closeModal();
    window.location.href = 'merge/account/initiate?redirectUri=' + this.router.url;
  }
}
