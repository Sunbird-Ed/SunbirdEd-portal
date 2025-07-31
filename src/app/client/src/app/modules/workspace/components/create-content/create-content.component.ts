import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResourceService, ConfigService, NavigationHelperService, ToasterService } from '@sunbird/shared';
import { FrameworkService, PermissionService, UserService } from '@sunbird/core';
import { IImpressionEventInput } from '@sunbird/telemetry';
import { WorkSpaceService } from './../../services';
import { SuiModalService, TemplateModalConfig, ModalTemplate } from 'ng2-semantic-ui-v9';
import * as _ from 'lodash-es';
// import { categoriesConfig } from '../../newConfig';
@Component({
  selector: 'app-create-content',
  templateUrl: './create-content.component.html'
})
export class CreateContentComponent implements OnInit, AfterViewInit {

  @ViewChild('createFrameworkModal')
  public createFrameworkModal: ModalTemplate<{ data: string }, string, string>;

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
    private formBuilder: FormBuilder, public modalService: SuiModalService,
    private toasterService: ToasterService) {
    this.resourceService = resourceService;
    this.frameworkService = frameworkService;
    this.permissionService = permissionService;
    this.configService = configService;
    
    // Initialize framework form
    this.frameworkForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(120)]],
      code: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9_]+$/), Validators.maxLength(50)]],
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
   * Open the Create Framework modal
   */
  openCreateFrameworkModal() {
    // Reset form and state
    this.frameworkForm.reset();
    this.submitted = false;
    this.isCreating = false;

    const config = new TemplateModalConfig<{ data: string }, string, string>(this.createFrameworkModal);
    config.mustScroll = true;
    config.isClosable = true;
    config.size = 'small';
    config.isInverted = false;

    this.modalService.open(config).onApprove(() => {
      // Handle approval if needed
    }).onDeny(() => {
      // Handle denial/cancel
    });
  }

  /**
   * Create framework and navigate to skill map editor
   */
  createFramework(modal: any) {
    this.submitted = true;
    
    if (this.frameworkForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.frameworkForm.controls).forEach(key => {
        this.frameworkForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isCreating = true;

    // Get form values
    const frameworkData = this.frameworkForm.value;

    // Simulate API call delay
    setTimeout(() => {
      this.isCreating = false;
      
      // Close modal
      modal.approve('created');
      
      // Show success message
      this.toasterService.success(
        this.resourceService?.frmelmnts?.smsg?.frameworkCreated || 'Framework created successfully!'
      );

      // Navigate to skill map editor with framework data
      this.router.navigate(['/workspace/content/skillmap/edit/new'], {
        queryParams: {
          frameworkName: frameworkData.name,
          frameworkCode: frameworkData.code,
          frameworkDescription: frameworkData.description
        }
      });
    }, 1000); // 1 second delay to show loader
  }
}
