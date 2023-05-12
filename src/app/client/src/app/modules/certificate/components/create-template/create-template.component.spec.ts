import { UploadCertificateService } from "../../services/upload-certificate/upload-certificate.service";
import { CreateTemplateComponent } from "./create-template.component";
import { UserService, CertRegService } from '@sunbird/core';
import { ToasterService, ResourceService, NavigationHelperService, LayoutService, COLUMN_TYPE } from '@sunbird/shared';
import { DomSanitizer } from '@angular/platform-browser';
import { CertConfigModel } from './../../models/cert-config-model/cert-config-model';
import * as _ from 'lodash-es';
import {ActivatedRoute} from '@angular/router';
import { of, throwError } from "rxjs";
import {MockData} from "./create-template.component.spec.data"
import { FormControl, FormGroup, Validators } from "@angular/forms";
export class FileReaderMock {
    DONE = FileReader.DONE;
    EMPTY = FileReader.EMPTY;
    LOADING = FileReader.LOADING;
    readyState = 0;
    error: FileReader['error'] = null;
    result: FileReader['result'] = null;
    abort = jest.fn();
    addEventListener = jest.fn();
    dispatchEvent = jest.fn();
    onabort = jest.fn();
    onerror = jest.fn();
    onload = jest.fn();
    onloadend = jest.fn();
    onloadprogress = jest.fn();
    onloadstart = jest.fn();
    onprogress = jest.fn();
    readAsArrayBuffer = jest.fn();
    readAsBinaryString = jest.fn();
    readAsDataURL = jest.fn();
    readAsText = jest.fn();
    removeEventListener = jest.fn();
  }
