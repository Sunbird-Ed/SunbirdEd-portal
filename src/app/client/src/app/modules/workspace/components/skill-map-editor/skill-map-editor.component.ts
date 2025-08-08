import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { SkillMapTreeComponent } from '../skill-map-tree/skill-map-tree.component';
import { ToasterService, ResourceService } from '@sunbird/shared';
import { ContentService, PermissionService, FrameworkService, PublicDataService } from '@sunbird/core';

export interface SkillMapNode {
  id: string;
  name: string;
  code: string;
  description?: string;
  children: SkillMapNode[];
}

export interface SkillMapData {
  id: string;
  name: string;
  description: string;
  code: string;
  status: string;
  framework: string;
  rootNode: SkillMapNode;
  createdBy: string;
  createdOn: string;
  lastModifiedOn: string;
  version: string;
}

@Component({
  selector: 'app-skill-map-editor',
  templateUrl: './skill-map-editor.component.html',
  styleUrls: ['./skill-map-editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SkillMapEditorComponent implements OnInit, OnDestroy {

  @ViewChild(SkillMapTreeComponent) skillMapTreeComponent: SkillMapTreeComponent;
  @ViewChild('editFrameworkModal') editFrameworkModalRef: any;

  public unsubscribe$ = new Subject<void>();
  public contentId: string;
  public isLoading = true;
  public skillMapData: SkillMapData;
  public frameworkName: string = ''; // Store framework name separately for header
  public selectedNodeData: any = {
    data: {
      metadata: {
        name: '',
        code: '',
        description: ''
      }
    },
    getLevel: () => 0,
    children: []
  }; // Tree node data from fancy tree
  public allCodes: string[] = []; // For uniqueness validation
  public formErrors = { name: '', code: '', description: '' };
  public showValidationErrors = false; // Flag to show validation errors even without user interaction
  public labelConfig: any = {
    addChild: '',
    addSibling: '',
    saveChanges: '',
    deleteNode: '',
    showActions: true,
    alwaysShowFolders: true
  };
  public newNodeData = { name: '', code: '', description: '' };
  public isRTL = false; // For RTL language support
  // Form Controls with validation
  public nameFormControl = new FormControl('', [Validators.required]);
  public codeFormControl = new FormControl('', [
    Validators.required,
    this.codeValidator.bind(this),
    this.uniqueCodeValidator.bind(this)
  ]);
  public descriptionFormControl = new FormControl('', [Validators.maxLength(256)]);
  public enrolmentTypeFormControl = new FormControl('byUser', [Validators.required]);
  public timeLimitFormControl = new FormControl('no', [Validators.required]);
  
  // Mode-related properties
  public mode: string = 'edit'; // Can be 'edit', 'view', or 'review'
  public isViewMode: boolean = false;
  public isReviewMode: boolean = false;
  public isEditMode: boolean = true;
  
  // User role properties
  public isSkillMapCreator: boolean = false;
  public isSkillMapReviewer: boolean = false;
  
  // Edit Framework Modal properties
  public showEditFrameworkModal: boolean = false;
  public isUpdatingFramework: boolean = false;
  public editFrameworkForm: any = {
    name: '',
    description: ''
  };
  public editFormSubmitted: boolean = false;
  
  // Store framework ID for API calls
  private frameworkId: string = '';
  
  // Store created node IDs for API associations
  private createdNodeIds: Map<string, string> = new Map(); // Map of local node ID to API node ID
  private termCreationQueue: any[] = []; // Queue for term creation API calls
  private associationUpdateQueue: any[] = []; // Queue for association update API calls

  // Custom validators
  private codeValidator(control: FormControl): { [key: string]: any } | null {
    const value = control.value;
    if (!value) return null;

    const validCodePattern = /^[a-zA-Z0-9_-]+$/;
    if (!validCodePattern.test(value)) {
      return { 'invalidCode': { value: control.value } };
    }
    return null;
  }

  private uniqueCodeValidator(control: FormControl): { [key: string]: any } | null {
    const value = control.value;
    if (!value || !value.trim()) return null;

    // Early return if tree component is not ready
    if (!this.skillMapTreeComponent) return null;

    // Get the current node's ID to exclude it from duplicate check
    // In FancyTree, use 'key' property for node ID
    const activeNode = this.skillMapTreeComponent.getActiveNode();
    const currentNodeId = activeNode ? (activeNode.key || activeNode.data.id) : this.selectedNodeData?.data?.id;

    // Count occurrences of this code
    let codeCount = 0;

    // Check in tree structure
    const rootNode = this.skillMapTreeComponent.getRootNode();
    if (rootNode && rootNode.children && rootNode.children.length > 0) {
      const actualRootNode = rootNode.children[0];
      if (actualRootNode) {
        codeCount = this.countCodeOccurrences(actualRootNode, value.trim(), currentNodeId);
      }
    }

    // Debug logging
    console.log('Code validation for:', value.trim(), 'Count:', codeCount, 'Current Node ID:', currentNodeId);

    // If code appears more than once (excluding current node), it's a duplicate
    if (codeCount > 0) {
      console.log('Duplicate code detected:', value.trim());
      return { 'duplicateCode': { value: control.value } };
    }

    return null;
  }

  private countCodeOccurrences(treeNode: any, targetCode: string, excludeNodeId?: string): number {
    let count = 0;

    // Check current node
    if (treeNode.data && treeNode.data.metadata && treeNode.data.metadata.code) {
      const nodeCode = treeNode.data.metadata.code.trim();
      if (nodeCode === targetCode.trim()) {
        // In FancyTree, node ID is stored in 'key' property, not 'data.id'
        const currentNodeId = treeNode.key || treeNode.data.id;

        // Only count if it's not the node we're currently editing
        if (!excludeNodeId || currentNodeId !== excludeNodeId) {
          console.log('Found matching code:', nodeCode, 'in node:', currentNodeId, 'excluding:', excludeNodeId);
          count++;
        } else {
          console.log('Excluding current node:', currentNodeId, 'with code:', nodeCode);
        }
      }
    }

    // Recursively check children
    if (treeNode.children && treeNode.children.length > 0) {
      for (const child of treeNode.children) {
        count += this.countCodeOccurrences(child, targetCode, excludeNodeId);
      }
    }

    return count;
  }

  private getNodeIdByCode(code: string): string | null {
    // Helper method to find node ID by code
    const findNodeById = (node: any, targetCode: string): string | null => {
      if (node.code === targetCode) return node.id;
      if (node.children) {
        for (const child of node.children) {
          const result = findNodeById(child, targetCode);
          if (result) return result;
        }
      }
      return null;
    };

    return this.skillMapData ? findNodeById(this.skillMapData.rootNode, code) : null;
  }

  // Getters and setters for safe two-way binding
  get nodeName(): string {
    return this.nameFormControl.value || '';
  }

  set nodeName(value: string) {
    this.nameFormControl.setValue(value);
    if (this.selectedNodeData?.data?.metadata) {
      this.selectedNodeData.data.metadata.name = value;

      // Only update skillMapData.rootNode.name if this is the actual root node
      if (this.selectedNodeData.data.root === true) {
        if (this.skillMapData?.rootNode) {
          this.skillMapData.rootNode.name = value || this.resourceService?.frmelmnts?.lbl?.untitled || 'Untitled';
        }
      }

      // Update the tree node title dynamically
      if (this.skillMapTreeComponent) {
        this.skillMapTreeComponent.updateActiveNodeTitle(value || '');
      }
    }
  }

  get nodeCode(): string {
    return this.codeFormControl.value || '';
  }

  set nodeCode(value: string) {
    this.codeFormControl.setValue(value);
    if (this.selectedNodeData?.data?.metadata) {
      this.selectedNodeData.data.metadata.code = value;
    }
  }

  get nodeDescription(): string {
    return this.descriptionFormControl.value || '';
  }

  set nodeDescription(value: string) {
    this.descriptionFormControl.setValue(value);
    if (this.selectedNodeData?.data?.metadata) {
      this.selectedNodeData.data.metadata.description = value;
    }
  }

  get nodeLevel(): number {
    return this.selectedNodeData?.getLevel() || 0;
  }

  get nodeChildrenCount(): number {
    return this.selectedNodeData?.children?.length || 0;
  }

    // Get the skill map name for the header - use framework name or fallback
  get skillMapName(): string {
    if (this.frameworkName && this.frameworkName.trim()) {
      return this.frameworkName;
    }
    // If no framework name, use the root node name (which is now the domain term)
    if (this.skillMapData?.rootNode?.name) {
      return this.skillMapData.rootNode.name;
    }
    return this.resourceService?.frmelmnts?.lbl?.skillMapEditor || 'Skill Map Editor';
  }

  // Save as Draft button should always be visible/enabled in edit mode
  get canSaveAsDraft(): boolean {
    return this.isEditMode; // Only allow saving as draft in edit mode
  }

  // Edit Framework Modal validation getter
  get hasEditNameError(): boolean {
    return this.editFormSubmitted && (!this.editFrameworkForm.name || !this.editFrameworkForm.name.trim());
  }

  private validateUniqueCodesInTree(treeNode: any): boolean {
    // Collect all codes in the tree
    const allCodes: string[] = [];
    this.extractCodesFromTreeNode(treeNode, allCodes);

    // Check for duplicates
    const codeSet = new Set();
    for (const code of allCodes) {
      if (codeSet.has(code)) {
        return false; // Duplicate found
      }
      codeSet.add(code);
    }

    return true; // No duplicates
  }

  private validateAllTreeNodes(treeNode: any): boolean {
    // Check if the tree node has required data
    if (!treeNode.data || !treeNode.data.metadata) return false;

    const metadata = treeNode.data.metadata;

    // Check current node - both name and code are required
    if (!metadata.name || metadata.name.trim().length === 0) return false;
    if (!metadata.code || metadata.code.trim().length === 0) return false;

    // Recursively check all children
    if (treeNode.children && treeNode.children.length > 0) {
      for (const child of treeNode.children) {
        if (!this.validateAllTreeNodes(child)) {
          return false;
        }
      }
    }

    return true;
  }

  private getAllCodesFromTree(): string[] {
    const codes: string[] = [];

    if (!this.skillMapTreeComponent) return codes;

    const rootNode = this.skillMapTreeComponent.getRootNode();
    if (!rootNode || !rootNode.children || rootNode.children.length === 0) return codes;

    // The actual root node in FancyTree is usually the first child of the tree root
    const actualRootNode = rootNode.children[0];
    if (!actualRootNode) return codes;

    this.extractCodesFromTreeNode(actualRootNode, codes);
    return codes;
  }

  private extractCodesFromTreeNode(treeNode: any, codes: string[]): void {
    if (treeNode.data && treeNode.data.metadata && treeNode.data.metadata.code) {
      const code = treeNode.data.metadata.code.trim();
      if (code.length > 0) {
        codes.push(code);
      }
    }

    // Recursively extract from children
    if (treeNode.children && treeNode.children.length > 0) {
      for (const child of treeNode.children) {
        this.extractCodesFromTreeNode(child, codes);
      }
    }
  }

  private refreshCodeValidation(): void {
    // Trigger validation refresh for the current code form control
    if (this.codeFormControl) {
      this.codeFormControl.updateValueAndValidity({ emitEvent: false });
    }
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toasterService: ToasterService,
    public resourceService: ResourceService,
    private permissionService: PermissionService,
    private frameworkService: FrameworkService,
    private contentService: ContentService,
    private publicDataService: PublicDataService
  ) { 
    // Determine user role for skill maps
    this.isSkillMapCreator = this.permissionService.checkRolesPermissions(['CONTENT_CREATOR']);
    this.isSkillMapReviewer = this.permissionService.checkRolesPermissions(['CONTENT_REVIEWER']);
  }

  ngOnInit(): void {
    // Initialize labelConfig with resource service labels
    this.labelConfig = {
      addChild: this.resourceService?.frmelmnts?.lbl?.addChild || 'Add Child',
      addSibling: this.resourceService?.frmelmnts?.lbl?.addSibling || 'Add Sibling',
      saveChanges: this.resourceService?.frmelmnts?.lbl?.saveChanges || 'Save Changes',
      deleteNode: this.resourceService?.frmelmnts?.lbl?.deleteNode || 'Delete Node',
      showActions: true,
      alwaysShowFolders: true
    };

    this.activatedRoute.params.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
      this.contentId = params.contentId;
    });
    
    // Handle query parameters for mode and framework data
    this.activatedRoute.queryParams.pipe(takeUntil(this.unsubscribe$)).subscribe(queryParams => {
      // Set mode based on query parameter
      this.mode = queryParams['mode'] || 'edit';
      this.isViewMode = this.mode === 'view';
      this.isReviewMode = this.mode === 'review';
      this.isEditMode = this.mode === 'edit';
      
      // Capture framework ID for API calls
      if (queryParams['frameworkId']) {
        this.frameworkId = queryParams['frameworkId'];
        console.log('Framework ID captured from query params:', this.frameworkId);
      }
      
      // Update label config and form states based on mode
      this.updateConfigForMode();
      
      if (queryParams['frameworkName']) {
        // Framework data passed from create content modal
        this.createNewSkillMapWithFramework({
          name: queryParams['frameworkName'],
          code: queryParams['frameworkCode'] || '',
          description: queryParams['frameworkDescription'] || ''
        });
      } else if (this.contentId === 'new') {
        this.createNewSkillMap();
      } else {
        this.loadSkillMapData();
      }
    });

    // Subscribe to form control changes to update underlying data
    this.nameFormControl.valueChanges.subscribe(value => {
      if (this.selectedNodeData?.data?.metadata) {
        this.selectedNodeData.data.metadata.name = value || '';

        // Only update skillMapData.rootNode.name if this is the actual root node
        if (this.selectedNodeData.data.root === true) {
          if (this.skillMapData?.rootNode) {
            this.skillMapData.rootNode.name = value || this.resourceService?.frmelmnts?.lbl?.untitled || 'Untitled';
          }
        }

        // Update the tree node title dynamically
        if (this.skillMapTreeComponent) {
          this.skillMapTreeComponent.updateActiveNodeTitle(value || '');
        }

        // Trigger change detection for Save as Draft validation
        this.cdr.detectChanges();
      }
    });

    this.codeFormControl.valueChanges.subscribe(value => {
      if (this.selectedNodeData?.data?.metadata) {
        this.selectedNodeData.data.metadata.code = value || '';

        // Update the underlying skill map data for root node
        if (this.selectedNodeData.data.root === true && this.skillMapData?.rootNode) {
          this.skillMapData.rootNode.code = value || '';
        }

        // Force validation refresh to check for duplicates
        setTimeout(() => {
          this.refreshCodeValidation();
          this.cdr.detectChanges();
        }, 0);
      }
    });

    this.descriptionFormControl.valueChanges.subscribe(value => {
      if (this.selectedNodeData?.data?.metadata) {
        this.selectedNodeData.data.metadata.description = value || '';

        // Update the underlying skill map data for root node
        if (this.selectedNodeData.data.root === true && this.skillMapData?.rootNode) {
          this.skillMapData.rootNode.description = value || '';
        }

        // Trigger change detection for Save as Draft validation
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Update configuration based on mode (view, edit, review)
   */
  private updateConfigForMode(): void {
    if (this.isViewMode || this.isReviewMode) {
      // In view mode, hide actions like add child, add sibling, delete
      this.labelConfig.showActions = false;
      
      // Make form controls disabled in view mode
      if (this.isViewMode) {
        this.nameFormControl.disable();
        this.codeFormControl.disable();
        this.descriptionFormControl.disable();
      } else if (this.isReviewMode) {
        // In review mode, forms should be read-only but reviewers can see all data
        this.nameFormControl.disable();
        this.codeFormControl.disable();
        this.descriptionFormControl.disable();
      }
    } else {
      // Edit mode - enable all controls and actions
      this.labelConfig.showActions = true;
      this.nameFormControl.enable();
      this.codeFormControl.enable();
      this.descriptionFormControl.enable();
    }
  }

  /**
   * Load existing skill map data from API - enhanced for view mode
   */

  // New method to handle metadata updates from meta-form component
  public onMetadataUpdate(event: any): void {
    console.log('Metadata update received:', event);

    if (event.action === 'save') {
      this.saveNodeChanges();
    } else if (event.field && event.value !== undefined) {
      // Handle real-time field updates
      if (this.selectedNodeData?.data?.metadata) {
        this.selectedNodeData.data.metadata[event.field] = event.value;

        // If this is the root node and name is being updated, update skillMapData.rootNode.name
        if (event.field === 'name' && this.selectedNodeData.data.root === true) {
          if (this.skillMapData?.rootNode) {
            this.skillMapData.rootNode.name = event.value || this.resourceService?.frmelmnts?.lbl?.untitled || 'Untitled';
          }
        }

        // Update form controls if needed
        if (event.field === 'name') {
          this.nameFormControl.setValue(event.value, { emitEvent: false });
          // Update the tree node title dynamically
          if (this.skillMapTreeComponent) {
            this.skillMapTreeComponent.updateActiveNodeTitle(event.value || '');
          }
        } else if (event.field === 'code') {
          this.codeFormControl.setValue(event.value, { emitEvent: false });
        } else if (event.field === 'description') {
          this.descriptionFormControl.setValue(event.value, { emitEvent: false });
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private createNewSkillMap(): void {
    // No framework name for regular new skill maps
    this.frameworkName = '';
    
    // Create default structure compatible with FancyTree
    this.skillMapData = {
      id: 'new-skillmap',
      name: 'New Skill Map', // Default metadata name
      description: 'A new skill map',
      code: 'NEW_SKILLMAP', // Default metadata code
      status: 'Draft',
      framework: 'NCF',
      rootNode: {
        id: 'root',
        name: this.resourceService?.frmelmnts?.lbl?.untitled || 'Untitled', // Always "Untitled" for new skill maps
        description: '', // Empty description for user to fill
        code: '', // Empty code for user to fill
        children: []
      },
      createdBy: 'current-user',
      createdOn: new Date().toISOString(),
      lastModifiedOn: new Date().toISOString(),
      version: '1.0'
    };

    this.extractAllCodes(this.skillMapData.rootNode);
    this.isLoading = false;
  }

  private createNewSkillMapWithFramework(frameworkData: {name: string, code: string, description: string}): void {
    // Store framework name for header display
    this.frameworkName = frameworkData.name;
    
    // Framework ID should already be set from query params or can use the framework code
    if (!this.frameworkId && frameworkData.code) {
      this.frameworkId = frameworkData.code;
      console.log('Framework ID set from framework data:', this.frameworkId);
    }
    
    // Create default structure with framework data for metadata, but root node should be "Untitled"
    this.skillMapData = {
      id: 'new-skillmap',
      name: frameworkData.name, // Framework name for metadata
      description: frameworkData.description,
      code: frameworkData.code, // Framework code for metadata
      status: 'Draft',
      framework: 'NCF',
      rootNode: {
        id: 'root',
        name: this.resourceService?.frmelmnts?.lbl?.untitled || 'Untitled', // Always "Untitled" for new skill maps
        description: '', // Empty description for user to fill
        code: '', // Empty code for user to fill
        children: []
      },
      createdBy: 'current-user',
      createdOn: new Date().toISOString(),
      lastModifiedOn: new Date().toISOString(),
      version: '1.0'
    };

    this.extractAllCodes(this.skillMapData.rootNode);
    this.isLoading = false;
  }

  /**
   * Load existing skill map data from API - enhanced for view mode
   */
  private loadSkillMapData(): void {
    if (this.contentId && this.contentId !== 'new') {
      this.isLoading = true;
      
      // Store framework ID for API calls
      this.frameworkId = this.contentId;
      console.log('Framework ID set from contentId:', this.frameworkId);
      
      // API call to fetch framework data
      this.fetchFrameworkData(this.contentId)
        .then((frameworkData) => {
          if (frameworkData) {
            this.processFrameworkApiResponse(frameworkData);
          } else {
            this.toasterService.error('Failed to load skill map data');
            this.goBack();
          }
        })
        .catch((error) => {
          console.error('Error loading skill map data:', error);
          this.toasterService.error('Failed to load skill map data');
          this.goBack();
        })
        .finally(() => {
          this.isLoading = false;
        });
    } else {
      // Mock implementation for new skill maps - replace with actual service call
      this.skillMapData = this.generateMockSkillMapData();
      this.extractAllCodes(this.skillMapData.rootNode);
      this.isLoading = false;
    }
  }

  /**
   * Fetch framework data from API
   */
  private fetchFrameworkData(frameworkId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.frameworkService.getFrameworkCategories(frameworkId).subscribe(
        (response: any) => {
          if (response && response.responseCode === 'OK' && response.result && response.result.framework) {
            resolve(response.result.framework);
          } else {
            console.error('Invalid API response:', response);
            reject(new Error('Invalid API response'));
          }
        },
        (error: any) => {
          console.error('API call failed:', error);
          reject(error);
        }
      );
    });
  }

  /**
   * Process the framework API response and convert to skill map format
   */
  private processFrameworkApiResponse(frameworkData: any): void {
    try {
      console.log('Processing framework API response:', frameworkData);
      
      // Store framework name for header
      this.frameworkName = frameworkData.name || 'Skill Map';
      console.log('Framework name set to:', this.frameworkName);
      
      // Store framework ID for API calls
      if (frameworkData.identifier) {
        this.frameworkId = frameworkData.identifier;
        console.log('Framework ID updated from API response:', this.frameworkId);
      }
      
      // Log framework structure for debugging
      if (frameworkData.categories) {
        console.log('Framework categories:', frameworkData.categories);
        frameworkData.categories.forEach((category, index) => {
          console.log(`Category ${index}:`, {
            name: category.name,
            code: category.code,
            termsCount: category.terms ? category.terms.length : 0
          });
          if (category.terms) {
            category.terms.forEach((term, termIndex) => {
              console.log(`  Term ${termIndex}:`, {
                name: term.name,
                code: term.code,
                identifier: term.identifier,
                associationsCount: term.associations ? term.associations.length : 0
              });
            });
          }
        });
      }
      
      // Process categories and terms to build tree structure
      const rootNode = this.buildTreeFromCategories(frameworkData.categories || []);
      
      // Create skill map data structure
      // Note: The rootNode is now the domain term, not a framework-level root
      this.skillMapData = {
        id: frameworkData.identifier || frameworkData.code || '',
        name: frameworkData.name || '',
        description: frameworkData.description || '',
        code: frameworkData.code || '',
        status: frameworkData.status || 'Draft',
        framework: frameworkData.identifier || '',
        rootNode: rootNode,
        createdBy: frameworkData.createdBy || '',
        createdOn: frameworkData.createdOn || new Date().toISOString(),
        lastModifiedOn: frameworkData.lastUpdatedOn || new Date().toISOString(),
        version: frameworkData.versionKey || '1.0'
      };

      // Extract all codes for validation
      this.extractAllCodes(this.skillMapData.rootNode);

      console.log('Processed skill map data:', this.skillMapData);
    } catch (error) {
      console.error('Error processing framework data:', error);
      this.toasterService.error('Error processing skill map data');
    }
  }

  /**
   * Build tree structure from framework categories
   * This is used when loading existing frameworks from API
   */
  private buildTreeFromCategories(categories: any[]): SkillMapNode {
    console.log('Building tree from categories:', categories);
    
    // If no categories, return empty root with "Untitled" (for new skill maps)
    if (!categories || categories.length === 0) {
      console.log('No categories found, returning empty root');
      return {
        id: 'root',
        name: this.resourceService?.frmelmnts?.lbl?.untitled || 'Untitled',
        code: '',
        description: '',
        children: []
      };
    }

    // Create maps to organize terms
    const nodeMap = new Map<string, SkillMapNode>();
    const termsByCategory = new Map<string, any[]>();
    const allTerms = new Map<string, any>();

    // First pass: collect all terms and organize by category
    for (const category of categories) {
      if (category.terms && category.terms.length > 0) {
        termsByCategory.set(category.code, category.terms);
        
        for (const term of category.terms) {
          // Store term with its category info
          allTerms.set(term.identifier, {
            ...term,
            categoryCode: category.code
          });
          
          // Create node for this term
          const node: SkillMapNode = {
            id: term.identifier,
            name: term.name,
            code: term.code,
            description: term.description || '',
            children: []
          };
          nodeMap.set(term.identifier, node);
        }
      }
    }

    console.log('Terms organized by category:', termsByCategory);

    // Find the domain term that should be the root for existing frameworks
    const domainTerms = termsByCategory.get('domain') || [];
    console.log('Domain terms found:', domainTerms);
    
    if (domainTerms.length === 0) {
      console.log('No domain terms found, using framework as root');
      return {
        id: 'root',
        name: this.resourceService?.frmelmnts?.lbl?.untitled || 'Untitled',
        code: '',
        description: '',
        children: []
      };
    }

    // Use the first domain term as the root node (for existing frameworks)
    const domainTerm = domainTerms[0];
    const rootNode = nodeMap.get(domainTerm.identifier);
    
    if (!rootNode) {
      console.error('Could not find domain node for root');
      return {
        id: 'root',
        name: this.resourceService?.frmelmnts?.lbl?.untitled || 'Untitled',
        code: '',
        description: '',
        children: []
      };
    }

    console.log('Using domain term as root:', domainTerm.name);

    // Build children for the domain root using associations
    this.buildChildrenFromAssociations(rootNode, nodeMap, allTerms);

    console.log('Final root node structure:', rootNode);
    return rootNode;
  }

  /**
   * Recursively build children from associations
   */
  private buildChildrenFromAssociations(
    parentNode: SkillMapNode, 
    nodeMap: Map<string, SkillMapNode>, 
    allTerms: Map<string, any>
  ): void {
    const parentTerm = allTerms.get(parentNode.id);
    if (!parentTerm || !parentTerm.associations) {
      return;
    }

    console.log(`Building children for ${parentNode.name}, associations:`, parentTerm.associations);

    for (const association of parentTerm.associations) {
      const childNode = nodeMap.get(association.identifier);
      const childTerm = allTerms.get(association.identifier);
      
      if (childNode && childTerm) {
        // Avoid circular references
        if (!this.isAncestorOf(childNode, parentNode)) {
          parentNode.children.push(childNode);
          console.log(`Added child "${childNode.name}" to parent "${parentNode.name}"`);
          
          // Recursively build children for this child
          this.buildChildrenFromAssociations(childNode, nodeMap, allTerms);
        }
      }
    }
  }

  /**
   * Check if a node is an ancestor of another node to prevent circular references
   */
  private isAncestorOf(potentialAncestor: SkillMapNode, node: SkillMapNode): boolean {
    if (potentialAncestor.id === node.id) return true;
    
    for (const child of node.children) {
      if (this.isAncestorOf(potentialAncestor, child)) {
        return true;
      }
    }
    return false;
  }

  private generateMockSkillMapData(): SkillMapData {
    const rootNode: SkillMapNode = {
      id: 'root',
      name: 'Mathematics',
      description: 'Root node for mathematics topics',
      code: 'MATH_ROOT',
      children: [
        {
          id: 'algebra',
          name: 'Algebra',
          description: 'Algebraic concepts and problem solving',
          code: 'MATH_ALGEBRA',
          children: [
            {
              id: 'linear-eq',
              name: 'Linear Equations',
              description: 'Solving linear equations and systems',
              code: 'MATH_LINEAR_EQ',
              children: []
            }
          ]
        },
        {
          id: 'geometry',
          name: 'Geometry',
          description: 'Geometric shapes, angles, and measurements',
          code: 'MATH_GEOMETRY',
          children: []
        }
      ]
    };

    return {
      id: 'skillmap-1',
      name: 'Mathematics Skill Map',
      description: 'Comprehensive mathematics learning path',
      code: 'SKILLMAP_MATH_001',
      status: 'Draft',
      framework: 'NCF',
      rootNode: rootNode,
      createdBy: 'teacher-1',
      createdOn: '2025-01-15T10:00:00Z',
      lastModifiedOn: '2025-01-20T15:30:00Z',
      version: '1.2'
    };
  }

  private extractAllCodes(node: SkillMapNode): void {
    // Only add non-empty codes to the array
    if (node.code && node.code.trim().length > 0) {
      this.allCodes.push(node.code);
    }
    if (node.children) {
      node.children.forEach(child => this.extractAllCodes(child));
    }
  }

  // Tree event handler - main interaction with tree component
  public onTreeEvent(event: any): void {
    switch (event.type) {
      case 'nodeSelect':
      case 'nodeActivate':
        this.selectedNodeData = event.data || this.getDefaultNodeData();

        // DON'T overwrite existing metadata - just ensure structure exists
        if (!this.selectedNodeData.data) {
          this.selectedNodeData.data = { metadata: { name: '', code: '', description: '' } };
        }
        if (!this.selectedNodeData.data.metadata) {
          this.selectedNodeData.data.metadata = { name: '', code: '', description: '' };
        }

        // Only initialize missing fields, don't overwrite existing ones
        if (this.selectedNodeData.data.metadata.name === undefined) {
          this.selectedNodeData.data.metadata.name = '';
        }
        if (this.selectedNodeData.data.metadata.code === undefined) {
          this.selectedNodeData.data.metadata.code = '';
        }
        if (this.selectedNodeData.data.metadata.description === undefined) {
          this.selectedNodeData.data.metadata.description = '';
        }

        // ONLY for the actual root node, sync with skillMapData.rootNode if needed
        if (this.selectedNodeData.data.root === true && this.skillMapData?.rootNode) {
          // Only sync if the tree node data is empty/undefined
          if (!this.selectedNodeData.data.metadata.name) {
            this.selectedNodeData.data.metadata.name = this.skillMapData.rootNode.name || '';
          }
          if (!this.selectedNodeData.data.metadata.code) {
            this.selectedNodeData.data.metadata.code = this.skillMapData.rootNode.code || '';
          }
          if (!this.selectedNodeData.data.metadata.description) {
            this.selectedNodeData.data.metadata.description = this.skillMapData.rootNode.description || '';
          }
        }

        // Sync form controls with the existing node data (don't modify the node data)
        this.nameFormControl.setValue(this.selectedNodeData.data.metadata.name || '', { emitEvent: false });
        this.codeFormControl.setValue(this.selectedNodeData.data.metadata.code || '', { emitEvent: false });
        this.descriptionFormControl.setValue(this.selectedNodeData.data.metadata.description || '', { emitEvent: false });

        // Reset touched state for form controls unless global validation is triggered
        if (!this.showValidationErrors) {
          this.nameFormControl.markAsUntouched();
          this.codeFormControl.markAsUntouched();
          this.descriptionFormControl.markAsUntouched();
        }

        // Trigger validation updates for unique code checking with a small delay
        setTimeout(() => {
          this.refreshCodeValidation();
          this.cdr.detectChanges();
        }, 100);
        break;
      case 'nodeAdded':
        this.handleNodeAdded(event);
        break;
      case 'nodeDelete':
        this.handleNodeDelete(event);
        break;
    }
  }

  private getDefaultNodeData(): any {
    return {
      data: {
        metadata: {
          name: '',
          code: '',
          description: ''
        }
      },
      getLevel: () => 0,
      children: []
    };
  }

  public deleteNode(node: any): void {
    if (node && node.getLevel() > 0) {
      // Directly delete the node without confirmation
      this.onTreeEvent({
        type: 'nodeDelete',
        data: node
      });
    }
  }

  private handleNodeAdded(event: any): void {
    this.updateSkillMapFromTree();

    // Set the newly added node as selected
    this.selectedNodeData = event.data;

    // Ensure the new node has proper metadata structure
    if (!this.selectedNodeData.data) {
      this.selectedNodeData.data = { metadata: { name: 'Untitled', code: '', description: '' } };
    }
    if (!this.selectedNodeData.data.metadata) {
      this.selectedNodeData.data.metadata = { name: 'Untitled', code: '', description: '' };
    }

    // Sync form controls with the new node's initial data
    this.nameFormControl.setValue(this.selectedNodeData.data.metadata.name || 'Untitled', { emitEvent: false });
    this.codeFormControl.setValue(this.selectedNodeData.data.metadata.code || '', { emitEvent: false });
    this.descriptionFormControl.setValue(this.selectedNodeData.data.metadata.description || '', { emitEvent: false });

    // Trigger validation updates for unique code checking with a small delay
    setTimeout(() => {
      this.refreshCodeValidation();
      this.cdr.detectChanges();
    }, 100);

    console.log('Node added successfully');
  }

  private handleNodeDelete(event: any): void {
    this.updateSkillMapFromTree();
    if (this.selectedNodeData && this.selectedNodeData.data.id === event.data.data.id) {
      this.selectedNodeData = null;
    }
    // Trigger change detection to update Save as Draft button state
    this.cdr.detectChanges();
    console.log('Node deleted successfully');
  }

  private updateSkillMapFromTree(): void {
    // Re-extract all codes from the tree to keep allCodes array updated
    this.allCodes = [];
    if (this.skillMapData?.rootNode) {
      this.extractAllCodes(this.skillMapData.rootNode);
    }
    this.updateLastModified();
    // Trigger change detection for Save as Draft validation
    this.cdr.detectChanges();
  }

  public onNodeDataChange(): void {
    this.formErrors = { name: '', code: '', description: '' };
  }

  public saveNodeChanges(): void {
    if (this.selectedNodeData && this.selectedNodeData.data && this.selectedNodeData.data.metadata) {
      const metadata = this.selectedNodeData.data.metadata;
      if (this.validateNodeData(metadata)) {
        // Only update skillMapData.rootNode.name if this is the actual root node
        if (this.selectedNodeData.data.root === true) {
          if (this.skillMapData?.rootNode) {
            this.skillMapData.rootNode.name = metadata.name || 'Untitled';
          }
        }

        // Update the tree node title using the more reliable method
        if (this.skillMapTreeComponent) {
          this.skillMapTreeComponent.updateActiveNodeTitle(metadata.name || '');
        }

        this.updateLastModified();
        console.log('Node changes saved successfully');
      }
    }
  }

  private validateNodeData(metadata: any): boolean {
    let isValid = true;
    this.formErrors = { name: '', code: '', description: '' };

    if (!metadata.name || metadata.name.trim().length === 0) {
      this.formErrors.name = 'Name is required';
      isValid = false;
    }

    if (!metadata.code || metadata.code.trim().length === 0) {
      this.formErrors.code = 'Code is required';
      isValid = false;
    } else if (this.allCodes.filter(code => code === metadata.code).length > 1) {
      this.formErrors.code = 'Code must be unique';
      isValid = false;
    }

    return isValid;
  }

  public saveDraft(): void {
    console.log('Save as draft clicked - starting validation...');

    // Set flag to show validation errors even without user interaction
    this.showValidationErrors = true;

    // First, ensure current form values are synced to the active node's metadata
    this.syncFormToActiveNode();

    // Trigger form validation for all nodes to show mat-error messages
    this.triggerValidationForAllNodes();

    // Small delay to ensure tree is fully rendered before validation
    setTimeout(() => {
      // Validate all nodes and highlight those with errors - ONLY when saving
      if (this.skillMapTreeComponent) {
        const validationResult = this.skillMapTreeComponent.validateAndHighlightNodes((nodeId: string) => {
          return this.validateNodeById(nodeId);
        });

        if (validationResult.hasErrors) {
          // Expand all tree nodes so user can see which nodes have validation errors
          this.skillMapTreeComponent.expandAllNodes();
          
          // Determine the type of validation errors and show appropriate message
          const errorMessage = this.getValidationErrorMessage(validationResult.errorNodes);

          this.toasterService.error(errorMessage);
          return; // Don't save if there are validation errors
        } else {
          // All validations passed, clear any highlights and save
          this.skillMapTreeComponent.clearAllHighlights();
          // Reset validation flag since everything is valid
          this.showValidationErrors = false;
          console.log('All validations passed, saving skill map as draft');
          
          // Create terms and associations via API
          this.createTermsAndAssociations();
        }
      }
    }, 100);
  }

  // Helper method to sync current form values to active node metadata
  private syncFormToActiveNode(): void {
    if (this.selectedNodeData?.data?.metadata) {
      // Update the metadata with current form values
      this.selectedNodeData.data.metadata.name = this.nameFormControl.value || '';
      this.selectedNodeData.data.metadata.code = this.codeFormControl.value || '';
      this.selectedNodeData.data.metadata.description = this.descriptionFormControl.value || '';

      // Also update the tree node's data directly
      const activeNode = this.skillMapTreeComponent?.getActiveNode();
      if (activeNode && activeNode.data && activeNode.data.metadata) {
        activeNode.data.metadata.name = this.nameFormControl.value || '';
        activeNode.data.metadata.code = this.codeFormControl.value || '';
        activeNode.data.metadata.description = this.descriptionFormControl.value || '';
      }
    }
  }

  // Method to trigger validation for all nodes and show mat-error messages
  private triggerValidationForAllNodes(): void {
    if (!this.skillMapTreeComponent) return;

    try {
      const tree = this.skillMapTreeComponent.getTree();
      if (tree) {
        // Visit all nodes in the tree
        tree.visit((node) => {
          if (node.data && node.data.metadata) {
            // For each node, create temporary form controls to trigger validation
            this.validateNodeFormControls(node);
          }
        });
      }
    } catch (error) {
      console.warn('Error triggering validation for all nodes:', error);
    }
  }

  // Method to validate form controls for a specific node
  private validateNodeFormControls(node: any): void {
    if (!node.data || !node.data.metadata) return;

    const metadata = node.data.metadata;
    const nodeId = node.key;

    // Check if this is the currently active node
    const activeNode = this.skillMapTreeComponent?.getActiveNode();
    const isActiveNode = activeNode && activeNode.key === nodeId;

    if (isActiveNode) {
      // For active node, trigger validation on the actual form controls
      this.nameFormControl.markAsTouched();
      this.nameFormControl.updateValueAndValidity();
      
      this.codeFormControl.markAsTouched();
      this.codeFormControl.updateValueAndValidity();
      
      this.descriptionFormControl.markAsTouched();
      this.descriptionFormControl.updateValueAndValidity();
    } else {
      // For non-active nodes, we'll set validation errors directly in the node metadata
      // This will be used by the highlighting system to show which nodes have errors
      if (!metadata.name || metadata.name.trim().length === 0) {
        metadata._hasNameError = true;
      } else {
        metadata._hasNameError = false;
      }

      if (!metadata.code || metadata.code.trim().length === 0) {
        metadata._hasCodeError = true;
      } else {
        // Check for duplicate codes
        const trimmedCode = metadata.code.trim();
        const codeCount = this.countCodeOccurrences(this.skillMapTreeComponent.getRootNode().children[0], trimmedCode, nodeId);
        metadata._hasCodeError = codeCount > 0;
      }
    }
  }

  // Method to validate a specific node by its ID
  private validateNodeById(nodeId: string): boolean {
    if (!this.skillMapTreeComponent) return false;

    const node = this.skillMapTreeComponent.getNodeById(nodeId);
    if (!node || !node.data || !node.data.metadata) return false;

    const metadata = node.data.metadata;

    // Get node values directly from metadata (not from form controls to avoid interference)
    let nodeName = metadata.name;
    let nodeCode = metadata.code;

    // Check if this is the currently active node and get real-time values
    const activeNode = this.skillMapTreeComponent.getActiveNode();
    const isActiveNode = activeNode && activeNode.key === nodeId;

    if (isActiveNode) {
      // For active node, get values from form controls (real-time values)
      nodeName = this.nameFormControl.value || '';
      nodeCode = this.codeFormControl.value || '';
    }

    console.log(`Validating node ${nodeId}:`, {
      isActiveNode,
      nodeName,
      nodeCode,
      metadataName: metadata.name,
      metadataCode: metadata.code,
      formName: this.nameFormControl.value,
      formCode: this.codeFormControl.value
    });

    // Check if required fields are present (empty string, null, or undefined)
    // "Untitled" is considered a valid default name
    const hasValidName = nodeName && typeof nodeName === 'string' && nodeName.trim().length > 0;
    const hasValidCode = nodeCode && typeof nodeCode === 'string' && nodeCode.trim().length > 0;

    if (!hasValidName || !hasValidCode) {
      console.log(`Node ${nodeId} validation failed - missing fields:`, { hasValidName, hasValidCode });
      return false; // Missing required fields
    }

    // Check for duplicate codes (use trimmed code for comparison)
    const trimmedCode = nodeCode.trim();
    const codeCount = this.countCodeOccurrences(this.skillMapTreeComponent.getRootNode().children[0], trimmedCode, nodeId);
    if (codeCount > 0) {
      console.log(`Node ${nodeId} validation failed - duplicate code:`, trimmedCode);
      return false; // Duplicate code found
    }

    console.log(`Node ${nodeId} validation passed`);
    return true; // All validations passed
  }

  public previewSkillMap(): void {
    // Sync current form values to active node before validation
    this.syncFormToActiveNode();

    // Step 1: Perform all basic input validations (same as Save as Draft)
    const basicValidationResult = this.performBasicValidations();
    
    if (!basicValidationResult.isValid) {
      this.toasterService.error(basicValidationResult.errorMessage);
      return;
    }

    // Step 2: Perform depth-specific validations for Send for Review
    const depthValidationResult = this.performDepthValidations();
    
    if (!depthValidationResult.isValid) {
      this.toasterService.error(depthValidationResult.errorMessage);
      return;
    }

    // Step 3: All validations passed - make API call to send for review
    this.sendForReview();
  }

  /**
   * Perform basic input validations (same as Save as Draft)
   */
  private performBasicValidations(): { isValid: boolean, errorMessage: string, errorNodes: string[] } {
    // Clear all existing highlights first
    if (this.skillMapTreeComponent) {
      this.skillMapTreeComponent.clearAllHighlights();
    }

    // Force trigger validation for all nodes to show mat-error messages
    this.triggerValidationForAllNodes();

    if (!this.skillMapTreeComponent) {
      return {
        isValid: false,
        errorMessage: 'Tree component is not available for validation.',
        errorNodes: []
      };
    }
    // Validate all nodes using tree component
    const validationResult = this.skillMapTreeComponent.validateAndHighlightNodes((nodeId: string) => {
      return this.validateNodeById(nodeId);
    });

    if (validationResult.hasErrors) {
      // Expand all nodes to show validation errors
      this.skillMapTreeComponent.expandAllNodes();
      
      return {
        isValid: false,
        errorMessage: this.getValidationErrorMessage(validationResult.errorNodes),
        errorNodes: validationResult.errorNodes
      };
    }

    return { isValid: true, errorMessage: '', errorNodes: [] };
  }

  /**
   * Perform depth-specific validations for Send for Review
   */
  private performDepthValidations(): { isValid: boolean, errorMessage: string, errorNodes: string[] } {
    const maxDepth = this.getMaxDepthFromConfig();
    const invalidNodes: string[] = [];

    // Validation 1: Check if at least one complete path to maxDepth exists
    const hasCompletePathResult = this.validateCompletePathToMaxDepth(maxDepth);
    if (!hasCompletePathResult.isValid) {
      return {
        isValid: false,
        errorMessage: `At least one complete path to maximum depth (${maxDepth} levels) is required.`,
        errorNodes: hasCompletePathResult.incompleteNodes
      };
    }

    // Validation 2: Each non-leaf node should have children (except nodes at maxDepth)
    const missingChildrenResult = this.validateNodesHaveChildren(maxDepth);
    if (!missingChildrenResult.isValid) {
      // Highlight nodes that are missing children
      missingChildrenResult.invalidNodes.forEach(nodeId => {
        this.skillMapTreeComponent.highlightNode(nodeId, 'add');
      });
      
      // Expand all nodes to show the issues
      this.skillMapTreeComponent.expandAllNodes();
      
      return {
        isValid: false,
        errorMessage: 'Some nodes are missing required children. Each node must have at least one child until the maximum depth is reached.',
        errorNodes: missingChildrenResult.invalidNodes
      };
    }

    return { isValid: true, errorMessage: '', errorNodes: [] };
  }

  /**
   * Get maxDepth from tree component configuration
   */
  private getMaxDepthFromConfig(): number {
    return this.skillMapTreeComponent?.config?.maxDepth || 4;
  }

  /**
   * Validate that at least one complete path to maxDepth exists
   */
  private validateCompletePathToMaxDepth(maxDepth: number): { isValid: boolean, incompleteNodes: string[] } {
    if (!this.skillMapTreeComponent) {
      return { isValid: false, incompleteNodes: [] };
    }
    const rootNode = this.skillMapTreeComponent.getRootNode();
    if (!rootNode || !rootNode.children || rootNode.children.length === 0) {
      return { isValid: false, incompleteNodes: [] };
    }

    // Check each path from root to see if any reaches maxDepth
    const actualRootNode = rootNode.children[0]; // The skill map root node
    if (!actualRootNode) {
      return { isValid: false, incompleteNodes: [] };
    }
    const hasCompletePath = this.checkPathToDepth(actualRootNode, 1, maxDepth);
    
    if (!hasCompletePath) {
      const incompleteNodes = this.findIncompletePathNodes(actualRootNode, 1, maxDepth);
      return { isValid: false, incompleteNodes };
    }

    return { isValid: true, incompleteNodes: [] };
  }

  /**
   * Recursively check if any path reaches the required depth
   */
  private checkPathToDepth(node: any, currentDepth: number, maxDepth: number): boolean {
    // If we've reached maxDepth, this path is complete
    if (currentDepth === maxDepth) {
      return true;
    }

    // If no children and we haven't reached maxDepth, this path is incomplete
    if (!node.children || node.children.length === 0) {
      return false;
    }

    // Check if any child path can reach maxDepth
    for (const child of node.children) {
      if (this.checkPathToDepth(child, currentDepth + 1, maxDepth)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Find nodes that are part of incomplete paths
   */
  private findIncompletePathNodes(node: any, currentDepth: number, maxDepth: number): string[] {
    const incompleteNodes: string[] = [];

    // If this node should have children but doesn't, it's part of an incomplete path
    if (currentDepth < maxDepth && (!node.children || node.children.length === 0)) {
      incompleteNodes.push(node.key || node.data?.id || node.id);
    }

    // Recursively check children
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        const childIncompleteNodes = this.findIncompletePathNodes(child, currentDepth + 1, maxDepth);
        incompleteNodes.push(...childIncompleteNodes);
      }
    }

    return incompleteNodes;
  }

  /**
   * Validate that each non-leaf node has children (except at maxDepth)
   */
  private validateNodesHaveChildren(maxDepth: number): { isValid: boolean, invalidNodes: string[] } {
    const invalidNodes: string[] = [];
    const rootNode = this.skillMapTreeComponent.getRootNode();
    
    if (!rootNode || !rootNode.children || rootNode.children.length === 0) {
      return { isValid: false, invalidNodes: [] };
    }

    const actualRootNode = rootNode.children[0]; // The skill map root node
    this.checkNodeChildren(actualRootNode, 1, maxDepth, invalidNodes);

    return {
      isValid: invalidNodes.length === 0,
      invalidNodes
    };
  }

  /**
   * Recursively check if nodes have required children
   */
  private checkNodeChildren(node: any, currentDepth: number, maxDepth: number, invalidNodes: string[]): void {
    // If we're at maxDepth, nodes don't need children
    if (currentDepth >= maxDepth) {
      return;
    }

    // If this node doesn't have children and it's not at maxDepth, it's invalid
    if (!node.children || node.children.length === 0) {
      invalidNodes.push(node.key || node.data?.id || node.id);
      return;
    }

    // Recursively check children
    for (const child of node.children) {
      this.checkNodeChildren(child, currentDepth + 1, maxDepth, invalidNodes);
    }
  }

  /**
   * Send framework for review via API call
   */
  private sendForReview(): void {
    // Get framework ID from query parameters (set during framework creation)
    this.activatedRoute.queryParams.pipe(takeUntil(this.unsubscribe$)).subscribe(queryParams => {
      const frameworkId = queryParams['frameworkId'] || 'dummy_framework_id';
      
      // Prepare API request
      const requestBody = {
        request: {
          framework: {
            // Add any additional framework data needed for review
            status: 'Review'
          }
        }
      };

      // Make API call (currently dummy implementation)
      this.makeReviewApiCall(frameworkId, requestBody);
    });
  }

  /**
   * Make the actual API call to send for review
   */
  private makeReviewApiCall(frameworkId: string, requestBody: any): void {
    // TODO: Replace with actual API call when implemented
    // const option = {
    //   url: `framework/v1/review/${frameworkId}`,
    //   data: requestBody
    // };
    // this.publicDataService.post(option).subscribe(

    // Dummy response simulation for now
    setTimeout(() => {
      const dummyResponse = {
        id: "api.v3.review",
        ver: "1.0",
        ts: new Date().toISOString(),
        params: {
          resmsgid: "fd605000-6dd3-11f0-b6b7-1303880447cd",
          msgid: "12a14544-a7e2-4e76-8bac-1495a4ef54ac",
          status: "successful",
          err: null,
          errmsg: null
        },
        responseCode: "OK",
        result: {
          versionKey: Date.now().toString()
        }
      };

      // Handle success response
      this.toasterService.success(
        this.resourceService?.frmelmnts?.smsg?.sentForReview || 'Sent for review successfully!'
      );

      // Optionally update the skill map status
      if (this.skillMapData) {
        this.skillMapData.status = 'Review';
        this.updateLastModified();
      }

      console.log('Framework sent for review:', dummyResponse);
    }, 1000); // 1 second delay to simulate API call
  }

  public publishSkillMap(): void {
    console.log('Publish functionality will be implemented');
  }
  
  public rejectSkillMap(): void {
    console.log('Reject functionality will be implemented');
  }

  public goBack(): void {
    this.router.navigate(['/workspace/content/skillmap/1']);
  }

  /**
   * Open Edit Framework Modal
   */
  public openEditFrameworkModal(): void {
    // Get framework identifier
    const frameworkId = this.getFrameworkIdentifier();
    
    if (!frameworkId) {
      this.toasterService.error('Framework ID not found. Cannot edit framework.');
      return;
    }

    // Check if we already have framework data from query params or need to fetch
    const queryParams = this.activatedRoute.snapshot.queryParams;
    if (queryParams['frameworkName'] && queryParams['frameworkDescription']) {
      // Use existing data from query params
      this.editFrameworkForm = {
        name: queryParams['frameworkName'] || '',
        description: queryParams['frameworkDescription'] || ''
      };
      this.resetEditFormValidation();
      this.showEditFrameworkModal = true;
    } else {
      // Fetch framework data from API
      this.fetchFrameworkDataForEdit(frameworkId);
    }
  }

  /**
   * Fetch framework data via API call for editing
   */
  private fetchFrameworkDataForEdit(frameworkId: string): void {
    const apiUrl = `framework/v1/read/${frameworkId}`;
    
    console.log('Fetching framework data for ID:', frameworkId);
    
    this.publicDataService.get({ url: apiUrl }).subscribe(
      (response: any) => {
        console.log('Framework data response:', response);
        
        if (response && response.result && response.result.framework) {
          const framework = response.result.framework;
          this.editFrameworkForm = {
            name: framework.name || '',
            description: framework.description || ''
          };
          this.resetEditFormValidation();
          this.showEditFrameworkModal = true;
        } else {
          this.toasterService.error('Failed to fetch framework data. Invalid response structure.');
        }
      },
      (error: any) => {
        console.error('Error fetching framework data:', error);
        this.toasterService.error(
          this.resourceService?.frmelmnts?.emsg?.frameworkFetchFailed || 
          'Failed to fetch framework data. Please try again.'
        );
      }
    );
  }

  /**
   * Close Edit Framework Modal
   */
  public closeEditFrameworkModal(): void {
    this.showEditFrameworkModal = false;
    this.resetEditFormValidation();
  }

  /**
   * Reset edit form validation state
   */
  private resetEditFormValidation(): void {
    this.editFormSubmitted = false;
    this.isUpdatingFramework = false;
  }

  /**
   * Validate edit form
   */
  public validateEditForm(): void {
    // Trigger validation check
    this.editFormSubmitted = true;
  }

  /**
   * Update Framework via API call
   */
  public updateFramework(): void {
    this.editFormSubmitted = true;
    
    // Validate form
    if (!this.editFrameworkForm.name || !this.editFrameworkForm.name.trim()) {
      return;
    }

    this.isUpdatingFramework = true;

    // Get framework identifier
    const frameworkId = this.getFrameworkIdentifier();
    
    if (!frameworkId) {
      this.isUpdatingFramework = false;
      this.toasterService.error('Framework ID not found. Cannot update framework.');
      return;
    }

    // Prepare API request
    const requestBody = {
      request: {
        framework: {
          name: this.editFrameworkForm.name.trim(),
          description: this.editFrameworkForm.description || '',
          code: this.generateFrameworkCode(this.editFrameworkForm.name.trim())
        }
      }
    };

    const apiUrl = `framework/v1/update/${frameworkId}`;
    
    console.log('Updating framework with API call:', { url: apiUrl, data: requestBody });

    this.publicDataService.patch({ url: apiUrl, data: requestBody }).subscribe(
      (response: any) => {
        console.log('Framework update response:', response);
        
        if (response && response.responseCode === 'OK') {
          // Update local data
          this.frameworkName = this.editFrameworkForm.name.trim();
          if (this.skillMapData) {
            this.skillMapData.name = this.editFrameworkForm.name.trim();
            this.skillMapData.description = this.editFrameworkForm.description || '';
          }
          
          // Close modal and show success message
          this.closeEditFrameworkModal();
          this.toasterService.success(
            this.resourceService?.frmelmnts?.smsg?.frameworkUpdated || 
            'Framework updated successfully!'
          );
        } else {
          this.isUpdatingFramework = false;
          this.toasterService.error('Failed to update framework. Invalid response from server.');
        }
      },
      (error: any) => {
        console.error('Error updating framework:', error);
        this.isUpdatingFramework = false;
        this.toasterService.error(
          this.resourceService?.frmelmnts?.emsg?.frameworkUpdateFailed || 
          'Failed to update framework. Please try again.'
        );
      }
    );
  }

  /**
   * Generate framework code from name
   */
  private generateFrameworkCode(name: string): string {
    // Convert to lowercase, replace spaces and special characters with underscores
    const code = name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    return code;
  }

  private updateLastModified(): void {
    this.skillMapData.lastModifiedOn = new Date().toISOString();
  }

  // Generate appropriate error message based on validation errors found
  private getValidationErrorMessage(errorNodes: string[]): string {
    const errorCount = errorNodes.length;
    const errorDetails = this.analyzeValidationErrors(errorNodes);

    // Check if we have form validation errors (like duplicate codes, invalid formats)
    if (errorDetails.hasFormErrors) {
      return this.resourceService?.frmelmnts?.lbl?.invalidInputDetected || 'Invalid input detected. Please review';
    } else if (errorDetails.hasMissingFields) {
      return this.resourceService?.frmelmnts?.lbl?.fillRequiredFields || 'Please fill all the required fields';
    } else {
      // Generic fallback
      return this.resourceService?.frmelmnts?.lbl?.failedToSaveSkillMap || 'Failed to save skill map, Please try again later.';
    }
  }

  // Analyze what types of validation errors exist
  private analyzeValidationErrors(errorNodes: string[]): { hasFormErrors: boolean, hasMissingFields: boolean } {
    let hasFormErrors = false;
    let hasMissingFields = false;

    for (const nodeId of errorNodes) {
      const node = this.skillMapTreeComponent.getNodeById(nodeId);
      if (!node || !node.data || !node.data.metadata) continue;

      const metadata = node.data.metadata;

      // Get current values (form values for active node, metadata for others)
      const activeNode = this.skillMapTreeComponent.getActiveNode();
      const isActiveNode = activeNode && activeNode.key === nodeId;

      let nodeName = metadata.name;
      let nodeCode = metadata.code;

      if (isActiveNode) {
        nodeName = this.nameFormControl.value || '';
        nodeCode = this.codeFormControl.value || '';
      }

      // Check for missing fields
      const hasValidName = nodeName && typeof nodeName === 'string' && nodeName.trim().length > 0;
      const hasValidCode = nodeCode && typeof nodeCode === 'string' && nodeCode.trim().length > 0;

      if (!hasValidName || !hasValidCode) {
        hasMissingFields = true;
      }

      // Check for form validation errors (duplicate codes, invalid formats)
      if (hasValidCode) {
        // Check for duplicate codes
        const trimmedCode = nodeCode.trim();
        const codeCount = this.countCodeOccurrences(this.skillMapTreeComponent.getRootNode().children[0], trimmedCode, nodeId);
        if (codeCount > 0) {
          hasFormErrors = true;
        }

        // Check for invalid code format (if active node, check form control errors)
        if (isActiveNode && this.codeFormControl.errors) {
          if (this.codeFormControl.errors['invalidCode'] || this.codeFormControl.errors['duplicateCode']) {
            hasFormErrors = true;
          }
        }
      }
    }

    return { hasFormErrors, hasMissingFields };
  }

  /**
   * Main method to create terms and associations via API calls
   */
  private async createTermsAndAssociations(): Promise<void> {
    
    try {
      console.log('Starting term creation and association process...');
      
      
      // Get framework identifier
      const frameworkIdentifier = this.getFrameworkIdentifier();
      if (!frameworkIdentifier) {
        console.warn('Framework identifier not found. Saving locally only.');
        this.saveLocalDraftOnly();
        return;
      }

      console.log('Using framework identifier:', frameworkIdentifier);

      // Clear previous data
      this.createdNodeIds.clear();
      this.termCreationQueue = [];
      this.associationUpdateQueue = [];

      // Build tree structure with levels and categories
      const treeStructure = this.buildTreeStructureWithCategories();
      console.log('Tree structure with categories:', treeStructure);

      // Step 1: Create all terms level by level
      console.log('Step 1: Creating terms...');
      await this.createTermsSequentially(treeStructure, frameworkIdentifier);

      // Step 2: Create associations between parent and child terms
      console.log('Step 2: Creating associations...');
      
      // Validate that all nodes have been created before creating associations
      const missingNodeIds = this.validateAllNodesCreated(treeStructure);
      if (missingNodeIds.length > 0) {
        throw new Error(`Cannot create associations: Missing API node IDs for: ${missingNodeIds.join(', ')}`);
      }
      
      await this.createAssociations(treeStructure, frameworkIdentifier);

      // Step 3: Update local storage and UI
      this.updateLastModified();
      console.log('Skill map saved as draft with API integration');
      
      // Log the final mapping for debugging
      console.log('Final node ID mappings:', Array.from(this.createdNodeIds.entries()));

      this.toasterService.success(
        this.resourceService?.frmelmnts?.lbl?.skillMapSavedDraft || 
        'Your skill map has been successfully saved as draft.'
      );

    } catch (error) {
      console.error('Error in createTermsAndAssociations:', error);
      
      // Show appropriate error message
      let errorMessage = 'Failed to save skill map. Please try again.';
      if (error.message) {
        if (error.message.includes('status 401')) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else if (error.message.includes('status 403')) {
          errorMessage = 'You do not have permission to create terms.';
        } else if (error.message.includes('status 500')) {
          errorMessage = 'Server error occurred. Please try again later.';
        } else if (error.message.includes('Network error')) {
          errorMessage = 'Network error. Please check your connection.';
        }
      }
      
      this.toasterService.error(errorMessage);
      
      // Offer fallback to local save
      console.log('Attempting fallback to local save...');
      this.saveLocalDraftOnly();
    }
  }

  /**
   * Get framework identifier from various sources
   */
  private getFrameworkIdentifier(): string {
    // Try to get from URL parameters first
    const frameworkId = this.activatedRoute.snapshot.queryParams['frameworkId'] || 
                       this.activatedRoute.snapshot.params['frameworkId'] ||
                       this.frameworkId ||
                       this.skillMapData?.framework ||
                       this.skillMapData?.id;
    
    console.log('Framework identifier found:', frameworkId);
    return frameworkId;
  }

  /**
   * Build tree structure with level information and category mapping
   */
  private buildTreeStructureWithCategories(): any {
    if (!this.skillMapTreeComponent) {
      throw new Error('Tree component not available');
    }

    const rootNode = this.skillMapTreeComponent.getRootNode();
    if (!rootNode || !rootNode.children || rootNode.children.length === 0) {
      throw new Error('No tree data available');
    }

    // The actual skill map root node (not the FancyTree container)
    const actualRootNode = rootNode.children[0];
    
    // Build tree with level and category information
    const treeWithCategories = this.buildNodeWithCategory(actualRootNode, 1);
    console.log('Built tree structure:', treeWithCategories);
    
    return treeWithCategories;
  }

  /**
   * Recursively build node structure with category information
   */
  private buildNodeWithCategory(node: any, level: number): any {
    // Determine category based on level
    const category = this.getCategoryByLevel(level);
    
    const nodeData = {
      id: node.key || node.data?.id || node.id,
      name: node.data?.metadata?.name || '',
      code: node.data?.metadata?.code || '',
      description: node.data?.metadata?.description || '',
      level: level,
      category: category,
      children: [],
      originalNode: node
    };

    // Recursively process children
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        const childData = this.buildNodeWithCategory(child, level + 1);
        nodeData.children.push(childData);
      }
    }

    return nodeData;
  }

  /**
   * Get category name based on tree level
   */
  private getCategoryByLevel(level: number): string {
    switch (level) {
      case 1: return 'domain';
      case 2: return 'skill';
      case 3: return 'subskill';
      case 4: return 'observableElement';
      default: return 'observableElement'; // Default for deeper levels
    }
  }

  /**
   * Create terms sequentially level by level
   */
  private async createTermsSequentially(treeStructure: any, frameworkIdentifier: string): Promise<void> {
    console.log('Creating terms sequentially...');
    
    // Create a queue of all nodes organized by level
    const nodesByLevel: Map<number, any[]> = new Map();
    this.organizeNodesByLevel(treeStructure, nodesByLevel);

    console.log('Nodes organized by level:', Array.from(nodesByLevel.entries()).map(([level, nodes]) => ({
      level,
      count: nodes.length,
      nodes: nodes.map(n => ({ name: n.name, category: n.category }))
    })));

    // Process each level sequentially
    const levels = Array.from(nodesByLevel.keys()).sort((a, b) => a - b);
    
    for (const level of levels) {
      const nodesAtLevel = nodesByLevel.get(level) || [];
      console.log(`Processing level ${level} with ${nodesAtLevel.length} nodes`);
      
      // Create all terms at this level with retry logic
      const termCreationPromises = nodesAtLevel.map(node => 
        this.createSingleTermWithRetry(node, frameworkIdentifier, 3) // 3 retries
      );
      
      try {
        await Promise.all(termCreationPromises);
        console.log(`Completed level ${level} - Created terms for:`, 
          nodesAtLevel.map(n => ({ name: n.name, apiId: this.createdNodeIds.get(n.id) }))
        );
      } catch (error) {
        console.error(`Failed to create terms at level ${level}:`, error);
        throw new Error(`Failed to create terms at level ${level}: ${error.message}`);
      }
    }
    
    console.log('All terms created successfully. Total terms:', this.createdNodeIds.size);
  }

  /**
   * Create a single term with retry logic
   */
  private async createSingleTermWithRetry(node: any, frameworkIdentifier: string, maxRetries: number): Promise<void> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.createSingleTerm(node, frameworkIdentifier);
        return; // Success, exit retry loop
      } catch (error) {
        lastError = error;
        console.warn(`Attempt ${attempt}/${maxRetries} failed for term "${node.name}":`, error.message);
        
        if (attempt < maxRetries) {
          // Wait before retrying (exponential backoff)
          const delay = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s...
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    // All retries failed
    throw new Error(`Failed to create term "${node.name}" after ${maxRetries} attempts: ${lastError.message}`);
  }

  /**
   * Organize nodes by their level in the tree
   */
  private organizeNodesByLevel(node: any, nodesByLevel: Map<number, any[]>): void {
    const level = node.level;
    
    if (!nodesByLevel.has(level)) {
      nodesByLevel.set(level, []);
    }
    nodesByLevel.get(level)!.push(node);
    
    // Recursively process children
    for (const child of node.children) {
      this.organizeNodesByLevel(child, nodesByLevel);
    }
  }

  /**
   * Create a single term via API
   */
  private async createSingleTerm(node: any, frameworkIdentifier: string): Promise<void> {
    try {
      console.log(`Creating term for node: ${node.name} (${node.category})`);
      
      const requestBody = {
        request: {
          term: {
            name: node.name,
            code: node.code,
            description: node.description || ''
          }
        }
      };

      // Make API call using actual endpoint
      const apiUrl = `framework/v1/term/create?framework=${frameworkIdentifier}&category=${node.category}`;
      
      const response = await this.makeApiCall('POST', apiUrl, requestBody);
      
      // Validate response structure
      if (!response) {
        throw new Error('No response received from API');
      }
      
      if (response.responseCode !== 'OK') {
        throw new Error(`API returned error: ${response.responseCode} - ${response.params?.errmsg || 'Unknown error'}`);
      }
      
      if (!response.result || !response.result.node_id) {
        throw new Error('Invalid API response: missing node_id in result');
      }
      
      // Extract node ID from response
      const nodeIdArray = response.result.node_id;
      if (!Array.isArray(nodeIdArray) || nodeIdArray.length === 0) {
        throw new Error('Invalid API response: node_id should be a non-empty array');
      }
      
      const apiNodeId = nodeIdArray[0]; // Take first element
      this.createdNodeIds.set(node.id, apiNodeId);
      
      console.log(`Term created successfully: ${node.name} -> ${apiNodeId}`);
      
    } catch (error) {
      console.error(`Error creating term for ${node.name}:`, error);
      
      // Add more context to the error
      const enhancedError = new Error(`Failed to create term "${node.name}" (${node.category}): ${error.message}`);
      enhancedError.stack = error.stack;
      throw enhancedError;
    }
  }

  /**
   * Validate that all nodes in the tree structure have been created and have API node IDs
   */
  private validateAllNodesCreated(node: any): string[] {
    const missingNodes: string[] = [];
    
    // Check current node
    if (!this.createdNodeIds.has(node.id)) {
      missingNodes.push(node.name || node.id);
    }
    
    // Recursively check children
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        const childMissingNodes = this.validateAllNodesCreated(child);
        missingNodes.push(...childMissingNodes);
      }
    }
    
    return missingNodes;
  }

  /**
   * Create associations between parent and child terms
   */
  private async createAssociations(treeStructure: any, frameworkIdentifier: string): Promise<void> {
    console.log('Creating associations...');
    
    // Collect all association updates needed
    const associationUpdates: any[] = [];
    this.collectAssociationUpdates(treeStructure, associationUpdates);
    
    console.log('Association updates to process:', associationUpdates.map(update => ({
      parentName: update.parentName,
      parentCategory: update.parentCategory,
      parentApiId: update.parentNodeId,
      childrenCount: update.associations.length,
      children: update.associations.map(a => a.identifier)
    })));
    
    // Process all association updates with retry logic
    for (let i = 0; i < associationUpdates.length; i++) {
      const update = associationUpdates[i];
      console.log(`Processing association ${i + 1}/${associationUpdates.length} for ${update.parentName}`);
      
      try {
        await this.updateTermAssociationsWithRetry(update, frameworkIdentifier, 3); // 3 retries
      } catch (error) {
        console.error(`Failed to update associations for ${update.parentName}:`, error);
        throw new Error(`Failed to update associations for "${update.parentName}": ${error.message}`);
      }
    }
    
    console.log('All associations created successfully');
  }

  /**
   * Update term associations with retry logic
   */
  private async updateTermAssociationsWithRetry(update: any, frameworkIdentifier: string, maxRetries: number): Promise<void> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.updateTermAssociations(update, frameworkIdentifier);
        return; // Success, exit retry loop
      } catch (error) {
        lastError = error;
        console.warn(`Attempt ${attempt}/${maxRetries} failed for associations update "${update.parentName}":`, error.message);
        
        if (attempt < maxRetries) {
          // Wait before retrying (exponential backoff)
          const delay = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s...
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    // All retries failed
    throw new Error(`Failed to update associations for "${update.parentName}" after ${maxRetries} attempts: ${lastError.message}`);
  }

  /**
   * Recursively collect all association updates needed
   */
  private collectAssociationUpdates(node: any, updates: any[] = []): any[] {
    // If this node has children, create association update for it
    if (node.children && node.children.length > 0) {
      const parentApiNodeId = this.createdNodeIds.get(node.id);
      
      if (parentApiNodeId) {
        const childAssociations = node.children
          .map(child => this.createdNodeIds.get(child.id))
          .filter(childId => childId) // Remove undefined values
          .map(childId => ({ identifier: childId }));
        
        if (childAssociations.length > 0) {
          updates.push({
            parentNodeId: parentApiNodeId,
            parentCategory: node.category,
            associations: childAssociations,
            parentName: node.name
          });
        }
      }
      
      // Recursively collect from children
      for (const child of node.children) {
        this.collectAssociationUpdates(child, updates);
      }
    }
    
    return updates;
  }

  /**
   * Update term associations via API
   */
  private async updateTermAssociations(update: any, frameworkIdentifier: string): Promise<void> {
    try {
      console.log(`Updating associations for ${update.parentName} (${update.parentNodeId})`);
      console.log(`Adding ${update.associations.length} child associations:`, update.associations.map(a => a.identifier));
      
      const requestBody = {
        request: {
          term: {
            associations: update.associations
          }
        }
      };

      // Make API call using actual endpoint
      const apiUrl = `framework/v1/term/update/${update.parentNodeId}?framework=${frameworkIdentifier}&category=${update.parentCategory}`;
      
      const response = await this.makeApiCall('POST', apiUrl, requestBody);
      
      // Validate response structure
      if (!response) {
        throw new Error('No response received from API');
      }
      
      if (response.responseCode !== 'OK') {
        throw new Error(`API returned error: ${response.responseCode} - ${response.params?.errmsg || 'Unknown error'}`);
      }
      
      console.log(`Associations updated successfully for ${update.parentName}`);
      
      // Log the version key if available for debugging
      if (response.result && response.result.versionKey) {
        console.log(`New version key: ${response.result.versionKey}`);
      }
      
    } catch (error) {
      console.error(`Error updating associations for ${update.parentName}:`, error);
      
      // Add more context to the error
      const enhancedError = new Error(`Failed to update associations for "${update.parentName}" (${update.parentCategory}): ${error.message}`);
      enhancedError.stack = error.stack;
      throw enhancedError;
    }
  }

  /**
   * Make API call with proper error handling
   */
  private async makeApiCall(method: string, url: string, data?: any): Promise<any> {
    try {
      console.log(`Making actual API call: ${method} ${url}`, data);
      
      const option = {
        url: url,
        data: data,
        header: {
          'Content-Type': 'application/json',
          'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhcGlfYWRtaW4ifQ.-qfZEwBAoHFhxNqhGq7Vy_SNVcwB1AtMX8xbiVHF5FQ"
        }
      };
      
      let response: any;
      
      if (method === 'POST') {
        response = await this.publicDataService.post(option).toPromise();
      } else if (method === 'PUT') {
        response = await this.publicDataService.put(option).toPromise();
      } else {
        throw new Error(`Unsupported HTTP method: ${method}`);
      }
      
      console.log(`API response received for ${method} ${url}:`, response);
      return response;
      
    } catch (error) {
      console.error(`API call failed: ${method} ${url}`, error);
      
      // Re-throw with more context
      if (error.status) {
        throw new Error(`API call failed with status ${error.status}: ${error.message || 'Unknown error'}`);
      } else {
        throw new Error(`API call failed: ${error.message || 'Network error'}`);
      }
    }
  }

  /**
   * Get stored API node ID for a local node ID
   */
  public getApiNodeId(localNodeId: string): string | undefined {
    return this.createdNodeIds.get(localNodeId);
  }

  /**
   * Get all created node ID mappings
   */
  public getCreatedNodeIds(): Map<string, string> {
    return new Map(this.createdNodeIds);
  }

  /**
   * Check if API integration is enabled and framework ID is available
   */
  private isApiIntegrationEnabled(): boolean {
    return !!this.getFrameworkIdentifier();
  }

  /**
   * Save draft locally without API integration (fallback method)
   */
  private saveLocalDraftOnly(): void {
    try {
      console.log('Saving draft locally without API integration');
      
      this.updateLastModified();
      console.log('Skill map saved as draft (local only)');

      // Show success toaster with local save indication
      this.toasterService.success(
        'Your skill map has been saved locally as draft. ' +
        (this.resourceService?.frmelmnts?.lbl?.skillMapSavedDraft || '')
      );
      
    } catch (error) {
      console.error('Error in saveLocalDraftOnly:', error);
      this.toasterService.error('Failed to save skill map locally. Please try again.');
    }
  }
}
