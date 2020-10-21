import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'lodash-es';
import { UploadCertificateService } from '../../services/upload-certificate/upload-certificate.service';
import { MockData } from './create-template.component.spec.data';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '@sunbird/core';
import { ToasterService, ResourceService, NavigationHelperService } from '@sunbird/shared';
import { DomSanitizer } from '@angular/platform-browser';
import { CertConfigModel } from './../../models/cert-config-model/cert-config-model';
import { fromFetch } from 'rxjs/fetch';

@Component({
  selector: 'app-create-template',
  templateUrl: './create-template.component.html',
  styleUrls: ['./create-template.component.scss']
})
export class CreateTemplateComponent implements OnInit {

  public unsubscribe$ = new Subject<void>();
  createTemplateForm: FormGroup;
  selectStateOption: any = [];
  selectLanguageOption: any = [];
  selectState: any;
  selectLanguage: any;
  showSelectImageModal;
  showUploadUserModal;
  certLogos: any = [];
  certSigns: any = [];
  logoType;
  defaultCertificates = [
    { path: 'assets/images/mp.svg', id: 0 },
    { path: 'assets/images/odisha.svg', id: 1 },
    { path: 'assets/images/jh.svg', id: 2 }];
  selectedCertificate: any;
  logoHtml;
  svgData;
  center = 275;
  disableCreateTemplate = true;
  certConfigModalInstance = new CertConfigModel();
  images = {};
  finalSVGurl: any;

  constructor(public uploadCertificateService: UploadCertificateService,
    public userService: UserService,
    private sanitizer: DomSanitizer,
    public toasterService: ToasterService,
    public resourceService: ResourceService,
    public navigationHelperService: NavigationHelperService ) {
  }

  ngOnInit() {
    this.navigationHelperService.setNavigationUrl();
    this.selectedCertificate = _.clone(this.defaultCertificates[0]);
    this.initializeFormFields();
    this.getSVGTemplate();
  }

  initializeFormFields() {
    this.createTemplateForm = new FormGroup({
      certificateTitle: new FormControl('', [Validators.required]),
      stateName: new FormControl('', [Validators.required]),
      authoritySignature: new FormControl('', [Validators.required]),
      authoritySignature2: new FormControl('', [Validators.required]),
      allowPermission: new FormControl('', [Validators.required])
    });

    // TODO: Move to a separate component this browse logic;
    this.createTemplateForm.valueChanges.subscribe(val => {
      this.validateForm();
    });
  }

  validateForm() {
    if (this.createTemplateForm.status === 'VALID' && _.get(this.createTemplateForm, 'value.allowPermission')) {
      this.disableCreateTemplate = false;
    } else {
      this.disableCreateTemplate = true;
    }
  }


