import { Component, OnInit, AfterViewInit, Output, Input, EventEmitter, OnChanges, ViewChild, ElementRef } from '@angular/core';
import * as ClassicEditor from '@project-sunbird/ckeditor-build-font';
import { FineUploader } from 'fine-uploader';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService, ResourceService, IUserData, IUserProfile, ToasterService } from '@sunbird/shared';
import { PublicDataService, UserService, ActionService, ContentService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { catchError, map} from 'rxjs/operators';
import { throwError, Observable} from 'rxjs';
import { CbseProgramService } from '../../services';
import MathText from '../../../../../assets/libs/mathEquation/plugin/mathTextPlugin.js';

@Component({
  selector: 'app-ckeditor-tool',
  templateUrl: './ckeditor-tool.component.html',
  styleUrls: ['./ckeditor-tool.component.scss']
})
export class CkeditorToolComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('editor') public editorRef: ElementRef;
  @ViewChild('fineUploaderUI') fineUploaderUI: ElementRef;
  @Input() editorConfig: any;
  @Input() editorDataInput: any;
  @Input() editorId: any;
  @Input() setCharacterLimit: any;
  @Input() setImageLimit: any;
  @Output() editorDataOutput = new EventEmitter<any>();
  @Output() hasError = new EventEmitter<any>();
  @Output() videoDataOutput = new EventEmitter<any>();
  @Input() videoShow;
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
  uploader;
  initialized = false;
  public assetProxyUrl = '/assets/public/';
  public baseURL = 'https://programs.diksha.gov.in';
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private configService: ConfigService,
    private cbseService: CbseProgramService,
    publicDataService: PublicDataService,
    toasterService: ToasterService,
    resourceService: ResourceService,
    public actionService: ActionService,
    private contentService: ContentService
  ) {
    this.userService = userService;
    this.configService = configService;
    this.publicDataService = publicDataService;
    this.toasterService = toasterService;
    this.resourceService = resourceService;
  }
  assetConfig: any = {
    'image': {
      'size': '50',
      'accepted': 'png, jpeg'
    },
    'video': {
      'size': '50',
      'accepted': 'mp4, webm'
    }
  };
  myAssets = [];
  allImages = [];
  allVideos = [];
  selectedVideo = {};
  loading = false;
  isClosable = true;
  selectedVideoId: string;
  showAddButton: boolean;
  assetsCount = Number;
  showImagePicker: boolean;
  showVideoPicker = false;
  showImageUploadModal: boolean;
  showVideoUploadModal: boolean;
  acceptVideoType: any;
  acceptImageType: any;
  showErrorMsg: boolean;
  errorMsg: string;
  query: string;

  ngOnInit() {
    this.initialized = true;
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
        }
      });
    this.editorConfig = _.assign({
      toolbar: ['bold', '|', 'italic', '|', 'underline',
        '|', 'numberedList', '|', 'fontSize', '|', 'subscript', '|', 'superscript', '|', 'MathText', '|'
      ],
      fontSize: {
        options: [
          9,
          11,
          13,
          15,
          17,
          19,
          21,
          23,
          25
        ]
      },
      image: {
        toolbar: ['imageStyle:alignLeft', 'imageStyle:full', 'imageStyle:alignRight'],
        styles: ['full', 'alignLeft', 'alignRight', 'alignCenter']
      },
      isReadOnly: false,
      removePlugins: ['ImageCaption', 'mathtype', 'ChemType']
    }, this.editorConfig);

    this.assetConfig = this.editorConfig.config.assetConfig || this.assetConfig;
    this.acceptVideoType = this.getVideoInputAccetType(this.assetConfig.video.accepted);
    this.acceptImageType = this.getImageInputAccetType(this.assetConfig.image.accepted);
  }
  ngOnChanges() {
    if (this.videoShow) {
      this.showVideoPicker = true;
      return setTimeout(() => {
        this.initiateUploadModal();
      }, 0);
    }
  }

  ngAfterViewInit() {
    this.initializeEditors();

  }

  initiateUploadModal() {
    this.uploader = new FineUploader({
      element: document.getElementById('upload-video-div'),
      template: 'qq-template-validation',
      multiple: false,
      autoUpload: false,
      request: {
        endpoint: '/assets/uploads'
      },
      validation: {
        allowedExtensions: this.assetConfig.video.accepted.split(', '),
        acceptFiles: this.acceptVideoType,
        itemLimit: 1,
        sizeLimit: _.toNumber(this.assetConfig.video.size) * 1024 * 1024  // 52428800  = 50 MB = 50 * 1024 * 1024 bytes
      },
      messages: {
        sizeError: `{file} is too large, maximum file size is ${this.assetConfig.video.size} MB.`,
        typeError: `Invalid content type (supported type: ${this.assetConfig.video.accepted})`
      },
      callbacks: {
        onStatusChange: () => {

        },
        onSubmit: () => {
          this.uploadContent();
        },
        onError: () => {
          this.uploader.reset();
        }
      }
    });
    this.fineUploaderUI.nativeElement.remove();
  }

  uploadContent() {
    if (this.uploader.getFile(0) == null) {
      this.toasterService.error('File is required to upload');
      this.uploader.reset();
      return;
    }
    this.uploadVideo();
  }

  initializeImagePicker(editorType) {
    this.showImagePicker = true;
  }

  initializeVideoPicker(editorType) {
    this.showVideoPicker = true;
  }
  /**
   * function to hide image picker
   */
  dismissImagePicker() {
    this.showImagePicker = false;
  }

  /**
   * function to hide video picker
   */
  dismissVideoPicker() {
    this.showVideoPicker = false;
    this.videoShow = false;
    this.videoDataOutput.emit(false);
  }
  dismissImageUploadModal() {
    this.showImagePicker = true;
    this.showImageUploadModal = false;
  }
  initiateImageUploadModal() {
    this.showImagePicker = false;
    this.showImageUploadModal = true;
  }

  dismissVideoUploadModal() {
    this.showVideoPicker = true;
    this.showVideoUploadModal = false;
  }
  initiateVideoUploadModal() {
    this.showVideoPicker = false;
    this.showImageUploadModal = true;
    this.loading = false;
    this.isClosable = true;
  }
  public isEditorReadOnly(state) {
    this.editorInstance.isReadOnly = state;
    this.isAssetBrowserReadOnly = state;
  }
  getVideoInputAccetType(VideoType) {
    const videoType = VideoType.split(', ');
    const result = [];
    _.forEach(videoType, (content) => {
      result.push('video/' + content);
    });
    return result.toString();
  }
  getImageInputAccetType(ImageType) {
    const types = ImageType ? ImageType.split(', ') : ['png', 'jpeg'];
    const result = [];
    _.forEach(types, (content) => {
      result.push('image/' + content);
    });
    return result.toString();
  }

  initializeEditors() {
    ClassicEditor.create(this.editorRef.nativeElement, {
      extraPlugins: ['Font', MathText],
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
        console.log('Editor was initialized');
        this.changeTracker(this.editorInstance);
        this.attacthEvent(this.editorInstance);
        // this.pasteTracker(this.editorInstance);
        this.characterCount = this.countCharacters(this.editorInstance.model.document);
      })
      .catch(error => {
        console.error(error.stack);
      });
  }
  changeTracker(editor) {
    editor.model.document.on('change', (eventInfo, batch) => {
      if (this.setCharacterLimit && this.setCharacterLimit > 0) {
        this.checkCharacterLimit();
      }
      const selectedElement = eventInfo.source.selection.getSelectedElement();
      this.isEditorFocused = (selectedElement && selectedElement.name === 'image') ? true : false;
      if (this.setImageLimit && this.setImageLimit > 0) {
        this.checkImageLimit();
      }
      this.editorDataOutput.emit({
        body: editor.getData(),
        length: this.characterCount,
        mediaobj: this.mediaobj
      });
    });
  }
  pasteTracker(editor) {
    editor.editing.view.document.on('clipboardInput', (evt, data) => {
      const dataTransfer = data.dataTransfer;
      const urlMatch =
        // tslint:disable-next-line:max-line-length
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}|file:\/\/\/+[^\s]{0,})/gi;
      const regex = new RegExp(urlMatch);
      const getUrl = dataTransfer.getData('text/html').match(regex);
      if (getUrl && getUrl.length > 0) {
        this.toasterService.error('No external link allowed');
        evt.stop();
      }
    });
  }
  checkImageLimit() {
    const childNodes = this.editorInstance.model.document.getRoot()._children._nodes;
    this.isAssetBrowserReadOnly = _.keys(_.pickBy(childNodes, { name: 'image' })).length === this.setImageLimit ? true : false;
  }
  checkCharacterLimit() {
    this.characterCount = this.countCharacters(this.editorInstance.model.document);
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
    this.contentService.post(req).subscribe((res) => {
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

  addVideoInEditor() {
    const videoData: any = _.cloneDeep(this.selectedVideo);
    videoData.src = this.getMediaOriginURL(videoData.downloadUrl);
    videoData.thumbnail  = (videoData.thumbnail) && this.getMediaOriginURL(videoData.thumbnail);
    this.showVideoPicker = false;
    this.showVideoUploadModal = false;
    this.videoDataOutput.emit(videoData);
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

    this.contentService.post(req).pipe(catchError(err => {
      const errInfo = { errorMsg: 'Image search failed' };
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
    }))
      .subscribe((res) => {
        _.map(res.result.content, (item) => {
          if (item.downloadUrl) {
            this.allImages.push(item);
          }
        });
      });
  }

  /**
   * function to get videos
   * @param offset page no
   */
  getMyVideos(offset, query) {
    if (offset === 0) {
      this.myAssets.length = 0;
    }
    const req = {
      url: `${this.configService.urlConFig.URLS.COMPOSITE.SEARCH}`,
      data: {
        'request': {
          filters: {
            mediaType: ['video'],
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

    if (query) {
      req.data.request['query'] = query;
    }
    this.contentService.post(req).subscribe((res) => {
      this.assetsCount = res.result.count;
      _.map(res.result.content, (item) => {
        if (item.downloadUrl) {
          this.myAssets.push(item);
        }
      });
    });
  }
  /**
 * functio to get all images
 * @param offset page no
 */
getAllVideos(offset, query) {
  if (offset === 0) {
    this.allVideos.length = 0;
  }
  const req = {
    url: `${this.configService.urlConFig.URLS.COMPOSITE.SEARCH}`,
    data: {
      'request': {
        filters: {
          mediaType: ['video'],
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

  if (query) {
    req.data.request['query'] = query;
  }

  this.contentService.post(req).pipe(catchError(err => {
    const errInfo = { errorMsg: 'Video search failed' };
    return throwError(this.cbseService.apiErrorHandling(err, errInfo));
  }))
    .subscribe((res) => {
      this.assetsCount = res.result.count;
      _.map(res.result.content, (item) => {
        if (item.downloadUrl) {
          this.allVideos.push(item);
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
   * function to lazy load my videos
   */
  lazyloadMyVideos() {
    const offset = this.myAssets.length;
    this.getMyVideos(offset, this.query);
  }

  /**
   * function to lazy load all videos
   */
  lazyloadAllVideos() {
    const offset = this.allVideos.length;
    this.getAllVideos(offset, this.query);
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
      if (fileSize > this.assetConfig.image.size) {
        this.showErrorMsg = true;
        this.errorMsg = 'Max size allowed is ' + this.assetConfig.image.size + 'MB';
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
      const req = this.generateAssetCreateRequest(fileName, fileType, 'image');
      this.actionService.post(req).pipe(catchError(err => {
        const errInfo = { errorMsg: 'Image upload failed' };
        return throwError(this.cbseService.apiErrorHandling(err, errInfo));
      })).subscribe((res) => {
        const imgId = res['result'].node_id;
        const request = {
          url: `${this.configService.urlConFig.URLS.ASSET.UPDATE}/${imgId}`,
          data: formData
        };
        this.actionService.post(request).pipe(catchError(err => {
          const errInfo = { errorMsg: 'Image upload failed' };
          return throwError(this.cbseService.apiErrorHandling(err, errInfo));
        })).subscribe((response) => {
          this.addImageInEditor(response.result.content_url, response.result.node_id);
          this.showImagePicker = false;
          this.showImageUploadModal = false;
        });
      });
      reader.onerror = (error: any) => { };
    }
  }

  /**
   * function to upload video
   */
  uploadVideo() {
    this.isClosable = false;
    this.loading = true;
    this.showErrorMsg = false;
    if (!this.showErrorMsg) {
      const req = this.generateAssetCreateRequest(this.uploader.getName(0), this.uploader.getFile(0).type, 'video');
      this.actionService.post(req).pipe(catchError(err => {
        this.loading = false;
        this.isClosable = true;
        const errInfo = { errorMsg: ' Unable to create an Asset' };
        return throwError(this.cbseService.apiErrorHandling(err, errInfo));
      })).subscribe((res) => {
        const contentId = res['result'].node_id;
        const request = {
          url: 'content/v3/upload/url/' + contentId,
          data: {
            request: {
              content: {
                fileName: this.uploader.getName(0)
              }
            }
          }
        };
        this.actionService.post(request).pipe(catchError(err => {
          const errInfo = { errorMsg: 'Unable to get pre_signed_url and Content Creation Failed, Please Try Again' };
          this.loading = false;
          this.isClosable = true;
          return throwError(this.cbseService.apiErrorHandling(err, errInfo));
        })).subscribe((response) => {
          const signedURL = response.result.pre_signed_url;
          const config = {
            processData: false,
            contentType: 'Asset',
            headers: {
              'x-ms-blob-type': 'BlockBlob'
            }
          };
          this.uploadToBlob(signedURL, this.uploader.getFile(0), config).subscribe(() => {
            const fileURL = signedURL.split('?')[0];
            this.updateContentWithURL(fileURL, this.uploader.getFile(0).type, contentId);
          });
        });
      });
    }
  }

  generateAssetCreateRequest(fileName, fileType, mediaType) {
    return {
      url: this.configService.urlConFig.URLS.ASSET.CREATE,
      data: {
        'request': {
          content: {
            name: fileName,
            contentType: 'Asset',
            mediaType: mediaType,
            mimeType: fileType,
            createdBy: this.userProfile.userId,
            language: ['English'],
            creator: `${this.userProfile.firstName} ${this.userProfile.lastName ? this.userProfile.lastName : ''}`,
            code: 'org.ekstep0.5375271337424472',
          }
        }
      }
    };
  }

  uploadToBlob(signedURL, file, config): Observable<any> {
    return this.actionService.http.put(signedURL, file, config).pipe(catchError(err => {
      const errInfo = { errorMsg: 'Unable to upload to Blob and Content Creation Failed, Please Try Again' };
      this.isClosable = true;
      this.loading = false;
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
      this.isClosable = true;
      this.loading = false;
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
    })).subscribe(res => {
      // Read upload video data
      this.getUploadVideo(res.result.node_id);
    });
  }

  getUploadVideo(videoId) {
    const option = {
      url: 'content/v3/read/' + videoId
    };
    this.actionService.get(option).pipe(map((data: any) => data.result.content), catchError(err => {
      const errInfo = { errorMsg: 'Unable to read the Video, Please Try Again' };
      this.loading = false;
      this.isClosable = true;
      this.loading = false;
      this.isClosable = true;
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
  })).subscribe(res => {
      this.toasterService.success('Asset Successfully Uploaded...');
      this.selectedVideo = res;
      this.showAddButton = true;
      this.loading = false;
      this.isClosable = true;
      this.addVideoInEditor();
    });
  }

  searchMyVideo(event) {
    this.query = event.target.value;
    this.getMyVideos(0, this.query);
  }
  searchAllVideo(event) {
    this.query = event.target.value;
    this.getAllVideos(0, this.query);
  }
  selectVideo(data) {
    this.showAddButton = true;
    this.selectedVideoId = data.identifier;
    this.selectedVideo = data;
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
    const aws_s3_urls = this.userService.cloudStorageUrls || ['https://s3.ap-south-1.amazonaws.com/ekstep-public-dev/',
      'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/',
      'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/'];
    _.forEach(aws_s3_urls, url => {
      if (src.indexOf(url) !== -1) {
        src = src.replace(url, replaceText);
      }
    });
    return src;
  }
  // Here Event listener is attacthed to document to listen the click event from Wiris plugin ('OK'-> button)
  attacthEvent(editor) {
    document.addEventListener('click', e => {
      if (e.target && (<Element>e.target).className === 'wrs_modal_button_accept') {
        editor.model.change(writer => {
          const insertPosition = editor.model.document.selection.getFirstPosition();
          writer.insertText(' ', insertPosition);
        });
      }
    });
  }
}
