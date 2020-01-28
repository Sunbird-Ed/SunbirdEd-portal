import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ConfigService, ToasterService } from '@sunbird/shared';
import { CollectionHierarchyService } from '../../services/collection-hierarchy/collection-hierarchy.service';
import { ProgramTelemetryService } from '../../../program/services';
import { UserService } from '@sunbird/core';

@Component({
  selector: 'app-resource-reorder',
  templateUrl: './resource-reorder.component.html',
  styleUrls: ['./resource-reorder.component.scss']
})
export class ResourceReorderComponent implements OnInit {
  unitSelected: string;
  @Input() collectionUnits;
  @Input() contentId;
  @Input() sessionContext;
  @Input() programContext;
  @Input() prevUnitSelect;
  @Output() moveEvent = new EventEmitter<any>();
  @ViewChild('modal') modal;
  showMoveButton = false;

  constructor(private collectionHierarchyService: CollectionHierarchyService, public toasterService: ToasterService,
              public programTelemetryService: ProgramTelemetryService, public userService: UserService,
              public configService: ConfigService) { }

  ngOnInit() {
  }

  moveResource() {
    this.collectionHierarchyService.addResourceToHierarchy(this.sessionContext.collection, this.unitSelected, this.contentId)
     .subscribe((data) => {
     this.collectionHierarchyService.removeResourceToHierarchy(this.sessionContext.collection, this.prevUnitSelect, this.contentId)
      .subscribe((res) => {
        this.toasterService.success('The Selected Resource is Successfully Moved');
        this.moveEvent.emit({
          action: 'afterMove',
          contentId: this.contentId,
          collection: {
            identifier: this.unitSelected
          }
        });
        this.modal.deny();
      });
    }, err => {
    });
  }

  onSelectBehaviour(e) {
    e.stopPropagation();
  }

  cancelMove() {
    this.moveEvent.emit({
      action: 'cancelMove',
      contentId: '',
      collection: {
        identifier: ''
      }
    });
  }
}
