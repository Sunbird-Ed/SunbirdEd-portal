import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'lodash-es';
import { UploadCertificateService } from '../../services/upload-certificate/upload-certificate.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService, CertRegService } from '@sunbird/core';
import { ToasterService, ResourceService, NavigationHelperService } from '@sunbird/shared';
import { DomSanitizer } from '@angular/platform-browser';
import { CertConfigModel } from './../../models/cert-config-model/cert-config-model';
import { BrowseImagePopupComponent } from '../browse-image-popup/browse-image-popup.component';
import {ActivatedRoute} from '@angular/router';
import dayjs from 'dayjs';
@Component({
  selector: 'app-create-template',
  templateUrl: './create-template.component.html',
  styleUrls: ['./create-template.component.scss']
})
export class CreateTemplateComponent implements OnInit, OnDestroy {

  @ViewChild(BrowseImagePopupComponent, {static: false})
  public browseImage: BrowseImagePopupComponent;

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
  defaultCertificates = [];
  selectedCertificate: any = {};
  logoHtml;
  svgData;
  center = 275;
  disableCreateTemplate = true;
  certConfigModalInstance = new CertConfigModel();
  images = {
    'LOGO1': { 'index': null, 'name' : '' , 'key': '', 'type': '', 'url': ''},
    'LOGO2': { 'index': null, 'name' : '' , 'key': '', 'type': '', 'url': ''},
    'SIGN1': { 'index': null, 'name' : '' , 'key': '', 'type': '', 'url': ''},
    'SIGN2': { 'index': null, 'name' : '' , 'key': '', 'type': '', 'url': ''}
  };
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
  queryParams: any;
  mode: any;

