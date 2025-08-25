import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators, AsyncValidatorFn } from '@angular/forms';
import { Subject, Observable, of, timer } from 'rxjs';
import { takeUntil, map, catchError, switchMap, debounceTime } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { SkillMapTreeComponent } from '../skill-map-tree/skill-map-tree.component';
import { ToasterService, ResourceService } from '@sunbird/shared';
import { ContentService, PermissionService, FrameworkService, PublicDataService, UserService } from '@sunbird/core';
import { SkillMapTreeService, SkillMapNode, SkillMapData } from '../../services/skill-map-tree.service';

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
      this.skillMapTreeService.codeValidator.bind(this.skillMapTreeService),
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
  private uniqueCodeValidator(control: FormControl): { [key: string]: any } | null {
    return this.skillMapTreeService.uniqueCodeValidator(control, this.skillMapTreeComponent, this.selectedNodeData);
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
        if (response?.result?.Term?.length > 0) {
          return this.checkCodeInCurrentFramework(code).pipe(
            map((existsInFramework: boolean) => {
              return !existsInFramework; // Return true to show error only if not in current framework
            })
          );
        }
        return of(false); // Code doesn't exist in search, so no error
      }),
      catchError((error) => {
        return of(false); // Return false on error to not block form
      })
    );
  }

  // Method to check if code exists in current framework
  private checkCodeInCurrentFramework(code: string): Observable<boolean> {
    if (!this.frameworkId) {
      return of(false);
    }

    return this.frameworkService.getFrameworkCategories(this.frameworkId, "edit").pipe(
      map((response: any) => {
        if (response?.responseCode === 'OK' && response?.result?.framework) {
          const framework = response.result.framework;
          if (framework?.categories?.length > 0) {
            for (const category of framework.categories) {
              if (category?.terms?.length > 0) {
                for (const term of category.terms) {
                  if (term?.code === code) {
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
      if (this.selectedNodeData?.data?.root === true) {
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
    if (this.frameworkName?.trim()) {
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
    return this.editFormSubmitted && (!this.editFrameworkForm?.name || !this.editFrameworkForm.name.trim());
  }

  // Check if current selected node is an observableElement (end node)
  get isObservableElement(): boolean {
    if (!this.selectedNodeData?.getLevel) {
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
    private publicDataService: PublicDataService,
    private skillMapTreeService: SkillMapTreeService
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
        if (this.selectedNodeData?.data?.root === true) {
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
        if (this.selectedNodeData?.data?.root === true && this.skillMapData?.rootNode) {
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
        if (this.selectedNodeData?.data?.root === true && this.skillMapData?.rootNode) {
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
    if (event?.action === 'save') {
      this.saveNodeChanges();
    } else if (event?.field && event?.value !== undefined) {
      if (this.selectedNodeData?.data?.metadata) {
        this.selectedNodeData.data.metadata[event.field] = event.value;
        if (event.field === 'name' && this.selectedNodeData?.data?.root === true) {
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
    // Get framework name from query params similar to openEditFrameworkModal
    const queryParams = this.activatedRoute?.snapshot?.queryParams;
    const frameworkNameFromParams = queryParams?.['frameworkName'] || '';
    
    this.frameworkName = frameworkNameFromParams;
    this.skillMapData = {
      id: 'new-skilldomain',
      name: 'New Skill Domain', // Default metadata name
      description: 'A new skill domain',
      code: 'NEW_SKILL_DOMAIN', // Default metadata code
      status: 'Draft',
      framework: 'FMPS',
      rootNode: {
        id: 'root',
        name: frameworkNameFromParams || this.resourceService?.frmelmnts?.lbl?.untitled || 'Untitled', // Use framework name instead of "Untitled"
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
        name: frameworkData.name || this.resourceService?.frmelmnts?.lbl?.untitled || 'Untitled', // Use framework name instead of "Untitled"
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
          if (response?.responseCode === 'OK' && response?.result?.framework) {
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
      this.frameworkName = frameworkData?.name || 'Skill Domain';

      // Store framework ID for API calls
      if (frameworkData?.identifier) {
        this.frameworkId = frameworkData.identifier;
      }

      // Get framework name from query params for fallback
      const queryParams = this.activatedRoute?.snapshot?.queryParams;
      const frameworkName = queryParams?.['frameworkName'] || frameworkData?.name;

      // Process categories and terms to build tree structure
      const rootNode = this.skillMapTreeService.buildTreeFromCategories(
        frameworkData?.categories || [], 
        this.resourceService, 
        frameworkName
      );

      // Create skill map data structure
      // Note: The rootNode is now the domain term, not a framework-level root
      this.skillMapData = {
        id: frameworkData?.identifier || frameworkData?.code || '',
        name: frameworkData?.name || frameworkName || '',
        description: frameworkData?.description || '',
        code: frameworkData?.code || '',
        status: frameworkData?.status || 'Draft',
        framework: frameworkData?.identifier || '',
        rootNode: rootNode,
        createdBy: frameworkData?.createdBy || '',
        createdOn: frameworkData?.createdOn || new Date().toISOString(),
        lastModifiedOn: frameworkData?.lastUpdatedOn || new Date().toISOString(),
        version: frameworkData?.versionKey || '1.0'
      };

      // Extract all codes for validation
      this.extractAllCodes(this.skillMapData?.rootNode);

    } catch (error) {
      this.toasterService.error('Error processing skill domain data');
    }
  }

  private extractAllCodes(node: SkillMapNode): void {
    // Only add non-empty codes to the array
    if (node?.code && node.code.trim().length > 0) {
      this.allCodes.push(node.code);
    }
    if (node?.children) {
      node.children.forEach(child => this.extractAllCodes(child));
    }
  }

  // Tree event handler - main interaction with tree component
  public onTreeEvent(event: any): void {    
    switch (event?.type) {
      case 'nodeSelect':
      case 'nodeActivate':
        this.handleNodeSelection(event);
        break;
      case 'nodeAdded':
        this.handleNodeAdded(event);
        break;
      case 'deleteRequest':
        // Handle delete request from tree component
        this.deleteNode(event?.data);
        break;
      case 'nodeDelete':
        // Handle actual node deletion (after API call)
        this.handleNodeDelete(event);
        break;
    }
  }

  /**
   * Handle node selection/activation events
   */
  private handleNodeSelection(event: any): void {
    this.selectedNodeData = event?.data || this.skillMapTreeService.getDefaultNodeData();

    // Ensure metadata structure exists safely
    this.skillMapTreeService.ensureNodeMetadataStructure(this.selectedNodeData);
    
    // Sync root node data if needed
    this.skillMapTreeService.syncRootNodeData(this.selectedNodeData, this.skillMapData);
    
    // Update form controls with node data
    this.skillMapTreeService.updateFormControlsFromNodeData(
      this.selectedNodeData, 
      this.nameFormControl, 
      this.codeFormControl, 
      this.descriptionFormControl
    );
    
    // Handle observable element specific data
    this.skillMapTreeService.handleObservableElementData(
      this.isObservableElement,
      this.isUpdatingObservableData,
      this.selectedNodeData,
      {
        behavioralIndicators: this.behavioralIndicators,
        measurableOutcomes: this.measurableOutcomes,
        assessmentCriteria: this.assessmentCriteria,
        resetEmptyObservableInputControls: () => this.skillMapTreeService.resetEmptyObservableInputControls(
          this.behavioralIndicatorsInputControl,
          this.measurableOutcomesInputControl,
          this.assessmentCriteriaInputControl
        ),
        clearObservableElementData: () => this.skillMapTreeService.clearObservableElementData(
          this.behavioralIndicators,
          this.measurableOutcomes,
          this.assessmentCriteria,
          this.behavioralIndicatorsInputControl,
          this.measurableOutcomesInputControl,
          this.assessmentCriteriaInputControl
        )
      }
    );

    // If this is an observableElement and we're in view/edit mode with existing data,
    // fetch the latest data from API
    if (this.isObservableElement && !this.isUpdatingObservableData && this.selectedNodeData?.data?.id && this.selectedNodeData.data.id !== 'root') {
      // Only fetch if we don't already have the data or if data is empty
      const hasExistingData = this.behavioralIndicators.length > 0 || 
                             this.measurableOutcomes.length > 0 || 
                             this.assessmentCriteria.length > 0;
      
      if (!hasExistingData) {
        this.fetchAndUpdateObservableElementData().catch(error => {
          console.error('Failed to fetch observableElement data:', error);
        });
      }
    }
    
    // Reset form validation state
    this.skillMapTreeService.resetFormValidationState(
      this.showValidationErrors,
      this.nameFormControl,
      this.codeFormControl,
      this.descriptionFormControl
    );
    
    // Trigger validation updates with delay
    this.skillMapTreeService.scheduleValidationUpdate(
      () => this.refreshCodeValidation(),
      this.cdr
    );
  }

  public deleteNode(node: any): void {
    if (node && node?.getLevel() > 0) {
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
          this.isDeletingTerm = false;
        });
      }).catch(error => {
        this.isDeletingTerm = false;
        this.toasterService.error(this.resourceService?.messages?.emsg?.failedToDeleteTerm || 'Failed to delete. Please try again.');
      });
    }
  }

  private handleNodeAdded(event: any): void {
    this.updateSkillMapFromTree();

    // Use service to handle the core node data preparation
    this.selectedNodeData = this.skillMapTreeService.handleNodeAdded(event);

    // Sync form controls with the new node's initial data
    this.nameFormControl.setValue(this.selectedNodeData?.data?.metadata?.name || 'Untitled', { emitEvent: false });
    this.codeFormControl.setValue(this.selectedNodeData?.data?.metadata?.code || '', { emitEvent: false });
    this.descriptionFormControl.setValue(this.selectedNodeData?.data?.metadata?.description || '', { emitEvent: false });

    // Trigger validation updates for unique code checking with a small delay
    setTimeout(() => {
      this.refreshCodeValidation();
      this.cdr.detectChanges();
    }, 100);
  }

  private handleNodeDelete(event: any): void {
    this.updateSkillMapFromTree();
    
    // Use service to handle the core node selection logic
    this.selectedNodeData = this.skillMapTreeService.handleNodeDelete(event, this.selectedNodeData);
    
    // Trigger change detection to update Save as Draft button state
    this.cdr.detectChanges();
  }

  private updateSkillMapFromTree(): void {
    // Re-extract all codes from the tree to keep allCodes array updated
    this.allCodes = [];
    if (this.skillMapData?.rootNode) {
      this.extractAllCodes(this.skillMapData.rootNode);
    }
    this.skillMapTreeService.updateLastModified(this.skillMapData);
    // Trigger change detection for Save as Draft validation
    this.cdr.detectChanges();
  }

  public onNodeDataChange(): void {
    this.formErrors = { name: '', code: '', description: '' };
  }

  public saveNodeChanges(): void {
    const result = this.skillMapTreeService.saveNodeChanges(
      this.selectedNodeData, 
      this.skillMapData, 
      this.skillMapTreeComponent, 
      this.allCodes
    );
    
    if (!result.isValid) {
      this.formErrors = result.formErrors;
    }
  }

  public saveDraft(isReview?: boolean): void {
    if (this.codeFormControl?.hasError('codeExists')) {
      this.toasterService.error(this.resourceService?.frmelmnts?.lbl?.codeAlreadyExists || 'Code already exists. Please use a different code.');
      return;
    }

    // Set loading state
    this.isSavingDraft = true;

    // Set flag to show validation errors even without user interaction
    this.showValidationErrors = true;

    // First, ensure current form values are synced to the active node's metadata
    this.skillMapTreeService.syncFormToActiveNode(
      this.selectedNodeData,
      this.nameFormControl,
      this.codeFormControl,
      this.descriptionFormControl,
      this.skillMapTreeComponent
    );

    // Trigger form validation for all nodes to show mat-error messages
    this.triggerValidationForAllNodes();

    // Small delay to ensure tree is fully rendered before validation
    setTimeout(() => {
      // Validate all nodes and highlight those with errors - ONLY when saving
      if (this.skillMapTreeComponent) {
        const validationResult = this.skillMapTreeComponent?.validateAndHighlightNodes((nodeId: string) => {
          return this.validateNodeById(nodeId);
        });

        if (validationResult?.hasErrors) {
          // Reset loading state on validation error
          this.isSavingDraft = false;

          // Expand all tree nodes so user can see which nodes have validation errors
          this.skillMapTreeComponent?.expandAllNodes();

          // Determine the type of validation errors and show appropriate message
          const errorMessage = this.skillMapTreeService.getValidationErrorMessage(validationResult?.errorNodes, this.resourceService);

          this.toasterService.error(errorMessage);
          return; // Don't save if there are validation errors
        } else {
          // All validations passed, clear any highlights and save
          this.skillMapTreeComponent?.clearAllHighlights();
          // Reset validation flag since everything is valid
          this.showValidationErrors = false;
          this.createTermsAndAssociations(isReview).catch(error => {
            // Reset loading state on error
            this.isSavingDraft = false;
          });
        }
       
      } else {
        // Reset loading state if tree component not available
        this.isSavingDraft = false;
      }
    }, 100);
  }



  // Method to trigger validation for all nodes and show mat-error messages
  private triggerValidationForAllNodes(): void {
    if (!this.skillMapTreeComponent) return;

    try {
      const tree = this.skillMapTreeComponent?.getTree();
      if (tree) {
        // Visit all nodes in the tree
        tree.visit((node) => {
          if (node?.data && node.data.metadata) {
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
    if (!node?.data || !node.data.metadata) return;

    const metadata = node.data.metadata;
    const nodeId = node.key;

    // Check if this is the currently active node
    const activeNode = this.skillMapTreeComponent?.getActiveNode();
    const isActiveNode = activeNode && activeNode?.key === nodeId;

    if (isActiveNode) {
      // For active node, trigger validation on the actual form controls
      this.nameFormControl?.markAsTouched();
      this.nameFormControl?.updateValueAndValidity();

      this.codeFormControl?.markAsTouched();
      this.codeFormControl?.updateValueAndValidity();

      this.descriptionFormControl?.markAsTouched();
      this.descriptionFormControl?.updateValueAndValidity();
    } else {
      // For non-active nodes, we'll set validation errors directly in the node metadata
      // This will be used by the highlighting system to show which nodes have errors
      if (!metadata?.name || metadata.name.trim().length === 0) {
        metadata._hasNameError = true;
      } else {
        metadata._hasNameError = false;
      }

      if (!metadata?.code || metadata.code.trim().length === 0) {
        metadata._hasCodeError = true;
      } else {
        // Check for duplicate codes
        const trimmedCode = metadata.code.trim();
        const codeCount = this.skillMapTreeService.countCodeOccurrences(this.skillMapTreeComponent?.getRootNode()?.children?.[0], trimmedCode, nodeId);
        metadata._hasCodeError = codeCount > 0;
      }
    }
  }

  // Method to validate a specific node by its ID
  private validateNodeById(nodeId: string): boolean {
    if (!this.skillMapTreeComponent) return false;

    const node = this.skillMapTreeComponent?.getNodeById(nodeId);
    if (!node || !node?.data || !node.data.metadata) return false;

    const metadata = node.data.metadata;

    // Get node values directly from metadata (not from form controls to avoid interference)
    let nodeName = metadata?.name;
    let nodeCode = metadata?.code;

    // Check if this is the currently active node and get real-time values
    const activeNode = this.skillMapTreeComponent?.getActiveNode();
    const isActiveNode = activeNode && activeNode?.key === nodeId;

    if (isActiveNode) {
      // For active node, get values from form controls (real-time values)
      nodeName = this.nameFormControl?.value || '';
      nodeCode = this.codeFormControl?.value || '';
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
    const codeCount = this.skillMapTreeService.countCodeOccurrences(this.skillMapTreeComponent?.getRootNode()?.children?.[0], trimmedCode, nodeId);
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
      this.skillMapTreeComponent?.clearAllHighlights();
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
    const validationResult = this.skillMapTreeComponent?.validateAndHighlightNodes((nodeId: string) => {
      return this.validateNodeById(nodeId);
    });

    if (validationResult?.hasErrors) {
      // Expand all nodes to show validation errors
      this.skillMapTreeComponent?.expandAllNodes();

      return {
        isValid: false,
        errorMessage: this.skillMapTreeService.getValidationErrorMessage(validationResult?.errorNodes, this.resourceService),
        errorNodes: validationResult?.errorNodes
      };
    }

    return { isValid: true, errorMessage: '', errorNodes: [] };
  }

  /**
   * Perform depth-specific validations for Send for Review
   */
  private performDepthValidations(): { isValid: boolean, errorMessage: string, errorNodes: string[] } {
    return this.skillMapTreeService.performDepthValidations(this.skillMapTreeComponent, this.resourceService);
  }

  /**
   * Send framework for review via API call
   */
  public sendForReview(): void {
    // Sync current form values to active node before validation
    this.skillMapTreeService.syncFormToActiveNode(
      this.selectedNodeData,
      this.nameFormControl,
      this.codeFormControl,
      this.descriptionFormControl,
      this.skillMapTreeComponent
    );

    // Step 1: Perform all basic input validations (same as Save as Draft)
    const basicValidationResult = this.performBasicValidations();

    if (!basicValidationResult?.isValid) {
      this.toasterService.error(basicValidationResult?.errorMessage);
      return;
    }

    // Step 2: Perform depth-specific validations for Send for Review
    const depthValidationResult = this.performDepthValidations();

    if (!depthValidationResult?.isValid) {
      this.toasterService.error(depthValidationResult?.errorMessage);
      return;
    }
    
    if (this.codeFormControl?.hasError('codeExists')) {
      this.toasterService.error(this.resourceService?.frmelmnts?.lbl?.codeAlreadyExists || 'Code already exists. Please use a different code.');
      return;
    }

    this.isSendingForReview = true;

    if (!this.frameworkId) {
      this.toasterService.error(this.resourceService?.frmelmnts?.lbl?.frameworkIdNotFound || 'Framework ID not found. Cannot send for review.');
      this.isSendingForReview = false;
      return;
    }
    this.saveDraft(true);
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
    const option = {
      url: `framework/v3/review/${frameworkId}`,
      data: requestBody
    };

    this.contentService.postWithHeaders(option).subscribe({
      next: (response) => {
        this.isSendingForReview = false;

        if (response?.result) {
          this.toasterService.success(this.resourceService?.frmelmnts?.lbl?.frameworkSentForReview || 'Framework sent for review successfully');
          if (this.skillMapData) {
            this.skillMapData.status = 'Review';
            this.skillMapTreeService.updateLastModified(this.skillMapData);
          }
          this.loadSkillMapData();
        } else {
          this.toasterService.error(this.resourceService?.frmelmnts?.lbl?.failedToSendFrameworkForReview || 'Failed to send framework for review');
        }
      },
      error: (error) => {
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
      this.toasterService.error(this.resourceService?.frmelmnts?.lbl?.frameworkIdNotFound || 'Framework ID is required for publishing');
      this.isPublishing = false;
      return;
    }
    const publishRequest = {
      url: `framework/v1/publish/${frameworkId}`,
      data: {}
    };
    this.contentService.postWithHeaders(publishRequest).subscribe({
      next: (response: any) => {
        if (response && response?.responseCode === 'OK') {
          this.toasterService.success(this.resourceService?.frmelmnts?.lbl?.frameworkPublishedSuccessfully || 'Framework published successfully');
          if (this.skillMapData) {
            this.skillMapData.status = 'Live';
          }
          setTimeout(() => {
            this.router.navigate(['/workspace/content/skillmap-reviewer/1']);
          }, 2000);
        } else {
          this.toasterService.error(this.resourceService?.frmelmnts?.lbl?.failedToPublishFramework || 'Failed to publish framework');
        }
        
        this.isPublishing = false;
      },
      error: (error: any) => {
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

    this.contentService.postWithHeaders(rejectRequest).subscribe({
      next: (response: any) => {
        if (response && response?.responseCode === 'OK') {
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
          this.toasterService.error(this.resourceService?.frmelmnts?.lbl?.failedToRejectFramework || 'Failed to reject framework');
        }
        
        this.isRejecting = false;
      },
      error: (error: any) => {
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
    const queryParams = this.activatedRoute?.snapshot?.queryParams;
    if (queryParams?.['frameworkName'] && queryParams?.['frameworkDescription']) {
      this.editFrameworkForm = {
        name: queryParams?.['frameworkName'] || '',
        description: queryParams?.['frameworkDescription'] || ''
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
    this.contentService.get({ url: apiUrl }).subscribe(
      (response: any) => {

        if (response && response?.result && response.result.framework) {
          const framework = response.result.framework;
          this.editFrameworkForm = {
            name: framework?.name || '',
            description: framework?.description || ''
          };
          this.resetEditFormValidation();
          this.showEditFrameworkModal = true;
        } else {
          this.toasterService.error(this.resourceService?.frmelmnts?.lbl?.failedToFetchFrameworkData || 'Failed to fetch framework data.');
        }
      },
      (error: any) => {
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
    if (!this.editFrameworkForm?.name || !this.editFrameworkForm.name.trim()) {
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
          description: this.editFrameworkForm?.description || '',
          code: this.skillMapTreeService.generateFrameworkCode(this.editFrameworkForm.name.trim())
        }
      }
    };

    const apiUrl = `framework/v1/update/${frameworkId}`;

    this.contentService.patch({ url: apiUrl, data: requestBody }).subscribe(
      (response: any) => {

        if (response && response?.responseCode === 'OK') {
          this.frameworkName = this.editFrameworkForm?.name?.trim();
          if (this.skillMapData) {
            this.skillMapData.name = this.editFrameworkForm?.name?.trim();
            this.skillMapData.description = this.editFrameworkForm?.description || '';
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
        this.isUpdatingFramework = false;
        this.toasterService.error(
          this.resourceService?.frmelmnts?.lbl?.failedToUpdateFramework ||
          'Failed to update framework. Please try again.'
        );
      }
    );
  }

  public addBehavioralIndicator(): void {
    this.skillMapTreeService.addBehavioralIndicator(
      this.behavioralIndicatorsInputControl,
      this.behavioralIndicators,
      () => this.updateObservableElementDataSilently()
    );
  }

  public removeBehavioralIndicator(index: number): void {
    this.skillMapTreeService.removeBehavioralIndicator(
      index,
      this.behavioralIndicators,
      () => this.updateObservableElementDataSilently()
    );
  }

  public addMeasurableOutcome(): void {
    this.skillMapTreeService.addMeasurableOutcome(
      this.measurableOutcomesInputControl,
      this.measurableOutcomes,
      () => this.updateObservableElementDataSilently()
    );
  }

  public removeMeasurableOutcome(index: number): void {
    this.skillMapTreeService.removeMeasurableOutcome(
      index,
      this.measurableOutcomes,
      () => this.updateObservableElementDataSilently()
    );
  }

  public addAssessmentCriteria(): void {
    this.skillMapTreeService.addAssessmentCriteria(
      this.assessmentCriteriaInputControl,
      this.assessmentCriteria,
      () => this.updateObservableElementDataSilently()
    );
  }

  public removeAssessmentCriteria(index: number): void {
    this.skillMapTreeService.removeAssessmentCriteria(
      index,
      this.assessmentCriteria,
      () => this.updateObservableElementDataSilently()
    );
  }

  private updateObservableElementDataSilently(): void {
    this.skillMapTreeService.updateObservableElementDataSilently(
      this.selectedNodeData,
      this.behavioralIndicators,
      this.measurableOutcomes,
      this.assessmentCriteria,
      this.skillMapData,
      (value: boolean) => this.isUpdatingObservableData = value
    );
  }

  /**
   * Fetch observableElement data from API and update current node
   */
  public async fetchAndUpdateObservableElementData(): Promise<void> {
    if (!this.isObservableElement || !this.selectedNodeData?.data?.id) {
      return;
    }

    try {
      const frameworkCode = this.getFrameworkIdentifier();
      const termIdentifier = this.selectedNodeData.data.id.split('_')?.pop();

      const observableData = await this.skillMapTreeService.fetchObservableElementData(
        termIdentifier,
        frameworkCode,
        this.contentService
      );
      this.behavioralIndicators.push(...observableData.behavioralIndicators);
      this.measurableOutcomes.push(...observableData.measurableOutcomes);
      this.assessmentCriteria.push(...observableData.assessmentCriteria);

      // Update the node metadata
      if (this.selectedNodeData.data.metadata) {
        this.selectedNodeData.data.metadata.behavioralIndicators = [...observableData.behavioralIndicators];
        this.selectedNodeData.data.metadata.measurableOutcomes = [...observableData.measurableOutcomes];
        this.selectedNodeData.data.metadata.assessmentCriteria = [...observableData.assessmentCriteria];
      }
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error fetching observableElement data:', error);
      this.toasterService.error(this.resourceService?.frmelmnts?.lbl?.failedToFetchObservableElementData || 'Failed to fetch observableElement data from API');
    }
  }

  /**
   * Main method to create terms and associations via API calls
   */
  private async createTermsAndAssociations(isReview: boolean): Promise<void> {
    try {
      const frameworkIdentifier = this.getFrameworkIdentifier();
      if (!frameworkIdentifier) {
        this.saveLocalDraftOnly();
        return;
      }
      this.termCreationQueue = [];
      this.associationUpdateQueue = [];

      const treeStructure = this.buildTreeStructureWithCategories();

      await this.createTermsSequentially(treeStructure, frameworkIdentifier);
      const missingNodeIds = this.validateAllNodesCreated(treeStructure);
      if (missingNodeIds.length > 0) {
        throw new Error(`Cannot create associations: Missing API node IDs for: ${missingNodeIds.join(', ')}`);
      }

      await this.createAssociations(treeStructure, frameworkIdentifier);

      this.skillMapTreeService.updateLastModified(this.skillMapData);
      this.isSavingDraft = false;

      this.toasterService.success(
        this.resourceService?.frmelmnts?.lbl?.skillMapSavedDraft ||
        'Your skill domain has been successfully saved as draft.'
      );

       if (isReview) {
          this.makeReviewApiCall(this.frameworkId);
        }

    } catch (error) {
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
    const frameworkId = this.activatedRoute?.snapshot?.queryParams?.['frameworkId'] ||
      this.activatedRoute?.snapshot?.params?.['frameworkId'] ||
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

    const rootNode = this.skillMapTreeComponent?.getRootNode();
    if (!rootNode || !rootNode?.children || rootNode.children.length === 0) {
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
      id: node?.key || node?.data?.id || node?.id,
      name: node?.data?.metadata?.name || node?.title || '',
      code: node?.data?.metadata?.code || '',
      description: node?.data?.metadata?.description || '',
      level: level,
      category: category,
      children: [],
      originalNode: node,
      metadata: node?.data?.metadata || {} 
    };
    if (node?.children && node.children.length > 0) {
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
    const termData = node?.data;
    if (!termData) {
      return Promise.reject('Invalid term data');
    }

    const category = this.getCategoryByLevel(node?.getLevel());
    const termCode = termData?.code || termData?.metadata?.code;
    const frameworkIdentifier = this.frameworkId;

    if (!category || !termCode || !frameworkIdentifier) {
      return Promise.reject('Missing required parameters for term deletion');
    }
    const requestData = {
      category: category,
      code: termCode,
      framework: frameworkIdentifier
    };
    return this.frameworkService.retireTerm(requestData).toPromise().then(response => {
      if (response && response?.responseCode === 'OK') {
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
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt - 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    throw new Error(`Failed to create term "${node?.name}" after ${maxRetries} attempts: ${lastError?.message}`);
  }

  /**
   * Organize nodes by their level in the tree
   */
  private organizeNodesByLevel(node: any, nodesByLevel: Map<number, any[]>): void {
    const level = node?.level;

    if (!nodesByLevel.has(level)) {
      nodesByLevel.set(level, []);
    }
    nodesByLevel.get(level)!.push(node);
    for (const child of node?.children) {
      this.organizeNodesByLevel(child, nodesByLevel);
    }
  }

  /**
   * Create a single term via API
   */
  private async createSingleTerm(node: any, frameworkIdentifier: string): Promise<void> {
    try {
      // First check if code exists using search API
      const searchRequestBody = {
        request: {
          filters: {
            status: ["Live"],
            code: node?.code
          }
        }
      };

      // Make search API call
      const searchResponse = await this.skillMapTreeService.makeApiCall('POST', 'composite/v1/search', searchRequestBody, this.contentService);

      // Prepare term data
      const termData: any = {
        name: node?.name,
        code: node?.code,
        description: node?.description || ''
      };

      if (node?.category === 'observableElement' || node?.level === 4) {
        termData.behavioralIndicators = node?.metadata?.behavioralIndicators || [];
        termData.measurableOutcomes = node?.metadata?.measurableOutcomes || [];
        termData.assessmentCriteria = node?.metadata?.assessmentCriteria || [];
      }

      const requestBody = {
        request: {
          term: termData
        }
      };

      if (searchResponse?.result?.count === 0) {
        // Create new term
        const createApiUrl = `framework/v1/term/create?framework=${frameworkIdentifier}&category=${node?.category}`;
        const response = await this.skillMapTreeService.makeApiCall('POST', createApiUrl, requestBody, this.contentService);
        
        const nodeIdArray = response.result.node_id;
        if (!Array.isArray(nodeIdArray) || nodeIdArray.length === 0) {
          throw new Error('Invalid create API response: node_id should be a non-empty array');
        }

        const apiNodeId = nodeIdArray[0];
        this.createdNodeIds.set(node?.id, apiNodeId);
      } else {
        const searchTermIdentifier =  searchResponse?.result?.Term[0]?.identifier;
        const updateId = searchTermIdentifier?.split('_')?.pop() || node?.code;
        
        // Update existing term
        const updateApiUrl = `framework/v1/term/update/${updateId}?framework=${frameworkIdentifier}&category=${node?.category}`;
        const updateResponse = await this.skillMapTreeService.makeApiCall('PATCH', updateApiUrl, requestBody, this.contentService);

        if (updateResponse?.responseCode !== 'OK') {
          throw new Error(`Update API returned error: ${updateResponse?.responseCode} - ${updateResponse?.params?.errmsg || 'Unknown error'}`);
        }

        const finalIdentifier = updateResponse?.result?.node_id ||
          updateResponse?.result?.identifier ||
          updateResponse?.result?.versionKey ||
          node?.code;

        this.createdNodeIds.set(node?.id, finalIdentifier);
      }

    } catch (error) {
      const enhancedError = new Error(`Failed to create term "${node?.name}" (${node?.category}): ${error?.message}`);
      enhancedError.stack = error?.stack;
      throw enhancedError;
    }
  }

  /**
   * Validate that all nodes in the tree structure have been created and have API node IDs
   */
  private validateAllNodesCreated(node: any): string[] {
    const missingNodes: string[] = [];
    if (!this.createdNodeIds.has(node?.id)) {
      missingNodes.push(node?.name || node?.id);
    }
    if (node?.children && node.children.length > 0) {
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
        if (!association?.identifier || association.identifier === update?.parentNodeId) {
          throw new Error(`Invalid association: Child identifier "${association?.identifier}" cannot be same as parent "${update?.parentNodeId}" for parent "${update?.parentName}"`);
        }
      }
    }
    for (let i = 0; i < associationUpdates.length; i++) {
      const update = associationUpdates[i];

      try {
        await this.updateTermAssociationsWithRetry(update, frameworkIdentifier, 3); // 3 retries
      } catch (error) {
        throw new Error(`Failed to update associations for "${update?.parentName}": ${error?.message}`);
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
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt - 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    throw new Error(`Failed to update associations for "${update?.parentName}" after ${maxRetries} attempts: ${lastError?.message}`);
  }

  /**
   * Recursively collect all association updates needed
   */
  private collectAssociationUpdates(node: any, updates: any[] = []): any[] {
    if (node?.children && node.children.length > 0) {
      const parentApiNodeId = this.createdNodeIds.get(node?.id);

      if (parentApiNodeId) {
        const childAssociations = [];

        for (const child of node?.children) {
          const childApiNodeId = this.createdNodeIds.get(child?.id);
          if (childApiNodeId) {
            childAssociations.push({ identifier: childApiNodeId });
          } else {
            throw new Error(`Cannot create associations: Missing API node ID for child "${child?.name}"`);
          }
        }

        if (childAssociations.length > 0) {
          updates.push({
            parentNodeId: parentApiNodeId,
            parentCategory: node?.category,
            parentMetadataId: node?.metadata?.id,
            associations: childAssociations,
            parentName: node?.name,
            code: node?.code,
            level: node?.level,
            metadata: node?.metadata, // Include full metadata for observable element fields
            childrenDetails: node.children.map(child => ({
              name: child?.name,
              treeNodeId: child?.id,
              metadataId: child?.metadata?.id,
              apiNodeId: this.createdNodeIds.get(child?.id),
              category: this.getCategoryByLevel(child?.level)
            }))
          });
        }
      } else {
        console.warn(`No API node ID found for parent node: ${node?.name} (${node?.id})`);
      }
      for (const child of node?.children) {
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
      if (update?.parentCategory === 'observableElement' || update?.level === 4) {
        termData.behavioralIndicators = update?.metadata?.behavioralIndicators || [];
        termData.measurableOutcomes = update?.metadata?.measurableOutcomes || [];
        termData.assessmentCriteria = update?.metadata?.assessmentCriteria || [];
      }

      const requestBody = {
        request: {
          term: termData
        }
      };
      // Extract the last part after the last underscore from parentNodeId
      const nodeId = update?.parentNodeId?.split('_').pop() || update?.parentNodeId;
      const apiUrl = `framework/v1/term/update/${nodeId}?framework=${frameworkIdentifier}&category=${update?.parentCategory}`;

      const response = await this.skillMapTreeService.makeApiCall('PATCH', apiUrl, requestBody, this.contentService);
      if (!response) {
        throw new Error('No response received from API');
      }

      if (response?.responseCode !== 'OK') {
        throw new Error(`API returned error: ${response?.responseCode} - ${response?.params?.errmsg || 'Unknown error'}`);
      }

    } catch (error) {
      const enhancedError = new Error(`Failed to update associations for "${update?.parentName}" (${update?.parentCategory}): ${error?.message}`);
      enhancedError.stack = error?.stack;
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
   * Save draft locally without API integration (fallback method)
   */
  private saveLocalDraftOnly(): void {
    this.skillMapTreeService.saveLocalDraftOnly(
      this.skillMapData, 
      this.toasterService, 
      this.resourceService, 
      this
    );
  }
}