  getSVGTemplate() {
    this.uploadCertificateService.getSvg(this.selectedCertificate.path).then(res => {
      const svgFile = res;
      this.logoHtml = this.sanitizer.bypassSecurityTrustHtml(svgFile);
      // const logoArray = _.concat(this.certLogos, this.certSigns);
      // if (!_.isEmpty(logoArray)) {
      //   this.previewCertificate();
      // }
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  createCertTemplate() {
    // TODO: Need to remove this method call;
    this.previewCertificate();
    const request = this.certConfigModalInstance.prepareCreateAssetRequest(_.get(this.createTemplateForm, 'value'));
    this.disableCreateTemplate = true;
    this.uploadCertificateService.createCertTemplate(request).subscribe(response => {
      console.log('create response', response);
      const assetId = _.get(response, 'result.identifier');
      console.log('this.finalSVGurl', this.finalSVGurl);
      this.uploadTemplate(this.finalSVGurl, assetId);
    }, error => {
      this.toasterService.error('Something went wrong, please try again later');
      console.log('error', error);
    });
  }

  uploadTemplate(base64Url, identifier) {
    this.uploadCertificateService.uploadTemplate(base64Url, identifier).subscribe(response => {
      this.toasterService.success('Template created successfully');
      this.navigationHelperService.navigateToLastUrl();
    }, error => {
      this.toasterService.error('Something went wrong, please try again later');
      console.log('error', error);
    });
  }

  assetData(data) {
    // if (data.type === 'LOGO') {
    // this.certLogos[data.index] = data;
    this.images[data.key] = data
    // } else {
    //   this.certSigns[data.index] = data;
    // }
    console.log(this.images);
    // console.log(this.certSigns);
  }

  close() {
    this.showSelectImageModal = false;
    this.showUploadUserModal = false;
  }

  removeLogo(index) {
    this.certLogos.splice(index, 1);
  }

  removeSigns(index) {
    this.certSigns.splice(index, 1);
  }

  removeImage(type) {
    this.images[type] = {};
  }

  openSateLogos(type) {
    this.logoType = type;
    this.showSelectImageModal = true;
  }

  openSignLogos(type) {
    this.logoType = type;
    this.showSelectImageModal = false;
    this.showUploadUserModal = true;
  }

  chooseCertificate(certificate) {
    this.logoHtml = null;
    this.selectedCertificate = _.clone(certificate);
    this.getSVGTemplate();
  }

  convertHtml(tag) {
    if (tag) {
      const html = tag.toString();
      return new DOMParser().parseFromString(html, 'text/html');
    }
  }

  previewCertificate() {
    this.svgData = this.convertHtml(this.logoHtml);
    console.log(this.svgData);
    this.svgData.getElementsByClassName('cert-state-symbol')[0].remove();
    this.svgData.getElementsByClassName('cert-title')[0].innerHTML = this.createTemplateForm.controls.certificateTitle.value;
    // const logosArray = _.concat(this.certLogos, this.certSigns);
    const logosArray = Object.values(this.images).filter(x => !_.isEmpty(x));
    this.editSVG(logosArray).then(res => {
      this.certificateCreation(this.svgData.getElementsByTagName('svg')[0])
    });
  }


  editSVG(logosArray) {
    console.log(logosArray)
    return new Promise(async (resolve, reject) => {
      for (let i = 0; i < logosArray.length; i++) {
        const logo = logosArray[i];
        if (logo) {
          let bottom = 72;
          if (logo.type && logo.type.includes('SIGN')) {
            bottom = 400
          }
          const res = await this.toDataURL(logo);
          if (res) {
            // this.svgData.getElementsByClassName('cert-state-symbol')[index].setAttribute('xlink:href', res)
            console.log(i, res['type'])
            const left = (i + 1) * 100;
            let doc = this.svgData;
            let image = doc.createElement('image');
            image.setAttribute('xlink:href', res['url'])
            image.setAttribute('id', i)
            image.setAttribute('x', (this.center + left));
            image.setAttribute('y', bottom)
            image.setAttribute('width', 100)
            image.setAttribute('height', 100)
            let element = doc.getElementsByTagName('svg')[0];
            element.appendChild(image);
            if (i === (logosArray.length - 1)) {
              console.log('resolve')
              resolve();
            }
          }
        }
      }
    });
  }

  toDataURL(image) {
    console.log(image);
    if (image.type === 'SIGN') {
      return new Promise((resolve, reject) => resolve({ url: image.url, type: image.type }))
    }
    return fetch(image.url, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.blob())
      .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve({ url: reader.result, type: image.type })
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      }));
  }


  certificateCreation(ev) {
    console.log(ev);
    this.finalSVGurl = this.getBase64Data(ev);
    this.selectedCertificate['path'] = this.sanitizer.bypassSecurityTrustResourceUrl(this.finalSVGurl);
    console.log('*******************Final certificate base64 data********************');
    console.log(this.finalSVGurl);
    console.log('********************************************************************');
  }

  getImagePath() {
    if (this.selectedCertificate) {
      return this.selectedCertificate.path;
    }
  }
  getBase64Data(ev) {
    const div = document.createElement('div');
    div.appendChild(ev.cloneNode(true));
    const b64 = 'data:image/svg+xml;base64,' + window.btoa(div.innerHTML);
    return b64;
  }
}
