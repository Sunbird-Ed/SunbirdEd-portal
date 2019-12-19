import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FineUploader } from 'fine-uploader';
import { ToasterService, ConfigService } from '@sunbird/shared';
import { PublicDataService, UserService, ActionService, PlayerService, FrameworkService } from '@sunbird/core';
import { ProgramStageService } from '../../../program/services';
import * as _ from 'lodash-es';
import { catchError, map, first } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { IContentUploadComponentInput} from '../../interfaces';
import { FormGroup, FormArray, FormBuilder, Validators, NgForm, FormControl } from '@angular/forms';
import { CbseProgramService } from '../../services/cbse-program/cbse-program.service';

@Component({
  selector: 'app-content-uploader',
  templateUrl: './content-uploader.component.html',
  styleUrls: ['./content-uploader.component.scss']
})
export class ContentUploaderComponent implements OnInit, AfterViewInit {
  @ViewChild('modal') modal;
  @ViewChild('fineUploaderUI') fineUploaderUI: ElementRef;
  @ViewChild('qq-upload-actions') actionButtons: ElementRef;
  // @ViewChild('contentTitle') contentTitle: ElementRef;
  @Input() contentUploadComponentInput: IContentUploadComponentInput;

  public sessionContext: any;
  public templateDetails: any;
  public unitIdentifier: any;
  public formConfiguration: any;
  public actions: any;
  public textFields: Array<any>;
  public selectionFields: Array<any>;
  public multiSelectionFields: Array<any>;
  @Output() uploadedContentMeta = new EventEmitter<any>();
  public playerConfig;
  public showPreview = false;
  showForm;
  uploader;
  loading;
  contentURL;
  selectOutcomeOption = {};
  contentDetailsForm: FormGroup;
  textInputArr: FormArray;
  selectionArr: FormArray;
  multiSelectionArr: FormArray;
  formValues: any;
  contentMetaData;
  visibility: any;
  editTitle: string;
  showTextArea: boolean;

  constructor(public toasterService: ToasterService, private userService: UserService,
    private publicDataService: PublicDataService, public actionService: ActionService,
    public playerService: PlayerService, public configService: ConfigService, private formBuilder: FormBuilder,
    private cbseService: CbseProgramService, public frameworkService: FrameworkService, public programStageService: ProgramStageService) { }

  ngOnInit() {
    this.sessionContext  = _.get(this.contentUploadComponentInput, 'sessionContext');
    this.templateDetails  = _.get(this.contentUploadComponentInput, 'templateDetails');
    this.unitIdentifier  = _.get(this.contentUploadComponentInput, 'unitIdentifier');
    this.actions = _.get(this.contentUploadComponentInput, 'entireConfig.actions');
    this.handleActionButtons();
  }

  ngAfterViewInit() {
    if (_.get(this.contentUploadComponentInput, 'action') === 'preview') {
      this.showPreview = true;
      this.getUploadedContentMeta(_.get(this.contentUploadComponentInput, 'contentIdentifier'));
    } else {
      this.initiateUploadModal();
      this.fineUploaderUI.nativeElement.remove();
    }
  }

  handleActionButtons() {
    this.visibility = {};
    this.visibility['showChangeFile'] = _.includes(this.actions.showChangeFile.roles, this.sessionContext.currentRoleId);
    this.visibility['showRequestChanges'] = _.includes(this.actions.showRequestChanges.roles, this.sessionContext.currentRoleId);
    this.visibility['showAccept'] = _.includes(this.actions.showAccept.roles, this.sessionContext.currentRoleId);
    this.visibility['showSubmit'] = _.includes(this.actions.showSubmit.roles, this.sessionContext.currentRoleId);
  }

  initiateUploadModal() {
    this.uploader = new FineUploader({
      element: document.getElementById('upload-content-div'),
      template: 'qq-template-validation',
      multiple: false,
      autoUpload: false,
      request: {
        endpoint: '/assets/uploads'
      },
      validation: {
        allowedExtensions: (this.templateDetails.filesConfig.accepted.length === 3) ?
          this.templateDetails.filesConfig.accepted.split(' ') : this.templateDetails.filesConfig.accepted.split(', '),
        itemLimit: 1,
        sizeLimit: 52428800 // 50 MB = 50 * 1024 * 1024 bytes
      },
      messages: {
        sizeError: '{file} is too large, maximum file size is 50MB.'
      },
      callbacks: {
        onStatusChange: () => {

        },
        onSubmit: () => {
          this.uploadContent();
        }
      }
    });
  }

