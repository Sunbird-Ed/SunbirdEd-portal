/*
*
* Author: Sunil A S<sunils@ilimi.in>
*
*/

import {
  Component, OnInit, Input, ElementRef,
  ViewChild, AfterViewInit, OnChanges
} from '@angular/core';
import * as _ from 'lodash';

/*
*
* nodes structure =  {
  data: {
    title: 'node 1',
    children: [{
      'title': 'node 1.1',
      'children': []
    }]
  }
}
*
*
* sample options = {
    folderIcon: 'fa fa-folder-o fa-lg', //font awesome icons
    fileIcon: 'fa fa-file-o fa-lg', //default
    customFileIcon: {
      'video': 'fa fa-file-video-o fa-lg',
      'pdf': 'fa fa-file-pdf-o fa-lg',
      'youtube': 'fa fa-youtube fa-lg',
      'H5P': 'fa fa-html5 fa-lg',
      'audio': 'fa fa-file-audio-o fa-lg',
      'ECML': 'fa fa-code-o fa-lg',
      'HTML': 'fa fa-html5-o fa-lg',
      'collection': 'fa fa-file-archive-o fa-lg',
      'epub': '',
      'doc': ''
    }
  };
*
*/


enum fileType {
  'application/vnd.ekstep.content-collection' = 'collection',
  'video/x-youtube' = 'youtube',
  'application/pdf' = 'pdf',
  'application/epub' = 'epub',
  'application/vnd.ekstep.ecml-archive' = 'ECML',
  'application/vnd.ekstep.ecml-archive+zip' = 'ECML',
  'application/vnd.ekstep.html-archive+zip' = 'HTML',
  'application/vnd.ekstep.content-archive+zip' = 'collection',
  'application/vnd.ekstep.content-collection+zip' = 'collection',
  'application/vnd.ekstep.h5p-archive+zip' = 'H5P',
  // 'application/octet-stream' = '',
  'application/msword' = 'doc',
  'image/jpeg' = 'image',
  'image/jpg' = 'image',
  'image/png' = 'image',
  'image/tiff' = 'image',
  'image/bmp' = 'image',
  'image/gif' = 'image',
  'image/svg+xml' = 'image',
  'video/avi' = 'video',
  'video/mpeg' = 'video',
  'video/quicktime' = 'video',
  'video/3gpp' = 'video',
  'video/mp4' = 'video',
  'video/ogg' = 'video',
  'video/webm' = 'video',
  'audio/mp3' = 'audio',
  'audio/mp4' = 'audio',
  'audio/mpeg' = 'audio',
  'audio/ogg' = 'audio',
  'audio/webm' = 'audio',
  'audio/x-wav' = 'audio',
  'audio/wa' = 'audio'
}

@Component({
  selector: 'app-collection-tree',
  templateUrl: './collection-tree.component.html',
  styleUrls: ['./collection-tree.component.css']
})
export class CollectionTreeComponent implements OnInit, OnChanges {

  @Input() public nodes;
  @Input() public options;
  private rootNode: any;
  public rootChildrens: any;

  ngOnInit() {
    this.initialize();
  }

  ngOnChanges() {
    this.initialize();
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
      node.fileType = fileType[node.model.mimeType];
      node.id = node.model.identifier;
      node.title = node.model.name || 'Untitled File';
      if (node.children && node.children.length) {
        if (this.options.folderIcon) {
          node.icon = this.options.folderIcon;
        } // else default icon is provided
        node.folder = true;
      } else {
        node.icon = this.options.customFileIcon[node.fileType] || this.options.fileIcon;
        node.folder = false;
      }
    });
  }
}
