import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
selector: 'app-certificate-configuration',
templateUrl: './certificate-configuration.component.html',
styleUrls: ['./certificate-configuration.component.scss']
})
export class CertificateConfigurationComponent implements OnInit, OnDestroy {

public unsubscribe$ = new Subject<void>();
showscreen: boolean;
showanotherscreen: boolean;
showErrorModal;
showPreviewModal;
;showTemplateDetectModal;
configureCertificate = [
 { title:"Course on teaching Science for upper primary teachers" ,imagePath:"assets/images/certificate-icon.png"},
 { title:"Course on teaching Science for upper primary teachers" ,imagePath:"assets/images/certificate-icon.png" },
 { title:"Personal safety course" ,imagePath:"assets/images/certificate-icon.png" },
 { title:"PISA orientation" , count:3 ,imagePath:"assets/images/certificate-icon.png"},
 { title:"Initiatives in school education" ,imagePath:"assets/images/certificate-icon.png" }
];
constructor() { }

ngOnInit() {
}

secondscreen(){
 this.showscreen = !this.showscreen;
}
thirdscreen(){
 this.showanotherscreen = !this.showanotherscreen; 
}

ngOnDestroy() {
 this.unsubscribe$.next();
 this.unsubscribe$.complete();
}

getCertificateDetails() {  }

addCertificateToBatch() { }
}
