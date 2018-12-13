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
import { ResourceService, PlayContent } from '../../services/index';
// import {Subscription , Subject} from 'rxjs';
@Component({
  selector: 'app-collection-tree',
  templateUrl: './collection-tree.component.html',
  styleUrls: ['./collection-tree.component.css']
})
export class CollectionTreeComponent implements OnInit, OnChanges {

  @Input() public nodes: ICollectionTreeNodes;
  @Input() public options: ICollectionTreeOptions;
  @Output() public contentSelect: EventEmitter<{ id: string, title: string }> = new EventEmitter();
  @Input() contentStatus: any;
  @Input() nodeRoot: any;
  private rootNode: any;
  public rootChildrens: any;
  private iconColor = {
    '0': 'fancy-tree-grey',
    '1': 'fancy-tree-blue',
    '2': 'fancy-tree-green'
  };
  count: number;
  public subscription: any;
  public courseProgress: any;
  constructor(public player: PlayContent, public resourceService?: ResourceService) {
    this.resourceService = resourceService;
    this.player = player;
    this.subscription = this.player.subject;
    // this.subscription = this.contentService.subject;
    this.courseProgress = this.player.CourseProgressListner;
  }
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
    console.log(item);
    if (!item.folder) {
      console.log(typeof item.id, typeof item.title, 'this is the id  and titile node node node ');
      this.subscription.next({ id: item.id, title: item.title });
    }
  }
  public onContentCheckBoxClick(child) {
    this.count++;
    this.courseProgress.next({ content_id: child.id });
  }


  public onItemSelect2(child: any) {
    console.log(child.id, child.title, '///////////*\\\\\\\\\\');
    this.contentSelect.emit({ id: child.id, title: child.title });
  }


  private initialize() {
    this.rootNode = this.createTreeModel();
    if (this.rootNode) {
      this.rootChildrens = this.rootNode.children;
      this.nodeRoot = this.rootNode;
      console.log(this.rootNode, '***********this is my root node ******************//');
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
      // console.log(node , "***********this is the node we are waling on *******************");
      node.fileType = MimeTypeTofileType[node.model.mimeType];
      node.id = node.model.identifier;
      if (node.children && node.children.length) {
        if (this.options.folderIcon) {
          node.icon = this.options.folderIcon;
        }
        node.folder = true;
      } else {
        node.completed = false;
        if (node.fileType === MimeTypeTofileType['application/vnd.ekstep.content-collection']) {
          node.folder = true;
        } else {
          const indexOf = _.findIndex(this.contentStatus, {});
          if (this.contentStatus) {
            const content: any = _.find(this.contentStatus, { 'contentId': node.model.identifier });
            const status = (content && content.status) ? content.status.toString() : 0;
            node.iconColor = this.iconColor[status];
            if (status === '2') {
              this.count++;
              node.completed = true;
            }

          } else {
            node.iconColor = this.iconColor['0'];
          }
          node.folder = false;
        }
        node.icon = this.options.customFileIcon[node.fileType] || this.options.fileIcon;
        node.icon = `${node.icon} ${node.iconColor}`;
      }
      if (node.folder && !(node.children.length)) {
        node.title = node.model.name + '<strong> (' + this.resourceService.messages.stmsg.m0121 + ')</strong>';
        node.extraClasses = 'disabled';
      } else {
        node.title = node.model.name || 'Untitled File';
        node.extraClasses = '';
      }
    });
  }
}
