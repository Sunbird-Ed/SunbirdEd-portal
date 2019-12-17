import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FineUploader } from 'fine-uploader';
import { ToasterService, ConfigService } from '@sunbird/shared';
import { PublicDataService, UserService, ActionService, PlayerService } from '@sunbird/core';
import { UUID } from 'angular2-uuid';
import * as _ from 'lodash-es';
import { catchError, map } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { ISelectedAttributes, IContentUploadComponentInput} from '../../interfaces';
import { ProgramStageService } from '../../../program/services';

@Component({
  selector: 'app-content-uploader',
  templateUrl: './content-uploader.component.html',
  styleUrls: ['./content-uploader.component.scss']
})
export class ContentUploaderComponent implements OnInit, AfterViewInit {
  @ViewChild('modal') modal;
  @ViewChild('fineUploaderUI') fineUploaderUI: ElementRef;
  @ViewChild('qq-upload-actions') actionButtons: ElementRef;
  @Input() contentUploadComponentInput: IContentUploadComponentInput;
  public selectedAttributes: ISelectedAttributes;
  public templateDetails: any;
  public unitIdentifier: any;
  @Output() uploadedContentMeta = new EventEmitter<any>();
  public playerConfig;
  public showPreview = false;
  uploader;
  loading;
  contentURL;

  constructor(public toasterService: ToasterService, private userService: UserService,
    private publicDataService: PublicDataService, public actionService: ActionService,
    public playerService: PlayerService, public configService: ConfigService, public programStageService: ProgramStageService) { }

  ngOnInit() {

    this.selectedAttributes  = _.get(this.contentUploadComponentInput, 'selectedAttributes');
    this.templateDetails  = _.get(this.contentUploadComponentInput, 'templateDetails');
    this.unitIdentifier  = _.get(this.contentUploadComponentInput, 'unitIdentifier');

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

  ngAfterViewInit() {
    this.fineUploaderUI.nativeElement.remove();
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
    let mimeType = fileUpload ? this.detectMimeType(this.uploader.getName(0)) : this.detectMimeType(this.contentURL);
    if (!mimeType) {
      this.toasterService.error('Invalid content type (supported type: pdf, epub, h5p, mp4, youtube, html-zip, webm, whitelisted-domain)');
      return;
    } else if (mimeType === 'video/x-youtube') {
      const option = {
        url: 'asset/v3/validate?field=license',
        data: {
          'request': {
            'asset': {
              'provider': 'youtube',
              'url': this.contentURL
            }
          }
        }
      };
      this.actionService.post(option).pipe(catchError(err => {
        return throwError(err)
      })).subscribe(res => {
        this.createNewContent(fileUpload, mimeType);
      });
    } else {
      this.createNewContent(fileUpload, mimeType);
    }
  }

  createNewContent(fileUpload, mimeType) {
    let creator = this.userService.userProfile.firstName;
    if (!_.isEmpty(this.userService.userProfile.lastName)) {
      creator = this.userService.userProfile.firstName + ' ' + this.userService.userProfile.lastName;
    }
    const option = {
      url: `content/v3/create`,
      data: {
        request: {
          content: {
            'name': 'Untitled Content',
            'code': UUID.UUID(),
            'mimeType': mimeType,
            'createdBy': this.userService.userid,
            'contentType': this.templateDetails.contentType,
            'resourceType': this.templateDetails.resourceType || 'Learn',
            'creator': creator,
            'framework': this.selectedAttributes.framework,
            'organisation': this.selectedAttributes.onBoardSchool ? [this.selectedAttributes.onBoardSchool] : []
          }
        }
      }
    };
    this.actionService.post(option).pipe(catchError(err => {
      return throwError('');
    }), map(res => res.result))
    .subscribe(result => {
      this.uploadByURL(fileUpload, mimeType, result.node_id);
    });
  }
  uploadByURL(fileUpload, mimeType, contentId) {
    if (fileUpload) {
      this.uploadFile(mimeType, contentId);
    } else {
      this.updateContentWithURL(this.contentURL, mimeType, contentId);
    }
  }

  uploadFile(mimeType, contentId) {
    let contentType = mimeType;
    document.getElementById('qq-upload-actions').style.display = 'none';
    this.loading = true;
    if (mimeType === 'application/vnd.ekstep.h5p-archive' || mimeType === 'application/vnd.ekstep.html-archive') {
      contentType = 'application/octet-stream';
    }
    let option = {
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
      return throwError(console.log('----> presigned value: ', err))
    })).subscribe(res => {
      let signedURL = res.result.pre_signed_url;
      let config = {
        processData: false,
        contentType: contentType,
        headers: {
          'x-ms-blob-type': 'BlockBlob'
        }
      };
      this.uploadToBlob(signedURL, config).subscribe(res => {
        const fileURL = signedURL.split('?')[0];
        this.updateContentWithURL(fileURL, mimeType, contentId);
      });
    });
  }

  uploadToBlob(signedURL, config): Observable<any> {
    return this.actionService.http.put(signedURL, this.uploader.getFile(0), config).pipe(catchError(err => {
      return throwError(err);
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
      return throwError(err);
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
      return throwError('');
    })).subscribe(res => {
      this.closeModal('ContentPreview', res);
      const contentDetails = {
        contentId: contentId,
        contentData: res
      };
      this.playerConfig = this.playerService.getConfig(contentDetails);
      this.playerConfig.context.pdata.pid = 'cbse-program-portal';
      this.showPreview = true;
    });
  }

  public closeModal(component, res?) {
    if (this.modal && this.modal.deny) {
      this.modal.deny();
      this.programStageService.removeLastStage();
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
        return this.validateUploadURL(fileName);
    }
  }

  validateUploadURL(url) {
    let response = '';
    if (this.isValidURL(url) && this.isWhitelistedURL(url)) {
      if (this.validateYoutubeURL(url)) {
        response = 'video/x-youtube';
      } else {
        response = 'text/x-url';
      }
    }
    return response;
  }

  isValidURL(url) {
    const res = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if (res == null) {
      return false;
    } else {
      return true;
    }
  }

  isWhitelistedURL(url) {
    let domainList = this.getWhitelistedDomains();
    let isWhitelistedURL = false;
    let hostName = this.getHostName(url);
    if (hostName) {
      for (const domain of domainList) {
        if (hostName[2] === domain || (hostName[1] + hostName[2]) === domain) {
          // the whitelisted domain can be either youtube.com or www.youtube.com
          isWhitelistedURL = true;
          break;
        }
      }
    }
    return isWhitelistedURL;
  }

  getHostName(url) {
    const match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
      return match;
    } else {
      return null;
    }
  }

  getWhitelistedDomains() {
    const domainList = ['youtube.com', 'youtu.be'];
    // domains = ''//ecEditor.getConfig('extContWhitelistedDomains');
    // if(typeof domains !== 'undefined' && domains){
    //     domainList = domains.split(',');
    // }
    return domainList;
  }

  validateYoutubeURL = function (fileName) {
    const hostName = this.getHostName(fileName);
    if (hostName && hostName[2] === 'youtube.com' || hostName[2] === 'youtu.be') {
      return true;
    }
    return false;
  };
}
