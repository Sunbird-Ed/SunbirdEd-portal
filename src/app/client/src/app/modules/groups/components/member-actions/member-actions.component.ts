import { ResourceService } from '@sunbird/shared';
import { Component, Input, EventEmitter, ViewChild, Output, OnDestroy } from '@angular/core';
import * as _ from 'lodash-es';

export interface IMemberActionData {
  title: string;
  description: string;
  buttonText: string;
  theme?: 'primary' | 'error';
}
@Component({
  selector: 'app-member-actions',
  templateUrl: './member-actions.component.html',
  styleUrls: ['./member-actions.component.scss']
})
export class MemberActionsComponent implements OnDestroy {
  @ViewChild('modal') modal;
  @Input() action: string;
  @Input() member: any;
  @Output() modalClose = new EventEmitter<void>();
  @Output() actionConfirm = new EventEmitter<any>();

  memberActionData: IMemberActionData;
  constructor(public resourceService: ResourceService) {
  }

  ngOnInit() {
    switch (this.action) {
      case 'promote':
        this.memberActionData = {
          title: `${this.resourceService.frmelmnts.btn.makeAdmin}?`,
          description: _.replace(this.resourceService.frmelmnts.lbl.makeAdmin, '{memberName}', this.member.title),
          buttonText: this.resourceService.frmelmnts.btn.makeAdmin,
          theme: 'primary'
        };
        break;
      case 'remove':
        this.memberActionData = {
          title: `${this.resourceService.frmelmnts.btn.removeMember}?`,
          description: _.replace(this.resourceService.frmelmnts.lbl.removeWarning, '{memberName}', this.member.title),
          buttonText: this.resourceService.frmelmnts.btn.removeMember,
          theme: 'error'
        };
        break;
      case 'dismiss':
        this.memberActionData = {
          title: `${this.resourceService.frmelmnts.btn.dismissAdmin}?`,
          description: _.replace(this.resourceService.frmelmnts.lbl.dismissWarning, '{memberName}', this.member.title),
          buttonText: this.resourceService.frmelmnts.btn.dismissAdmin,
          theme: 'primary'
        };
        break;
    }
  }

  closeModal() {
    this.modal.deny();
    this.modalClose.emit();
  }

  performAction() {
    this.actionConfirm.emit({ data: this.member, action: this.action });
    this.closeModal();
  }

  ngOnDestroy() {
    if (this.modal.deny) {
      this.modal.deny();
    }
  }
}
