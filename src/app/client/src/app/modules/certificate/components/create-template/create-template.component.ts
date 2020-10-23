import { Component, OnInit, ViewChild } from '@angular/core';
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
import { BrowseImagePopupComponent } from '../browse-image-popup/browse-image-popup.component';

@Component({
  selector: 'app-create-template',
  templateUrl: './create-template.component.html',
  styleUrls: ['./create-template.component.scss']
})
export class CreateTemplateComponent implements OnInit {

  @ViewChild(BrowseImagePopupComponent)
  private browseImage: BrowseImagePopupComponent;

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
  // api call
  defaultCertificates = [
    { artifactUrl: 'assets/images/template-1.svg', identifier: 0 },
    { artifactUrl: 'assets/images/template-2.svg', identifier: 1 },
    { artifactUrl: 'assets/images/template-3.svg', identifier: 2 },
    { artifactUrl: 'assets/images/template-4.svg', identifier: 3 }];
  selectedCertificate: any;
  logoHtml;
  svgData;
  center = 275;
  disableCreateTemplate = true;
  certConfigModalInstance = new CertConfigModel();
  images: object = {};
  finalSVGurl: any;
  classNames = {
    'STATE_LOGOS': 'state-logo',
    'STATE_TITLE': 'state-title',
    'SIGN_LOGO': ['signatureImg1', 'signatureImg2'],
    'CERT_TITLE': 'cert-title',
    'DESIGNATIONS_NAMES': ['signatureTitle1', 'signatureTitle2'],
    'DESIGNATIONS': ['signatureTitle1a', 'signatureTitle2a']
  };
  optionSing = 'SIGN2';

  constructor(public uploadCertificateService: UploadCertificateService,
    public userService: UserService,
    private sanitizer: DomSanitizer,
    public toasterService: ToasterService,
    public resourceService: ResourceService,
    public navigationHelperService: NavigationHelperService) {
  }

  ngOnInit() {
    this.navigationHelperService.setNavigationUrl();
    this.initializeFormFields();
    this.selectedCertificate = _.clone(this.defaultCertificates[0]);
    this.getSVGTemplate();
    this.uploadCertificateService.getCertificates().subscribe(res => {
      console.log(res);
      // this.defaultCertificates = _.get(res, 'result.content');
      // this.selectedCertificate = _.clone(this.defaultCertificates[0]);
      // this.getSVGTemplate();
    });
  }

  initializeFormFields() {
    this.createTemplateForm = new FormGroup({
      certificateTitle: new FormControl('', [Validators.required]),
      stateName: new FormControl('', [Validators.required]),
      authoritySignature_0: new FormControl('', [Validators.required]),
      authoritySignature_1: new FormControl(''),
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
    this.uploadCertificateService.getSvg(this.selectedCertificate.artifactUrl).then(res => {
      const svgFile = res;
      this.logoHtml = this.sanitizer.bypassSecurityTrustHtml(svgFile);
      console.log(this.convertHtml(this.logoHtml));
      this.previewCertificate();
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
    if (data.key === this.optionSing) {
      this.createTemplateForm.get('authoritySignature_1').setValidators([Validators.required]);
      this.createTemplateForm.get('authoritySignature_1').updateValueAndValidity();
    }
    this.images[data.key] = data;
    console.log(this.images);
  }

  close() {
    this.showSelectImageModal = false;
    this.showUploadUserModal = false;
  }

  removeImage(key) {
    if (key === 'SIGN2') {
      this.createTemplateForm.get('authoritySignature_1').clearValidators();
      this.createTemplateForm.get('authoritySignature_1').updateValueAndValidity();
    }
    this.images[key] = {};
  }

  openSateLogos(type) {
    this.logoType = type;
    this.showSelectImageModal = true;
    this.browseImage.getAssetList();
  }

  openSignLogos(type) {
    this.logoType = type;
    this.showSelectImageModal = true;
    this.browseImage.getAssetList();
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
    console.log(this.images);
    this.svgData = this.convertHtml(this.logoHtml);
    const stateLogos = this.svgData.getElementsByClassName(this.classNames.STATE_LOGOS);
    const digitalSigns = this.classNames.SIGN_LOGO.map(id => this.svgData.getElementById(id));
    console.log(digitalSigns);
    this.updateTitles();
    this.updateStateLogos(stateLogos);
    this.updateSigns(digitalSigns);
  }

  updateTitles() {
    const certTitle = this.svgData.getElementsByClassName(this.classNames.CERT_TITLE);
    certTitle[0].innerHTML = this.createTemplateForm.controls.certificateTitle.value;
    const stateTitle = this.svgData.getElementsByClassName(this.classNames.STATE_TITLE);
    stateTitle[0].innerHTML = this.createTemplateForm.controls.stateName.value;
    this.classNames.DESIGNATIONS.forEach((id, index) => {
      const designation_html = this.svgData.getElementById(id);
      if (designation_html) {
        const title = this.createTemplateForm.get(`authoritySignature_${index}`).value;
        designation_html.innerHTML = title;
      }
    });
  }

  updateStateLogos(stateLogos) {
    const logosArray = Object.values(this.images).filter(x => !_.isEmpty(x) && x.type === 'LOGO');
    this.editSVG(logosArray, stateLogos).then(res => {
      this.certificateCreation(this.svgData.getElementsByTagName('svg')[0]);
    });
  }

  updateSigns(stateLogos) {
    const logosArray = Object.values(this.images).filter(x => !_.isEmpty(x) && x.type === 'SIGN');
    this.editSVG(logosArray, stateLogos).then(res => {
      this.certificateCreation(this.svgData.getElementsByTagName('svg')[0]);
    });
  }

  editSVG(logosArray, stateLogos) {
    console.log(logosArray);
    return new Promise(async (resolve, reject) => {
      for (let i = 0; i < logosArray.length; i++) {
        const logo = logosArray[i];
        if (logo) {
          console.log(stateLogos[i]);
          const res = await this.toDataURL(logo);

          if (res && !_.isEmpty(stateLogos) && stateLogos[i]) {
            stateLogos[i].setAttribute('xlink:href', res['url']);
          }
          if (i === (logosArray.length - 1)) {
            console.log('resolve');
            resolve();
          }
        }
      }
    });
  }

  toDataURL(image) {
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
        reader.onloadend = () => resolve({ url: reader.result, type: image.type });
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      }));
  }


  certificateCreation(ev) {
    this.finalSVGurl = this.getBase64Data(ev);
    this.selectedCertificate['artifactUrl'] = this.sanitizer.bypassSecurityTrustResourceUrl(this.finalSVGurl);
  }

  getImagePath() {
    if (this.selectedCertificate) {
      return this.selectedCertificate.artifactUrl;
    }
  }
  getBase64Data(ev) {
    const div = document.createElement('div');
    div.appendChild(ev.cloneNode(true));
    const b64 = 'data:image/svg+xml;base64,' + window.btoa(div.innerHTML);
    return b64;
  }
}