  constructor(public uploadCertificateService: UploadCertificateService,
    public userService: UserService,
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private certRegService: CertRegService,
    public toasterService: ToasterService,
    public resourceService: ResourceService,
    public navigationHelperService: NavigationHelperService) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.queryParams = params;
      this.mode = _.get(this.queryParams, 'type');
    });
    this.navigationHelperService.setNavigationUrl();
    this.initializeFormFields();
    this.getDefaultTemplates();
  }

  getDefaultTemplates() {
    const request = {
      'request': {
          'filters': {
              'certType': 'cert template layout',
              'channel': this.userService.channel,
              'mediaType': 'image'
          },
          'fields': ['identifier', 'name', 'code', 'certType', 'data', 'issuer', 'signatoryList', 'artifactUrl', 'primaryCategory', 'channel'],
          'limit': 100
      }
    };
    this.uploadCertificateService.getCertificates(request).subscribe(res => {
      this.defaultCertificates = _.get(res, 'result.content');
      this.selectedCertificate = _.clone(this.defaultCertificates[0]);
      this.getSVGTemplate();
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
    // TODO: Form validation need to improve
    const logo = _.get(this.images, 'LOGO1.url');
    const sign = _.get(this.images, 'SIGN1.url');
    if (this.createTemplateForm.status === 'VALID' && _.get(this.createTemplateForm, 'value.allowPermission')
      && logo && sign) {
      this.disableCreateTemplate = false;
    } else {
      this.disableCreateTemplate = true;
    }
  }


  getSVGTemplate() {
    this.uploadCertificateService.getSvg(this.selectedCertificate.artifactUrl).then(res => {
      const svgFile = res;
      this.logoHtml = this.sanitizeHTML(svgFile);
      this.previewCertificate();
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  createCertTemplate() {
    this.validateForm();
    // TODO: form validation need to improve
    if (this.disableCreateTemplate) {
      this.createTemplateForm.controls.certificateTitle.markAsTouched();
      this.createTemplateForm.controls.stateName.markAsTouched();
      this.createTemplateForm.controls.authoritySignature_0.markAsTouched();
      this.createTemplateForm.controls.authoritySignature_1.markAsTouched();
      this.createTemplateForm.controls.allowPermission.markAsTouched();
    } else {
      this.previewCertificate();
      setTimeout(() => {
        const channel = this.userService.channel;
        const request = this.certConfigModalInstance.prepareCreateAssetRequest(_.get(this.createTemplateForm, 'value'), channel, this.selectedCertificate, this.images);
        this.disableCreateTemplate = true;
        this.uploadCertificateService.createCertTemplate(request).subscribe(response => {
          const assetId = _.get(response, 'result.identifier');
          this.uploadTemplate(this.finalSVGurl, assetId);
        }, error => {
          this.toasterService.error('Something went wrong, please try again later');
        });
      }, 1000);
    }
  }

  uploadTemplate(base64Url, identifier) {
    this.uploadCertificateService.storeAsset(base64Url, identifier).subscribe(response => {
      this.toasterService.success(_.get(this.resourceService, 'frmelmnts.cert.lbl.certAddSuccess'));
      const templateIdentifier = {'identifier': _.get(response , 'result.identifier')};
      this.uploadCertificateService.certificate.next(templateIdentifier);
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
    this.validateForm();
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
    this.validateForm();
  }

  openSateLogos(type) {
    this.logoType = type;
    this.showSelectImageModal = true;
    this.browseImage.getAssetList();
  }

  openSignLogos(type) {
    this.logoType = type;
    this.showSelectImageModal = false;
    this.showUploadUserModal = true;
    // this.browseImage.getAssetList();
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
    const stateLogos = this.svgData.getElementsByClassName(this.classNames.STATE_LOGOS);
    const digitalSigns = this.classNames.SIGN_LOGO.map(id => this.svgData.getElementById(id));
    this.updateTitles();
    this.updateStateLogos(stateLogos);
    this.updateSigns(digitalSigns);
  }

  updateTitles() {
    const certTitle = this.svgData.getElementsByClassName(this.classNames.CERT_TITLE);
    certTitle[0].innerHTML = this.createTemplateForm.controls.certificateTitle.value;
    const stateTitle = this.svgData.getElementsByClassName(this.classNames.STATE_TITLE);
    stateTitle[0].innerHTML = this.createTemplateForm.controls.stateName.value;
    this.classNames.DESIGNATIONS_NAMES.forEach((id, index) => {
      const designation_html = this.svgData.getElementById(id);
      if (designation_html) {
        const title = this.createTemplateForm.get(`authoritySignature_${index}`).value;
        designation_html.innerHTML = title;
      }
    });
  }

  updateStateLogos(stateLogos) {
    const logosArray = Object.values(this.images).filter(x => !_.isEmpty(x) && x['type'] === 'LOGO');
    this.editSVG(logosArray, stateLogos).then(res => {
      this.certificateCreation(this.svgData.getElementsByTagName('svg')[0]);
    });
  }

  updateSigns(stateLogos) {
    const logosArray = Object.values(this.images).filter(x => !_.isEmpty(x) && x['type'] === 'SIGN');
    this.editSVG(logosArray, stateLogos).then(res => {
      this.certificateCreation(this.svgData.getElementsByTagName('svg')[0]);
    });
  }

  editSVG(logosArray, stateLogos) {
    return new Promise(async (resolve, reject) => {
      for (let i = 0; i < logosArray.length; i++) {
        const logo = logosArray[i];
        if (logo) {
          const res = await this.toDataURL(logo);

          if (res && !_.isEmpty(stateLogos) && stateLogos[i]) {
            stateLogos[i].setAttribute('xlink:href', res['url']);
          }
          if (i === (logosArray.length - 1)) {
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

urltoFile(url, filename, mimeType) {
  return (fetch(url)
      .then((res) => {
        return res.arrayBuffer();
      })
      .then((buf) => {
        return new File([buf], filename, {type: mimeType});
      })
  );
}

  certificateCreation(ev) {
   const dataURL  = this.getBase64Data(ev);
    this.selectedCertificate['artifactUrl'] = this.sanitizer.bypassSecurityTrustResourceUrl(dataURL);
    this.urltoFile(dataURL, `certificate_${dayjs().format('YYYY-MM-DD_HH_mm')}.svg`, 'image/svg+xml')
    .then((file) => {
      this.finalSVGurl = file;
    });
  }


  sanitizeHTML(html){
    return this.sanitizer.bypassSecurityTrustHtml(html);
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

  back() {
    this.uploadCertificateService.certificate.next(null);
    this.navigationHelperService.navigateToLastUrl();
  }
}
