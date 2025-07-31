import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { SkillMapTreeComponent } from '../skill-map-tree/skill-map-tree.component';
import { ToasterService, ResourceService } from '@sunbird/shared';

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

  public unsubscribe$ = new Subject<void>();
  public contentId: string;
  public isLoading = true;
  public skillMapData: SkillMapData;
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

  // Get the skill map name for the header - either root node name or fallback
  get skillMapName(): string {
    if (this.skillMapData?.rootNode?.name) {
      return this.skillMapData.rootNode.name.trim() || this.resourceService?.frmelmnts?.lbl?.untitled || 'Untitled';
    }
    return this.resourceService?.frmelmnts?.lbl?.skillMapEditor || 'Skill Map Editor';
  }

  // Save as Draft button should always be visible/enabled
  get canSaveAsDraft(): boolean {
    return true; // Always allow saving as draft regardless of validation state
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
    public resourceService: ResourceService
  ) { }

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
      
      // Check for framework data from query parameters
      this.activatedRoute.queryParams.pipe(takeUntil(this.unsubscribe$)).subscribe(queryParams => {
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
    // Create default structure compatible with FancyTree
    this.skillMapData = {
      id: 'new-skillmap',
      name: 'New Skill Map',
      description: 'A new skill map',
      code: 'NEW_SKILLMAP',
      status: 'Draft',
      framework: 'NCF',
      rootNode: {
        id: 'root',
        name: this.resourceService?.frmelmnts?.lbl?.untitled || 'Untitled Skill Map',
        description: '', // No default description
        code: '', // No default code for root node
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
    // Create default structure with framework data
    this.skillMapData = {
      id: 'new-skillmap',
      name: frameworkData.name,
      description: frameworkData.description,
      code: frameworkData.code,
      status: 'Draft',
      framework: 'NCF',
      rootNode: {
        id: 'root',
        name: frameworkData.name,
        description: frameworkData.description,
        code: frameworkData.code,
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

  private loadSkillMapData(): void {
    // Mock implementation - replace with actual service call
    this.skillMapData = this.generateMockSkillMapData();
    this.extractAllCodes(this.skillMapData.rootNode);
    this.isLoading = false;
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
          this.updateLastModified();
          console.log('Skill map saved as draft');

          // Show success toaster
          this.toasterService.success(this.resourceService?.frmelmnts?.lbl?.skillMapSavedDraft || 'Your skill map has been successfully saved as draft.');
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
    console.log('Preview functionality will be implemented');
  }

  public publishSkillMap(): void {
    console.log('Publish functionality will be implemented');
  }

  public goBack(): void {
    this.router.navigate(['/workspace/content/skillmap/1']);
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
}
