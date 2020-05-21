import { Component, OnInit, Input, EventEmitter, ViewChild, Output, ElementRef, Renderer2 } from '@angular/core';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-member-actions',
  templateUrl: './member-actions.component.html',
  styleUrls: ['./member-actions.component.scss']
})
export class MemberActionsComponent implements OnInit {
  @Input() modalName: string;
  @Input() member: {};
  @ViewChild('modal') modal;
  @Output() modalClosed = new EventEmitter();
  @Output() handleMember = new EventEmitter();
  constructor() {
   }

  ngOnInit() {
  }

  closeModal() {
    this.modal.close();
    this.modalClosed.emit();
  }

  removeMember(name) {
      this.handleMember.emit({data: {identifier: _.get(this.member, 'identifier'), modalName: name}});
      this.closeModal();
  }
}
