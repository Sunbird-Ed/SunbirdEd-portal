import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UploadCertificateService } from '../../services/upload-certificate/upload-certificate.service';
import { ToasterService, ResourceService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { UserService } from '@sunbird/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';


@Component({
  selector: 'browse-image-popup',
  templateUrl: './browse-image-popup.component.html',
  styleUrls: ['./browse-image-popup.component.scss']
})
export class BrowseImagePopupComponent implements OnInit {

  @Input() showSelectImageModal = false;
  @Input() logoType;
  @Input() enableUploadSignature = false;
  @Output() assetData = new EventEmitter();
  @Output() close = new EventEmitter();
  @Input() showUploadUserModal = false;
  imageName;
  imagesList = [];
  uploadForm: UntypedFormGroup;
  fileObj: any;
  selectedLogo: any;
  sign = 'SIGN';
  imageDimensions = {
    'LOGO': { type: 'PNG', dimensions: '88px X 88px' },
    'SIGN': { type: 'PNG', dimensions: '112px X 46px' }
  };
  allImagesList = [];

  constructor(public uploadCertificateService: UploadCertificateService,
    public toasterService: ToasterService,
    public resourceService: ResourceService,
    public userService: UserService) {
    this.uploadForm = new UntypedFormGroup({
      assetCaption: new UntypedFormControl('', [Validators.required]),
      creator: new UntypedFormControl('', [Validators.required]),
      creatorId: new UntypedFormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    // this.getAssetList();
  }

  getAssetList() {
    this.imageName = '';
    this.selectedLogo = null;
    this.uploadCertificateService.getAssetData().subscribe(res => {
      this.imagesList = res.result.content;
    }, error => {
      this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0004'));
    });
  }

  searchImage(type?) {
    this.uploadCertificateService.getAssetData(this.imageName, type).subscribe(res => {
      if (res && res.result) {
        if (!type) {
          this.imagesList = res.result.content;
        } else {
          this.allImagesList = res.result.content;
        }
      }
    }, error => {
      this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0004'));
    });
  }

  async fileChange(ev) {
    this.uploadForm.reset();
    const imageProperties = await this.getImageProperties(ev.target.files[0]);
    const isDimensionMatched = this.dimentionCheck(imageProperties);
    const isTypeMatched = _.get(imageProperties, 'type').includes('png');
    const isSizeMatched = _.get(imageProperties, 'size') < 1;
    if (imageProperties && isSizeMatched && isTypeMatched && isDimensionMatched) {
      this.fileObj = ev.target.files[0];
      const fileName = _.get(this.fileObj, 'name').split('.')[0];
      const userName = `${_.get(this.userService, 'userProfile.firstName') || ''} ${_.get(this.userService, 'userProfile.lastName') || ''}`;
      this.uploadForm.patchValue({
        'assetCaption': fileName,
        'creator': userName,
        'creatorId': _.get(this.userService, 'userProfile.id')
      });
    } else {
      this.toasterService.error(_.get(this.resourceService, 'frmelmnts.cert.lbl.imageErrorMsg'));

    }
  }

  getAllImages() {
    this.imageName = '';
    this.selectedLogo = null;
    this.uploadCertificateService.getAssetData(null, 'all').subscribe(res => {
      this.allImagesList = res.result.content;
    }, error => {
      this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0004'));
    });
  }

  dimentionCheck(image) {
    let flag = false;
    if (image) {
      const dimension = `${_.get(image, 'width')}px X ${_.get(image, 'height')}px`;
      const logoType = _.get(this.logoType, 'type');
      const requiredDimensions = this.imageDimensions[logoType]['dimensions'];
      flag = _.isEqual(dimension, requiredDimensions);
    }
    return flag;
  }

  getImageProperties(ev) {
    return new Promise((resolve, reject) => {
      let imageData;
      const file = ev;
      const img = new Image();
      if (file.url) {
        img.src = file.url;
      } else {
        img.src = window.URL.createObjectURL(file);
      }
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        imageData = {
          'height': height,
          'width': width,
          'size': _.toNumber((file.size / (1024 * 1024)).toFixed(2)),
          'type': file.type
        };
        resolve(imageData);
      };
    });
  }

  browseImages() {
    this.showUploadUserModal = true;
    this.selectedLogo = null;
  }

  upload() {
    // TODO: have to make more dynamic (use input variable autoUpload)
    if (this.logoType.type !== this.sign) {
      this.uploadCertificateService.createAsset(this.uploadForm.value, this.logoType.type).subscribe(res => {
        if (res && res.result) {
          this.uploadBlob(res);
        }
      }, error => {
        this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0004'));
      });
    } else {
      this.getImageURLs();
    }
  }

  /**
  *  converting images files as data URLs
  */
  getImageURLs() {
    const file = this.fileObj;
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        const imageURL = reader.result as string;
        const image = {
          'name': this.uploadForm.controls.assetCaption.value,
          'url': imageURL,
          'type': this.logoType.type,
          'key': this.logoType.key,
          'index': this.logoType.index
        };
        this.assetData.emit(image);
        this.uploadForm.reset();
        this.closeModel();
      };
    }
  }

  uploadBlob(data) {
    if (data) {
      const identifier = _.get(data, 'result.content_id');
      this.uploadCertificateService.storeAsset(this.fileObj, identifier).subscribe(imageData => {
        if (imageData.result) {
          this.showUploadUserModal = false;
          this.showSelectImageModal = false;
          const image = {
            'name': this.uploadForm.controls.assetCaption.value,
            'url': imageData.result.artifactUrl,
            'type': this.logoType.type,
            'key': this.logoType.key,
            'index': this.logoType.index
          };
          this.assetData.emit(image);
          this.uploadForm.reset();
          this.closeModel();
        }
      }, error => {
        this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0004'));
        this.closeModel();
        this.uploadForm.reset();
      });
    }
  }

  async selectLogo(logo) {
    const file = {
      url: logo.artifactUrl,
      type: logo.mimeType,
      size: logo.size
    };
    const imageProperties = await this.getImageProperties(file);
    const isDimensionMatched = this.dimentionCheck(imageProperties);
    const isTypeMatched = _.get(imageProperties, 'type').includes('png');
    const isSizeMatched = _.get(imageProperties, 'size') < 1;
    if (imageProperties && isSizeMatched && isTypeMatched && isDimensionMatched) {
      this.selectedLogo = logo;
    } else {
      this.toasterService.error(_.get(this.resourceService, 'frmelmnts.cert.lbl.imageErrorMsg'));
    }
  }
  back() {
    if (this.logoType.type === this.sign) {
      this.closeModel();
    } else {
      this.showUploadUserModal = false;
      this.showSelectImageModal = true;
      this.uploadForm.reset();
      // this.close.emit();
      this.selectedLogo = null;
    }

  }

  closeModel() {
    this.uploadForm.reset();
    this.showUploadUserModal = false;
    this.showSelectImageModal = false;
    this.selectedLogo = null;
    this.close.emit();
  }

  selectAndUseLogo() {
    const image = {
      'name': this.selectedLogo.name,
      'url': this.selectedLogo.artifactUrl,
      'type': this.logoType.type,
      'key': this.logoType.key,
      'index': this.logoType.index
    };
    this.assetData.emit(image);
    this.selectedLogo = null;
    this.closeModel();
  }

  showUploadSignature() {
    this.logoType = { type: 'SIGN', index: 0, key: 'SIGN1' };
    this.showSelectImageModal = false;
    this.showUploadUserModal = true;
  }
}
