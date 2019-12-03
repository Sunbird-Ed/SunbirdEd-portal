import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-recursive-tree',
  templateUrl: './recursive-tree.component.html',
  styleUrls: ['./recursive-tree.component.scss']
})
export class RecursiveTreeComponent implements OnInit {

  @Input() collectionUnits;
  @Input() selectedChapter;
  @Output() emitselectedChapter = new EventEmitter<any>();
  @Output() resourceTemplate = new EventEmitter<any>();
  public showModal = false;
  public unitIdentifier;
  constructor() { }

  ngOnInit() {
  }

  showResourceTemplateEvent(event) {
    this.resourceTemplate.emit({
      action: event.action,
      showPopup: event.action === 'add' ? true : false,
      unitIdentifier: event.unitIdentifier,
      contentId: event.contentId
    });
  }

  crateResource(e, unitIdentifier) {
    e.stopPropagation();
    this.showModal = true;
    this.resourceTemplate.emit({
      action: 'add',
      showPopup: this.showModal,
      unitIdentifier: unitIdentifier
    });
  }

  deleteResource(e, contentId, unitIdentifier) {
    this.resourceTemplate.emit({
      action: 'delete',
      contentId: contentId,
      unitIdentifier: unitIdentifier
    });
  }
}
