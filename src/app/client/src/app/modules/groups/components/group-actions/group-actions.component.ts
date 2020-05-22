import { ResourceService } from '@sunbird/shared';
import { Component, OnInit, Input, ViewChild, Output, EventEmitter, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-group-actions',
  templateUrl: './group-actions.component.html',
  styleUrls: ['./group-actions.component.scss']
})
export class GroupActionsComponent {

  @ViewChild('modal') modal;
  @Input() modalName: string;
  @Output() modalClosed = new EventEmitter();
  @Input() pastMembersList;
  @Input() groupName: string;

  constructor(private renderer: Renderer2, public resourceService: ResourceService) {
    this.renderer.listen('window', 'click', (e: Event) => {
      if (e.target['tabIndex'] === -1) {
        this.closeModal();
      }
     });
   }

  closeModal() {
    this.modal.close();
    this.modalClosed.emit();
  }
}
