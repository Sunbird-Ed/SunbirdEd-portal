import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
@Component({
  selector: 'app-account-recovery-info',
  templateUrl: './account-recovery-info.component.html',
  styleUrls: ['./account-recovery-info.component.scss']
})
export class AccountRecoveryInfoComponent implements OnInit {
  @Output() close = new EventEmitter<any>();
  @ViewChild('accountRecoveryModal') accountRecoveryModal;
  constructor(public resourceService: ResourceService) { }

  closeModal() {
    this.accountRecoveryModal.deny();
    this.close.emit();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.accountRecoveryModal.deny();
  }

}
