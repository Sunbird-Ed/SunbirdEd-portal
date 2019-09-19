/*
*
* Author: Sunil A S<sunils@ilimi.in>
*
*/

import { Component, OnInit, Input, OnChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import * as _ from 'lodash-es';
import { ICollectionTreeNodes, ICollectionTreeOptions, MimeTypeTofileType } from '@sunbird/shared';
import { ResourceService } from '@sunbird/shared';
import { OrgDetailsService, UserService } from '@sunbird/core';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as TreeModel from 'tree-model';
import { environment } from '@sunbird/environment';
import { Router } from '@angular/router';
import { ConnectionService } from '@sunbird/offline';

@Component({
  selector: 'app-collection-tree',
  templateUrl: './collection-tree.component.html'
})
export class CollectionTreeComponent implements OnInit, OnChanges, OnDestroy {

  @Input() public nodes: ICollectionTreeNodes;
  @Input() public options: ICollectionTreeOptions;
  @Output() public contentSelect: EventEmitter<{id: string, title: string}> = new EventEmitter();
  @Input() contentStatus: any;
  private rootNode: any;
  private selectLanguage: string;
  private contentComingSoonDetails: any;
  public rootChildrens: any;
  private languageSubscription: Subscription;
  private iconColor = {
    '0': 'fancy-tree-black',
    '1': 'fancy-tree-blue',
    '2': 'fancy-tree-green'
  };
  public commingSoonMessage: string;
  public unsubscribe$ = new Subject<void>();
  isOffline: boolean = environment.isOffline;
  isConnected = navigator.onLine;
  status = this.isConnected ? 'ONLINE' : 'OFFLINE';

  constructor(public orgDetailsService: OrgDetailsService,
    private userService: UserService, public router: Router, private connectionService: ConnectionService,
    public resourceService?: ResourceService) {
    this.resourceService = resourceService;
    this.orgDetailsService = orgDetailsService;
  }
  ngOnInit() {
    this.connectionService.monitor().pipe(
      takeUntil(this.unsubscribe$))
      .subscribe(isConnected => {
        this.isConnected = isConnected;
        this.status = isConnected ? 'ONLINE' : 'OFFLINE';
        this.initialize();
      });
    /*
    * rootOrgId is required to select the custom comming soon message from systemsettings
    */
    let rootOrgId: string;
    const contentLevelChannel = _.get(this.nodes, 'data.channel');
    if (!rootOrgId) {
      if (this.userService.loggedIn) {
        rootOrgId = this.userService.rootOrgId;
      } else {
        rootOrgId = this.orgDetailsService.getRootOrgId;
      }
    }
    /*
    * fetching comming soon message at org level to show if content not exists in any of the folder
    */
    this.orgDetailsService.getCommingSoonMessage([contentLevelChannel, rootOrgId]).pipe(takeUntil(this.unsubscribe$)).subscribe(
      (apiResponse) => {
        this.contentComingSoonDetails = apiResponse;
      }
    );
    this.languageSubscription = this.resourceService.languageSelected$.pipe(takeUntil(this.unsubscribe$)).subscribe(item => {
      this.selectLanguage = item.value;
      this.initialize();
    });
  }

  ngOnChanges() {
    if (this.contentComingSoonDetails) {
      this.initialize();
    }
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
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
        if (this.isOffline && node.fileType === 'youtube' && this.status === 'OFFLINE') {
          node.title = `${node.model.name} <div class='sb-label sb-label-table sb-label-warning-0'>
          ${this.resourceService.frmelmnts.lbl.onlineOnly}</div>` ||
            `Untitled File <div class='sb-label sb-label-table sb-label-warning-0'>${this.resourceService.frmelmnts.lbl.onlineOnly}</div>`;
          node.extraClasses = 'disabled';
        } else {
          node.title = node.model.name || 'Untitled File';
          node.extraClasses = '';
        }
      }
    });
  }

  private setCommingSoonMessage (node) {
    this.commingSoonMessage = '';
    const nodes = node.getPath();
    const altMessages = [];
    nodes.forEach((eachnode, index) => {
      if (_.has(eachnode, 'model.altMsg') && eachnode.model.altMsg.length) {
        altMessages.push(eachnode.model.altMsg[0]);
      }
    });
    if (altMessages.length > 0) {
      this.commingSoonMessage = this.getMessageFormTranslations(altMessages[altMessages.length - 1]);
    } else if (this.contentComingSoonDetails) {
      this.commingSoonMessage = this.getMessageFormTranslations(this.contentComingSoonDetails);
    }
    if (!this.commingSoonMessage) {
      this.commingSoonMessage  = this.resourceService.messages.stmsg.m0121;
    }
  }

  private getMessageFormTranslations (commingsoonobj) {
    try {
      const translations = JSON.parse(commingsoonobj.translations);
      if (translations[this.selectLanguage]) {
        return translations[this.selectLanguage];
      } else {
        return translations['en'] || commingsoonobj.value;
      }
    } catch (e) {
      return commingsoonobj.value;
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
