import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'lodash-es';
import { UploadCertificateService } from '../../services/upload-certificate/upload-certificate.service';
import { MockData } from './create-template.component.data';
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
    { path: 'assets/images/mp.svg' },
    { path: 'assets/images/odisha.svg' },
    { path: 'assets/images/jh.svg' }]
  selectedCertificate: any;
  svgFile;
  logoHtml;
  svgData;
  center = 275;
  disableCreateTemplate = true;
  certConfigModalInstance = new CertConfigModel();

  constructor(public uploadCertificateService: UploadCertificateService,
    public userService: UserService,
    private sanitizer: DomSanitizer,
    public toasterService: ToasterService,
    public resourceService: ResourceService,
    public navigationHelperService: NavigationHelperService,) {
  }

  ngOnInit() {
    this.navigationHelperService.setNavigationUrl();
    this.selectedCertificate = this.defaultCertificates[0];
    this.initializeFormFields();
    this.getSVGTemplate();
  }

  initializeFormFields() {
    this.createTemplateForm = new FormGroup({
      certificateTitle: new FormControl('', [Validators.required]),
      stateName: new FormControl('', [Validators.required]),
      authoritySignature: new FormControl('', [Validators.required]),
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
      this.svgFile = res;
      this.logoHtml = this.sanitizer.bypassSecurityTrustHtml(this.svgFile);
      const logoArray = _.concat(this.certLogos, this.certSigns);
      if (!_.isEmpty(logoArray)) {
        this.previewCertificate();
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  createCertTemplate() {
    const request = this.certConfigModalInstance.prepareCreateAssetRequest(_.get(this.createTemplateForm, 'value'));
    this.disableCreateTemplate = true;
    this.uploadCertificateService.createCertTemplate(request).subscribe(response => {
      this.toasterService.success('Template created successfully');
      this.navigationHelperService.navigateToLastUrl();
    }, error => {
      this.toasterService.error('Something went wrong, please try again later');
      console.log('error', error);
    });
  }

  onTemplateChange() {

  }


  assetData(data) {
    if (data.type === 'LOGO') {
      this.certLogos.push(data);
    } else {
      this.certSigns.push(data);
    }
    console.log(this.certLogos);
    console.log(this.certSigns);
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
    this.selectedCertificate = certificate;
    this.getSVGTemplate();
  }

  convertHtml(tag) {
    const html = tag.toString();
    return new DOMParser().parseFromString(html, 'text/html');
  }

  previewCertificate() {
    this.svgData = this.convertHtml(this.logoHtml);
    console.log(this.svgData)
    this.svgData.getElementsByClassName('cert-state-symbol')[0].remove();
    const logosArray = _.concat(this.certLogos, this.certSigns);
    this.editSVG(logosArray).then(res => {
      this.certificateCreation(this.svgData.getElementsByTagName('svg')[0])
    })
  }

  editSVG(logosArray) {
    console.log(logosArray)
    return new Promise((resolve, reject) => {
      logosArray.forEach((data, index) => {
        if (data) {
          console.log('index------', index, data)
          let bottom = 72;
          if (data.type === 'SIGN') {
            bottom = 400
          }
          this.toDataURL(data.url).then(res => {
            if (res) {
              // this.svgData.getElementsByClassName('cert-state-symbol')[index].setAttribute('xlink:href', res)
              console.log(index)
              const left = (index + 1) * 100;
              let doc = this.svgData;
              let image = doc.createElement('image');
              image.setAttribute('xlink:href', res)
              image.setAttribute('id', index)
              image.setAttribute('x', (this.center + left));
              image.setAttribute('y', bottom)
              image.setAttribute('width', 100)
              image.setAttribute('height', 100)
              let element = doc.getElementsByTagName('svg')[0];
              element.appendChild(image);
              if (index === (logosArray.length - 1)) {
                console.log('resolve')
                resolve();
              }
            }
          })
        }
      });
    });

  }

  toDataURL(url) {
    return fetch(url, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.blob())
      .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      }));
  }


  certificateCreation(ev) {
    console.log(ev);
    const url = this.getBase64Data(ev);
    this.selectedCertificate = { 'path': this.sanitizer.bypassSecurityTrustResourceUrl(url) };
    console.log('*******************Final certificate base64 data********************');
    console.log(url);
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
