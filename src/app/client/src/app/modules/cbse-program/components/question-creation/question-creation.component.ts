import { Component, OnInit, AfterViewInit, Output, Input, EventEmitter , OnChanges} from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ActivatedRoute, Router } from '@angular/router';
import {  ConfigService, ResourceService, IUserData, IUserProfile, ToasterService  } from '@sunbird/shared';
import { PublicDataService, UserService, ActionService } from '@sunbird/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';


// tslint:disable-next-line:import-blacklist
import * as _ from 'lodash';
@Component({
  selector: 'app-question-creation',
  templateUrl: './question-creation.component.html',
  styleUrls: ['./question-creation.component.css']
})
export class QuestionCreationComponent implements OnInit, AfterViewInit, OnChanges {
  public userProfile: IUserProfile;
  public publicDataService: PublicDataService;
  private toasterService: ToasterService;
  public resourceService: ResourceService;
  questionMetaForm: FormGroup;
  enableSubmitBtn = false;
  public isAssetBrowserReadOnly = false;
  initialized = false;
  public isQuestionFocused: boolean;
  public isAnswerFocused: boolean;
  @Input() tabIndex: any;
  @Input() questionMetaData: any;
  @Output() enableCreateButton = new EventEmitter < any > ();
  @Output() questionStatus = new EventEmitter < any > ();
  @Input() selectedAttributes: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private configService: ConfigService,
    publicDataService: PublicDataService,
    toasterService: ToasterService,
    resourceService: ResourceService,
    public actionService: ActionService
  ) {
    this.userService = userService;
    this.configService = configService;
    this.publicDataService = publicDataService;
    this.toasterService = toasterService;
    this.resourceService = resourceService;
  }
  answer_editor: any;
  question_editor: any;
  editor: any;
  myAssets = [];
  allImages = [];
  showImagePicker: boolean;
  showImageUploadModal: boolean;
  showErrorMsg: boolean;
  errorMsg: string;
  topicName: string;
  initializeImagePicker(editorType) {
    this.showImagePicker = true;
    this.editor = editorType === 'question' ? this.question_editor : this.answer_editor;
  }
  /**
   * function to hide image picker
   */
  dismissImagePicker() {
    this.showImagePicker = false;
  }

  /**
   * function to hide image upload modal
   */
  dismissImageUploadModal() {
    this.showImagePicker = true;
    this.showImageUploadModal = false;
  }

  /**
   * function to show image upload modal
   */
  initiateImageUploadModal() {
    this.showImagePicker = false;
    this.showImageUploadModal = true;
  }

  ngOnInit() {
    console.log('questionMetaData ', this.questionMetaData);
    this.initialized = true;
    this.initializeFormFields();
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
        }
      });
      if (this.questionMetaData.data) {
        this.questionMetaForm.controls.learningOutcome.setValue(this.questionMetaData.data.learningOutcome[0]);
        this.questionMetaForm.controls.bloomsLevel.setValue(this.questionMetaData.data.bloomsLevel[0]);
        this.questionMetaForm.controls.qlevel.setValue(this.questionMetaData.data.qlevel);
        this.questionMetaForm.controls.max_score.setValue(this.questionMetaData.data.max_score);
      }
  }

  ngAfterViewInit() {
    this.initializeEditors();
    this.initializeDropdown();
  }
  ngOnChanges() {
    if (this.initialized) {
      if (this.questionMetaData.mode === 'edit') {
        this.isEditorReadOnly(false);
      } else {
        this.isEditorReadOnly(true);
      }
      if (this.questionMetaData && this.questionMetaData.data) {
        this.question_editor.setData(this.questionMetaData.data.body);
        this.answer_editor.setData(this.questionMetaData.data.answers[0]);
        console.log(this.questionMetaForm);
        this.questionMetaForm.controls.learningOutcome.setValue(this.questionMetaData.data.learningOutcome[0]);
        this.questionMetaForm.controls.bloomsLevel.setValue(this.questionMetaData.data.bloomsLevel[0]);
        this.questionMetaForm.controls.qlevel.setValue(this.questionMetaData.data.qlevel);
        this.questionMetaForm.controls.max_score.setValue(this.questionMetaData.data.max_score);
      } else {
        this.questionMetaForm.reset();
        this.question_editor.setData('');
        this.answer_editor.setData('');
      }
    }
  }
  public isEditorReadOnly(state) {
    this.question_editor.isReadOnly = state;
    this.answer_editor.isReadOnly = state;
    this.isAssetBrowserReadOnly = state;
    console.log(this.isAssetBrowserReadOnly);

  }
  initializeEditors() {
    ClassicEditor.create(document.querySelector('#question_editor'), {
        toolbar: ['heading', '|', 'bold', '|', 'italic', '|',
          'bulletedList', '|', 'numberedList', '|', 'insertTable', '|'
        ],
        image: {
          toolbar: ['imageTextAlternative', '|', 'imageStyle:full', 'imageStyle:alignRight'],
          styles: ['full', 'alignLeft', 'alignRight', 'side', 'alignCenter']
        },
        isReadOnly: false,
        removePlugins: ['ImageCaption']
      })
      .then(editor => {
        this.question_editor = editor;
        if (this.questionMetaData && this.questionMetaData.data) {
          this.question_editor.setData(this.questionMetaData.data.body);
        }
        console.log('Editor was initialized', editor);
        this.focusTracker(this.question_editor);
      })
      .catch(error => {
        console.error(error.stack);
      });

    ClassicEditor.create(document.querySelector('#answer_editor'), {
        toolbar: ['heading', '|', 'bold', '|', 'italic', '|',
          'bulletedList', '|', 'numberedList', '|', 'insertTable', '|'
        ],
        image: {
          toolbar: ['imageTextAlternative', '|', 'imageStyle:full', 'imageStyle:alignRight'],
          styles: ['full', 'alignLeft', 'alignRight', 'side', 'alignCenter']
        },
        isReadOnly: false,
        removePlugins: ['ImageCaption']
      })
      .then(editor => {
        this.answer_editor = editor;
        if (this.questionMetaData && this.questionMetaData.data) {
          this.answer_editor.setData(this.questionMetaData.data.answers[0]);
        }
        console.log('Editor was initialized', editor);
        this.focusTracker(this.answer_editor);
      })
      .catch(error => {
        console.error(error.stack);
      });
    this.enableCreateButton.emit(false);
    // this.question_editor.setData(this.questionMetaData.data.body);
    // this.answer_editor.setData(this.questionMetaData.data.answers);
  }
  focusTracker(editor) {
    editor.model.document.on('change', (eventInfo, batch) => {
      const selectedElement = eventInfo.source.selection.getSelectedElement();
      if (selectedElement && selectedElement.name === 'image') {
        if (editor.sourceElement.id === 'question_editor') {
          this.isQuestionFocused = true;
        } else if (editor.sourceElement.id === 'answer_editor') {
          this.isAnswerFocused = true;
        }
        console.log(this.isQuestionFocused, this.isAnswerFocused);
      } else {
        if (editor.sourceElement.id === 'question_editor') {
          this.isQuestionFocused = false;
        } else if (editor.sourceElement.id === 'answer_editor') {
          this.isAnswerFocused = false;
        }
        console.log(this.isQuestionFocused, this.isAnswerFocused);
      }
    });
  }

  initializeDropdown() {
    ( < any > $('.ui.checkbox')).checkbox();
  }
  initializeFormFields() {
    this.questionMetaForm = new FormGroup({
      learningOutcome: new FormControl('', Validators.required),
      qlevel: new FormControl('', [Validators.required]),
      bloomsLevel: new FormControl('', [Validators.required]),
      max_score: new FormControl(null, [Validators.required])
    });
  }
  enableSubmitButton() {
    this.questionMetaForm.valueChanges.subscribe(val => {
      this.enableSubmitBtn = (this.questionMetaForm.status === 'VALID');
    });
  }
  validateAllFormFields(questionMetaForm: FormGroup) {
    Object.keys(questionMetaForm.controls).forEach(field => {
      const control = questionMetaForm.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({
          onlySelf: true
        });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
  createQuestion(event) {
    console.log(this.questionMetaForm.value);
    console.log(this.question_editor.getData());
    console.log(this.answer_editor.getData());
    this.questionMetaData = {
      mode: '',
      data: {

      }
    };
    if (this.questionMetaForm.valid) {
      const req = {
        url: this.configService.urlConFig.URLS.ASSESSMENT.CREATE,
        data: {
          'request': {
            'assessment_item': {
              'objectType': 'AssessmentItem',
              'metadata': {
                'createdBy': this.userProfile.userId,
                'code': this.selectedAttributes.questionType,
                'type': this.selectedAttributes.questionType,
                'category': this.selectedAttributes.questionType.toUpperCase(),
                'itemType': 'UNIT',
                'version': 3,
                'name': this.selectedAttributes.questionType + '_' + this.selectedAttributes.framework,
                'body': this.question_editor.getData(),
                'answers': [this.answer_editor.getData()],
                'learningOutcome': [this.questionMetaForm.value.learningOutcome],
                'bloomsLevel': [this.questionMetaForm.value.bloomsLevel],
                'qlevel': this.questionMetaForm.value.qlevel,
                'max_score': Number(this.questionMetaForm.value.max_score),
                'template_id': 'NA',
                'framework': this.selectedAttributes.framework,
                'board': this.selectedAttributes.board,
                'medium': this.selectedAttributes.medium,
                'gradeLevel': [
                  this.selectedAttributes.gradeLevel
                ],
                'subject': this.selectedAttributes.subject,
                'topic': [this.selectedAttributes.topic],
                'status': 'Draft'
              }
            }
          }
        }
      };
      this.actionService.post(req).subscribe((res) => {
        if (res.responseCode !== 'OK') {
          console.log('Please try again');
          this.questionStatus.emit({'status': 'failed'});
        } else {
          this.enableCreateButton.emit(true);
          this.questionStatus.emit({'status': 'success', 'identifier': res.result.node_id});
          // this.question_editor.destroy();
          // this.answer_editor.destroy();
        }
      });
    } else {
      this.validateAllFormFields(this.questionMetaForm);
    }
  }
  /**
   * function to get images
   * @param offset page no
   */
  getMyImages(offset) {
    if (offset === 0) {
      this.myAssets.length = 0;
    }
    const req = {
      url: `${this.configService.urlConFig.URLS.COMPOSITE.SEARCH}`,
      data: {
        'request': {
          filters: {
            mediaType: ['image'],
            contentType: 'Asset',
            compatibilityLevel: {
              min: 1,
              max: 2
            },
            status: ['Live'],
            createdBy: this.userProfile.userId
          },
          limit: 50,
          offset: offset
        }
      }
    };
    this.publicDataService.post(req).subscribe((res) => {
      _.map(res.result.content, (item) => {
        if (item.downloadUrl) {
          this.myAssets.push(item);
        }
      });
    });
  }

  addImageInEditor(imageUrl) {
    this.editor.model.change(writer => {
      const imageElement = writer.createElement('image', {
        src: imageUrl
      });
      this.editor.model.insertContent(imageElement, this.editor.model.document.selection);
    });
    this.showImagePicker = false;
  }

  /**
   * functio to get all images
   * @param offset page no
   */
  getAllImages(offset) {
    if (offset === 0) {
      this.allImages.length = 0;
    }
    const req = {
      url: `${this.configService.urlConFig.URLS.COMPOSITE.SEARCH}`,
      data: {
        'request': {
          filters: {
            mediaType: ['image'],
            contentType: 'Asset',
            compatibilityLevel: {
              min: 1,
              max: 2
            },
            status: ['Live']
          },
          limit: 50,
          offset: offset
        }
      }
    };
    this.publicDataService.post(req).subscribe((res) => {
      _.map(res.result.content, (item) => {
        if (item.downloadUrl) {
          this.allImages.push(item);
        }
      });
    });
  }

  /**
   * function to lazy load my images
   */
  lazyloadMyImages() {
    const offset = this.myAssets.length;
    this.getMyImages(offset);
  }

  /**
   * function to lazy load all images
   */
  lazyloadAllImages() {
    const offset = this.allImages.length;
    this.getAllImages(offset);
  }

  /**
   * function to upload image
   */
  uploadImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    const formData: FormData = new FormData();
    formData.append('file', file);
    const fileType = file.type;
    const fileName = file.name;
    const fileSize = file.size / 1024 / 1024;
    if (fileType.split('/')[0] === 'image') {
      this.showErrorMsg = false;
      if (fileSize > 1) {
        this.showErrorMsg = true;
        this.errorMsg = 'Max size allowed is 1MB';
      } else {
        this.errorMsg = '';
        this.showErrorMsg = false;
        reader.readAsDataURL(file);
      }
    } else {
      this.showErrorMsg = true;
      this.errorMsg = 'Please choose an image file';
    }
    if (!this.showErrorMsg) {
      // reader.onload = (uploadEvent: any) => {
      const req = {
        url: this.configService.urlConFig.URLS.CONTENT.CREATE_CONTENT,
        data: {
          'request': {
            content: {
              name: fileName,
              contentType: 'Asset',
              mediaType: 'image',
              mimeType: fileType,
              createdBy: this.userProfile.userId,
              language: ['English'],
              creator: `${this.userProfile.firstName} ${this.userProfile.lastName ? this.userProfile.lastName : ''}`,
              code: 'org.ekstep0.5375271337424472',
            }
          }
        }
      };
      this.publicDataService.post(req).subscribe((res) => {
        const imgId = res['result'].node_id;
        const request = {
          url: `${this.configService.urlConFig.URLS.CONTENT.UPLOAD_IMAGE}/${imgId}`,
          data: formData
        };
        this.publicDataService.post(request).subscribe((response) => {
          this.addImageInEditor(response.result.content_url);
          this.showImagePicker = false;
          this.showImageUploadModal = false;
        });
      });
      reader.onerror = (error: any) => {};
    }
  }

}