  uploadContent() {
    if (this.uploader.getFile(0) == null && !this.contentURL) {
      this.toasterService.error('URL or File is required to upload');
      return;
    }
    let fileUpload = false;
    if (this.uploader.getFile(0) != null) {
      fileUpload = true;
    }
    const mimeType = fileUpload ? this.detectMimeType(this.uploader.getName(0)) : this.detectMimeType(this.contentURL);
    if (!mimeType) {
      this.toasterService.error('Invalid content type (supported type: pdf, epub, h5p, mp4, html-zip, webm)');
      return;
    } else {
      this.uploadByURL(fileUpload, mimeType);
    }
  }

  uploadByURL(fileUpload, mimeType) {
    if (fileUpload) {
      this.uploadFile(mimeType, this.contentUploadComponentInput.contentIdentifier);
    }
  }

  uploadFile(mimeType, contentId) {
    let contentType = mimeType;
    // document.getElementById('qq-upload-actions').style.display = 'none';
    this.loading = true;
    if (mimeType === 'application/vnd.ekstep.h5p-archive' || mimeType === 'application/vnd.ekstep.html-archive') {
      contentType = 'application/octet-stream';
    }
    const option = {
      url: 'content/v3/upload/url/' + contentId,
      data: {
        request: {
          content: {
            fileName: this.uploader.getName(0)
          }
        }
      }
    };
    this.actionService.post(option).pipe(catchError(err => {
      const errInfo = { errorMsg: 'Unable to get pre_signed_url and Content Creation Failed, Please Try Again' };
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
  })).subscribe(res => {
      const signedURL = res.result.pre_signed_url;
      const config = {
        processData: false,
        contentType: contentType,
        headers: {
          'x-ms-blob-type': 'BlockBlob'
        }
      };
      this.uploadToBlob(signedURL, config).subscribe(() => {
        const fileURL = signedURL.split('?')[0];
        this.updateContentWithURL(fileURL, mimeType, contentId);
      });
    });
  }

  uploadToBlob(signedURL, config): Observable<any> {
    return this.actionService.http.put(signedURL, this.uploader.getFile(0), config).pipe(catchError(err => {
      const errInfo = { errorMsg: 'Unable to upload to Blob and Content Creation Failed, Please Try Again' };
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
  }), map(data => data));
  }

  updateContentWithURL(fileURL, mimeType, contentId) {
    const data = new FormData();
    data.append('fileUrl', fileURL);
    data.append('mimeType', mimeType);
    const config = {
      enctype: 'multipart/form-data',
      processData: false,
      contentType: false,
      cache: false
    };
    const option = {
      url: 'content/v3/upload/' + contentId,
      data: data,
      param: config
    };
    this.actionService.post(option).pipe(catchError(err => {
      const errInfo = { errorMsg: 'Unable to update pre_signed_url with Content Id and Content Creation Failed, Please Try Again' };
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
  })).subscribe(res => {
      this.getUploadedContentMeta(contentId);
      this.uploadedContentMeta.emit({
        contentId: contentId
      });
    });
  }

  getUploadedContentMeta(contentId) {
    const option = {
      url: 'content/v3/read/' + contentId
    };
    this.actionService.get(option).pipe(map(data => data.result.content), catchError(err => {
      const errInfo = { errorMsg: 'Unable to read the Content, Please Try Again' };
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
  })).subscribe(res => {
      // this.closeModal();
      const contentDetails = {
        contentId: contentId,
        contentData: res
      };
      this.contentMetaData = res;
      this.playerConfig = this.playerService.getConfig(contentDetails);
      this.playerConfig.context.pdata.pid = 'cbse-program-portal';
      this.showPreview = true;
      this.loading = false;
      // At the end of execution
      this.fetchFrameWorkDetails();
      this.manageFormConfiguration();
      this.editTitle = this.contentMetaData.name;
    });
  }

  public closeModal(action?) {
    if (this.modal && this.modal.deny && action === 'Cancel') {
      this.modal.deny();
      this.programStageService.removeLastStage();
    } else if (this.modal && this.modal.deny) {
      this.modal.deny();
    }
  }

  detectMimeType(fileName) {
    const extn = fileName.split('.').pop();
    switch (extn) {
      case 'pdf':
        return 'application/pdf';
      case 'mp4':
        return 'video/mp4';
      case 'h5p':
        return 'application/vnd.ekstep.h5p-archive';
      case 'zip':
        return 'application/vnd.ekstep.html-archive';
      case 'epub':
        return 'application/epub';
      case 'webm':
        return 'video/webm';
      default:
        // return this.validateUploadURL(fileName);
    }
  }

