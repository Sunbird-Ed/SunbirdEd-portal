import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash-es';
import { UserService } from '@sunbird/core';
import { ConfigService } from '@sunbird/shared';
import { ProgramTelemetryService } from '../../../program/services';

@Component({
  selector: 'app-recursive-tree',
  templateUrl: './recursive-tree.component.html',
  styleUrls: ['./recursive-tree.component.scss']
})
export class RecursiveTreeComponent implements OnInit {

  @Input() collectionUnits;
  @Input() selectedChapter;
  @Input() programContext;
  @Input() sessionContext;
  @Output() emitSelectedNode = new EventEmitter<any>();
  @Output() nodeMeta = new EventEmitter<any>();
  public showModal = false;
  public showAddresource = false;
  visibility: any;
  public unitIdentifier;
  constructor(public userService: UserService, public configService: ConfigService,
    public programTelemetryService: ProgramTelemetryService) { }

  ngOnInit() {
    this.visibility = {};
    // tslint:disable-next-line:max-line-length
    this.visibility['showAddresource'] = _.includes(this.programContext.config.actions.showAddResource.roles, this.sessionContext.currentRoleId);
    // tslint:disable-next-line:max-line-length
    this.visibility['showEditResource'] = _.includes(this.programContext.config.actions.showEditResource.roles, this.sessionContext.currentRoleId);
    // tslint:disable-next-line:max-line-length
    this.visibility['showMoveResource'] = _.includes(this.programContext.config.actions.showMoveResource.roles, this.sessionContext.currentRoleId);
    // tslint:disable-next-line:max-line-length
    this.visibility['showDeleteResource'] = _.includes(this.programContext.config.actions.showDeleteResource.roles, this.sessionContext.currentRoleId);
    // tslint:disable-next-line:max-line-length
    this.visibility['showPreviewResource'] = _.includes(this.programContext.config.actions.showPreviewResource.roles, this.sessionContext.currentRoleId);
  }

  nodeMetaEmitter(event) {
    this.nodeMeta.emit({
      action: event.action,
      showPopup: event.action === 'add' ? true : false,
      collection: event.collection,
      content: event.content
    });
  }

  createResource(e, collection) {
    e.stopPropagation();
    this.showModal = true;
    this.nodeMeta.emit({
      action: 'add',
      showPopup: this.showModal,
      collection: collection
    });
  }

  deleteResource(e, content, collection) {
    this.nodeMeta.emit({
      action: 'delete',
      content: content,
      collection: collection,
      showPopup: null,
    });
  }

  moveResource(e, content, collection) {
    this.nodeMeta.emit({
      action: 'beforeMove',
      content: content,
      collection: collection
    });
  }

  previewResource(e, content, collection) {
    this.nodeMeta.emit({
      action: 'preview',
      content: content,
      collection: collection
    });
  }

  menuClick(e) {
    e.stopPropagation();
  }

}
