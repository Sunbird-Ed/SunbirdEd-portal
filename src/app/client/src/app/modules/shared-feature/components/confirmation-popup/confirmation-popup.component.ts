import { Component, OnInit, ViewChild, Output, EventEmitter, Input, HostListener } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
@Component({
  selector: 'app-confirmation-popup',
  templateUrl: './confirmation-popup.component.html',
  styleUrls: ['./confirmation-popup.component.scss']
})
export class ConfirmationPopupComponent implements OnInit {
  @ViewChild('confirmationModal', {static: true}) confirmationModal;
  @Input() popupMode: string;
  @Input() batchId: string;
  @Output() close = new EventEmitter<any>();

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.closeModal();
  }
  constructor(public resourceService: ResourceService) { }

  ngOnInit() {
  }

  closeModal() {
    this.confirmationModal.deny();
    this.close.emit();
  }

  navigateToAddCertificate() {
    this.confirmationModal.deny();
    this.close.emit({mode: 'add-certificates', batchId: this.batchId});
  }

}
