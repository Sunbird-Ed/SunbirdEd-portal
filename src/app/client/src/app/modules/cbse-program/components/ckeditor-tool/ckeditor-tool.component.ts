import { Component, OnInit, AfterViewInit, Output, Input, EventEmitter, OnChanges, ViewChild, ElementRef} from '@angular/core';
import * as ClassicEditor from '@project-sunbird/ckeditor-build-font';
import { ActivatedRoute, Router } from '@angular/router';
import {  ConfigService, ResourceService, IUserData, IUserProfile, ToasterService  } from '@sunbird/shared';
import { PublicDataService, UserService, ActionService } from '@sunbird/core';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-ckeditor-tool',
  templateUrl: './ckeditor-tool.component.html',
  styleUrls: ['./ckeditor-tool.component.css']
})
export class CkeditorToolComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('editor') public editorRef: ElementRef;
  @Input() editorConfig: any;
  @Input() editorDataInput: any;
  @Input() editorId: any;
  @Input() setCharacterLimit: any;
  @Input() setImageLimit: any;
  @Output() editorDataOutput = new EventEmitter < any > ();
  @Output() hasError = new EventEmitter < any > ();
  public editorInstance: any;
  public isEditorFocused: boolean;
  public limitExceeded: boolean;
  public userProfile: IUserProfile;
  public publicDataService: PublicDataService;
  private toasterService: ToasterService;
  public resourceService: ResourceService;
  public isAssetBrowserReadOnly = false;
  public characterCount: Number;
  public mediaobj;
  initialized = false;
  public assetProxyUrl = '/assets/public/';
  public baseURL = 'http://dev.sunbirded.org';
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
  myAssets = [];
  allImages = [];
  showImagePicker: boolean;
  showImageUploadModal: boolean;
  showErrorMsg: boolean;
  errorMsg: string;

  ngOnInit() {
    this.initialized = true;
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
        }
      });

      this.editorConfig = _.assign({
        toolbar: ['heading', '|', 'bold', '|', 'italic', '|',
          'bulletedList', '|', 'numberedList', '|', 'insertTable', '|' , 'fontSize', '|',
          'mathtype', '|',
        ],
          fontSize: {
            options: [
                9,
                11,
                13,
                15,
                17,
                19,
                21
            ]
        },
        image: {
          toolbar: ['imageStyle:alignLeft', 'imageStyle:full', 'imageStyle:alignRight'],
          styles: ['full', 'alignLeft', 'alignRight', 'alignCenter']
        },
        isReadOnly: false,
        removePlugins: ['ImageCaption']
      }, this.editorConfig);
  }
  ngOnChanges() {
  }

  ngAfterViewInit() {
    this.initializeEditors();

  }

  initializeImagePicker(editorType) {
    this.showImagePicker = true;
  }
  /**
   * function to hide image picker
   */
  dismissImagePicker() {
    this.showImagePicker = false;
  }
  dismissImageUploadModal() {
    this.showImagePicker = true;
    this.showImageUploadModal = false;
  }
  initiateImageUploadModal() {
    this.showImagePicker = false;
    this.showImageUploadModal = true;
  }
  public isEditorReadOnly(state) {
    this.editorInstance.isReadOnly = state;
    this.isAssetBrowserReadOnly = state;
  }

  initializeEditors() {
    ClassicEditor.create(this.editorRef.nativeElement, {
        // plugins: this.editorConfig.plugins,
        extraPlugins: ['Font'],
        toolbar: this.editorConfig.toolbar,
        fontSize: this.editorConfig.fontSize,
        image: this.editorConfig.image,
        isReadOnly: this.editorConfig.isReadOnly,
        removePlugins: this.editorConfig.removePlugins
    })
    .then(editor => {
      this.editorInstance = editor;
      this.isAssetBrowserReadOnly = this.editorConfig.isReadOnly;
      if (this.editorDataInput) {
        this.editorDataInput = this.editorDataInput
                      .replace(/(<img("[^"]*"|[^\/">])*)>/gi, '$1/>')
                      .replace(/(<br("[^"]*"|[^\/">])*)>/gi, '$1/>');
        this.editorInstance.setData(this.editorDataInput);
      } else {
        this.editorInstance.setData('');
      }
      console.log('Editor was initialized', editor);
      this.changeTracker(this.editorInstance);
      this.characterCount = this.countCharacters(this.editorInstance.model.document);
    })
    .catch(error => {
      console.error(error.stack);
    });
  }

  changeTracker(editor) {
    editor.model.document.on('change', (eventInfo, batch) => {
      if (this.setCharacterLimit && this.setCharacterLimit > 0) { this.checkCharacterLimit(); }
      const selectedElement = eventInfo.source.selection.getSelectedElement();
      this.isEditorFocused = (selectedElement && selectedElement.name === 'image') ? true : false;
      if (this.setImageLimit && this.setImageLimit > 0) { this.checkImageLimit(); }
      this.editorDataOutput.emit({body: editor.getData(), length: this.characterCount, mediaobj: this.mediaobj });
    });
  }
  checkImageLimit() {
    const childNodes =  this.editorInstance.model.document.getRoot()._children._nodes;
    this.isAssetBrowserReadOnly = _.keys(_.pickBy(childNodes, {name: 'image'})).length === this.setImageLimit ? true : false ;
  }
  checkCharacterLimit() {
    this.characterCount = this.countCharacters( this.editorInstance.model.document );
    this.limitExceeded = (this.characterCount <= this.setCharacterLimit) ? false : true;
    this.hasError.emit(this.limitExceeded);
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

  addImageInEditor(imageUrl, imageId) {
    const src = this.getMediaOriginURL(imageUrl);
    this.mediaobj = {
      id: imageId,
      type: 'image',
      src: src,
      baseUrl: this.baseURL
    };
    this.editorInstance.model.change(writer => {
      const imageElement = writer.createElement('image', {
        'src': src,
        'alt': imageId,
        'data-asset-variable': imageId
      });
      this.editorInstance.model.insertContent(imageElement, this.editorInstance.model.document.selection);
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
          this.addImageInEditor(response.result.content_url, response.result.identifier);
          this.showImagePicker = false;
          this.showImageUploadModal = false;
        });
      });
      reader.onerror = (error: any) => {};
    }
  }

  countCharacters(document) {
    const rootElement = document.getRoot();
    return this.countCharactersInElement(rootElement);
  }
  countCharactersInElement(node) {
    let chars = 0;
    const forEach = Array.prototype.forEach;
    const forE = node.getChildren();
    let child;

    while (!(child = forE.next()).done) {
      if (child.value.is('text')) {
        chars += child.value.data.length;
      } else if (child.value.is('element')) {
        chars += this.countCharactersInElement(child.value);
      }
    }
    return chars;
  }

  getMediaOriginURL(src) {
    const replaceText = this.assetProxyUrl;
    const aws_s3_urls = ['https://s3.ap-south-1.amazonaws.com/ekstep-public-dev/',
    'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/',
    'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/'];
    _.forEach(aws_s3_urls, url => {
      if (src.indexOf(url) !== -1) {
        src = src.replace(url, replaceText);
      }
    });
    return src;
  }

}
