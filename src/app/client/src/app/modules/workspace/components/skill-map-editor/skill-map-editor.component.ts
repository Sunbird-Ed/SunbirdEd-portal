import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators, AsyncValidatorFn } from '@angular/forms';
import { Subject, Observable, of, timer } from 'rxjs';
import { takeUntil, map, catchError, switchMap, debounceTime } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { SkillMapTreeComponent } from '../skill-map-tree/skill-map-tree.component';
import { ToasterService, ResourceService } from '@sunbird/shared';
import { ContentService, PermissionService, FrameworkService, PublicDataService, UserService } from '@sunbird/core';

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
  @ViewChild('rejectModal') rejectModalRef: any;

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
  public codeFormControl = new FormControl('', {
    validators: [
      Validators.required,
      this.codeValidator.bind(this),
      this.uniqueCodeValidator.bind(this)
    ],
    asyncValidators: [this.codeExistsValidator()]
  });
  public descriptionFormControl = new FormControl('', [Validators.maxLength(256)]);
  public enrolmentTypeFormControl = new FormControl('byUser', [Validators.required]);
  public timeLimitFormControl = new FormControl('no', [Validators.required]);

  // Observable Element Form Controls
  public behavioralIndicatorsInputControl = new FormControl('');
  public measurableOutcomesInputControl = new FormControl('');
  public assessmentCriteriaInputControl = new FormControl('');

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
  public showRejectModal: boolean = false;
  public isUpdatingFramework: boolean = false;
  public isSavingDraft: boolean = false;
  public isSendingForReview: boolean = false;
  public isPublishing: boolean = false;
  public isRejecting: boolean = false;
  public isDeletingTerm: boolean = false;
  
  public editFrameworkForm: any = {
    name: '',
    description: ''
  };
  public editFormSubmitted: boolean = false;

  // Observable Element specific fields
  public behavioralIndicators: string[] = [];
  public measurableOutcomes: string[] = [];
  public assessmentCriteria: string[] = [];

  private isUpdatingObservableData: boolean = false;

  private frameworkId: string = '';
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
    if (!this.skillMapTreeComponent) return null;
    const activeNode = this.skillMapTreeComponent.getActiveNode();
    const currentNodeId = activeNode ? (activeNode.key || activeNode.data.id) : this.selectedNodeData?.data?.id;
    let codeCount = 0;
    const rootNode = this.skillMapTreeComponent.getRootNode();
    if (rootNode && rootNode.children && rootNode.children.length > 0) {
      const actualRootNode = rootNode.children[0];
      if (actualRootNode) {
        codeCount = this.countCodeOccurrences(actualRootNode, value.trim(), currentNodeId);
      }
    }
    if (codeCount > 0) {
      return { 'duplicateCode': { value: control.value } };
    }

    return null;
  }

  private countCodeOccurrences(treeNode: any, targetCode: string, excludeNodeId?: string): number {
    let count = 0;
    if (treeNode.data && treeNode.data.metadata && treeNode.data.metadata.code) {
      const nodeCode = treeNode.data.metadata.code.trim();
      if (nodeCode === targetCode.trim()) {
        const currentNodeId = treeNode.key || treeNode.data.id;
        if (!excludeNodeId || currentNodeId !== excludeNodeId) {
          count++;
        }
      }
    }
    if (treeNode.children && treeNode.children.length > 0) {
      for (const child of treeNode.children) {
        count += this.countCodeOccurrences(child, targetCode, excludeNodeId);
      }
    }

    return count;
  }

  // Async validator to check code existence via API
  private codeExistsValidator(): AsyncValidatorFn {
    return (control: FormControl): Observable<{ [key: string]: any } | null> => {
      const value = control.value;
      if (!value || !value.trim()) {
        return of(null);
      }
      return timer(500).pipe(
        switchMap(() => this.checkCodeExists(value.trim())),
        map(exists => exists ? { 'codeExists': { value: control.value } } : null),
        catchError(() => of(null)) // Return null on API error to not block form
      );
    };
  }

  // Method to check if code exists via API
  private checkCodeExists(code: string): Observable<boolean> {
    const requestBody = {
      request: {
        filters: {
          code: code,
          status: ["Live"]
        }
      }
    };

    const option = {
      url: 'composite/v1/search',
      data: requestBody
    };

    return this.contentService.post(option).pipe(
      switchMap((response: any) => {
        if (response && response.result && response.result.Term && response.result.Term.length > 0) {
          return this.checkCodeInCurrentFramework(code).pipe(
            map((existsInFramework: boolean) => {
              return !existsInFramework; // Return true to show error only if not in current framework
            })
          );
        }
        return of(false); // Code doesn't exist in search, so no error
      }),
      catchError((error) => {
        console.warn('Error checking code existence:', error);
        return of(false); // Return false on error to not block form
      })
    );
  }

  // Method to check if code exists in current framework
  private checkCodeInCurrentFramework(code: string): Observable<boolean> {
    if (!this.frameworkId) {
      console.warn('Framework ID not available for code validation');
      return of(false);
    }

    return this.frameworkService.getFrameworkCategories(this.frameworkId, "edit").pipe(
      map((response: any) => {
        if (response && response.responseCode === 'OK' && response.result && response.result.framework) {
          const framework = response.result.framework;
          if (framework.categories && framework.categories.length > 0) {
            for (const category of framework.categories) {
              if (category.terms && category.terms.length > 0) {
                for (const term of category.terms) {
                  if (term.code === code) {
                    return true; // Code found in current framework
                  }
                }
              }
            }
          }
        }
        return false; // Code not found in current framework
      }),
      catchError((error) => {
        console.warn('Error checking code in current framework:', error);
        return of(false); // Return false on error
      })
    );
  }

  get nodeName(): string {
    return this.nameFormControl.value || '';
  }

  set nodeName(value: string) {
    this.nameFormControl.setValue(value);
    if (this.selectedNodeData?.data?.metadata) {
      this.selectedNodeData.data.metadata.name = value;
      if (this.selectedNodeData.data.root === true) {
        if (this.skillMapData?.rootNode) {
          this.skillMapData.rootNode.name = value || this.resourceService?.frmelmnts?.lbl?.untitled || 'Untitled';
        }
      }
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
    return this.resourceService?.frmelmnts?.lbl?.skillMapEditor || 'Skill Domain Editor';
  }

  // Save as Draft button should only be disabled based on mode, not validation errors
  get canSaveAsDraft(): boolean {
    return this.isEditMode; // Only allow saving as draft in edit mode
  }

  // Edit Framework Modal validation getter
  get hasEditNameError(): boolean {
    return this.editFormSubmitted && (!this.editFrameworkForm.name || !this.editFrameworkForm.name.trim());
  }

  // Check if current selected node is an observableElement (end node)
  get isObservableElement(): boolean {
    if (!this.selectedNodeData || !this.selectedNodeData.getLevel) {
      return false;
    }
    // ObservableElement is at level 4 (domain=1, skill=2, subskill=3, observableElement=4)
    return this.selectedNodeData.getLevel() === 4;
  }

  private refreshCodeValidation(): void {
    if (this.codeFormControl) {
      this.codeFormControl.updateValueAndValidity({ emitEvent: false });
    }
  }

  constructor(
    public userService: UserService,
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
    this.isSkillMapCreator = this.permissionService.checkRolesPermissions(['SKILLMAP_CREATOR']);
    this.isSkillMapReviewer = this.permissionService.checkRolesPermissions(['SKILLMAP_REVIEWER']);
  }

  ngOnInit(): void {
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

    this.activatedRoute.queryParams.pipe(takeUntil(this.unsubscribe$)).subscribe(queryParams => {
      this.mode = queryParams['mode'] || 'edit';
      this.isViewMode = this.mode === 'view';
      this.isReviewMode = this.mode === 'review';
      this.isEditMode = this.mode === 'edit';
      if (queryParams['frameworkId']) {
        this.frameworkId = queryParams['frameworkId'];
      }

      this.updateConfigForMode();
      
      if (queryParams['frameworkName']) {
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

    this.nameFormControl.valueChanges.subscribe(value => {
      if (this.selectedNodeData?.data?.metadata) {
        this.selectedNodeData.data.metadata.name = value || '';
        if (this.selectedNodeData.data.root === true) {
          if (this.skillMapData?.rootNode) {
            this.skillMapData.rootNode.name = value || this.resourceService?.frmelmnts?.lbl?.untitled || 'Untitled';
          }
        }
        if (this.skillMapTreeComponent) {
          this.skillMapTreeComponent.updateActiveNodeTitle(value || '');
        }
        this.cdr.detectChanges();
      }
    });

    this.codeFormControl.valueChanges.subscribe(value => {
      if (this.selectedNodeData?.data?.metadata) {
        this.selectedNodeData.data.metadata.code = value || '';
        if (this.selectedNodeData.data.root === true && this.skillMapData?.rootNode) {
          this.skillMapData.rootNode.code = value || '';
        }
        setTimeout(() => {
          this.refreshCodeValidation();
          this.cdr.detectChanges();
        }, 0);
      }
    });

    this.descriptionFormControl.valueChanges.subscribe(value => {
      if (this.selectedNodeData?.data?.metadata) {
        this.selectedNodeData.data.metadata.description = value || '';
        if (this.selectedNodeData.data.root === true && this.skillMapData?.rootNode) {
          this.skillMapData.rootNode.description = value || '';
        }
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Update configuration based on mode (view, edit, review)
   */
  private updateConfigForMode(): void {
    if (this.isViewMode || this.isReviewMode) {
      this.labelConfig.showActions = false;
      if (this.isViewMode) {
        this.nameFormControl.disable();
        this.codeFormControl.disable();
        this.descriptionFormControl.disable();
      } else if (this.isReviewMode) {
        this.nameFormControl.disable();
        this.codeFormControl.disable();
        this.descriptionFormControl.disable();
      }
    } else {
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
    if (event.action === 'save') {
      this.saveNodeChanges();
    } else if (event.field && event.value !== undefined) {
      if (this.selectedNodeData?.data?.metadata) {
        this.selectedNodeData.data.metadata[event.field] = event.value;
        if (event.field === 'name' && this.selectedNodeData.data.root === true) {
          if (this.skillMapData?.rootNode) {
            this.skillMapData.rootNode.name = event.value || this.resourceService?.frmelmnts?.lbl?.untitled || 'Untitled';
          }
        }
        if (event.field === 'name') {
          this.nameFormControl.setValue(event.value, { emitEvent: false });
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
    this.frameworkName = '';
    this.skillMapData = {
      id: 'new-skilldomain',
      name: 'New Skill Domain', // Default metadata name
      description: 'A new skill domain',
      code: 'NEW_SKILL_DOMAIN', // Default metadata code
      status: 'Draft',
      framework: 'FMPS',
      rootNode: {
        id: 'root',
        name: this.resourceService?.frmelmnts?.lbl?.untitled || 'Untitled', // Always "Untitled" for new skill maps
        description: '', // Empty description for user to fill
        code: '', // Empty code for user to fill
        children: []
      },
      createdBy: this.userService.userProfile.id,
      createdOn: new Date().toISOString(),
      lastModifiedOn: new Date().toISOString(),
      version: '1.0'
    };

    this.extractAllCodes(this.skillMapData.rootNode);
    this.isLoading = false;
  }

  private createNewSkillMapWithFramework(frameworkData: { name: string, code: string, description: string }): void {
    this.frameworkName = frameworkData.name;
    if (!this.frameworkId && frameworkData.code) {
      this.frameworkId = frameworkData.code;
    }
    this.skillMapData = {
      id: 'new-skilldomain',
      name: frameworkData.name, // Framework name for metadata
      description: frameworkData.description,
      code: frameworkData.code, // Framework code for metadata
      status: 'Draft',
      framework: 'FMPS',
      rootNode: {
        id: 'root',
        name: this.resourceService?.frmelmnts?.lbl?.untitled || 'Untitled', // Always "Untitled" for new skill maps
        description: '', // Empty description for user to fill
        code: '', // Empty code for user to fill
        children: []
      },
      createdBy: this.userService.userProfile.id,
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
      this.frameworkId = this.contentId;
      this.fetchFrameworkData(this.contentId)
        .then((frameworkData) => {
          if (frameworkData) {
            this.processFrameworkApiResponse(frameworkData);
          } else {
            this.toasterService.error(this.resourceService?.frmelmnts?.lbl?.failedToLoadContent || 'Failed to load skill domain data');
            this.goBack();
          }
        })
        .catch((error) => {
          this.toasterService.error(this.resourceService?.frmelmnts?.lbl?.failedToLoadContent || 'Failed to load skill domain data');
          this.goBack();
        })
        .finally(() => {
          this.isLoading = false;
        });
    } else {
      this.isLoading = false;
    }
  }

  /**
   * Fetch framework data from API
   */
  private fetchFrameworkData(frameworkId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.frameworkService.getFrameworkCategories(frameworkId, "edit").subscribe(
        (response: any) => {
          if (response && response.responseCode === 'OK' && response.result && response.result.framework) {
            resolve(response.result.framework);
          } else {
            reject(new Error('Invalid API response'));
          }
        },
        (error: any) => {
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
      // Store framework name for header
      this.frameworkName = frameworkData.name || 'Skill Domain';

      // Store framework ID for API calls
      if (frameworkData.identifier) {
        this.frameworkId = frameworkData.identifier;
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

    } catch (error) {
      this.toasterService.error('Error processing skill domain data');
    }
  }

  /**
   * Build tree structure from framework categories
   * This is used when loading existing frameworks from API
   */
  private buildTreeFromCategories(categories: any[]): SkillMapNode {
    // If no categories, return empty root with "Untitled" (for new skill maps)
    if (!categories || categories.length === 0) {
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
        // Filter out retired terms
        const activeTerms = category.terms.filter(term => term.status !== 'Retired');
        
        if (activeTerms.length > 0) {
          termsByCategory.set(category.code, activeTerms);

          for (const term of activeTerms) {
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
    }
    // Find the domain term that should be the root for existing frameworks
    const domainTerms = termsByCategory.get('domain') || [];
    if (domainTerms.length === 0) {
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
    this.buildChildrenFromAssociations(rootNode, nodeMap, allTerms);
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
    for (const association of parentTerm.associations) {
      const childNode = nodeMap.get(association.identifier);
      const childTerm = allTerms.get(association.identifier);

      if (childNode && childTerm) {
        if (!this.isAncestorOf(childNode, parentNode)) {
          parentNode.children.push(childNode);
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

        // Load observableElement specific data if this is level 4 node
        if (this.isObservableElement) {
          // Only reload arrays if we're not currently updating observable data
          if (!this.isUpdatingObservableData) {
            this.behavioralIndicators = this.selectedNodeData.data.metadata.behavioralIndicators || [];
            this.measurableOutcomes = this.selectedNodeData.data.metadata.measurableOutcomes || [];
            this.assessmentCriteria = this.selectedNodeData.data.metadata.assessmentCriteria || [];
          }
          
          // Only reset input controls if they are empty
          if (!this.behavioralIndicatorsInputControl.value) {
            this.behavioralIndicatorsInputControl.setValue('', { emitEvent: false });
          }
          if (!this.measurableOutcomesInputControl.value) {
            this.measurableOutcomesInputControl.setValue('', { emitEvent: false });
          }
          if (!this.assessmentCriteriaInputControl.value) {
            this.assessmentCriteriaInputControl.setValue('', { emitEvent: false });
          }
        } else {
          // Clear arrays if not observableElement
          this.behavioralIndicators = [];
          this.measurableOutcomes = [];
          this.assessmentCriteria = [];
          this.behavioralIndicatorsInputControl.setValue('', { emitEvent: false });
          this.measurableOutcomesInputControl.setValue('', { emitEvent: false });
          this.assessmentCriteriaInputControl.setValue('', { emitEvent: false });
        }

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
      case 'deleteRequest':
        // Handle delete request from tree component
        this.deleteNode(event.data);
        break;
      case 'nodeDelete':
        // Handle actual node deletion (after API call)
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
      // Show loading state
      this.isDeletingTerm = true;
      
      // Call retire API before removing from tree
      this.retireTermFromAPI(node).then(() => {
        
        // After successful API call, call the tree component's deleteNode method
        if (this.skillMapTreeComponent) {
          this.skillMapTreeComponent.deleteNode(node);
        }
        
        // Refresh the tree data from server to hide retired terms
        this.refreshTreeData().then(() => {
          this.isDeletingTerm = false;
        }).catch(error => {
          console.error('Error refreshing tree data:', error);
          this.isDeletingTerm = false;
        });
      }).catch(error => {
        console.error('Error retiring term:', error);
        this.isDeletingTerm = false;
        this.toasterService.error(this.resourceService.messages.emsg.failedToDeleteTerm || 'Failed to delete. Please try again.');
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
  }

  private handleNodeDelete(event: any): void {
    this.updateSkillMapFromTree();
    if (this.selectedNodeData && this.selectedNodeData.data.id === event.data.data.id) {
      this.selectedNodeData = null;
    }
    // Trigger change detection to update Save as Draft button state
    this.cdr.detectChanges();
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

  public saveDraft(isReview?: boolean): void {
    // Check for code validation errors first
    if (this.codeFormControl.pending) {
      this.toasterService.warning(this.resourceService?.frmelmnts?.lbl?.codeValidationInProgress || 'Code validation in progress. Please wait.');
      return;
    }
    
    if (this.codeFormControl.hasError('codeExists')) {
      this.toasterService.error(this.resourceService?.frmelmnts?.lbl?.codeAlreadyExists || 'Code already exists. Please use a different code.');
      return;
    }

    // Set loading state
    this.isSavingDraft = true;

    // Get and log the tree data first
    this.getAndLogTreeData();

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
          // Reset loading state on validation error
          this.isSavingDraft = false;

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
          this.createTermsAndAssociations().catch(error => {
            console.error('Error in createTermsAndAssociations:', error);
            // Reset loading state on error
            this.isSavingDraft = false;
          });
        }
        if (isReview) {
          this.makeReviewApiCall(this.frameworkId);
        }
      } else {
        // Reset loading state if tree component not available
        this.isSavingDraft = false;
      }
    }, 100);
  }

  /**
   * Method to get and log the complete tree data
   */
  private getAndLogTreeData(): void {
    try {
      if (this.skillMapTreeComponent) {
        const tree = this.skillMapTreeComponent.getTree();
        if (tree) {
          // Get the complete tree data including all nodes and their metadata
          const completeTreeData = this.extractCompleteTreeData(tree);;
          return completeTreeData;
        }
      }
      console.warn('Tree component or tree not available for data extraction');
    } catch (error) {
      console.error('Error getting tree data:', error);
    }
  }

  /**
   * Extract complete tree data from FancyTree
   */
  private extractCompleteTreeData(tree: any): any {
    const extractNodeData = (node: any) => {
      const nodeData = {
        id: node.key || node.data?.metadata?.identifier,
        title: node.title,
        expanded: node.isExpanded(),
        selected: node.isSelected(),
        active: node.isActive(),
        hasChildren: node.hasChildren(),
        level: node.getLevel(),
        metadata: node.data?.metadata || {},
        children: []
      };

      // Recursively extract child data
      if (node.hasChildren() && node.children) {
        nodeData.children = node.children.map(child => extractNodeData(child));
      }

      return nodeData;
    };

    // Start from root and extract all data
    const rootChildren = tree.getRootNode().children || [];
    return {
      framework: {
        name: this.skillMapData?.name || this.frameworkName,
        code: this.skillMapData?.code,
        description: this.skillMapData?.description,
        status: this.skillMapData?.status
      },
      rootNodes: rootChildren.map(node => extractNodeData(node)),
      extractedAt: new Date().toISOString()
    };
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

    // Check if required fields are present (empty string, null, or undefined)
    // "Untitled" is considered a valid default name
    const hasValidName = nodeName && typeof nodeName === 'string' && nodeName.trim().length > 0;
    const hasValidCode = nodeCode && typeof nodeCode === 'string' && nodeCode.trim().length > 0;

    if (!hasValidName || !hasValidCode) {
      return false; // Missing required fields
    }

    // Check for duplicate codes (use trimmed code for comparison)
    const trimmedCode = nodeCode.trim();
    const codeCount = this.countCodeOccurrences(this.skillMapTreeComponent.getRootNode().children[0], trimmedCode, nodeId);
    if (codeCount > 0) {
      return false; // Duplicate code found
    }
    return true; // All validations passed
  }

  public previewSkillMap(): void {
    // Send for review - all validations are now handled in sendForReview() method
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
        errorMessage: this.resourceService?.frmelmnts?.lbl?.someNodesMissingChildren ||  `Some nodes are missing required children. Each node must have at least one child until the maximum depth is reached.`,
        errorNodes: hasCompletePathResult.incompleteNodes
      };
    }

    // Validation 2: Each non-leaf node should have children (except nodes at maxDepth)
    const missingChildrenResult = this.validateNodesHaveChildren(maxDepth);
    if (!missingChildrenResult.isValid) {
      missingChildrenResult.invalidNodes.forEach(nodeId => {
        this.skillMapTreeComponent.highlightNode(nodeId, 'add');
      });

      this.skillMapTreeComponent.expandAllNodes();

      return {
        isValid: false,
        errorMessage: this.resourceService?.frmelmnts?.lbl?.someNodesMissingChildren ||  'Some nodes are missing required children. Each node must have at least one child until the maximum depth is reached.',
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

    const actualRootNode = rootNode.children[0]; 
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
    if (currentDepth === maxDepth) {
      return true;
    }

    if (!node.children || node.children.length === 0) {
      return false;
    }

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

    if (currentDepth < maxDepth && (!node.children || node.children.length === 0)) {
      incompleteNodes.push(node.key || node.data?.id || node.id);
    }

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

    const actualRootNode = rootNode.children[0];
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
    if (currentDepth >= maxDepth) {
      return;
    }
    if (!node.children || node.children.length === 0) {
      invalidNodes.push(node.key || node.data?.id || node.id);
      return;
    }
    for (const child of node.children) {
      this.checkNodeChildren(child, currentDepth + 1, maxDepth, invalidNodes);
    }
  }

  /**
   * Send framework for review via API call
   */
  public sendForReview(): void {
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

    // // Step 3: Check for async code validation errors
    // if (this.codeFormControl.pending) {
    //   this.toasterService.warning(this.resourceService?.frmelmnts?.lbl?.codeValidationInProgress || 'Code validation in progress. Please wait.');
    //   return;
    // }
    
    if (this.codeFormControl.hasError('codeExists')) {
      this.toasterService.error(this.resourceService?.frmelmnts?.lbl?.codeAlreadyExists || 'Code already exists. Please use a different code.');
      return;
    }

    this.isSendingForReview = true;

    if (!this.frameworkId) {
      console.error('Framework ID not found');
      this.toasterService.error(this.resourceService?.frmelmnts?.lbl?.frameworkIdNotFound || 'Framework ID not found. Cannot send for review.');
      this.isSendingForReview = false;
      return;
    }
    this.makeReviewApiCall(this.frameworkId);
  }

  /**
   * Make the actual API call to send for review
   */
  public makeReviewApiCall(frameworkId: string): void {
    const requestBody = {
      request: {
        frameworkId: frameworkId
      }
    };
    this.saveDraft(true)
    const option = {
      url: `framework/v3/review/${frameworkId}`,
      data: requestBody
    };

    this.publicDataService.postWithHeaders(option).subscribe({
      next: (response) => {
        this.isSendingForReview = false;

        if (response?.result) {
          this.toasterService.success(this.resourceService?.frmelmnts?.lbl?.frameworkSentForReview || 'Framework sent for review successfully');
          if (this.skillMapData) {
            this.skillMapData.status = 'Review';
            this.updateLastModified();
          }
          this.loadSkillMapData();
        } else {
          console.error('Review API call returned unexpected response:', response);
          this.toasterService.error(this.resourceService?.frmelmnts?.lbl?.failedToSendFrameworkForReview || 'Failed to send framework for review');
        }
      },
      error: (error) => {
        console.error('Review API call failed:', error);
        this.isSendingForReview = false;
        let errorMessage = this.resourceService?.frmelmnts?.lbl?.failedToSendFrameworkForReview || 'Failed to send framework for review';
        this.toasterService.error(errorMessage);
      }
    });
  }

  public publishSkillMap(): void {
    if (!this.isSkillMapReviewer) {
      this.toasterService.warning(this.resourceService?.frmelmnts?.lbl?.onlyReviewersCanPublish || 'Only reviewers can publish skill domains');
      return;
    }
    this.isPublishing = true;
    const frameworkIdentifier = this.getFrameworkIdentifier();
    
    if (!frameworkIdentifier) {
      console.error('Framework ID not found for publishing');
      this.toasterService.error(this.resourceService?.frmelmnts?.lbl?.frameworkIdNotFound || 'Framework ID not found. Cannot publish framework.');
      this.isPublishing = false;
      return;
    }
    
    this.makePublishApiCall(frameworkIdentifier);
  }

  /**
   * Make the actual API call to publish the framework
   */
  private makePublishApiCall(frameworkId: string): void {
    if (!frameworkId) {
      console.error('Framework ID is required for publishing but not provided');
      this.toasterService.error(this.resourceService?.frmelmnts?.lbl?.frameworkIdNotFound || 'Framework ID is required for publishing');
      this.isPublishing = false;
      return;
    }
    const publishRequest = {
      url: `framework/v1/publish/${frameworkId}`,
      data: {}
    };
    this.publicDataService.postWithHeaders(publishRequest).subscribe({
      next: (response: any) => {
        if (response && response.responseCode === 'OK') {
          this.toasterService.success(this.resourceService?.frmelmnts?.lbl?.frameworkPublishedSuccessfully || 'Framework published successfully');
          if (this.skillMapData) {
            this.skillMapData.status = 'Live';
          }
          setTimeout(() => {
            this.router.navigate(['/workspace/content/skillmap-reviewer/1']);
          }, 2000);
        } else {
          console.error('Invalid publish response:', response);
          this.toasterService.error(this.resourceService?.frmelmnts?.lbl?.failedToPublishFramework || 'Failed to publish framework');
        }
        
        this.isPublishing = false;
      },
      error: (error: any) => {
        console.error('Error publishing framework:', error);
        let errorMessage = this.resourceService?.frmelmnts?.lbl?.failedToPublishFramework || 'Failed to publish framework';
        this.toasterService.error(errorMessage);
        this.isPublishing = false;
      }
    });
  }

  public rejectSkillMap(): void {
    if (!this.isSkillMapReviewer) {
      this.toasterService.warning(this.resourceService?.frmelmnts?.lbl?.onlyReviewersCanReject || 'Only reviewers can reject skill domains');
      return;
    }
    this.showRejectModal = true;
  }

  /**
   * Close reject confirmation modal
   */
  public closeRejectModal(): void {
    this.showRejectModal = false;
  }

  /**
   * Handle reject confirmation from modal
   */
  public confirmReject(): void {
    this.closeRejectModal();
    
    this.isRejecting = true;
    
    const frameworkIdentifier = this.getFrameworkIdentifier();
    if (!frameworkIdentifier) {
      console.error('Framework ID not found for rejection');
      this.toasterService.error(this.resourceService?.frmelmnts?.lbl?.frameworkIdNotFound || 'Framework ID not found');
      this.isRejecting = false;
      return;
    }
    
    this.makeRejectApiCall(frameworkIdentifier);
  }

  /**
   * Make the actual API call to reject the framework
   */
  private makeRejectApiCall(frameworkId: string): void {
    if (!frameworkId) {
      console.error('Framework ID is required for rejection but not provided');
      this.toasterService.error(this.resourceService?.frmelmnts?.lbl?.frameworkIdNotFound || 'Framework ID is required for rejection');
      this.isRejecting = false;
      return;
    }

    const rejectRequest = {
      url: `framework/v3/reject/${frameworkId}`,
      data: {
        request: {
          framework: {}
        }
      }
    };

    this.publicDataService.postWithHeaders(rejectRequest).subscribe({
      next: (response: any) => {
        if (response && response.responseCode === 'OK') {
          this.toasterService.success(
            this.resourceService?.frmelmnts?.lbl?.frameworkRejected || 'Framework rejected successfully'
          );
          
          // Update local status if available
          if (this.skillMapData) {
            this.skillMapData.status = 'Draft';
          }
          
          // Navigate to skillmap list after successful reject
          setTimeout(() => {
            this.router.navigate(['/workspace/content/skillmap-reviewer/1']);
          }, 2000);
        } else {
          console.error('Invalid reject response:', response);
          this.toasterService.error(this.resourceService?.frmelmnts?.lbl?.failedToRejectFramework || 'Failed to reject framework');
        }
        
        this.isRejecting = false;
      },
      error: (error: any) => {
        console.error('Error rejecting framework:', error);

        let errorMessage = this.resourceService?.frmelmnts?.lbl?.failedToRejectFramework || 'Failed to reject framework';
        this.toasterService.error(errorMessage);
        this.isRejecting = false;
      }
    });
  }

  public goBack(): void {
    if (this.isSkillMapReviewer) {
      this.router.navigate(['/workspace/content/skillmap-reviewer/1']);
    }
    else{
      this.router.navigate(['/workspace/content/skillmap/1']);
    }
  }

  /**
   * Open Edit Framework Modal
   */
  public openEditFrameworkModal(): void {
    const frameworkId = this.getFrameworkIdentifier();

    if (!frameworkId) {
      this.toasterService.error(this.resourceService?.frmelmnts?.lbl?.frameworkIdNotFound || 'Framework ID not found. Cannot edit framework.');
      return;
    }

    // Check if we already have framework data from query params or need to fetch
    const queryParams = this.activatedRoute.snapshot.queryParams;
    if (queryParams['frameworkName'] && queryParams['frameworkDescription']) {
      this.editFrameworkForm = {
        name: queryParams['frameworkName'] || '',
        description: queryParams['frameworkDescription'] || ''
      };
      this.resetEditFormValidation();
      this.showEditFrameworkModal = true;
    } else {
      this.fetchFrameworkDataForEdit(frameworkId);
    }
  }

  /**
   * Fetch framework data via API call for editing
   */
  private fetchFrameworkDataForEdit(frameworkId: string): void {
    const apiUrl = `framework/v3/read/${frameworkId}`;
    this.publicDataService.get({ url: apiUrl }).subscribe(
      (response: any) => {

        if (response && response.result && response.result.framework) {
          const framework = response.result.framework;
          this.editFrameworkForm = {
            name: framework.name || '',
            description: framework.description || ''
          };
          this.resetEditFormValidation();
          this.showEditFrameworkModal = true;
        } else {
          this.toasterService.error(this.resourceService?.frmelmnts?.lbl?.failedToFetchFrameworkData || 'Failed to fetch framework data.');
        }
      },
      (error: any) => {
        console.error('Error fetching framework data:', error);
        this.toasterService.error(
          this.resourceService?.frmelmnts?.lbl?.failedToFetchFrameworkData ||
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
    if (!this.editFrameworkForm.name || !this.editFrameworkForm.name.trim()) {
      return;
    }
    this.isUpdatingFramework = true;
    const frameworkId = this.getFrameworkIdentifier();

    if (!frameworkId) {
      this.isUpdatingFramework = false;
      this.toasterService.error(this.resourceService?.frmelmnts?.lbl?.frameworkIdNotFound || 'Framework ID not found. Cannot update framework.');
      return;
    }
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

    this.publicDataService.patch({ url: apiUrl, data: requestBody }).subscribe(
      (response: any) => {

        if (response && response.responseCode === 'OK') {
          this.frameworkName = this.editFrameworkForm.name.trim();
          if (this.skillMapData) {
            this.skillMapData.name = this.editFrameworkForm.name.trim();
            this.skillMapData.description = this.editFrameworkForm.description || '';
          }
          this.closeEditFrameworkModal();
          this.toasterService.success(
            this.resourceService?.frmelmnts?.lbl?.frameworkUpdated ||
            'Framework updated successfully!'
          );
        } else {
          this.isUpdatingFramework = false;
          this.toasterService.error(this.resourceService?.frmelmnts?.lbl?.failedToUpdateFramework || 'Failed to update framework. Invalid response from server.');
        }
      },
      (error: any) => {
        console.error('Error updating framework:', error);
        this.isUpdatingFramework = false;
        this.toasterService.error(
          this.resourceService?.frmelmnts?.lbl?.failedToUpdateFramework ||
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


  public addBehavioralIndicator(): void {
    const value = this.behavioralIndicatorsInputControl.value?.trim();
    if (value && !this.behavioralIndicators.includes(value)) {
      this.behavioralIndicators.push(value);
      this.behavioralIndicatorsInputControl.setValue('', { emitEvent: false });
      this.updateObservableElementDataSilently();
    }
  }

  public removeBehavioralIndicator(index: number): void {
    this.behavioralIndicators.splice(index, 1);
    this.updateObservableElementDataSilently();
  }

  public addMeasurableOutcome(): void {
    const value = this.measurableOutcomesInputControl.value?.trim();
    if (value && !this.measurableOutcomes.includes(value)) {
      this.measurableOutcomes.push(value);
      this.measurableOutcomesInputControl.setValue('', { emitEvent: false });
      this.updateObservableElementDataSilently();
    }
  }

  public removeMeasurableOutcome(index: number): void {
    this.measurableOutcomes.splice(index, 1);
    this.updateObservableElementDataSilently();
  }

  public addAssessmentCriteria(): void {
    const value = this.assessmentCriteriaInputControl.value?.trim();
    if (value && !this.assessmentCriteria.includes(value)) {
      this.assessmentCriteria.push(value);
      this.assessmentCriteriaInputControl.setValue('', { emitEvent: false });
      this.updateObservableElementDataSilently();
    }
  }

  public removeAssessmentCriteria(index: number): void {
    this.assessmentCriteria.splice(index, 1);
    this.updateObservableElementDataSilently();
  }

  private updateObservableElementDataSilently(): void {
    if (this.selectedNodeData && this.selectedNodeData.data && this.selectedNodeData.data.metadata) {
      this.isUpdatingObservableData = true;
      
      this.selectedNodeData.data.metadata.behavioralIndicators = [...this.behavioralIndicators];
      this.selectedNodeData.data.metadata.measurableOutcomes = [...this.measurableOutcomes];
      this.selectedNodeData.data.metadata.assessmentCriteria = [...this.assessmentCriteria];
      this.updateLastModified();
      setTimeout(() => {
        this.isUpdatingObservableData = false;
      }, 100);
    }
  }

  private getValidationErrorMessage(errorNodes: string[]): string {
    const errorCount = errorNodes.length;
    const errorDetails = this.analyzeValidationErrors(errorNodes);
    if (errorDetails.hasFormErrors) {
      return this.resourceService?.frmelmnts?.lbl?.invalidInputDetected || 'Invalid input detected. Please review';
    } else if (errorDetails.hasMissingFields) {
      return this.resourceService?.frmelmnts?.lbl?.fillRequiredFields || 'Please fill all the required fields';
    } else {
      return this.resourceService?.frmelmnts?.lbl?.failedToSaveSkillMap || 'Failed to save skill domain, Please try again later.';
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
      const activeNode = this.skillMapTreeComponent.getActiveNode();
      const isActiveNode = activeNode && activeNode.key === nodeId;

      let nodeName = metadata.name;
      let nodeCode = metadata.code;

      if (isActiveNode) {
        nodeName = this.nameFormControl.value || '';
        nodeCode = this.codeFormControl.value || '';
      }
      const hasValidName = nodeName && typeof nodeName === 'string' && nodeName.trim().length > 0;
      const hasValidCode = nodeCode && typeof nodeCode === 'string' && nodeCode.trim().length > 0;

      if (!hasValidName || !hasValidCode) {
        hasMissingFields = true;
      }

      if (hasValidCode) {
        const trimmedCode = nodeCode.trim();
        const codeCount = this.countCodeOccurrences(this.skillMapTreeComponent.getRootNode().children[0], trimmedCode, nodeId);
        if (codeCount > 0) {
          hasFormErrors = true;
        }
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
      const frameworkIdentifier = this.getFrameworkIdentifier();
      if (!frameworkIdentifier) {
        this.saveLocalDraftOnly();
        return;
      }
      this.createdNodeIds.clear();
      this.termCreationQueue = [];
      this.associationUpdateQueue = [];

      const treeStructure = this.buildTreeStructureWithCategories();

      await this.createTermsSequentially(treeStructure, frameworkIdentifier);
      const missingNodeIds = this.validateAllNodesCreated(treeStructure);
      if (missingNodeIds.length > 0) {
        throw new Error(`Cannot create associations: Missing API node IDs for: ${missingNodeIds.join(', ')}`);
      }

      await this.createAssociations(treeStructure, frameworkIdentifier);

      this.updateLastModified();
      this.isSavingDraft = false;

      this.toasterService.success(
        this.resourceService?.frmelmnts?.lbl?.skillMapSavedDraft ||
        'Your skill domain has been successfully saved as draft.'
      );

    } catch (error) {
      console.error('Error in createTermsAndAssociations:', error);
      this.isSavingDraft = false;
      let errorMessage = this.resourceService?.frmelmnts?.lbl?.failedToSaveSkillMap || 'Failed to save. Please try again.';
      this.toasterService.error(errorMessage);
      this.saveLocalDraftOnly();
    }
  }

  /**
   * Get framework identifier from various sources
   */
  private getFrameworkIdentifier(): string {
    const frameworkId = this.activatedRoute.snapshot.queryParams['frameworkId'] ||
      this.activatedRoute.snapshot.params['frameworkId'] ||
      this.frameworkId ||
      this.skillMapData?.framework ||
      this.skillMapData?.id;
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

    const actualRootNode = rootNode.children[0];
    const treeWithCategories = this.buildNodeWithCategory(actualRootNode, 1);

    return treeWithCategories;
  }

  /**
   * Recursively build node structure with category information
   */
  private buildNodeWithCategory(node: any, level: number): any {
    const category = this.getCategoryByLevel(level);

    const nodeData = {
      id: node.key || node.data?.id || node.id,
      name: node.data?.metadata?.name || node.title || '',
      code: node.data?.metadata?.code || '',
      description: node.data?.metadata?.description || '',
      level: level,
      category: category,
      children: [],
      originalNode: node,
      metadata: node.data?.metadata || {} 
    };
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        const childData = this.buildNodeWithCategory(child, level + 1);
        nodeData.children.push(childData);
      }
    }

    return nodeData;
  }

  /**
   * Refresh tree data from server (used after delete operations)
   */
  private refreshTreeData(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.loadSkillMapData();
      setTimeout(() => {
        resolve();
      }, 500);
    });
  }

  /**
   * Retire a term using the delete term API
   */
  private retireTermFromAPI(node: any): Promise<any> {
    const termData = node.data;
    if (!termData || !termData.metadata) {
      console.error('Invalid term data:', termData);
      return Promise.reject('Invalid term data');
    }

    const category = this.getCategoryByLevel(node.getLevel());
    const termCode = termData.metadata.code;
    const frameworkIdentifier = this.frameworkId;

    if (!category || !termCode || !frameworkIdentifier) {
      console.error('Missing required parameters:', { category, termCode, frameworkIdentifier });
      return Promise.reject('Missing required parameters for term deletion');
    }
    const requestData = {
      category: category,
      code: termCode,
      framework: frameworkIdentifier
    };
    return this.frameworkService.retireTerm(requestData).toPromise().then(response => {
      if (response && response.responseCode === 'OK') {
        return response;
      } else {
        throw new Error('Failed to retire term: ' + (response?.params?.errmsg || 'Unknown error'));
      }
    });
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
    const nodesByLevel: Map<number, any[]> = new Map();
    this.organizeNodesByLevel(treeStructure, nodesByLevel);
    const levels = Array.from(nodesByLevel.keys()).sort((a, b) => a - b);

    for (const level of levels) {
      const nodesAtLevel = nodesByLevel.get(level) || [];
      const termCreationPromises = nodesAtLevel.map(node =>
        this.createSingleTermWithRetry(node, frameworkIdentifier, 3) // 3 retries
      );

      try {
        await Promise.all(termCreationPromises);
      } catch (error) {
        console.error(`Failed to create terms at level ${level}:`, error);
        throw new Error(`Failed to create terms at level ${level}: ${error.message}`);
      }
    }

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
          const delay = Math.pow(2, attempt - 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
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
    for (const child of node.children) {
      this.organizeNodesByLevel(child, nodesByLevel);
    }
  }

  /**
   * Create a single term via API
   */
  private async createSingleTerm(node: any, frameworkIdentifier: string): Promise<void> {
    try {

      const termData: any = {
        name: node.name,
        code: node.code,
        description: node.description || ''
      };

      if (node.category === 'observableElement' || node.level === 4) {
        termData.behavioralIndicators = node.metadata?.behavioralIndicators || [];
        termData.measurableOutcomes = node.metadata?.measurableOutcomes || [];
        termData.assessmentCriteria = node.metadata?.assessmentCriteria || [];
      }

      const requestBody = {
        request: {
          term: termData
        }
      };
      const createApiUrl = `framework/v1/term/create?framework=${frameworkIdentifier}&category=${node.category}`;

      try {
        const response = await this.makeApiCall('POST', createApiUrl, requestBody);
        if (!response) {
          throw new Error('No response received from create API');
        }

        if (response.responseCode !== 'OK') {
          throw new Error(`Create API returned error: ${response.responseCode} - ${response.params?.errmsg || 'Unknown error'}`);
        }

        if (!response.result || !response.result.node_id) {
          throw new Error('Invalid create API response: missing node_id in result');
        }
        const nodeIdArray = response.result.node_id;
        if (!Array.isArray(nodeIdArray) || nodeIdArray.length === 0) {
          throw new Error('Invalid create API response: node_id should be a non-empty array');
        }

        const apiNodeId = nodeIdArray[0]; // Take first element
        this.createdNodeIds.set(node.id, apiNodeId);

      } catch (createError) {
        const updateApiUrl = `framework/v1/term/update/${requestBody?.request?.term?.code}?framework=${frameworkIdentifier}&category=${node.category}`;

        const updateResponse = await this.makeApiCall('PATCH', updateApiUrl, requestBody);

        if (updateResponse.responseCode !== 'OK') {
          throw new Error(`Update API returned error: ${updateResponse.responseCode} - ${updateResponse.params?.errmsg || 'Unknown error'}`);
        }

        const termIdentifier = updateResponse.result?.node_id ||
          updateResponse.result?.identifier ||
          updateResponse.result?.versionKey ||
          node.code;

        this.createdNodeIds.set(node.id, termIdentifier);
      }

    } catch (error) {
      console.error(`Error in createSingleTerm for ${node.name}:`, error);
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
    if (!this.createdNodeIds.has(node.id)) {
      missingNodes.push(node.name || node.id);
    }
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
    const associationUpdates: any[] = [];
    this.collectAssociationUpdates(treeStructure, associationUpdates);

    if (associationUpdates.length === 0) {
      return;
    }
    for (const update of associationUpdates) {
      for (const association of update.associations) {
        if (!association.identifier || association.identifier === update.parentNodeId) {
          console.error('Invalid association detected:', {
            parentName: update.parentName,
            parentApiId: update.parentNodeId,
            associationId: association.identifier,
            childrenDetails: update.childrenDetails
          });
          throw new Error(`Invalid association: Child identifier "${association.identifier}" cannot be same as parent "${update.parentNodeId}" for parent "${update.parentName}"`);
        }
      }
    }
    for (let i = 0; i < associationUpdates.length; i++) {
      const update = associationUpdates[i];

      try {
        await this.updateTermAssociationsWithRetry(update, frameworkIdentifier, 3); // 3 retries
      } catch (error) {
        console.error(`Failed to update associations for ${update.parentName}:`, error);
        throw new Error(`Failed to update associations for "${update.parentName}": ${error.message}`);
      }
    }
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
          const delay = Math.pow(2, attempt - 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    throw new Error(`Failed to update associations for "${update.parentName}" after ${maxRetries} attempts: ${lastError.message}`);
  }

  /**
   * Recursively collect all association updates needed
   */
  private collectAssociationUpdates(node: any, updates: any[] = []): any[] {
    if (node.children && node.children.length > 0) {
      const parentApiNodeId = this.createdNodeIds.get(node.id);

      if (parentApiNodeId) {
        const childAssociations = [];

        for (const child of node.children) {
          const childApiNodeId = this.createdNodeIds.get(child.id);
          if (childApiNodeId) {
            childAssociations.push({ identifier: childApiNodeId });
          } else {
            console.error(`Missing API node ID for child: ${child.name} (${child.id})`);
            throw new Error(`Cannot create associations: Missing API node ID for child "${child.name}"`);
          }
        }

        if (childAssociations.length > 0) {
          updates.push({
            parentNodeId: parentApiNodeId,
            parentCategory: node.category,
            parentMetadataId: node.metadata?.id,
            associations: childAssociations,
            parentName: node.name,
            code: node.code,
            level: node.level,
            metadata: node.metadata, // Include full metadata for observable element fields
            childrenDetails: node.children.map(child => ({
              name: child.name,
              treeNodeId: child.id,
              metadataId: child.metadata?.id,
              apiNodeId: this.createdNodeIds.get(child.id),
              category: this.getCategoryByLevel(child.level)
            }))
          });
        }
      } else {
        console.warn(`No API node ID found for parent node: ${node.name} (${node.id})`);
      }
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
      const termData: any = {
        associations: update.associations
      };
      if (update.parentCategory === 'observableElement' || update.level === 4) {
        termData.behavioralIndicators = update.metadata?.behavioralIndicators || [];
        termData.measurableOutcomes = update.metadata?.measurableOutcomes || [];
        termData.assessmentCriteria = update.metadata?.assessmentCriteria || [];
      }

      const requestBody = {
        request: {
          term: termData
        }
      };
      const apiUrl = `framework/v1/term/update/${update?.code}?framework=${frameworkIdentifier}&category=${update.parentCategory}`;

      const response = await this.makeApiCall('PATCH', apiUrl, requestBody);
      if (!response) {
        throw new Error('No response received from API');
      }

      if (response.responseCode !== 'OK') {
        throw new Error(`API returned error: ${response.responseCode} - ${response.params?.errmsg || 'Unknown error'}`);
      }

    } catch (error) {
      console.error(`Error updating associations for ${update.parentName}:`, error);
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
      const option = {
        url: url,
        data: data
      };
      let response: any;
      if (method === 'POST') {
        response = await this.publicDataService.post(option).toPromise();
      } else if (method === 'PUT') {
        response = await this.publicDataService.put(option).toPromise();
      } else if (method === 'PATCH') {
        response = await this.publicDataService.patch(option).toPromise();
      } else {
        throw new Error(`Unsupported HTTP method: ${method}`);
      }
      return response;
    } catch (error) {
      console.error(`API call failed: ${method} ${url}`, error);
      const enhancedError: any = new Error(`API call failed with ${method} ${url}: ${error.message || 'Unknown error'}`);
      if (error.status) {
        enhancedError.status = error.status;
      }
      if (error.responseCode) {
        enhancedError.responseCode = error.responseCode;
      }
      if (error.params) {
        enhancedError.params = error.params;
      }

      throw enhancedError;
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
      this.updateLastModified();
      this.isSavingDraft = false;
      this.toasterService.success(
        (this.resourceService?.frmelmnts?.lbl?.skillMapSavedDraft || '')
      );

    } catch (error) {
      this.isSavingDraft = false;
      this.toasterService.error(this.resourceService?.frmelmnts?.lbl?.skillMapSavedDraftFailed || 'Failed to save skill domain locally. Please try again.');
    }
  }
}
