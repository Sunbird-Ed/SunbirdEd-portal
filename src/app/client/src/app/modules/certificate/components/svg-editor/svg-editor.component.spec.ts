import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { SvgEditorComponent } from './svg-editor.component';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserCacheTtlService, ConfigService, NavigationHelperService, ToasterService, UtilService, ResourceService } from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheService } from 'ng2-cache-service';
import { CoreModule } from '@sunbird/core';
import { configureTestSuite } from '@sunbird/test-util';
import { CertConfigModel } from '../../models/cert-config-model/cert-config-model';
import * as _ from 'lodash-es';
import { UploadCertificateService } from '../../services/upload-certificate/upload-certificate.service';
import { of, throwError } from 'rxjs';
import { MockData } from './svg-editor.component.spec.data';

describe('SvgEditorComponent', () => {
  let component: SvgEditorComponent;
  let fixture: ComponentFixture<SvgEditorComponent>;
  configureTestSuite();

  const resourceBundle = {
    frmelmnts: {
      cert : {
        lbl :
        {
          certAddSuccess : 'Template created successfully'
        }
      }
  },
  messages: {

  }
};

const fakeActivatedRoute = {
  snapshot: {
    data: {
      telemetry: {
        env: 'certs',
        pageid: 'certificate-configuration',
        type: 'view',
        subtype: 'paginate',
        ver: '1.0'
      }
    }
  },
  queryParams: of({
    type: 'edit',
    courseId: 'do_456789',
    batchId: '124631256'
  })
};


class RouterStub {
  public url = '/cert/configure/add';
  navigate = jasmine.createSpy('navigate');
}

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, CoreModule, ReactiveFormsModule, HttpClientTestingModule, RouterModule.forRoot([]) ],
      declarations: [ SvgEditorComponent ],
      providers: [
        ConfigService,
        NavigationHelperService,
        UtilService,
        BrowserCacheTtlService,
        ToasterService,
        TelemetryService,
        CacheService,
        UploadCertificateService,
        {provide: ResourceService, useValue: resourceBundle},
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: Router, useClass: RouterStub},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgEditorComponent);
    component = fixture.componentInstance;
    component.defaultCertificates = [
      { artifactUrl: 'assets/images/template-1.svg', identifier: 0 },
      { artifactUrl: 'assets/images/template-2.svg', identifier: 1 },
      { artifactUrl: 'assets/images/template-3.svg', identifier: 2 },
      { artifactUrl: 'assets/images/template-4.svg', identifier: 3 }];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should terminate all subscriptions', () => {
    spyOn(component.unsubscribe$, 'next');
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });

  it('on init', () => {
    const navigationHelperService = TestBed.inject(NavigationHelperService);
    spyOn(navigationHelperService, 'setNavigationUrl').and.stub();
    component.ngOnInit();
    expect(navigationHelperService.setNavigationUrl).toHaveBeenCalled();
  });

  it('should enable create template button if all the form fields are filled.', () => {
    component.createTemplateForm = new FormGroup({
      certificateTitle: new FormControl('Completion certificate'),
      stateName: new FormControl('Gujrat'),
      authoritySignature_0: new FormControl('vinu kumar'),
      authoritySignature_1: new FormControl('Sudip Mukherjee'),
      allowPermission: new FormControl(true)
    });
    component.images.LOGO1.url = 'http://test.com/';
    component.images.SIGN1.url = 'http://test.com/';
    component.validateForm();
    expect(component.disableCreateTemplate).toEqual(false);
  });

  it('should not enable create template button if any of the form fields are not filled.', () => {
    component.createTemplateForm = new FormGroup({
      certificateTitle: new FormControl(''),
      stateName: new FormControl(''),
      authoritySignature_0: new FormControl(''),
      authoritySignature_1: new FormControl(''),
      allowPermission: new FormControl('')
    });
    component.validateForm();
    expect(component.disableCreateTemplate).toEqual(true);
  });

  it('should create the certificate template with all the form values', fakeAsync(() => {
    const uploadCertService = TestBed.inject(UploadCertificateService);
    component.createTemplateForm = new FormGroup({
      certificateTitle: new FormControl('Completion certificate'),
      stateName: new FormControl('Gujrat'),
      authoritySignature_0: new FormControl('vinu kumar'),
      authoritySignature_1: new FormControl('Sudip Mukherjee'),
      allowPermission: new FormControl(true)
    });
    component.images.LOGO1.url = 'http://test.com/';
    component.images.SIGN1.url = 'http://test.com/';
    component.selectedCertificate = {issuer: `{}`};
    spyOn(component, 'uploadTemplate');
    spyOn(component, 'previewCertificate').and.stub();
    spyOn(new CertConfigModel(), 'prepareCreateAssetRequest').and.stub();
    spyOn(uploadCertService, 'createCertTemplate').and.returnValue(of(MockData.create));

    component.createCertTemplate();
    tick(1000);
  expect(component.disableCreateTemplate).toEqual(true);
    expect(component.uploadTemplate).toHaveBeenCalledWith(component.finalSVGurl, MockData.create.result.identifier);
  }));

  it('should not create the certificate template with all the form values', fakeAsync(() => {
    const uploadCertService = TestBed.inject(UploadCertificateService);
    const toasterService:any = TestBed.inject(ToasterService);
    component.createTemplateForm = new FormGroup({
      certificateTitle: new FormControl('Completion certificate'),
      stateName: new FormControl('Gujrat'),
      authoritySignature_0: new FormControl('vinu kumar'),
      authoritySignature_1: new FormControl('Sudip Mukherjee'),
      allowPermission: new FormControl(true)
    });
    component.images.LOGO1.url = 'http://test.com/';
    component.images.SIGN1.url = 'http://test.com/';
    spyOn(component, 'uploadTemplate');
    component.selectedCertificate = {issuer: `{}`};
    spyOn(component, 'previewCertificate').and.stub();
    spyOn(toasterService, 'error').and.stub();
    spyOn(new CertConfigModel(), 'prepareCreateAssetRequest').and.stub();
    spyOn(uploadCertService, 'createCertTemplate').and.callFake(() => throwError({}));
    component.createCertTemplate();
    tick(1000);
    expect(toasterService.error).toHaveBeenCalledWith('Something went wrong, please try again later');
  }));

  it('should upload the final certificate svg image', () => {
    const uploadCertService = TestBed.inject(UploadCertificateService);
    const navigationHelperService = TestBed.inject(NavigationHelperService);
    const toasterService:any = TestBed.inject(ToasterService);
    spyOn(toasterService, 'success').and.stub();
    spyOn(navigationHelperService, 'navigateToLastUrl').and.stub();
    spyOn(uploadCertService, 'storeAsset').and.returnValue(of({}));
    component.uploadTemplate(MockData.imageUrlData.id, 'SOME_DO_ID');
    expect(toasterService.success).toHaveBeenCalledWith('Template created successfully');
    expect(navigationHelperService.navigateToLastUrl).toHaveBeenCalled();
  });

  it('should not upload the final certificate svg image', () => {
    const uploadCertService = TestBed.inject(UploadCertificateService);
    const toasterService:any = TestBed.inject(ToasterService);
    spyOn(toasterService, 'error').and.stub();
    spyOn(uploadCertService, 'storeAsset').and.callFake(() => throwError({}));
    component.uploadTemplate(MockData.imageUrlData.id, 'SOME_DO_ID');
    expect(toasterService.error).toHaveBeenCalledWith('Something went wrong, please try again later');
  });

  it('should close the browse', () => {
    component.close();
    expect(component.showSelectImageModal).toEqual(false);
    expect(component.showUploadUserModal).toEqual(false);
  });

  it('should call removeImage', () => {
    component.removeImage('LOGO1');
    expect(_.isEmpty(component.images['LOGO1'])).toBeTruthy();
  });

  it('should call openSignLogos', () => {
    const data = {type: 'SIGN', index: 0,  key: 'SIGN1'};
    component.openSignLogos(data);
    expect(component.logoType).toEqual(data);
    expect(component.showSelectImageModal ).toBeFalsy();
    expect(component.showUploadUserModal).toBeTruthy();
  });

  it('should call chooseCertificate', () => {
    spyOn(component, 'getSVGTemplate').and.stub();
    const data = { artifactUrl: 'assets/images/template-1.svg', identifier: 0 };
    component.chooseCertificate(data);
    expect(component.selectedCertificate ).toEqual(data);
  });

  it('should call  previewCertificate', () => {
    spyOn(component, 'updateTitles').and.stub();
    spyOn(component, 'updateStateLogos').and.stub();
    spyOn(component, 'updateSigns').and.stub();
    component.logoHtml = MockData.svgData.data;
    const data = { artifactUrl: 'assets/images/template-1.svg', identifier: 0 };
    component.previewCertificate();
    expect(component.updateStateLogos).toHaveBeenCalled();
    expect(component.updateSigns).toHaveBeenCalled();
  });

  it('should call updateTitles', () => {
    component.svgData = new DOMParser().parseFromString(MockData.svgData.data, 'text/html');
    component.createTemplateForm.patchValue({
      certificateTitle: 'Completion Of Test',
      stateName: 'AP',
      authoritySignature_0: 'CEO'
    });
    component.updateTitles();
    const stateTitle  = component.svgData.getElementById('stateTitle');
    const certTitle   = component.svgData.getElementById('certTitle');
    const wrapper = document.createElement('div');
    wrapper.appendChild(stateTitle);
    const wrapper2 = document.createElement('div');
    wrapper2.innerHTML = `<text class="state-title" id="stateTitle" x="420.942785" y="185" xml:space="preserve">AP</text>`;
    // expect(wrapper.firstChild).toEqual(wrapper2.firstChild);
  });

  it('should call updateSigns', () => {
    component.images = MockData.imagesArray;
    const image = `<image></image>`;
    spyOn(component, 'editSVG').and.returnValue(new Promise((resolve) => resolve()));
    const state = new DOMParser().parseFromString(image, 'text/html');
    component.updateSigns(state);
    expect(component.editSVG).toHaveBeenCalled();
  });

  it('should call updateStateLogos', () => {
    const toasterService:any = TestBed.inject(ToasterService);
    spyOn(toasterService, 'error').and.stub();
    component.svgData = new DOMParser().parseFromString(MockData.svgData.data, 'text/html');
    component.images = MockData.imagesArray;
    const image = `<image></image>`;
    spyOn(component, 'editSVG').and.returnValue(new Promise((resolve) => resolve()));
    const state = new DOMParser().parseFromString(image, 'text/html');
    component.updateStateLogos(state);
    expect(component.editSVG).toHaveBeenCalled();
  });

  it('should call certificateCreation', () => {
    component.images = MockData.imagesArray;
    const svgData = MockData.svgData.data;
    spyOn(component, 'getBase64Data').and.returnValue('data:image/jpeg;base64, xyz');
    spyOn(component, 'urltoFile').and.returnValue(new Promise((resolve) => resolve('File')));
    const ev = new DOMParser().parseFromString(svgData, 'text/html');
    component.certificateCreation(ev);
    expect(component.urltoFile).toHaveBeenCalled();
    expect(component.getBase64Data).toHaveBeenCalled();
  });

  it('should call assetData', () => {
    component.optionSing = 'LOGO1';
    const data = {
      index: 0,
      key: 'LOGO1',
      name: '001.png',
      type: 'LOGO',
      url: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11293020669537484811928/artifact/001_1578394365141.png'
      };
    component.assetData(data);
    expect(component.images['LOGO1']).toEqual(data);
  });

  it('should call getDefaultTemplates', () => {
  const uploadService = TestBed.inject(UploadCertificateService);
  spyOn(uploadService, 'getCertificates').and.returnValue(of(MockData.defaultCerts));
  spyOn(component, 'getSVGTemplate').and.stub();
  component.getDefaultTemplates();
  expect(component.getSVGTemplate).toHaveBeenCalled();
  });

  it('should make input as touched', () => {
    component.svgData = new DOMParser().parseFromString(MockData.svgData.data, 'text/html');
    component.createTemplateForm = new FormGroup({
      certificateTitle: new FormControl(Validators.required),
      stateName: new FormControl(Validators.required),
      authoritySignature_0: new FormControl(Validators.required),
      authoritySignature_1: new FormControl(Validators.required),
      allowPermission: new FormControl(Validators.requiredTrue)
    });
    component.images.LOGO1.url = null;
    component.images.SIGN1.url = null;
    component.createCertTemplate();
    expect(component.createTemplateForm.controls.certificateTitle.touched).toEqual(true);
    expect(component.createTemplateForm.controls.stateName.touched).toEqual(true);
    expect(component.createTemplateForm.controls.authoritySignature_0.touched).toEqual(true);

  });
  // it('should remove the selected logo', () => {
  //   component.certLogos = [
  //     {
  //       id: '123'
  //     },
  //     {
  //       id: '456'
  //     },
  //     {
  //       id: '789'
  //     }
  //   ];
  //   component.removeLogo(1);
  //   expect(component.certLogos).toEqual([
  //     {
  //       id: '123'
  //     },
  //     {
  //       id: '789'
  //     }
  //   ]);
  // });

  // it('should remove the selected sign', () => {
  //   component.certSigns = [
  //     {
  //       id: '123'
  //     },
  //     {
  //       id: '456'
  //     },
  //     {
  //       id: '789'
  //     }
  //   ];
  //   component.removeSigns(1);
  //   expect(component.certSigns).toEqual([
  //     {
  //       id: '123'
  //     },
  //     {
  //       id: '789'
  //     }
  //   ]);
  // });

  it('should redo layout on render', () => {
    component.layoutConfiguration = {};
    component.redoLayout();
    component.layoutConfiguration = null;
    component.redoLayout();
  });

  describe('SVG editor test cases', () => {

    it('should invoke when SVG element is clicked for text', () => {
      component.showSVGInputModal = false;
      const e = {
        type: 'text',
        element: {
          textContent: 'SVG header'
        }
      };
      component.elementClicked(e);
      expect(component.selectedSVGObject).toBeDefined();
      expect(component.showSVGInputModal).toBeTruthy();
      expect(component.showSVGInputModal).toEqual(true);
      expect(component.selectedSVGObject['type']).toEqual(e.type);
      expect(component.selectedSVGObject['value']).toEqual(e.element.textContent);
    });

    it('should close input modal from accepting user input', () => {
      component.closeSVGInputModal();
      expect(component.showSVGInputModal).toBeFalsy();
    });

    it('should invoke updateSVGInputTag after input is accepted for new svg text element', () => {
      component.showSVGInputModal = true;
      spyOn(component.edit, 'next');
      component.updateSVGInputTag();
      expect(component.showSVGInputModal).toBeFalsy();
      expect(component.edit.next).toHaveBeenCalled();
    });

    xit('should convert image URL to base64 string', () => {
      const imageObj = {
        url: 'http://staging.sunbirded.org/auth/resources/7.0.1/login/ntp/img/logo.png'
      };
      component.svgAssetData(imageObj);
      expect(component.showSVGInputModal).toBeFalsy();
      expect(component.selectedSVGObject).toEqual({});
    });

    it('should toggle preview and edit for buttons - for hide', () => {
      spyOn(component.togglePreview, 'next');
      component.toggleSVGPreview();
      expect(component.previewButton).toEqual('hide');
      expect(component.togglePreview.next).toHaveBeenCalled();
    });

    it('should toggle preview and edit for buttons - for show', () => {
      component.previewButton = 'hide';
      spyOn(component.togglePreview, 'next');
      component.toggleSVGPreview();
      expect(component.previewButton).toEqual('show');
      expect(component.togglePreview.next).toHaveBeenCalled();
    });

    it('should create the certificate template with new SVG changes', fakeAsync(() => {
      const uploadCertService = TestBed.inject(UploadCertificateService);
      component.selectedCertificate = { issuer: `{}` };
      const elementMock = {
        innerHTML: '<svg height="30" width="200"><text x="0" y="15" fill="red">Sample SVG String</text></svg>'
      };
      spyOn(component.save, 'next');
      spyOn(document, 'getElementById').and.returnValue(elementMock);
      spyOn(component, 'uploadTemplate');
      spyOn(component, 'previewCertificate').and.stub();
      spyOn(new CertConfigModel(), 'prepareCreateAssetRequest').and.stub();
      spyOn(uploadCertService, 'createCertTemplate').and.returnValue(of(MockData.create));
      component.saveUpdatedCertificate();
      tick(1000);
      expect(component.disableCreateTemplate).toEqual(true);
      expect(component.save.next).toHaveBeenCalled();
      expect(component.uploadTemplate).toHaveBeenCalledWith(component.finalSVGurl, MockData.create.result.identifier);
    }));

    it('should not create the certificate template with new SVG changes and expect error', fakeAsync(() => {
      spyOn(component.save, 'next');
      const uploadCertService = TestBed.inject(UploadCertificateService);
      const toasterService:any = TestBed.inject(ToasterService);
      component.selectedCertificate = { issuer: `{}` };
      const elementMock = {
        innerHTML: '<svg height="30" width="200"><text x="0" y="15" fill="red">Sample SVG String</text></svg>'
      };
      spyOn(document, 'getElementById').and.returnValue(elementMock);
      spyOn(component, 'uploadTemplate');
      spyOn(component, 'previewCertificate').and.stub();
      spyOn(new CertConfigModel(), 'prepareCreateAssetRequest').and.stub();
      spyOn(uploadCertService, 'createCertTemplate').and.callFake(() => throwError({}));
      spyOn(toasterService, 'error').and.stub();
      component.saveUpdatedCertificate();
      fixture.detectChanges();
      tick(1000);
      expect(component.save.next).toHaveBeenCalled();
      expect(toasterService.error).toHaveBeenCalledWith('Something went wrong, please try again later');
    }));

  });

});
