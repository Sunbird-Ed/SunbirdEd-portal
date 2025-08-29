import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResourceService, ConfigService, NavigationHelperService, ToasterService } from '@sunbird/shared';
import { FrameworkService, PermissionService, UserService, ContentService, PublicDataService } from '@sunbird/core';
import { SearchService } from '@sunbird/core';
import { IImpressionEventInput } from '@sunbird/telemetry';
import { WorkSpaceService, EditorService } from './../../services';
import { SelectObservableOption } from '../select-observable/select-observable.component';
import * as _ from 'lodash-es';
// import { categoriesConfig } from '../../newConfig';
@Component({
  selector: 'app-create-content',
  templateUrl: './create-content.component.html'
})
export class CreateContentComponent implements OnInit, AfterViewInit {
  @ViewChild('frameworkModal') frameworkModal: any;

  /*
 roles allowed to create textBookRole
 */
  textBookRole: Array<string>;
  /**
    * lessonRole   access roles
  */
  lessonRole: Array<string>;
  /**
 * collectionRole  access roles
 */
  collectionRole: Array<string>;
  /**
  *  lessonplanRole access roles
  */
  lessonplanRole: Array<string>;
  /**
  *  lessonplanRole access roles
  */
  contentUploadRole: Array<string>;
  /**
   * courseRole  access roles
  */
  courseRole: Array<string>;
 /**
   * assesment access role
   */
  assessmentRole: Array<string>;
  /**
   * skillmap access role
   */
  skillmapRole: Array<string>;
  /**
   * questionbank access role
   */
  questionBankRole: Array<string>;
  /**
   * To call resource service which helps to use language constant
   */
  public resourceService: ResourceService;
  /**
   * Reference for framework service
  */
  public frameworkService: FrameworkService;

  /**
   * reference of permissionService service.
  */
  public permissionService: PermissionService;
  /**
  * reference of config service.
 */
  public configService: ConfigService;
  /**
	 * telemetryImpression
	*/
  telemetryImpression: IImpressionEventInput;
  public enableQuestionSetCreation;

  /**
   * Framework creation form
   */
  public frameworkForm: FormGroup;
  /**
   * Question Bank creation form
   */
  public questionBankForm: FormGroup;
  public isCreating = false;
  public isCreatingQuestionBank = false;
  public isQuestionBankReviewer = false;
  public isSkillMapUser = false;
  public submitted = false;
  public showCreateFrameworkModal = false;
  public showCreateQuestionBankModal = false;
  public showObservableElementsModal = false;
  public observableElementsOptions: SelectObservableOption[] = [];
  public selectedObservableElements: SelectObservableOption[] = [];
  public isLoadingObservableElements = false;
  private selectedObservableElement: SelectObservableOption;
  /**
  * Constructor to create injected service(s) object
  *
  * Default method of DeleteComponent class

  * @param {ResourceService} resourceService Reference of ResourceService
 */

