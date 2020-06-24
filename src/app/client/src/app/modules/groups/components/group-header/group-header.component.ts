import { Component, OnInit, ViewChild, Input, EventEmitter, Output, Renderer2 } from '@angular/core';
import { ResourceService, NavigationHelperService } from '@sunbird/shared';
@Component({
  selector: 'app-group-header',
  templateUrl: './group-header.component.html',
  styleUrls: ['./group-header.component.scss']
})
export class GroupHeaderComponent {
  showDeleteModal;
  showPastMemberModal;
  @ViewChild('modal') modal;
  @Input() modalName: string;
  @Output() modalClosed = new EventEmitter();
  @Input() pastMembersList;
  @Input() groupName: string;
  showModal = false;
  constructor(private renderer: Renderer2, public resourceService: ResourceService,
    private navigationHelperService: NavigationHelperService) {
    this.renderer.listen('window', 'click', (e: Event) => {
      if (e.target['tabIndex'] === -1) {
        this.closeModal();
      }
     });
  }
  deleteGroup() {
    this.showModal = true;
    this.modalName = 'deleteGroup';
  }

  closeModal() {
    this.showModal = false;
  }
}
