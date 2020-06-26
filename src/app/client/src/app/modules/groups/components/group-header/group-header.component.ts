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
  dropdownContent = true;
  @ViewChild('modal') modal;
  @Input() modalName: string;
  @Output() modalClosed = new EventEmitter();
  @Input() pastMembersList;
  @Input() groupData: string;
  showModal = false;
  showEditModal: boolean;
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
  editGroup() {
    this.showEditModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
  dropdownMenu(){
    this.dropdownContent = !this.dropdownContent;
  }
}