  public categoriesConfig: any = []
  enableWorkspaceData: any = {
    request: {
      formType: "workspace",
      subType: "categories",
      formAction: "get"
    }
  }
  constructor(configService: ConfigService, resourceService: ResourceService,
    frameworkService: FrameworkService, permissionService: PermissionService,
    private activatedRoute: ActivatedRoute, public userService: UserService,
    public navigationhelperService: NavigationHelperService,
    public workSpaceService: WorkSpaceService, private router: Router,
    private formBuilder: FormBuilder, private toasterService: ToasterService,
    private contentService: ContentService, private publicDataService: PublicDataService,
    private searchService: SearchService, private editorService: EditorService) {
    this.resourceService = resourceService;
    this.frameworkService = frameworkService;
    this.permissionService = permissionService;
    this.configService = configService;
    
    // Initialize framework form
    this.frameworkForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(120)]],
      description: ['', [Validators.maxLength(256)]]
    });
    
    // Initialize question bank form
    this.questionBankForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(120)]],
      observable: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.frameworkService.initialize();
    this.textBookRole = this.configService.rolesConfig.workSpaceRole.textBookRole;
    this.lessonRole = this.configService.rolesConfig.workSpaceRole.lessonRole;
    this.collectionRole = this.configService.rolesConfig.workSpaceRole.collectionRole;
    this.lessonplanRole = this.configService.rolesConfig.workSpaceRole.lessonplanRole;
    this.contentUploadRole = this.configService.rolesConfig.workSpaceRole.contentUploadRole;
    this.assessmentRole = this.configService.rolesConfig.workSpaceRole.assessmentRole;
    this.courseRole = this.configService.rolesConfig.workSpaceRole.courseRole;
    this.skillmapRole = this.configService.rolesConfig.workSpaceRole.skillmapRole;
    this.questionBankRole = this.configService.rolesConfig.workSpaceRole.createRole || ['CONTENT_CREATOR'];
    
    // Check if user is a question bank reviewer (should not see create option)
    this.isQuestionBankReviewer = this.permissionService.checkRolesPermissions(['CONTENT_REVIEWER', 'CONTENT_REVIEW']);
    
    // Check if user only has skill map roles and should not see other content creation options
    const hasSkillMapRoles = this.permissionService.checkRolesPermissions(['SKILLMAP_CREATOR', 'SKILLMAP_REVIEWER']);
    const hasContentRoles = this.permissionService.checkRolesPermissions(['CONTENT_CREATOR', 'CONTENT_CREATION', 'CONTENT_REVIEWER', 'CONTENT_REVIEW', 'BOOK_CREATOR']);
    
    this.isSkillMapUser = hasSkillMapRoles && !hasContentRoles;
    
    this.workSpaceService.questionSetEnabled$.subscribe(
      (response: any) => {
        this.enableQuestionSetCreation = response.questionSetEnablement;
      }
    );
    this.workSpaceService.getFormData(this.enableWorkspaceData.request).subscribe((resp: any)=>{
      this.categoriesConfig = resp.result.form.data.fields;
    })
  }



  ngAfterViewInit () {
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env
        },
        edata: {
          type: this.activatedRoute.snapshot.data.telemetry.type,
          pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
          uri: this.activatedRoute.snapshot.data.telemetry.uri,
          duration: this.navigationhelperService.getPageLoadTime()
        }
      };
    });
  }

  showCategory(category){
    if(this.categoriesConfig.length > 0){
      return this.categoriesConfig.some( cat => cat.code == category && cat.visible == true);
    }
  }

  /**
   * Getter for name field validation
   */
  get nameField() {
    return this.frameworkForm.get('name');
  }

  /**
   * Check if name field has validation errors
   */
  get hasNameError() {
    const nameControl = this.frameworkForm.get('name');
    return nameControl && nameControl.invalid && (nameControl.touched || this.submitted);
  }

  /**
   * Check if question bank name field has validation errors
   */
  get hasQuestionBankNameError() {
    const nameControl = this.questionBankForm.get('name');
    return nameControl && nameControl.invalid && (nameControl.touched || this.submitted);
  }

  /**
   * Check if question bank observable field has validation errors
   */
  get hasQuestionBankObservableElementError() {
    return this.selectedObservableElements.length === 0 && this.submitted;
  }

  /**
   * Open the Create Framework modal
   */
  openCreateFrameworkModal() {
    // Reset form and state
    this.frameworkForm.reset();
    this.submitted = false;
    this.isCreating = false;
    this.showCreateFrameworkModal = true;
  }

  /**
   * Close the Create Framework modal
   */
  closeCreateFrameworkModal() {
    this.showCreateFrameworkModal = false;
    this.frameworkForm.reset();
    this.submitted = false;
    this.isCreating = false;
  }

  /**
   * Open the Create Question Bank modal
   */
  openCreateQuestionBankModal() {
    // Reset form and state
    this.questionBankForm.reset();
    this.submitted = false;
    this.isCreatingQuestionBank = false;
    this.selectedObservableElements = [];
    this.showCreateQuestionBankModal = true;
  }

  /**
   * Close the Create Question Bank modal
   */
  closeCreateQuestionBankModal() {
    this.showCreateQuestionBankModal = false;
    this.showObservableElementsModal = false; // Also close observable modal if open
    this.questionBankForm.reset();
    this.submitted = false;
    this.isCreatingQuestionBank = false;
    this.selectedObservableElements = []; // Reset selected elements
  }

  /**
   * Open observable elements selector
   */
  openObservableSelector() {
    this.showObservableElementsModal = true;
    this.loadObservableElements();
  }

  /**
   * Load observable elements from API
   */
  loadObservableElements() {
    if (this.observableElementsOptions.length > 0) {
      return; // Already loaded
    }

    this.isLoadingObservableElements = true;
    
    this.searchService.getObservableElements().subscribe(
      (response: any) => {
        this.isLoadingObservableElements = false;
        if (response && response.Term && Array.isArray(response.Term)) {
          this.observableElementsOptions = response.Term.map(item => ({
            identifier: item.identifier,
            code: item.code,
            name: item.name,
            ...item // Include all other properties
          }));
        } else {
          console.error('Invalid response format:', response);
          this.toasterService.error(
            this.resourceService?.frmelmnts?.emsg?.observableElementsLoadFailed || 
            'Failed to load observable elements. Please try again.'
          );
        }
      },
      (error: any) => {
        this.isLoadingObservableElements = false;
        console.error('Error loading observable elements:', error);
        this.toasterService.error(
          this.resourceService?.frmelmnts?.emsg?.observableElementsLoadFailed || 
          'Failed to load observable elements. Please try again.'
        );
      }
    );
  }

  /**
   * Handle observable elements selection
   */
  onObservableElementsSelected(selected: SelectObservableOption[]) {
    this.selectedObservableElements = selected;
    this.selectedObservableElement = selected[0]; // Store the first selected element
    
    // Update the form field value
    if (selected.length > 0) {
      const selectedElement = selected[0]; // Single select
      const displayValue = `${selectedElement.name} (${selectedElement.code})`;
      this.questionBankForm.patchValue({
        observable: displayValue
      });
    } else {
      this.questionBankForm.patchValue({
        observable: ''
      });
    }
    
    // Mark the field as touched for validation
    const observableControl = this.questionBankForm.get('observable');
    if (observableControl) {
      observableControl.markAsTouched();
    }
  }

  /**
   * Close observable elements modal
   */
  closeObservableElementsModal() {
    this.showObservableElementsModal = false;
  }

  /**
   * Create framework and navigate to skill map editor
   */
  createFramework(modal: any) {
    this.submitted = true;
    
    // Only validate name field
    const nameControl = this.frameworkForm.get('name');
    if (!nameControl || nameControl.invalid) {
      // Mark name field as touched to show validation error
      nameControl?.markAsTouched();
      return;
    }

    this.isCreating = true;

    // Get form values
    const frameworkData = this.frameworkForm.value;
    
    // Prepare API request
    const requestBody = {
      request: {
        framework: {
          name: frameworkData.name,
          description: frameworkData.description || "Enter your description",
          type: "SkillMap",
          code: this.generateCode(frameworkData.name),
          channels: [
            {
              identifier: this.userService?.channel
            }
          ],
          systemDefault: "Yes"
        }
      }
    };

    // Make API call to create framework using PublicDataService with /api prefix (like framework read APIs)
    const option = {
      url: 'framework/v1/create',
      data: requestBody
    };

    this.publicDataService.contentPost(option).subscribe(
      (response: any) => {
        if (response && response.result && response.result.node_id) {
          // After framework creation, create the required categories
          this.createFrameworkCategories(response.result.node_id, frameworkData, requestBody, modal);
        } else {
          this.isCreating = false;
          this.toasterService.error(this.resourceService?.frmelmnts?.emsg?.skillDomainCreationFailed || 
          'Failed to create skill Domain. Please try again.');
        }
      },
      (error: any) => {
        console.error('Error creating framework:', error);
        this.isCreating = false;
        this.toasterService.error(
          this.resourceService?.frmelmnts?.emsg?.skillDomainCreationFailed || 
          'Failed to create skill Domain. Please try again.'
        );
      }
    );
  }

  /**
   * Generate framework code from name
   */
  private generateCode(name: string): string {
    // Convert to lowercase, replace spaces and special characters with underscores
    const code = name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    return code;
  }

  /**
   * Create framework categories after framework creation
   */
  private createFrameworkCategories(nodeId: string, frameworkData: any, requestBody: any, modal: any) {
    const categories = [
      { name: "Domain", code: "domain" },
      { name: "Skill", code: "skill" },
      { name: "Sub Skill", code: "subSkill" },
      { name: "Observable Element", code: "observableElement" }
    ];

    // Create all categories sequentially
    this.createCategoriesSequentially(nodeId, categories, 0, frameworkData, requestBody, modal);
  }

  /**
   * Create categories sequentially (one after another)
   */
  private createCategoriesSequentially(nodeId: string, categories: any[], index: number, frameworkData: any, requestBody: any, modal: any) {
    if (index >= categories.length) {
      // All categories created successfully, now navigate to editor
      this.handleFrameworkCreationSuccess(frameworkData, requestBody, modal, nodeId);
      return;
    }

    const category = categories[index];
    const categoryOption = {
      url: `framework/v1/category/create?framework=${nodeId}`,
      data: {
        request: {
          category: {
            name: category.name,
            code: category.code
          }
        }
      }
    };

    this.contentService.post(categoryOption).subscribe(
      (response: any) => {  
        // Create next category
        this.createCategoriesSequentially(nodeId, categories, index + 1, frameworkData, requestBody, modal);
      },
      (error: any) => {
        console.error(`Error creating category ${category.name}:`, error);
        this.isCreating = false;
        this.toasterService.error(
          `Failed to create category: ${category.name}. Please try again.`
        );
      }
    );
  }

  /**
   * Handle framework creation success and navigate to editor
   */
  private handleFrameworkCreationSuccess(frameworkData: any, requestBody: any, modal: any, nodeId: string) {
    // Handle success response
    this.isCreating = false;
    
    // Close modal using multiple approaches
    if (modal && modal.deny) {
      modal.deny();
    }
    
    // Also use the ViewChild reference as backup
    if (this.frameworkModal && this.frameworkModal.deny) {
      this.frameworkModal.deny();
    }
    
    // Set the boolean flag as final backup
    this.showCreateFrameworkModal = false;
    
    // Show success message
    this.toasterService.success(
      this.resourceService?.frmelmnts?.smsg?.frameworkCreated || 'Framework created successfully!'
    );

    // Navigate to skill map editor with framework data
    this.router.navigate(['/workspace/content/skillmap/edit/new'], {
      queryParams: {
        frameworkName: frameworkData.name,
        frameworkCode: requestBody.request.framework.code,
        frameworkDescription: requestBody.request.framework.description,
        frameworkId: nodeId
      }
    });
  }

  /**
   * Create question bank and navigate to question bank editor
   */
  createQuestionBank(modal: any) {
    this.submitted = true;
    
    // Validate form - check selected observable elements instead of form control
    const nameControl = this.questionBankForm.get('name');
    if (!nameControl || nameControl.invalid || this.selectedObservableElements.length === 0) {
      return;
    }

    this.isCreatingQuestionBank = true;
    
    const questionBankData = this.questionBankForm.value;
    
    // Prepare content creation request data similar to data-driven component
    const requestData = {
      content: this.generateQuestionBankData(questionBankData)
    };

    // Create content using editorService
    this.editorService.create(requestData).subscribe(
      (response: any) => {
        this.isCreatingQuestionBank = false;
        
        if (modal && modal.deny) {
          modal.deny();
        }
        this.showCreateQuestionBankModal = false;
        
        // Show success message
        this.toasterService.success(
          this.resourceService?.frmelmnts?.smsg?.questionBankCreated || 'Question Bank created successfully!'
        );

        // Create lock and navigate to editor
        this.createLockAndNavigateToQuestionBankEditor({identifier: response.result.content_id});
      },
      (error: any) => {
        this.isCreatingQuestionBank = false;
        console.error('Error creating question bank:', error);
        this.toasterService.error(
          this.resourceService?.frmelmnts?.emsg?.questionBankCreationFailed || 
          'Failed to create question bank. Please try again.'
        );
      }
    );
  }

  /**
   * Generate question bank creation data
   */
  private generateQuestionBankData(formData: any) {
    const requestData = {
      name: formData.name,
      description: formData.description || 'Question Bank for bulk questions creation',
      createdBy: this.userService.userProfile.id,
      createdFor: this.userService?.userProfile?.rootOrgId ? [this.userService?.userProfile?.rootOrgId] : [],
      mimeType: this.configService.appConfig.CONTENT_CONST.CREATE_LESSON,
      primaryCategory: 'Question Bank',
      contentType: "Resource",
      framework: localStorage.getItem('selectedFramework'),
      observableElementIds: [this.selectedObservableElement.identifier]
    };

    // Add creator name
    if (!_.isEmpty(this.userService.userProfile.lastName)) {
      requestData['creator'] = this.userService.userProfile.firstName + ' ' + this.userService.userProfile.lastName;
    } else {
      requestData['creator'] = this.userService.userProfile.firstName;
    }

    return requestData;
  }

  /**
   * Create lock and navigate to question bank editor
   */
  private createLockAndNavigateToQuestionBankEditor(content: any) {
    const state = 'draft';
    const framework = localStorage.getItem('selectedFramework');
    
    // Navigate to content editor with assessment type (same as practice assessment)
    this.router.navigate(['/workspace/content/edit/content/', content.identifier, state, framework, 'Draft'], {
      queryParams: {
        contentType: 'assessment',
        primaryCategory: 'Question Bank',
        obsEleId: this.selectedObservableElement?.identifier
      }
    });
  }

  /**
   * Remove selected observable element
   */
  removeSelectedObservableElement() {
    this.selectedObservableElements = [];
    this.selectedObservableElement = null;
    this.questionBankForm.patchValue({
      observable: ''
    });
  }
}
