import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ConfigService, ToasterService } from '@sunbird/shared';
import { CollectionHierarchyService } from '../../services/collection-hierarchy/collection-hierarchy.service';

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
  @Input() prevUnitSelect;
  @Output() moveEvent = new EventEmitter<any>();
  @ViewChild('modal') modal;

  constructor(private collectionHierarchyService: CollectionHierarchyService, public toasterService: ToasterService) { }

  ngOnInit() {
  }

  moveResource() {
    this.collectionHierarchyService.addResourceToHierarchy(this.sessionContext.collection, this.unitSelected, this.contentId)
     .subscribe((data) => {
     this.collectionHierarchyService.removeResourceToHierarchy(this.sessionContext.collection, this.prevUnitSelect, this.contentId)
      .subscribe((res) => {
        this.toasterService.success('The Selected Resource is Successfuly Moved');
        this.moveEvent.emit({
          action: 'afterMove',
          contentId: this.contentId,
          collection: {
            identifier: this.unitSelected
          }
        });
        this.modal.deny();
      });
    });
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
