
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
  public enrolledCourseDetailsRendered: boolean ;
  private iconColor = {
    '0': 'fancy-tree-grey',
    '1': 'fancy-tree-blue',
    '2': 'fancy-tree-green'
  };
  public subscription: any;
  public courseProgress: any;
  constructor(public player: PlayContent, public resourceService?: ResourceService) {
    this.resourceService = resourceService;
    this.player = player;
    this.subscription = this.player.subject;
    // this.subscription = this.contentService.subject;
    this.courseProgress = this.player.CourseProgressListner;
    // this.enrolledCourseDetailsRendered = this.player.EnrolledCourseDetailsRendered;
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
    if (!item.folder) {
      this.subscription.next({ id: item.id, title: item.title });
    }
  }
  public onContentCheckBoxClick(child) {
    this.courseProgress.next({ content_id: child.id });
  }


  public onItemSelect2(child: any) {
    this.contentSelect.emit({ id: child.id, title: child.title });
  }


  private initialize() {
    this.rootNode = this.createTreeModel();
    if (this.rootNode) {
      this.rootChildrens = this.rootNode.children;
      this.nodeRoot = this.rootNode;
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
