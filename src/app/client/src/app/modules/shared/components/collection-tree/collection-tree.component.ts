/*
*
* Author: Sunil A S<sunils@ilimi.in>
*
*/

import {
  Component, OnInit, Input, ElementRef,
  ViewChild, AfterViewInit, OnChanges, Output, EventEmitter
} from '@angular/core';
import * as _ from 'lodash';
import { ICollectionTreeNodes, ICollectionTreeOptions, MimeTypeTofileType } from '../../interfaces';

@Component({
  selector: 'app-collection-tree',
  templateUrl: './collection-tree.component.html',
  styleUrls: ['./collection-tree.component.css']
})
export class CollectionTreeComponent implements OnInit, OnChanges {

  @Input() public nodes: ICollectionTreeNodes;
  @Input() public options: ICollectionTreeOptions;
  @Output() public contentSelect: EventEmitter<{id: string, title: string}> = new EventEmitter();

  private rootNode: any;
  public rootChildrens: any;

  ngOnInit() {
    this.initialize();
  }

  ngOnChanges() {
    this.initialize();
  }

  public onNodeClick(node: any) {
    if (!node.folder) {
      this.contentSelect.emit({ id: node.id, title: node.title });
    }
  }

  public onItemSelect(item: any) {
    if (!item.folder) {
      this.contentSelect.emit({ id: item.data.id, title: item.title });
    }
  }

  private initialize() {
    this.rootNode = this.createTreeModel();
    if (this.rootNode) {
      this.rootChildrens = this.rootNode.children;
      this.addNodeMeta();
    }
  }

  private createTreeModel() {
    if (!this.nodes) { return; }
    const model = new TreeModel();
    return model.parse(this.nodes.data);
  }

  private addNodeMeta() {
    if (!this.rootNode) { return; }
    this.rootNode.walk((node) => {
      node.fileType = MimeTypeTofileType[node.model.mimeType];
      node.id = node.model.identifier;
      node.title = node.model.name || 'Untitled File';
      if (node.children && node.children.length) {
        if (this.options.folderIcon) {
          node.icon = this.options.folderIcon;
        }
        node.folder = true;
      } else {
        if ( node.fileType === MimeTypeTofileType['application/vnd.ekstep.content-collection']) {
          node.folder = true;
        } else {
          node.folder = false;
        }
        node.icon = this.options.customFileIcon[node.fileType] || this.options.fileIcon;
      }
    });
  }
}
