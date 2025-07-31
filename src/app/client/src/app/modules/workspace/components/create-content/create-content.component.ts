import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResourceService, ConfigService, NavigationHelperService, ToasterService } from '@sunbird/shared';
import { FrameworkService, PermissionService, UserService, ContentService } from '@sunbird/core';
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
    private contentService: ContentService) {
    this.resourceService = resourceService;
    this.frameworkService = frameworkService;
    this.permissionService = permissionService;
    this.configService = configService;
    
    // Initialize framework form
    this.frameworkForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(120)]],
      code: ['', [Validators.pattern(/^[A-Za-z0-9_]+$/), Validators.maxLength(50)]],
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

    // Make API call to create framework (using dummy response for now)
    const option = {
      url: '/api/framework/v1/create',
      data: requestBody
    };

    // For now, simulate API response with dummy data
    // this.contentService.post(option).subscribe(
    // Dummy response simulation
    setTimeout(() => {
      const dummyResponse = {
        id: "api.framework.create",
        ver: "1.0",
        ts: new Date().toISOString(),
        params: {
          resmsgid: "023848b0-6d36-11f0-adfb-bf1585e44d30",
          msgid: "01961540-6d36-11f0-a8cb-63f26e4e8579",
          status: "successful",
          err: null,
          errmsg: null
        },
        responseCode: "OK",
        result: {
          node_id: requestBody.request.framework.code,
          versionKey: Date.now().toString()
        }
      };

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
          frameworkId: dummyResponse.result?.node_id
        }
      });
    }, 1000); // 1 second delay to simulate API call
  }

  /**
   * Generate framework code from name
   */
  private generateFrameworkCode(name: string): string {
    // Remove special characters and spaces, convert to uppercase
    const code = name.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase();
    // Add timestamp to ensure uniqueness
    const timestamp = Date.now().toString().slice(-4);
    return `${code}_${timestamp}`;
  }
}