describe("CreateTemplateComponent", () => {
    let component: CreateTemplateComponent;

    const mockUploadCertificateService: Partial<UploadCertificateService> = {
        certificate: {
            next: jest.fn()
        } as any
    };
    const mockUserService: Partial<UserService> = {}
    const mockDomSanitizer: Partial<DomSanitizer> = {}
    const mockActivatedRoute: Partial<ActivatedRoute> = {
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
        } as any,
        queryParams: of({
            type: 'edit',
            courseId: 'do_456789',
            batchId: '124631256'
        })
    }
    const mockCertRegService: Partial<CertRegService> = {}
    const mockToasterService: Partial<ToasterService> = {
        error: jest.fn(),
        success: jest.fn()
    }
    const mockResourceService: Partial<ResourceService> = {
        frmelmnts: {
            cert : {  lbl : { certAddSuccess : 'Template created successfully' }}
        },
        messages: {}
    }
    const mockNavigationHelperService: Partial<NavigationHelperService> = {
        setNavigationUrl: jest.fn(),
        navigateToLastUrl: jest.fn(),
    }
    const mockLayoutService: Partial<LayoutService> = {
        initlayoutConfig: jest.fn(),
        redoLayoutCSS: jest.fn()
    }

    beforeAll(() => {
        component = new CreateTemplateComponent(
            mockUploadCertificateService as UploadCertificateService, 
            mockUserService as UserService, 
            mockDomSanitizer as DomSanitizer, 
            mockActivatedRoute as ActivatedRoute, 
            mockCertRegService as CertRegService, 
            mockToasterService as ToasterService, 
            mockResourceService as ResourceService, 
            mockNavigationHelperService as NavigationHelperService, 
            mockLayoutService as LayoutService
        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be create a instance of CreateTemplateComponent', () => {
        expect(component).toBeTruthy();
    });

    it('should call updateTitles', () => {
        component.svgData = new DOMParser().parseFromString(MockData.svgData.data, 'text/html');
        component.createTemplateForm = new FormGroup({
            certificateTitle: new FormControl('title'),
            stateName: new FormControl('state'),
            authoritySignature_0: new FormControl('sign0'),
            authoritySignature_1: new FormControl('sign1'),
            allowPermission: new FormControl('')
        });
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

    describe('certificateCreation', () => { 

        it("should get base64 data", () => {
            let newDiv = document.createElement("div");
            newDiv.setAttribute("id", "test-id");
            const res = component.getBase64Data(newDiv);
            expect(res).toEqual("data:image/svg+xml;base64,PGRpdiBpZD0idGVzdC1pZCI+PC9kaXY+")
        })

        it('should call certificateCreation', () => {
            component.images = MockData.imagesArray;
            const svgData = MockData.svgData.data;
            jest.spyOn(component, 'getBase64Data').mockReturnValue('data:image/jpeg;base64, xyz');
            const mFile = new File(['go'], 'go.pdf');
            jest.spyOn(component, 'urltoFile').mockReturnValue(new Promise((resolve) => resolve(mFile)));
            mockDomSanitizer.bypassSecurityTrustResourceUrl = jest.fn().mockReturnValue("artifact_url");
            const ev = new DOMParser().parseFromString(svgData, 'text/html');
            component.certificateCreation(ev);
            expect(component.urltoFile).toHaveBeenCalled();
            expect(component.getBase64Data).toHaveBeenCalled();
        });

        it("should sanitize html", () => {
            mockDomSanitizer.bypassSecurityTrustHtml = jest.fn().mockReturnValue(MockData.svgData.data);
            const res = component.sanitizeHTML(MockData.svgData.data);
            expect(res).toBeDefined();
        })

        it("should get image path", () => {
            component.selectedCertificate = {artifactUrl: "artifact-url"};
            expect(component.getImagePath()).toEqual('artifact-url')
        })
    })

    describe('update signs and state logos', () => { 
        it('should call updateStateLogos', () => {
            component.svgData = new DOMParser().parseFromString(MockData.svgData.data, 'text/html');
            component.images = MockData.imagesArray;
            const image = `<image></image>`;
            jest.spyOn(component, 'certificateCreation').mockImplementation();
            jest.spyOn(component, 'editSVG').mockImplementation(() => Promise.resolve({})as any);
            const state = new DOMParser().parseFromString(image, 'text/html');
            component.updateStateLogos(state);
            expect(component.editSVG).toHaveBeenCalled();
        });
    
        it('should call updateSigns', () => {
            component.images = MockData.imagesArray;
            const image = `<image></image>`;
            jest.spyOn(component, 'certificateCreation').mockImplementation();
            jest.spyOn(component, 'editSVG').mockReturnValue(new Promise<void>((resolve) => resolve()));
            const state = new DOMParser().parseFromString(image, 'text/html');
            component.updateSigns(state);
            expect(component.editSVG).toHaveBeenCalled();
        });
    })

    describe('previewCertificate', () => { 
        it('should call  previewCertificate', () => {
            jest.spyOn(component, 'updateTitles').mockImplementation();
            jest.spyOn(component, 'updateStateLogos').mockImplementation();
            jest.spyOn(component, 'updateSigns').mockImplementation();
            component.logoHtml = MockData.svgData.data;
            const data = { artifactUrl: 'assets/images/template-1.svg', identifier: 0 };
            component.previewCertificate();
            expect(component.updateTitles).toHaveBeenCalled();
            expect(component.updateStateLogos).toHaveBeenCalled();
            expect(component.updateSigns).toHaveBeenCalled();
        });
    })

    describe('getSVGTemplate', () => { 
        it('should get SVG Template ', (done) => {
            mockUploadCertificateService.getSvg = jest.fn(() => Promise.resolve(MockData.svgData));
            jest.spyOn(component, 'sanitizeHTML').mockReturnValue(MockData.svgData.data);
            jest.spyOn(component, 'previewCertificate').mockImplementation();
            component.getSVGTemplate();
            setTimeout(() => {
                expect(component.logoHtml).toBeDefined();
                expect(component.previewCertificate).toHaveBeenCalled();
                done();
            });
        });
    })

    describe('getDefaultTemplates', () => { 
        it('should get default templates ', () => {
            mockUploadCertificateService.getCertificates = jest.fn(() => of(MockData.defaultCerts));
            jest.spyOn(component, 'getSVGTemplate').mockImplementation();
            component.getDefaultTemplates();
            expect(component.getSVGTemplate).toHaveBeenCalled();
            expect(component.defaultCertificates).toEqual(MockData.defaultCerts.result.content);
        });
    })

    describe('validateForm', () => { 
        it('should disable create template if form is not valid ', () => {
            component.createTemplateForm = new FormGroup({
                certificateTitle: new FormControl('title'),
                stateName: new FormControl('state'),
                authoritySignature_0: new FormControl('sign0'),
                authoritySignature_1: new FormControl('sign1'),
                allowPermission: new FormControl('')
            });
            component.validateForm();
            expect(component.disableCreateTemplate).toBeTruthy();
        });

        it('should enable create template if form is valid ', () => {
            component.createTemplateForm = new FormGroup({
                certificateTitle: new FormControl('title'),
                stateName: new FormControl('state'),
                authoritySignature_0: new FormControl('sign0'),
                authoritySignature_1: new FormControl('sign1'),
                allowPermission: new FormControl('true')
            });
            component.images = MockData.imagesArray;
            component.validateForm();
            expect(component.disableCreateTemplate).toBeFalsy();
        });
    })

    describe('initializeFormFields', () => { 
        it('should get default templates ', () => {
            component.initializeFormFields();
            expect(component.createTemplateForm).toBeDefined();
        });
        it('should validate form on value chagnes', () => {
            jest.spyOn(component, 'validateForm').mockImplementation();
            component.initializeFormFields();
            component.createTemplateForm.controls.certificateTitle.setValue("Title");
            expect(component.validateForm).toHaveBeenCalled();
        });
    })

    describe("redoLayout", () => {
        it('should redo layout on render for threeToNine column', () => {
            component.layoutConfiguration = {};
            mockLayoutService.initlayoutConfig = jest.fn(() => { });
            mockLayoutService.redoLayoutCSS = jest.fn(() => {
                return 'sb-g-col-xs-9';
            });
            component.redoLayout();
            expect(component.FIRST_PANEL_LAYOUT).toEqual('sb-g-col-xs-9');
        });
        it('should redo layout on render for fullLayout column', () => {
            component.layoutConfiguration = null;
            mockLayoutService.initlayoutConfig = jest.fn(() => { });
            mockLayoutService.redoLayoutCSS = jest.fn(() => {
                return 'sb-g-col-xs-12';
            });
            component.redoLayout();
            expect(component.FIRST_PANEL_LAYOUT).toEqual('sb-g-col-xs-12');
        });
    });

    describe('ngOnInit', () => { 
        it('should initialize form fields and get default templates', () => {
            jest.spyOn(component, 'initializeFormFields').mockImplementation();
            jest.spyOn(component, 'getDefaultTemplates').mockImplementation();
            jest.spyOn(component, 'redoLayout').mockImplementation();
            component.ngOnInit();
            expect(mockNavigationHelperService.setNavigationUrl).toHaveBeenCalled();
            expect(component.initializeFormFields).toHaveBeenCalled();
            expect(component.getDefaultTemplates).toHaveBeenCalled();
            expect(component.redoLayout).toHaveBeenCalled();
            expect(mockLayoutService.initlayoutConfig).toHaveBeenCalled();
        });
    })

    describe("ngOnDestroy", () => {
        it('should destroy sub', () => {
            component.unsubscribe$ = {
                next: jest.fn(),
                complete: jest.fn()
            } as any;
            component.ngOnDestroy();
            expect(component.unsubscribe$.next).toHaveBeenCalled();
            expect(component.unsubscribe$.complete).toHaveBeenCalled();
        });
    });

    describe('uploadTemplate', () => { 
        it('should not upload the final certificate svg image', () => {
            mockUploadCertificateService.storeAsset = jest.fn(() => throwError({}))
            component.uploadTemplate(MockData.imageUrlData.id, 'SOME_DO_ID');
            expect(mockToasterService.error).toHaveBeenCalledWith('Something went wrong, please try again later');
        });
        it('should upload the final certificate svg image', () => {
            mockUploadCertificateService.storeAsset = jest.fn().mockReturnValue(of({}));
            component.uploadTemplate(MockData.imageUrlData.id, 'SOME_DO_ID');
            expect(mockToasterService.success).toHaveBeenCalledWith('Template created successfully');
            expect(mockNavigationHelperService.navigateToLastUrl).toHaveBeenCalled();
        });
        
    })

    describe("createCertTemplate", () => {
        it('should create the certificate template with all the form values', () => {
            jest.useFakeTimers();
            jest.spyOn(global, 'setTimeout');
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
            jest.spyOn(component, 'uploadTemplate').mockImplementation();
            jest.spyOn(component, 'previewCertificate').mockImplementation();
            jest.spyOn(new CertConfigModel(), 'prepareCreateAssetRequest').mockImplementation();
            mockUploadCertificateService.createCertTemplate = jest.fn(() => of(MockData.create))
            component.createCertTemplate();
            jest.runOnlyPendingTimers();
            expect(component.disableCreateTemplate).toEqual(true);
            expect(component.uploadTemplate).toHaveBeenCalledWith(component.finalSVGurl, MockData.create.result.identifier);
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
    });

    describe('assetData', () => { 
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
            expect(component.validateForm).toHaveBeenCalled();
        });

        it('should close the browse', () => {
            component.close();
            expect(component.showSelectImageModal).toEqual(false);
            expect(component.showUploadUserModal).toEqual(false);
        });
        
        it('should call removeImage', () => {
            component.removeImage('SIGN2');
            expect(component.validateForm).toHaveBeenCalled();
        });
    })

    it('should call openSignLogos', () => {
        const data = {type: 'SIGN', index: 0,  key: 'SIGN1'};
        component.openSignLogos(data);
        expect(component.logoType).toEqual(data);
        expect(component.showSelectImageModal ).toBeFalsy();
        expect(component.showUploadUserModal).toBeTruthy();
    });

    it('should call chooseCertificate', () => {
        const data = { artifactUrl: 'assets/images/template-1.svg', identifier: 0 };
        component.chooseCertificate(data);
        expect(component.selectedCertificate ).toEqual(data);
        expect(component.getSVGTemplate ).toHaveBeenCalled();
    });

    it('should navigate to last url on back', () => {
        component.back();
        expect(mockUploadCertificateService.certificate.next).toHaveBeenCalled();
        expect(mockNavigationHelperService.navigateToLastUrl).toHaveBeenCalled();
    });

    
   
    
    
})