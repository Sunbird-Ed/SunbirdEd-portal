import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResourceService, ConfigService, NavigationHelperService, ToasterService } from '@sunbird/shared';
import { FrameworkService, PermissionService, UserService, ContentService, PublicDataService } from '@sunbird/core';
import { IImpressionEventInput } from '@sunbird/telemetry';
import { WorkSpaceService } from './../../services';
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
  public isCreating = false;
  public submitted = false;
  public showCreateFrameworkModal = false;
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
    private contentService: ContentService, private publicDataService: PublicDataService) {
    this.resourceService = resourceService;
    this.frameworkService = frameworkService;
    this.permissionService = permissionService;
    this.configService = configService;
    
    // Initialize framework form
    this.frameworkForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(120)]],
      description: ['', [Validators.maxLength(256)]]
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
          code: this.generateFrameworkCode(frameworkData.name),
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
  private generateFrameworkCode(name: string): string {
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
}
