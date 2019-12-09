import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() selectedAttributes;
  @Input() prevUnitSelect;
  @Output() afterMoveEvent = new EventEmitter<any>();

  constructor(private collectionHierarchyService: CollectionHierarchyService, public toasterService: ToasterService) { }

  ngOnInit() {
  }

  moveResource() {
    this.collectionHierarchyService.addResourceToHierarchy(this.selectedAttributes.collection, this.unitSelected, this.contentId)
     .subscribe((data) => {
     this.collectionHierarchyService.removeResourceToHierarchy(this.selectedAttributes.collection, this.prevUnitSelect, this.contentId)
      .subscribe((res) => {
        this.toasterService.success('The Selected Resource is Successfuly Moved');
        this.afterMoveEvent.emit({
          action: 'afterMove',
          contentId: this.contentId,
          unitIdentifier: this.unitSelected
        });
      });
    });
  }
}
