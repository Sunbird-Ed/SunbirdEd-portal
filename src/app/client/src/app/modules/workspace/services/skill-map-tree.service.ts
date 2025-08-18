import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class SkillMapTreeService {

  constructor() { }

  /**
   * Code validator for form controls
   */
  codeValidator(control: FormControl): { [key: string]: any } | null {
    const value = control?.value;
    if (!value) return null;

    const validCodePattern = /^[a-zA-Z0-9_-]+$/;
    if (!validCodePattern.test(value)) {
      return { 'invalidCode': { value: control?.value } };
    }
    return null;
  }

  /**
   * Build tree structure from framework categories
   * This is used when loading existing frameworks from API
   */
  buildTreeFromCategories(categories: any[], resourceService: any): SkillMapNode {
    // If no categories, return empty root with "Untitled" (for new skill maps)
    if (!categories || categories.length === 0) {
      return {
        id: 'root',
        name: resourceService?.frmelmnts?.lbl?.untitled || 'Untitled',
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
      if (category?.terms && category.terms.length > 0) {
        // Filter out retired terms
        const activeTerms = category.terms.filter(term => term?.status !== 'Retired');
        
        if (activeTerms.length > 0) {
          termsByCategory.set(category?.code, activeTerms);

          for (const term of activeTerms) {
            // Store term with its category info
            allTerms.set(term?.identifier, {
              ...term,
              categoryCode: category?.code
            });

            // Create node for this term
            const node: SkillMapNode = {
              id: term?.identifier,
              name: term?.name,
              code: term?.code,
              description: term?.description || '',
              children: []
            };
            nodeMap.set(term?.identifier, node);
          }
        }
      }
    }
    // Find the domain term that should be the root for existing frameworks
    const domainTerms = termsByCategory.get('domain') || [];
    if (domainTerms.length === 0) {
      return {
        id: 'root',
        name: resourceService?.frmelmnts?.lbl?.untitled || 'Untitled',
        code: '',
        description: '',
        children: []
      };
    }

    // Use the first domain term as the root node (for existing frameworks)
    const domainTerm = domainTerms[0];
    const rootNode = nodeMap.get(domainTerm?.identifier);

    if (!rootNode) {
      console.error('Could not find domain node for root');
      return {
        id: 'root',
        name: resourceService?.frmelmnts?.lbl?.untitled || 'Untitled',
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
  buildChildrenFromAssociations(
    parentNode: SkillMapNode,
    nodeMap: Map<string, SkillMapNode>,
    allTerms: Map<string, any>
  ): void {
    const parentTerm = allTerms.get(parentNode?.id);
    if (!parentTerm || !parentTerm?.associations) {
      return;
    }
    for (const association of parentTerm.associations) {
      const childNode = nodeMap.get(association?.identifier);
      const childTerm = allTerms.get(association?.identifier);

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
  isAncestorOf(potentialAncestor: SkillMapNode, node: SkillMapNode): boolean {
    if (potentialAncestor?.id === node?.id) return true;

    for (const child of node?.children) {
      if (this.isAncestorOf(potentialAncestor, child)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get default node data structure
   */
  getDefaultNodeData(): any {
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

  /**
   * Handle node added event - prepare node data structure
   */
  handleNodeAdded(event: any): any {
    // Set the newly added node data
    const selectedNodeData = event?.data;

    // Ensure the new node has proper metadata structure
    if (!selectedNodeData?.data) {
      selectedNodeData.data = { metadata: { name: 'Untitled', code: '', description: '' } };
    }
    if (!selectedNodeData?.data?.metadata) {
      selectedNodeData.data.metadata = { name: 'Untitled', code: '', description: '' };
    }

    return selectedNodeData;
  }

  /**
   * Handle node delete event - check if selected node should be cleared
   */
  handleNodeDelete(event: any, selectedNodeData: any): any {
    // Check if the deleted node is currently selected
    if (selectedNodeData && selectedNodeData?.data?.id === event?.data?.data?.id) {
      return null; // Clear selection
    }
    return selectedNodeData; // Keep current selection
  }

  /**
   * Perform depth-specific validations for Send for Review
   */
  performDepthValidations(skillMapTreeComponent: any, resourceService: any): { isValid: boolean, errorMessage: string, errorNodes: string[] } {
    const maxDepth = this.getMaxDepthFromConfig(skillMapTreeComponent);
    const invalidNodes: string[] = [];

    // Validation 1: Check if at least one complete path to maxDepth exists
    const hasCompletePathResult = this.validateCompletePathToMaxDepth(maxDepth, skillMapTreeComponent);
    if (!hasCompletePathResult?.isValid) {
      return {
        isValid: false,
        errorMessage: resourceService?.frmelmnts?.lbl?.someNodesMissingChildren ||  `Some nodes are missing required children. Each node must have at least one child until the maximum depth is reached.`,
        errorNodes: hasCompletePathResult?.incompleteNodes
      };
    }

    // Validation 2: Each non-leaf node should have children (except nodes at maxDepth)
    const missingChildrenResult = this.validateNodesHaveChildren(maxDepth, skillMapTreeComponent);
    if (!missingChildrenResult?.isValid) {
      missingChildrenResult?.invalidNodes?.forEach(nodeId => {
        skillMapTreeComponent?.highlightNode(nodeId, 'add');
      });

      skillMapTreeComponent?.expandAllNodes();

      return {
        isValid: false,
        errorMessage: resourceService?.frmelmnts?.lbl?.someNodesMissingChildren ||  'Some nodes are missing required children. Each node must have at least one child until the maximum depth is reached.',
        errorNodes: missingChildrenResult?.invalidNodes
      };
    }

    return { isValid: true, errorMessage: '', errorNodes: [] };
  }

  /**
   * Get maxDepth from tree component configuration
   */
  private getMaxDepthFromConfig(skillMapTreeComponent: any): number {
    return skillMapTreeComponent?.config?.maxDepth || 4;
  }

  /**
   * Validate that at least one complete path to maxDepth exists
   */
  private validateCompletePathToMaxDepth(maxDepth: number, skillMapTreeComponent: any): { isValid: boolean, incompleteNodes: string[] } {
    if (!skillMapTreeComponent) {
      return { isValid: false, incompleteNodes: [] };
    }
    const rootNode = skillMapTreeComponent?.getRootNode();
    if (!rootNode || !rootNode?.children || rootNode.children.length === 0) {
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

    if (!node?.children || node.children.length === 0) {
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

    if (currentDepth < maxDepth && (!node?.children || node.children.length === 0)) {
      incompleteNodes.push(node?.key || node?.data?.id || node?.id);
    }

    if (node?.children && node.children.length > 0) {
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
  private validateNodesHaveChildren(maxDepth: number, skillMapTreeComponent: any): { isValid: boolean, invalidNodes: string[] } {
    const invalidNodes: string[] = [];
    const rootNode = skillMapTreeComponent?.getRootNode();

    if (!rootNode || !rootNode?.children || rootNode.children.length === 0) {
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
    if (!node?.children || node.children.length === 0) {
      invalidNodes.push(node?.key || node?.data?.id || node?.id);
      return;
    }
    for (const child of node?.children) {
      this.checkNodeChildren(child, currentDepth + 1, maxDepth, invalidNodes);
    }
  }

  /**
   * Save node changes - validates and updates node data
   */
  saveNodeChanges(selectedNodeData: any, skillMapData: any, skillMapTreeComponent: any, allCodes: string[]): { isValid: boolean, formErrors: any } {
    let formErrors = { name: '', code: '', description: '' };
    
    if (selectedNodeData && selectedNodeData?.data && selectedNodeData.data.metadata) {
      const metadata = selectedNodeData.data.metadata;
      const validationResult = this.validateNodeData(metadata, allCodes);
      
      if (validationResult?.isValid) {
        // Only update skillMapData.rootNode.name if this is the actual root node
        if (selectedNodeData?.data?.root === true) {
          if (skillMapData?.rootNode) {
            skillMapData.rootNode.name = metadata?.name || 'Untitled';
          }
        }

        // Update the tree node title using the more reliable method
        if (skillMapTreeComponent) {
          skillMapTreeComponent?.updateActiveNodeTitle(metadata?.name || '');
        }

        this.updateLastModified(skillMapData);
        return { isValid: true, formErrors };
      } else {
        return { isValid: false, formErrors: validationResult?.formErrors };
      }
    }
    
    return { isValid: false, formErrors };
  }

  /**
   * Validate node data
   */
  validateNodeData(metadata: any, allCodes: string[]): { isValid: boolean, formErrors: any } {
    let isValid = true;
    let formErrors = { name: '', code: '', description: '' };

    if (!metadata?.name || metadata.name.trim().length === 0) {
      formErrors.name = 'Name is required';
      isValid = false;
    }

    if (!metadata?.code || metadata.code.trim().length === 0) {
      formErrors.code = 'Code is required';
      isValid = false;
    } else if (allCodes?.filter(code => code === metadata.code).length > 1) {
      formErrors.code = 'Code must be unique';
      isValid = false;
    }

    return { isValid, formErrors };
  }

  /**
   * Update last modified timestamp
   */
  updateLastModified(skillMapData: any): void {
    if (skillMapData) {
      skillMapData.lastModifiedOn = new Date().toISOString();
    }
  }

  /**
   * Save draft locally without API integration (fallback method)
   */
  saveLocalDraftOnly(skillMapData: any, toasterService: any, resourceService: any, componentInstance: any): void {
    try {
      this.updateLastModified(skillMapData);
      if (componentInstance) {
        componentInstance.isSavingDraft = false;
      }
      toasterService?.success(
        (resourceService?.frmelmnts?.lbl?.skillMapSavedDraft || '')
      );

    } catch (error) {
      if (componentInstance) {
        componentInstance.isSavingDraft = false;
      }
      toasterService?.error(resourceService?.frmelmnts?.lbl?.skillMapSavedDraftFailed || 'Failed to save skill domain locally. Please try again.');
    }
  }

  /**
   * Unique code validator for form controls
   */
  uniqueCodeValidator(control: any, skillMapTreeComponent: any, selectedNodeData: any): { [key: string]: any } | null {
    const value = control?.value;
    if (!value || !value?.trim()) return null;
    if (!skillMapTreeComponent) return null;
    const activeNode = skillMapTreeComponent?.getActiveNode();
    const currentNodeId = activeNode ? (activeNode?.key || activeNode?.data?.id) : selectedNodeData?.data?.id;
    let codeCount = 0;
    const rootNode = skillMapTreeComponent?.getRootNode();
    if (rootNode && rootNode?.children && rootNode.children.length > 0) {
      const actualRootNode = rootNode.children[0];
      if (actualRootNode) {
        codeCount = this.countCodeOccurrences(actualRootNode, value.trim(), currentNodeId);
      }
    }
    if (codeCount > 0) {
      return { 'duplicateCode': { value: control?.value } };
    }

    return null;
  }

  /**
   * Count occurrences of a code in the tree
   */
  countCodeOccurrences(treeNode: any, targetCode: string, excludeNodeId?: string): number {
    let count = 0;
    if (treeNode?.data && treeNode.data.metadata && treeNode.data.metadata.code) {
      const nodeCode = treeNode.data.metadata.code.trim();
      if (nodeCode === targetCode.trim()) {
        const currentNodeId = treeNode?.key || treeNode?.data?.id;
        if (!excludeNodeId || currentNodeId !== excludeNodeId) {
          count++;
        }
      }
    }
    if (treeNode?.children && treeNode.children.length > 0) {
      for (const child of treeNode.children) {
        count += this.countCodeOccurrences(child, targetCode, excludeNodeId);
      }
    }

    return count;
  }

  /**
   * Ensure metadata structure exists on selected node
   */
  ensureNodeMetadataStructure(selectedNodeData: any): void {
    // DON'T overwrite existing metadata - just ensure structure exists
    if (!selectedNodeData?.data) {
      selectedNodeData.data = { metadata: { name: '', code: '', description: '' } };
    }
    if (!selectedNodeData?.data?.metadata) {
      selectedNodeData.data.metadata = { name: '', code: '', description: '' };
    }

    // Only initialize missing fields, don't overwrite existing ones
    const metadata = selectedNodeData?.data?.metadata;
    if (metadata?.name === undefined) {
      metadata.name = '';
    }
    if (metadata?.code === undefined) {
      metadata.code = '';
    }
    if (metadata?.description === undefined) {
      metadata.description = '';
    }
  }

  /**
   * Sync root node data with skillMapData if needed
   */
  syncRootNodeData(selectedNodeData: any, skillMapData: any): void {
    // ONLY for the actual root node, sync with skillMapData.rootNode if needed
    if (selectedNodeData?.data?.root === true && skillMapData?.rootNode) {
      const metadata = selectedNodeData?.data?.metadata;
      // Only sync if the tree node data is empty/undefined
      if (!metadata?.name) {
        metadata.name = skillMapData?.rootNode?.name || '';
      }
      if (!metadata?.code) {
        metadata.code = skillMapData?.rootNode?.code || '';
      }
      if (!metadata?.description) {
        metadata.description = skillMapData?.rootNode?.description || '';
      }
    }
  }

  /**
   * Update form controls with node data
   */
  updateFormControlsFromNodeData(selectedNodeData: any, nameFormControl: any, codeFormControl: any, descriptionFormControl: any): void {
    const metadata = selectedNodeData?.data?.metadata;
    // Sync form controls with the existing node data (don't modify the node data)
    nameFormControl?.setValue(metadata?.name || '', { emitEvent: false });
    codeFormControl?.setValue(metadata?.code || '', { emitEvent: false });
    descriptionFormControl?.setValue(metadata?.description || '', { emitEvent: false });
  }

  /**
   * Handle observable element specific data loading
   */
  handleObservableElementData(
    isObservableElement: boolean,
    isUpdatingObservableData: boolean,
    selectedNodeData: any,
    context: {
      behavioralIndicators: string[],
      measurableOutcomes: string[],
      assessmentCriteria: string[],
      resetEmptyObservableInputControls: () => void,
      clearObservableElementData: () => void
    }
  ): void {
    // Load observableElement specific data if this is level 4 node
    if (isObservableElement) {
      // Only reload arrays if we're not currently updating observable data
      if (!isUpdatingObservableData) {
        const metadata = selectedNodeData?.data?.metadata;
        if (context?.behavioralIndicators) {
          context.behavioralIndicators.length = 0;
          context.behavioralIndicators.push(...(metadata?.behavioralIndicators || []));
        }
        if (context?.measurableOutcomes) {
          context.measurableOutcomes.length = 0;
          context.measurableOutcomes.push(...(metadata?.measurableOutcomes || []));
        }
        if (context?.assessmentCriteria) {
          context.assessmentCriteria.length = 0;
          context.assessmentCriteria.push(...(metadata?.assessmentCriteria || []));
        }
      }
      
      // Only reset input controls if they are empty
      context?.resetEmptyObservableInputControls();
    } else {
      // Clear arrays if not observableElement
      context?.clearObservableElementData();
    }
  }

  /**
   * Reset observable input controls if they are empty
   */
  resetEmptyObservableInputControls(
    behavioralIndicatorsInputControl: any,
    measurableOutcomesInputControl: any,
    assessmentCriteriaInputControl: any
  ): void {
    if (!behavioralIndicatorsInputControl?.value) {
      behavioralIndicatorsInputControl?.setValue('', { emitEvent: false });
    }
    if (!measurableOutcomesInputControl?.value) {
      measurableOutcomesInputControl?.setValue('', { emitEvent: false });
    }
    if (!assessmentCriteriaInputControl?.value) {
      assessmentCriteriaInputControl?.setValue('', { emitEvent: false });
    }
  }

  /**
   * Clear observable element data
   */
  clearObservableElementData(
    behavioralIndicators: string[],
    measurableOutcomes: string[],
    assessmentCriteria: string[],
    behavioralIndicatorsInputControl: any,
    measurableOutcomesInputControl: any,
    assessmentCriteriaInputControl: any
  ): void {
    if (behavioralIndicators) behavioralIndicators.length = 0;
    if (measurableOutcomes) measurableOutcomes.length = 0;
    if (assessmentCriteria) assessmentCriteria.length = 0;
    behavioralIndicatorsInputControl?.setValue('', { emitEvent: false });
    measurableOutcomesInputControl?.setValue('', { emitEvent: false });
    assessmentCriteriaInputControl?.setValue('', { emitEvent: false });
  }

  /**
   * Reset form validation state
   */
  resetFormValidationState(
    showValidationErrors: boolean,
    nameFormControl: any,
    codeFormControl: any,
    descriptionFormControl: any
  ): void {
    // Reset touched state for form controls unless global validation is triggered
    if (!showValidationErrors) {
      nameFormControl?.markAsUntouched();
      codeFormControl?.markAsUntouched();
      descriptionFormControl?.markAsUntouched();
    }
  }

  /**
   * Schedule validation update with delay
   */
  scheduleValidationUpdate(refreshCodeValidation: () => void, cdr: any): void {
    // Trigger validation updates for unique code checking with a small delay
    setTimeout(() => {
      refreshCodeValidation();
      cdr?.detectChanges();
    }, 100);
  }

  /**
   * Make API call with proper error handling
   */
  async makeApiCall(method: string, url: string, data: any, publicDataService: any): Promise<any> {
    try {
      const option = {
        url: url,
        data: data
      };
      let response: any;
      if (method === 'POST') {
        response = await publicDataService?.post(option)?.toPromise();
      } else if (method === 'PUT') {
        response = await publicDataService?.put(option)?.toPromise();
      } else if (method === 'PATCH') {
        response = await publicDataService?.patch(option)?.toPromise();
      } else {
        throw new Error(`Unsupported HTTP method: ${method}`);
      }
      return response;
    } catch (error) {
      const enhancedError: any = new Error(`API call failed with ${method} ${url}: ${error?.message || 'Unknown error'}`);
      if (error?.status) {
        enhancedError.status = error.status;
      }
      if (error?.responseCode) {
        enhancedError.responseCode = error.responseCode;
      }
      if (error?.params) {
        enhancedError.params = error.params;
      }

      throw enhancedError;
    }
  }

  /**
   * Get validation error message based on error analysis
   */
  getValidationErrorMessage(errorNodes: string[], resourceService: any): string {
    const errorCount = errorNodes?.length;
    const errorDetails = this.analyzeValidationErrors(errorNodes, resourceService);
    if (errorDetails?.hasFormErrors) {
      return resourceService?.frmelmnts?.lbl?.invalidInputDetected || 'Invalid input detected. Please review';
    } else if (errorDetails?.hasMissingFields) {
      return resourceService?.frmelmnts?.lbl?.fillRequiredFields || 'Please fill all the required fields';
    } else {
      return resourceService?.frmelmnts?.lbl?.failedToSaveSkillMap || 'Failed to save skill domain, Please try again later.';
    }
  }

  /**
   * Analyze what types of validation errors exist
   */
  analyzeValidationErrors(
    errorNodes: string[], 
    resourceService: any,
    context?: {
      skillMapTreeComponent: any,
      nameFormControl: any,
      codeFormControl: any
    }
  ): { hasFormErrors: boolean, hasMissingFields: boolean } {
    let hasFormErrors = false;
    let hasMissingFields = false;

    if (!context?.skillMapTreeComponent) {
      // If no tree component context provided, assume missing fields
      return { hasFormErrors: false, hasMissingFields: true };
    }

    for (const nodeId of errorNodes) {
      const node = context?.skillMapTreeComponent?.getNodeById(nodeId);
      if (!node || !node?.data || !node.data.metadata) continue;
      const metadata = node.data.metadata;
      const activeNode = context?.skillMapTreeComponent?.getActiveNode();
      const isActiveNode = activeNode && activeNode?.key === nodeId;

      let nodeName = metadata?.name;
      let nodeCode = metadata?.code;

      if (isActiveNode && context?.nameFormControl && context?.codeFormControl) {
        nodeName = context?.nameFormControl?.value || '';
        nodeCode = context?.codeFormControl?.value || '';
      }
      const hasValidName = nodeName && typeof nodeName === 'string' && nodeName.trim().length > 0;
      const hasValidCode = nodeCode && typeof nodeCode === 'string' && nodeCode.trim().length > 0;

      if (!hasValidName || !hasValidCode) {
        hasMissingFields = true;
      }

      if (hasValidCode && context?.skillMapTreeComponent) {
        const trimmedCode = nodeCode.trim();
        const codeCount = this.countCodeOccurrences(context?.skillMapTreeComponent?.getRootNode()?.children?.[0], trimmedCode, nodeId);
        if (codeCount > 0) {
          hasFormErrors = true;
        }
        if (isActiveNode && context?.codeFormControl?.errors) {
          if (context?.codeFormControl?.errors?.['invalidCode'] || context?.codeFormControl?.errors?.['duplicateCode']) {
            hasFormErrors = true;
          }
        }
      }
    }

    return { hasFormErrors, hasMissingFields };
  }

  /**
   * Sync current form values to active node metadata
   */
  syncFormToActiveNode(
    selectedNodeData: any,
    nameFormControl: FormControl,
    codeFormControl: FormControl,
    descriptionFormControl: FormControl,
    skillMapTreeComponent?: any
  ): void {
    if (selectedNodeData?.data?.metadata) {
      // Update the metadata with current form values
      selectedNodeData.data.metadata.name = nameFormControl?.value || '';
      selectedNodeData.data.metadata.code = codeFormControl?.value || '';
      selectedNodeData.data.metadata.description = descriptionFormControl?.value || '';

      // Also update the tree node's data directly
      const activeNode = skillMapTreeComponent?.getActiveNode();
      if (activeNode && activeNode?.data && activeNode.data.metadata) {
        activeNode.data.metadata.name = nameFormControl?.value || '';
        activeNode.data.metadata.code = codeFormControl?.value || '';
        activeNode.data.metadata.description = descriptionFormControl?.value || '';
      }
    }
  }

  /**
   * Generate framework code from name
   */
  generateFrameworkCode(name: string): string {
    // Convert to lowercase, replace spaces and special characters with underscores
    const code = name?.toLowerCase()?.replace(/[^a-z0-9]+/g, '_')?.replace(/^_+|_+$/g, '');
    return code;
  }

  /**
   * Add behavioral indicator to the list
   */
  addBehavioralIndicator(
    inputControl: FormControl,
    behavioralIndicators: string[],
    updateCallback: () => void
  ): void {
    const value = inputControl?.value?.trim();
    if (value && !behavioralIndicators?.includes(value)) {
      behavioralIndicators?.push(value);
      inputControl?.setValue('', { emitEvent: false });
      updateCallback?.();
    }
  }

  /**
   * Remove behavioral indicator from the list
   */
  removeBehavioralIndicator(
    index: number,
    behavioralIndicators: string[],
    updateCallback: () => void
  ): void {
    if (index >= 0 && index < behavioralIndicators?.length) {
      behavioralIndicators?.splice(index, 1);
      updateCallback?.();
    }
  }

  /**
   * Add measurable outcome to the list
   */
  addMeasurableOutcome(
    inputControl: FormControl,
    measurableOutcomes: string[],
    updateCallback: () => void
  ): void {
    const value = inputControl?.value?.trim();
    if (value && !measurableOutcomes?.includes(value)) {
      measurableOutcomes?.push(value);
      inputControl?.setValue('', { emitEvent: false });
      updateCallback?.();
    }
  }

  /**
   * Remove measurable outcome from the list
   */
  removeMeasurableOutcome(
    index: number,
    measurableOutcomes: string[],
    updateCallback: () => void
  ): void {
    if (index >= 0 && index < measurableOutcomes?.length) {
      measurableOutcomes?.splice(index, 1);
      updateCallback?.();
    }
  }

  /**
   * Add assessment criteria to the list
   */
  addAssessmentCriteria(
    inputControl: FormControl,
    assessmentCriteria: string[],
    updateCallback: () => void
  ): void {
    const value = inputControl?.value?.trim();
    if (value && !assessmentCriteria?.includes(value)) {
      assessmentCriteria?.push(value);
      inputControl?.setValue('', { emitEvent: false });
      updateCallback?.();
    }
  }

  /**
   * Remove assessment criteria from the list
   */
  removeAssessmentCriteria(
    index: number,
    assessmentCriteria: string[],
    updateCallback: () => void
  ): void {
    if (index >= 0 && index < assessmentCriteria?.length) {
      assessmentCriteria?.splice(index, 1);
      updateCallback?.();
    }
  }

  /**
   * Update observable element data silently
   */
  updateObservableElementDataSilently(
    selectedNodeData: any,
    behavioralIndicators: string[],
    measurableOutcomes: string[],
    assessmentCriteria: string[],
    skillMapData: any,
    setUpdatingFlag: (value: boolean) => void
  ): void {
    if (selectedNodeData?.data?.metadata) {
      setUpdatingFlag?.(true);
      
      selectedNodeData.data.metadata.behavioralIndicators = [...(behavioralIndicators || [])];
      selectedNodeData.data.metadata.measurableOutcomes = [...(measurableOutcomes || [])];
      selectedNodeData.data.metadata.assessmentCriteria = [...(assessmentCriteria || [])];
      this.updateLastModified?.(skillMapData);
      setTimeout(() => {
        setUpdatingFlag?.(false);
      }, 100);
    }
  }

}