  manageFormConfiguration() {
    this.showForm = true;
    // tslint:disable-next-line:max-line-length
    const compConfiguration = _.find(_.get(this.contentUploadComponentInput, 'entireConfig.components'), {compId: 'uploadContentComponent'});
    this.formConfiguration = compConfiguration.config.formConfiguration;
    this.textFields = _.filter(this.formConfiguration, {'inputType': 'text', 'visible': true});
    this.selectionFields = _.filter(this.formConfiguration, {'inputType': 'select', 'visible': true});
    this.multiSelectionFields = _.filter(this.formConfiguration, {'inputType': 'multiselect', 'visible': true});
   // tslint:disable-next-line:max-line-length
    this.selectOutcomeOption = { bloomslevel: ['remember', 'understand', 'apply', 'analyse', 'evaluate', 'create'], LearningOutcome: ['sdhgfsjhadf', 'dfjghkdas', 'hgadfjhg'], license: ['CC BY 4.0', 'CC BY 5.0']};
    const disableFormField = (this.sessionContext.currentRole === 'CONTRIBUTOR') ? false : true ;
    // this.contentMetaData = {};
    this.contentMetaData['bloomslevel'] = ['remember'];
    this.contentMetaData['Author'] = 'Shashi';
    this.contentMetaData['LearningOutcome'] = ['sdhgfsjhadf'];
    // this.contentMetaData['creator'] = 'Shashi';

    const topicTerm = _.find(this.sessionContext.topicList, { name: this.sessionContext.topic });
    if (topicTerm && topicTerm.associations) {
       this.selectOutcomeOption['LearningOutcome'] = topicTerm.associations;
    }

    if (this.sessionContext.bloomsLevel) {
      this.selectOutcomeOption['bloomslevel'] = this.sessionContext.bloomsLevel;
    }

    this.contentDetailsForm = this.formBuilder.group({
      textInputArr: this.formBuilder.array([ ]),
      selectionArr: this.formBuilder.array([ ]),
      multiSelectionArr: this.formBuilder.array([ ])
    });

    _.forEach(this.selectionFields, (obj) => {
      const controlName = {};
      const code = obj.code;
      const preSavedValues = {};
      // tslint:disable-next-line:max-line-length
      preSavedValues[code] = (this.contentMetaData && this.contentMetaData[code]) ? (Array.isArray(this.contentMetaData[code]) ? this.contentMetaData[code][0] : this.contentMetaData[code]) : '';
      // tslint:disable-next-line:max-line-length
      obj.required ? controlName[obj.code] = [preSavedValues[code], [Validators.required]] : controlName[obj.code] = preSavedValues[code];
      this.selectionArr = this.contentDetailsForm.get('selectionArr') as FormArray;
      this.selectionArr.push(this.formBuilder.group(controlName));
    });

    _.forEach(this.multiSelectionFields, (obj) => {
      const controlName = {};
      const code = obj.code;
      const preSavedValues = {};
      // tslint:disable-next-line:max-line-length
      preSavedValues[code] = (this.contentMetaData && this.contentMetaData[code] && this.contentMetaData[code].length) ? this.contentMetaData[code] : [];
      obj.required ? controlName[obj.code] = [preSavedValues[code], [Validators.required]] : controlName[obj.code] = preSavedValues[code];
      this.multiSelectionArr = this.contentDetailsForm.get('multiSelectionArr') as FormArray;
      this.multiSelectionArr.push(this.formBuilder.group(controlName));
    });

    _.forEach(this.textFields, (obj) => {
      const controlName = {};
      const code = obj.code;
      const preSavedValues = {};
      preSavedValues[code] = (this.contentMetaData && this.contentMetaData[code]) ? this.contentMetaData[code] : '';
      // tslint:disable-next-line:max-line-length
      obj.required ? controlName[obj.code] = [{value: preSavedValues[code], disabled: disableFormField}, Validators.required] : controlName[obj.code] = preSavedValues[code];
      this.textInputArr = this.contentDetailsForm.get('textInputArr') as FormArray;
      this.textInputArr.push(this.formBuilder.group(controlName));
    });

  }

  fetchFrameWorkDetails() {
    this.frameworkService.initialize(this.sessionContext.framework);
    this.frameworkService.frameworkData$.pipe(first()).subscribe((frameworkDetails: any) => {
      if (frameworkDetails && !frameworkDetails.err) {
        const frameworkData = frameworkDetails.frameworkdata[this.sessionContext.framework].categories;
        this.sessionContext.topicList = _.get(_.find(frameworkData, { code: 'topic' }), 'terms');
      }
    });
  }

  saveContent() {
    if (this.contentDetailsForm.valid) {
     this.formValues = {};
        _.map(this.contentDetailsForm.value, (value, key) => { _.map(value, (obj) => { _.assign(this.formValues, obj); });
     });
     console.log(this.formValues);
    } else {
      this.markFormGroupTouched(this.contentDetailsForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  changeFile() {
    this.showPreview = false;
    setTimeout(() => {
      this.initiateUploadModal();
      this.fineUploaderUI.nativeElement.remove();
    }, 0);
  }

  editContentTitle() {
    // this.showTextArea = true;
    // this.editTitle = this.contentTitle.nativeElement.text;
  }
}

