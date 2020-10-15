import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'lodash-es';
import { UploadCertificateService } from '../../services/upload-certificate/upload-certificate.service';
import { MockData } from './create-template.component.data';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '@sunbird/core';
import { ToasterService, ResourceService } from '@sunbird/shared';
import { DomSanitizer } from '@angular/platform-browser';
import { CertConfigModel } from './../../models/cert-config-model/cert-config-model';

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

  certLogos: any = [];
  certSigns: any = [];
  logoType;
  defaultCertificates = [
    { path: 'assets/images/gj.svg' },
    { path: 'assets/images/dl.svg' },
    { path: 'assets/images/jh.svg' }]
  selectedCertificate: any;
  svgFile;
  logoHtml;
  svgData;
  center = 150;
  disableCreateTemplate = true;
  certConfigModalInstance = new CertConfigModel();

  constructor(public uploadCertificateService: UploadCertificateService,
    public userService: UserService,
    private sanitizer: DomSanitizer,
    public toasterService: ToasterService,
    public resourceService: ResourceService) {
  }

  ngOnInit() {
    // for testing  
    this.toDataURL('https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_212391432703451136165/artifact/boys_1512626063334.png').then(res => {
      console.log(res)
    })
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

  getBase64Image(img) {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const dataURL = canvas.toDataURL('image/png');
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
  }

  getSVGTemplate() {
    this.uploadCertificateService.getSvg(this.selectedCertificate.path).then(res => {
      this.svgFile = res;
      this.logoHtml = this.sanitizer.bypassSecurityTrustHtml(this.svgFile);
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  createCertTemplate() {
    const request = this.certConfigModalInstance.prepareCreateAssetRequest(_.get(this.createTemplateForm, 'value'));
    console.log('request body to make create cert api call', request);

    // TODO: Api call to make cert create: api/asset/v1/create
  }

  onTemplateChange() {

  }


  assetData(data) {
    if (data.type === 'LOGO') {
      this.certLogos.push(data);
    }else{
      this.certSigns.push(data);
    }
  }

  close(){
    this.showSelectImageModal = false;
  }

  removeLogo(index) {
    this.certLogos.splice(index, 1)
  }

  removeSigns(index) {
    this.certSigns.splice(index, 1)
  }

  openSateLogos(type) {
    this.logoType = type
    this.showSelectImageModal = true;
  }

  openSignLogos(type) {
    this.logoType = type;
    this.showSelectImageModal = true;
  }

  chooseCertificate(certificate) {
    this.selectedCertificate = certificate;
    this.getSVGTemplate();
  }

  convertHtml(tag) {
    const html = tag.toString();
    return new DOMParser().parseFromString(html, "text/html");
  }

  previewCertificate() {
    this.svgData = this.convertHtml(this.logoHtml)
    const logsArray = _.concat(this.certLogos, this.certSigns);
    logsArray.forEach((x, index) => {
      this.editSVG(x, index)
    })
    this.certificateCreation(this.svgData.getElementsByTagName('svg')[0])
  }

  editSVG(data, index) {
    if (data) {
      let bottom = 75;
      if (data.type === 'SIGN') {
        bottom = 400
      }
      const left = (index + 1) * 100;
      let doc = this.svgData;
      let image = doc.createElement("image");
      image.setAttribute('xlink:href', data.url)
      image.setAttribute('id', index)
      image.setAttribute('x', (this.center + left))
      image.setAttribute('y', bottom)
      image.setAttribute('width', 100)
      image.setAttribute('height', 100)
      let element = doc.getElementsByTagName("svg")[0];
      element.appendChild(image);
    }
  }

  toDataURL(url) {
    return fetch(url)
      .then(response => response.blob())
      .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      }))
  }


  certificateCreation(ev) {
    const url = this.getBase64Data(ev);
    this.selectedCertificate = { 'path': this.sanitizer.bypassSecurityTrustResourceUrl(url) }
    //  console.log(this.selectedCertificate)
    // const imageTag = document.getElementById('updatedSvg')
    // if (imageTag) {
    //   const data = this.sanitizer.bypassSecurityTrustStyle(url)
    //   imageTag.setAttribute('src', data)
    // } 
    // else {
    //   const image = document.createElement('img');
    //   image.setAttribute('src', url)
    //   image.setAttribute('id', 'updatedSvg')
    //   document.getElementById('imageSrc').appendChild(image)
    // }
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
