import { Component, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { ResourceService } from '../../services';

interface InputType {
  title: string;
  body: string;
  event: string;
}

@Component({
  selector: 'app-confirm-popup',
  templateUrl: './confirm-popup.component.html',
  styleUrls: ['./confirm-popup.component.scss']
})
export class ConfirmPopupComponent {

  @Input() input: InputType;
  @Output() confirmation = new EventEmitter<boolean>();
  @ViewChild('modal') modal;

  constructor(public resourceService: ResourceService) {

  }

  public confirm(confirm: boolean): void {
    this.confirmation.emit(confirm);
    this.closeModal();
  }

  private closeModal() {
    if (this.modal) {
      this.modal.deny();
    }
  }

}
