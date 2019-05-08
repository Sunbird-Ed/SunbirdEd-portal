/*
*
* Author: Sunil A S<sunils@ilimi.in>
*
*/

import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash-es';
import { ICollectionTreeNodes, ICollectionTreeOptions, MimeTypeTofileType, IUserData } from '@sunbird/shared';
import { ResourceService } from '@sunbird/shared';
import { OrgDetailsService, UserService } from '@sunbird/core';
import { Subscription } from 'rxjs';
import * as TreeModel from 'tree-model';
@Component({
  selector: 'app-collection-tree',
  templateUrl: './collection-tree.component.html'
})
export class CollectionTreeComponent implements OnInit, OnChanges {

  @Input() public nodes: ICollectionTreeNodes;
  @Input() public options: ICollectionTreeOptions;
  @Output() public contentSelect: EventEmitter<{id: string, title: string}> = new EventEmitter();
  @Input() contentStatus: any;
  private rootNode: any;
  private rootOrgId: any;
  private selectLanguage: string;
  private contentComingSoonObj: any;
  private cmngSoonApiInprogress = false;
  public rootChildrens: any;
  private languageSubscription: Subscription;
  private iconColor = {
    '0': 'fancy-tree-black',
    '1': 'fancy-tree-blue',
    '2': 'fancy-tree-green'
  };
  public commingSoonMessage: string;
  constructor(public orgDetailsService: OrgDetailsService,
    private userService: UserService, public resourceService?: ResourceService) {
    this.resourceService = resourceService;
    this.orgDetailsService = orgDetailsService;
  }
  ngOnInit() {
    /*
    * this.rootOrgId is required to select the custom comming soon messafe from systemsettings
    */
    if (this.userService.loggedIn) {
      this.rootOrgId = this.userService.rootOrgId;
    } else {
      this.orgDetailsService.orgDetails$.subscribe(item => {
        if (item.orgDetails && item.orgDetails.rootOrgId) {
          this.rootOrgId = item.orgDetails.rootOrgId;
        }
      });
    }
    this.languageSubscription = this.resourceService.languageSelected$.subscribe(item => {
      this.selectLanguage = item.value;
      this.initialize();
    });
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
    /*
    * fetching comming soon message at org level to show if content not exists in any of the folder
    */
    if (!this.cmngSoonApiInprogress) {
      this.cmngSoonApiInprogress = true;
      this.orgDetailsService.getCommingSoonMessage().subscribe(
        (apiResponse) => {
          this.cmngSoonApiInprogress = false;
          if (apiResponse.value && apiResponse.value) {
            this.contentComingSoonObj = _.find(JSON.parse(apiResponse.value), {rootOrgId: this.rootOrgId});
          }
          this.rootNode = this.createTreeModel();
          if (this.rootNode) {
            this.rootChildrens = this.rootNode.children;
            this.addNodeMeta();
          }
        }
      );
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
        if ( node.fileType === MimeTypeTofileType['application/vnd.ekstep.content-collection']) {
          node.folder = true;
        } else {
          const indexOf = _.findIndex(this.contentStatus, { });
          if (this.contentStatus) {
            const content: any = _.find(this.contentStatus, { 'contentId': node.model.identifier});
            const status = (content && content.status) ? content.status.toString() : 0;
            node.iconColor = this.iconColor[status];
          } else {
            node.iconColor = this.iconColor['0'];
          }
          node.folder = false;
        }
        node.icon = this.options.customFileIcon[node.fileType] || this.options.fileIcon;
        node.icon = `${node.icon} ${node.iconColor}`;
      }
      if (node.folder && !(node.children.length)) {
        this.setCommingSoonMessage(node);
        node.title = node.model.name + '<span> (' + this.commingSoonMessage + ')</span>';
        node.extraClasses = 'disabled';
      } else {
        node.title = node.model.name || 'Untitled File';
        node.extraClasses = '';
      }
    });
  }

  private setCommingSoonMessage (node) {
    if (node.model && node.model.altMsg && node.model.altMsg.length) {
      this.commingSoonMessage = this.getMessageFormTranslations(node.model.altMsg[0].translations);
    } else if (node.model && node.parent && node.parent.model.altMsg && node.parent.model.altMsg.length) {
      this.commingSoonMessage = this.getMessageFormTranslations(node.model.parent.model.altMsg[0].translations);
    } else if (this.contentComingSoonObj) {
      this.commingSoonMessage = this.getMessageFormTranslations(this.contentComingSoonObj.translations);
    } else {
      this.commingSoonMessage  = this.resourceService.messages.stmsg.m0121;
    }
  }

  private getMessageFormTranslations (translations) {
    translations = JSON.parse(translations);
    if (translations[this.selectLanguage]) {
      return translations[this.selectLanguage];
    } else {
      return translations['en'];
    }
  }
}
