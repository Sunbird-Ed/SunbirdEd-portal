import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-recursive-tree',
  templateUrl: './recursive-tree.component.html',
  styleUrls: ['./recursive-tree.component.scss']
})
export class RecursiveTreeComponent implements OnInit {

  @Input() collectionUnits;
  @Input() selectedChapter;
  @Output() emitSelectedNode = new EventEmitter<any>();
  @Output() nodeMeta = new EventEmitter<any>();
  public showModal = false;
  public unitIdentifier;
  constructor() { }

  ngOnInit() {
    console.log(this.collectionUnits);
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
