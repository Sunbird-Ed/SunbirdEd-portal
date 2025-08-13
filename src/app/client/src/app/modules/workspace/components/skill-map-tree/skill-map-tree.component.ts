import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, Input, Output, EventEmitter, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';
import { ResourceService } from '@sunbird/shared';
import { SkillMapNode } from '../skill-map-editor/skill-map-editor.component';

declare var $: any;

export interface SkillMapTreeNode {
  id: string;
  title: string;
  tooltip: string;
  folder: boolean;
  children: SkillMapTreeNode[];
  root: boolean;
  icon: string | boolean;
  metadata: any;
}

@Component({
  selector: 'app-skill-map-tree',
  templateUrl: './skill-map-tree.component.html',
  styleUrls: ['./skill-map-tree.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SkillMapTreeComponent implements OnInit, AfterViewInit, OnDestroy {
  
  @ViewChild('skillMapTree') public tree: ElementRef;
  @Input() public skillMapData: any;
  @Input() public labelConfig: any = {};
  @Input() public config: any = {
    mode: 'edit',
    maxDepth: 4, // Maximum depth for skill map tree structure
    objectType: 'SkillMap'
  };
  @Output() public treeEventEmitter: EventEmitter<any> = new EventEmitter();
  public visibility: any = {};
  public rootNode: SkillMapTreeNode[] = [];
  public unsubscribe$ = new Subject<void>();
  
  constructor(
    private cdr: ChangeDetectorRef,
    public resourceService: ResourceService
  ) { }

  ngOnInit() {
    this.initialize();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.renderTree();
    }, 100);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  initialize() {
    if (this.skillMapData && this.skillMapData.rootNode) {
      this.buildRootNode();
    }
  }

  buildRootNode() {
    const data = this.skillMapData.rootNode;
    const treeData = this.buildTree(data);
    
    // Use consistent ID for root node
    const rootId = data.id || 'root';
    
    // Use "Untitled" as fallback for root node title
    const rootTitle = data.name || this.resourceService?.frmelmnts?.lbl?.untitled || 'Untitled';
    
    this.rootNode = [{
      id: rootId,
      title: rootTitle,
      tooltip: rootTitle,
      folder: true,
      children: treeData,
      root: true,
      icon: false, // Remove icon
      metadata: {
        name: rootTitle, // Ensure we always have a name
        code: data.code || '',
        description: data.description || '',
        level: 0,
        id: rootId // Ensure we have a consistent ID for root identification
      }
    }];
  }

  buildTree(data: SkillMapNode, tree?: SkillMapTreeNode[], level?: number): SkillMapTreeNode[] {
    tree = tree || [];
    level = level || 1;
    
    if (data.children && data.children.length > 0) {
      data.children.forEach((child) => {
        const childTree: SkillMapTreeNode[] = [];
        const treeNode: SkillMapTreeNode = {
          id: child.id || uuidv4(),
          title: child.name || this.resourceService?.frmelmnts?.lbl?.untitled,
          tooltip: child.name || this.resourceService?.frmelmnts?.lbl?.untitled,
          folder: true,
          children: childTree,
          root: false,
          icon: false, // Remove icon
          metadata: {
            name: child.name || this.resourceService?.frmelmnts?.lbl?.untitled, // Ensure we always have a name
            code: child.code || '',
            description: child.description || '',
            level: level,
            parentId: data.id,
            id: child.id // Ensure each child has its own ID
          }
        };
        
        tree.push(treeNode);
        
        if (child.children && child.children.length > 0) {
          this.buildTree(child, childTree, level + 1);
        }
      });
    }
    
    return tree;
  }

  renderTree() {
    if (!this.tree || !this.tree.nativeElement) {
      return;
    }

    const options = this.getTreeConfig();
    $(this.tree.nativeElement).fancytree(options);
    
    // Add collection editor specific classes to match their exact structure
    $(this.tree.nativeElement).addClass('ui-fancytree');
    $(this.tree.nativeElement).addClass('sb-collectionTree-fancyTreelist');
    
    // CRITICAL: Remove any ::before pseudo-elements that might add unwanted lines
    $(this.tree.nativeElement).css({
      'position': 'relative'
    });
    
    // Force remove all pseudo-elements immediately
    const $treeElement = $(this.tree.nativeElement);
    $treeElement.find('.ui-fancytree, .ui-fancytree ul, .ui-fancytree li').each(function() {
      $(this).css({
        'position': 'relative'
      });
    });
    
    // Set initial state
    setTimeout(() => {
      const tree = $(this.tree.nativeElement).fancytree("getTree");
      const rootFirstChild = tree.getFirstChild();
      if (rootFirstChild) {
        rootFirstChild.setExpanded(true);
        rootFirstChild.setActive(true);
        this.updateNodeActions(rootFirstChild);
        
        // Additional CSS class targeting for root node
        const $rootElement = $(rootFirstChild.li);
        $rootElement.addClass('skill-map-root-node');
      }
      
      // Force spacing removal on initial render - apply collection editor margin reset
      this.forceSpacingRemoval();
      
      // Additional cleanup of pseudo-elements
      this.removePseudoElements();
    }, 100);
  }

  getTreeConfig() {
    // Match collection editor FancyTree configuration exactly
    const options: any = {
      extensions: ['glyph', 'dnd5'],
      clickFolderMode: 3,
      source: this.rootNode,
      escapeTitles: true,
      glyph: {
        preset: 'awesome4',
        map: {
          folder: 'icon folder sb-fancyTree-icon',
          folderOpen: 'icon folder outline sb-fancyTree-icon'
        }
      },
      dnd5: {
        autoExpandMS: 400,
        preventVoidMoves: true, // Prevent dropping nodes 'before self', etc.
        preventRecursion: true, // Prevent dropping nodes on own descendants
        dragStart: (node, data) => {
          const draggable = this.config.mode === 'edit' ? true : false;
          return draggable;
        },
        dragEnter: (node, data) => {
          return true;
        },
        dragDrop: (node, data) => {
          return this.handleDragDrop(node, data);
        },
        filter: {
          autoApply: true,
          autoExpand: false,
          counter: true,
          fuzzy: false,
          hideExpandedCounter: true,
          hideExpanders: false,
          highlight: true,
          leavesOnly: false,
          nodata: true,
          mode: 'dimm'
        }
      },
      init: (event, data) => { },
      click: (event, data): boolean => {
        this.tree.nativeElement.click();
        return true;
      },
      activate: (event, data) => {
        const node = data.node;
        this.updateNodeActions(node);
        this.treeEventEmitter.emit({
          type: 'nodeActivate',
          data: node
        });
        setTimeout(() => {
          this.attachContextMenu(node);
        }, 10);
      },
      renderNode: (event, data) => {
        const node = data.node;
        const $nodeSpan = $(node.span);

        // Check if span of node already rendered
        if (!$nodeSpan.data('rendered')) {
          this.attachContextMenu(node);
          // Mark span as rendered
          $nodeSpan.data('rendered', true);
        }
      }
    };
    return options;
  }

  updateNodeActions(node: any) {
    this.visibility = {};
    
    if (!node) {
      this.visibility.addChild = false;
      this.visibility.addSibling = false;
    } else {
      const nodeLevel = node.getLevel() - 1;
      
      // Add child: can add if it's a folder and not at max depth
      this.visibility.addChild = (nodeLevel < this.config.maxDepth);
      
      // Add sibling: can add if it's not root and parent is not at max depth
      this.visibility.addSibling = !node.data.root && nodeLevel < this.config.maxDepth;
    }
    
    this.cdr.detectChanges();
  }

  attachContextMenu(node: any) {
    const $nodeSpan = $(node.span);
    
    if (this.config.mode !== 'edit') {
      return;
    }

    // Check if context menu already attached
    if ($nodeSpan.find('.context-menu').length > 0) {
      return;
    }

    const menuTemplate = this.getContextMenuTemplate(node);
    const contextMenuElement = $(menuTemplate);
    
    // Append the context menu to the node span
    $nodeSpan.append(contextMenuElement);
    
    // Apply proper styling and visibility
    $nodeSpan.css('position', 'relative');
    
    // Show context menu on node hover with fade-in effect
    $nodeSpan.hover(
      // Mouse enter
      () => {
        contextMenuElement.css('opacity', '1');
      },
      // Mouse leave
      () => {
        contextMenuElement.css('opacity', '0');
        // Also hide any open dropdown when hovering out
        const dropdown = $nodeSpan.find('.context-menu-dropdown');
        dropdown.removeClass('visible').addClass('hidden');
      }
    );
    
    // Handle dropdown click
    const dropdownTrigger = $nodeSpan.find('.context-menu-trigger');
    dropdownTrigger.on('click', (event) => {
      event.stopPropagation();
      
      // Close any other open dropdowns
      $('.context-menu-dropdown.visible').removeClass('visible').addClass('hidden');
      
      // Toggle this dropdown
      const dropdown = $nodeSpan.find('.context-menu-dropdown');
      setTimeout(() => {
        dropdown.removeClass('hidden').addClass('visible');
        
        // Add click handlers to menu items
        dropdown.find('.menu-item').off('click').on('click', (e) => {
          e.stopPropagation();
          const action = $(e.currentTarget).data('action');
          this.handleContextMenuAction(action, node);
          dropdown.removeClass('visible').addClass('hidden');
        });
        
        // Add hover effects
        dropdown.find('.menu-item').hover(
          function() {
            $(this).css('background-color', '#f5f5f5');
          },
          function() {
            $(this).css('background-color', 'white');
          }
        );
      }, 10);
    });
    
    // Close dropdown when clicking outside
    $(document).on('click', () => {
      $nodeSpan.find('.context-menu-dropdown').removeClass('visible').addClass('hidden');
    });
  }

  getContextMenuTemplate(node: any): string {
    if (node.data.root) {
      return `
        <span class="context-menu ui dropdown sb-dotted-dropdown">
          <span class="context-menu-trigger p-0 w-auto">
            <i class="icon ellipsis vertical sb-color-black"></i>
          </span>
          <div class="context-menu-dropdown menu transition hidden">
            <div class="menu-item item" data-action="addChild">
              <i class="icon plus"></i>${this.resourceService?.frmelmnts?.lbl?.addChildMenu || 'Add Child'}
            </div>
          </div>
        </span>
      `;
    } else {
      return `
        <span class="context-menu ui dropdown sb-dotted-dropdown">
          <span class="context-menu-trigger p-0 w-auto">
            <i class="icon ellipsis vertical sb-color-black"></i>
          </span>
          <div class="context-menu-dropdown menu transition hidden">
            <div class="menu-item item" data-action="addSibling">
              <i class="icon plus"></i>${this.resourceService?.frmelmnts?.lbl?.addSiblingMenu || 'Add Sibling'}
            </div>
            <div class="menu-item item" data-action="addChild">
              <i class="icon plus"></i>${this.resourceService?.frmelmnts?.lbl?.addChildMenu || 'Add Child'}
            </div>
            <div class="menu-item item" data-action="delete">
              <i class="icon trash"></i>${this.resourceService?.frmelmnts?.lbl?.deleteMenu || 'Delete'}
            </div>
          </div>
        </span>
      `;
    }
  }

  handleContextMenuAction(action: string, node: any) {
    switch (action) {
      case 'addChild':
        this.addChild(node);
        break;
      case 'addSibling':
        this.addSibling(node);
        break;
      case 'delete':
        this.confirmAndDeleteNode(node);
        break;
    }
  }

  confirmAndDeleteNode(node: any) {
    if (node.data.root) {
      alert(this.resourceService?.frmelmnts?.lbl?.cannotDeleteRootNode || 'Cannot delete the root node');
      return;
    }
    
    // Emit delete request event instead of directly deleting
    // This allows parent component to handle API call first
    this.treeEventEmitter.emit({
      type: 'deleteRequest',
      data: node
    });
  }

  // Handle drag and drop operations (like collection editor)
  handleDragDrop(node: any, data: any): boolean {
    // Prevent dropping on root node in certain conditions
    if ((data.hitMode === 'before' || data.hitMode === 'after' || data.hitMode === 'over') && data.node.data.root) {
      return false;
    }
    
    // Check max depth constraints
    if (this.config.maxDepth) {
      const currentLevel = node.getLevel();
      const targetLevel = data.node.getLevel();
      
      // Prevent exceeding max depth
      if (targetLevel >= this.config.maxDepth) {
        return false;
      }
    }
    
    // Allow the drop operation
    data.otherNode.moveTo(node, data.hitMode);
    
    // Emit event for external handling
    this.treeEventEmitter.emit({
      type: 'nodeMoved',
      data: {
        movedNode: data.otherNode,
        targetNode: node,
        hitMode: data.hitMode
      }
    });
    
    return true;
  }

  // Collection editor approach - simplified spacing control
  private forceSpacingRemoval(): void {
    setTimeout(() => {
      const $treeElement = $(this.tree.nativeElement);
      
      // Apply collection editor specific CSS classes and spacing rules
      $treeElement.find('ul').css({
        'padding': '0 !important',
        'margin': '0 0 1px 0 !important',
        'list-style': 'none !important'
      });
      
      $treeElement.find('li').css({
        'padding': '0 !important',
        'margin': '0 0 1px 0 !important',
        'list-style': 'none !important'
      });
      
      // Collection editor specific ul > li > span:first-child padding
      $treeElement.find('ul > li > span:first-child').css({
        'padding': '15px 33px !important'
      });
      
      // Collection editor nested ul padding override
      $treeElement.find('ul.fancytree-container > li > ul').css({
        'padding-left': '0px !important'
      });
      
      // Key collection editor margin fix
      $treeElement.find('.ui-fancytree, .ui-fancytree ul').css({
        'margin': '0 0 0 0.625rem !important'
      });
      
    }, 10);
  }

  // Method to remove unwanted pseudo-elements that create lines
  private removePseudoElements(): void {
    setTimeout(() => {
      const $treeElement = $(this.tree.nativeElement);
      
      // Add CSS to override any pseudo-elements
      const style = document.createElement('style');
      style.textContent = `
        .skill-map-fancytree .ui-fancytree::before,
        .skill-map-fancytree .ui-fancytree::after,
        .skill-map-fancytree .ui-fancytree ul::before,
        .skill-map-fancytree .ui-fancytree ul::after,
        .skill-map-fancytree .ui-fancytree li::before,
        .skill-map-fancytree .ui-fancytree li::after,
        .skill-map-fancytree .fancytree-container::before,
        .skill-map-fancytree .fancytree-container::after {
          display: none !important;
          content: none !important;
          background: none !important;
          border: none !important;
          position: static !important;
        }
      `;
      
      // Add the style to the document head if not already present
      if (!document.getElementById('fancytree-pseudo-fix')) {
        style.id = 'fancytree-pseudo-fix';
        document.head.appendChild(style);
      }
    }, 50);
  }

  // Helper method to get dynamic node title
  private getNodeTitle(): string {
    // Always default to 'Untitled' for new nodes
    return this.resourceService?.frmelmnts?.lbl?.untitled || 'Untitled';
  }

  // Method to update the current active node's title using applyPatch (like collection editor)
  public updateActiveNodeTitle(newTitle: string): void {
    const tree = $(this.tree.nativeElement).fancytree("getTree");
    const activeNode = tree.getActiveNode();
    
    if (activeNode) {
      let title = newTitle && newTitle.trim() ? newTitle.trim() : this.resourceService?.frmelmnts?.lbl?.untitled || 'Untitled';
      
      // Remove special characters like in collection editor
      title = this.removeSpecialChars(title);
      
      // Use applyPatch like in collection editor - this is more reliable
      activeNode.applyPatch({ title }).done(() => {
        // Update the metadata only after successful patch
        if (activeNode.data.metadata) {
          activeNode.data.metadata.name = title;
        }
      });
    }
  }

  // Stable highlighting method - exactly like collection editor  
  public highlightNode(nodeId: string, action: 'add' | 'remove'): void {
    try {
      const tree = $(this.tree.nativeElement).fancytree("getTree");
      if (!tree) return;
      
      const node = tree.getNodeByKey(nodeId);
      if (!node || !node.span) return;
      
      if (action === 'add') {
        // Use the collection editor's exact approach
        if (node.span.childNodes && node.span.childNodes.length > 2) {
          if (node.span.childNodes[1] && node.span.childNodes[1].classList) {
            node.span.childNodes[1].classList.add('highlightNode');
          }
          if (node.span.childNodes[2] && node.span.childNodes[2].classList) {
            node.span.childNodes[2].classList.add('highlightNode');
          }
        }
        // Fallback: add to title directly if childNodes approach doesn't work
        const titleElement = $(node.span).find('.fancytree-title')[0];
        if (titleElement && titleElement.classList) {
          titleElement.classList.add('highlightNode');
        }
      } else if (action === 'remove') {
        // Remove highlighting
        if (node.span.childNodes && node.span.childNodes.length > 2) {
          if (node.span.childNodes[1] && node.span.childNodes[1].classList) {
            node.span.childNodes[1].classList.remove('highlightNode');
          }
          if (node.span.childNodes[2] && node.span.childNodes[2].classList) {
            node.span.childNodes[2].classList.remove('highlightNode');
          }
        }
        // Fallback: remove from title directly
        const titleElement = $(node.span).find('.fancytree-title')[0];
        if (titleElement && titleElement.classList) {
          titleElement.classList.remove('highlightNode');
        }
      }
    } catch (error) {
      console.warn('Error in highlightNode:', error, nodeId, action);
    }
  }

  // Stable validation method - only validate when explicitly called
  public validateAndHighlightNodes(validationCallback?: (nodeId: string) => boolean): { hasErrors: boolean; errorNodes: string[] } {
    const errorNodes: string[] = [];
    
    try {
      const tree = $(this.tree.nativeElement).fancytree("getTree");
      
      if (!tree) {
        console.warn('Tree not available for validation');
        return { hasErrors: false, errorNodes: [] };
      }
      
      // First, clear all existing highlights
      tree.visit((node) => {
        if (node.key) {
          this.highlightNode(node.key, 'remove');
        }
      });
      
      // Then validate each node and highlight errors
      tree.visit((node) => {
        if (node.key && validationCallback) {
          const hasValidationError = !validationCallback(node.key);
          
          if (hasValidationError) {
            this.highlightNode(node.key, 'add');
            errorNodes.push(node.key);
          }
        }
      });
      
      console.log('Validation complete. Error nodes:', errorNodes);
      
    } catch (error) {
      console.error('Error during validation:', error);
    }
    
    return {
      hasErrors: errorNodes.length > 0,
      errorNodes: errorNodes
    };
  }

  // Method to clear all validation highlights
  public clearAllHighlights(): void {
    try {
      const tree = $(this.tree.nativeElement).fancytree("getTree");
      if (tree) {
        tree.visit((node) => {
          if (node.key) {
            this.highlightNode(node.key, 'remove');
          }
        });
      }
    } catch (error) {
      console.warn('Error clearing highlights:', error);
    }
  }

  // Method to get a node by its ID - using stable FancyTree API
  public getNodeById(nodeId: string): any {
    const tree = $(this.tree.nativeElement).fancytree("getTree");
    return tree ? tree.getNodeByKey(nodeId) : null;
  }

  // Method to update a specific node's title to reflect validation state
  public updateNodeTitle(nodeId: string, title: string, hasError?: boolean): void {
    try {
      const node = this.getNodeById(nodeId);
      if (node) {
        node.setTitle(title);
        // Optionally add error class to the node
        if (hasError !== undefined) {
          const $nodeElement = $(node.li);
          if (hasError) {
            $nodeElement.addClass('validation-error');
          } else {
            $nodeElement.removeClass('validation-error');
          }
        }
      }
    } catch (error) {
      console.warn('Error updating node title:', error);
    }
  }

  // Helper method to remove special characters (from collection editor)
  private removeSpecialChars(text: string): string {
    if (text) {
      const iChars = "!`~@#$^*+=[]\\\'{}|\"<>%/";
      for (let i = 0; i < text.length; i++) {
        if (iChars.indexOf(text.charAt(i)) !== -1) {
          text = text.replace(text.charAt(i), '');
        }
      }
    }
    return text;
  }

  addChild(parentNode?: any) {
    const tree = $(this.tree.nativeElement).fancytree("getTree");
    const selectedNode = parentNode || tree.getActiveNode();
    
    if (!selectedNode) {
      return;
    }

    const nodeLevel = selectedNode.getLevel();
    if (nodeLevel >= this.config.maxDepth) {
      return;
    }

    const uniqueId = uuidv4();
    const nodeTitle = this.getNodeTitle();
    
    const newNodeData: SkillMapTreeNode = {
      id: uniqueId,
      title: nodeTitle,
      tooltip: nodeTitle,
      folder: true,
      children: [],
      root: false,
      icon: false, // Remove icon
      metadata: {
        name: nodeTitle,
        code: '', // No default code - user must provide
        description: '', // No default description - user can provide if needed
        level: nodeLevel,
        parentId: selectedNode.data.id,
        id: uniqueId // Ensure metadata has the same ID
      }
    };

    const newNode = selectedNode.addChildren(newNodeData);
    newNode.setActive();
    selectedNode.setExpanded(true);
    
    this.updateNodeActions(newNode);
    
    // Force spacing removal after adding child to eliminate gaps
    this.forceSpacingRemoval();
    
    this.treeEventEmitter.emit({
      type: 'nodeAdded',
      data: newNode,
      createType: 'child'
    });
  }

  addSibling(targetNode?: any) {
    const tree = $(this.tree.nativeElement).fancytree("getTree");
    const selectedNode = targetNode || tree.getActiveNode();
    
    if (!selectedNode || selectedNode.data.root) {
      return;
    }

    const nodeLevel = selectedNode.getLevel() - 1;
    if (nodeLevel >= this.config.maxDepth) {
      return;
    }

    const uniqueId = uuidv4();
    const nodeTitle = this.getNodeTitle();
    
    const newNodeData: SkillMapTreeNode = {
      id: uniqueId,
      title: nodeTitle,
      tooltip: nodeTitle,
      folder: true,
      children: [],
      root: false,
      icon: false, // Remove icon
      metadata: {
        name: nodeTitle,
        code: '', // No default code - user must provide
        description: '', // No default description - user can provide if needed
        level: nodeLevel,
        parentId: selectedNode.data.metadata.parentId,
        id: uniqueId // Ensure metadata has the same ID
      }
    };

    const newNode = selectedNode.appendSibling(newNodeData);
    newNode.setActive();
    
    this.updateNodeActions(newNode);
    
    // Force spacing removal after adding sibling to eliminate gaps
    this.forceSpacingRemoval();
    
    this.treeEventEmitter.emit({
      type: 'nodeAdded',
      data: newNode,
      createType: 'sibling'
    });
  }

  deleteNode(targetNode?: any) {
    const tree = $(this.tree.nativeElement).fancytree("getTree");
    const selectedNode = targetNode || tree.getActiveNode();
    
    if (!selectedNode || selectedNode.data.root) {
      return;
    }

    const afterDeleteNode = selectedNode.getPrevSibling() || selectedNode.getParent();
    
    this.treeEventEmitter.emit({
      type: 'nodeDelete',
      data: selectedNode
    });
    
    selectedNode.remove();
    
    if (afterDeleteNode) {
      afterDeleteNode.setActive();
      this.updateNodeActions(afterDeleteNode);
    }
  }

  // Action button handlers
  onAddChild() {
    this.addChild();
  }

  onAddSibling() {
    this.addSibling();
  }

  getActiveNode() {
    const tree = $(this.tree.nativeElement).fancytree("getTree");
    return tree ? tree.getActiveNode() : null;
  }

  getTree() {
    return $(this.tree.nativeElement).fancytree("getTree");
  }

  getRootNode() {
    const tree = this.getTree();
    return tree ? tree.rootNode : null;
  }

  // Method to expand all nodes in the tree
  public expandAllNodes(): void {
    try {
      const tree = this.getTree();
      if (tree) {
        tree.visit((node) => {
          if (node.hasChildren()) {
            node.setExpanded(true);
          }
        });
        console.log('All tree nodes expanded');
      }
    } catch (error) {
      console.warn('Error expanding all nodes:', error);
    }
  }

  // Method to collapse all nodes in the tree (keeping root expanded)
  public collapseAllNodes(): void {
    try {
      const tree = this.getTree();
      if (tree) {
        tree.visit((node) => {
          // Don't collapse the root node (first level)
          if (node.hasChildren() && node.getLevel() > 1) {
            node.setExpanded(false);
          }
        });
        console.log('All tree nodes collapsed (except root)');
      }
    } catch (error) {
      console.warn('Error collapsing all nodes:', error);
    }
  }
}
