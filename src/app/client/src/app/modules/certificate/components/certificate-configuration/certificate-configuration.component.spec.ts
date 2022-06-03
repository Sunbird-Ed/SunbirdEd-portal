import { BehaviorSubject, of, throwError } from "rxjs";
import { CertificateService, UserService, PlayerService, CertRegService, FormService } from '@sunbird/core';
import { CertificateConfigurationComponent } from "./certificate-configuration.component";
import { TelemetryService } from '@sunbird/telemetry';
import { DomSanitizer } from '@angular/platform-browser';
import { ResourceService, NavigationHelperService, ToasterService, LayoutService, COLUMN_TYPE } from '@sunbird/shared';
import { UploadCertificateService } from "../../services/upload-certificate/upload-certificate.service";
import { ActivatedRoute, Router } from "@angular/router";
import { response as CertMockResponse } from './certificate-configuration.component.spec.data';
import { FormControl, FormGroup } from "@angular/forms";

describe("CertificateConfigurationComponent", () => {
    let component: CertificateConfigurationComponent;

    const mockCertificateService: Partial<CertificateService> = {
    };
    const mockUserService: Partial<UserService> = {
        userData$: of({
            userProfile: {
                userId: 'sample-uid',
                rootOrgId: 'sample-root-id',
                rootOrg: {},
                hashTagIds: ['id']
            } as any
        }) as any,
    };
    const mockPlayerService: Partial<PlayerService> = {};
    const mockDomSanitizer: Partial<DomSanitizer> = {};
    const mockResourceService: Partial<ResourceService> = {
        frmelmnts: {
            lbl: {
                Select: 'Select'
            },
            cert: {
                lbl: {
                    preview: 'preview',
                    certAddSuccess: 'Certificate added successfully',
                    certUpdateSuccess: 'Certificate updated successfully.',
                    certAddError: 'Failed to add the certificate. Try again later.',
                    certEditError: 'Failed to edit the certificate. Try again later.'
                }
            }
        },
        messages: {
            emsg: {
                m0005: 'Something went wrong, try again later'
            }
        }
    };
    const mockCertRegService: Partial<CertRegService> = {};
    const mockUploadCertificateService: Partial<UploadCertificateService> = {
        certificate: {
            subscribe: jest.fn(() => [{ 'identifier': "do_1131446242806251521827" }])
        } as any
    };
    const mockNavigationHelperService: Partial<NavigationHelperService> = {};
    const mockTelemetryService: Partial<TelemetryService> = {
        impression: jest.fn(),
        interact: jest.fn()
    };
    const mockLayoutService: Partial<LayoutService> = {
        redoLayoutCSS: jest.fn()
    };
    const mockFormService: Partial<FormService> = {};
    const mockRouter: Partial<Router> = {
        events: of({ url: '/cert/configure/add' }) as any,
        navigate: jest.fn()
    };
    const mockToasterService: Partial<ToasterService> = {
        error: jest.fn(),
        success: jest.fn()
    };
    const mockActivatedRoute: Partial<ActivatedRoute> = {
        queryParams: of({
            type: 'edit',
            courseId: 'do_456789',
            batchId: '124631256'
        }),
        params: of({ collectionId: "123" }),
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
        } as any
    };

    beforeAll(() => {
        component = new CertificateConfigurationComponent(
            mockCertificateService as CertificateService,
            mockUserService as UserService,
            mockPlayerService as PlayerService,
            mockDomSanitizer as DomSanitizer,
            mockResourceService as ResourceService,
            mockCertRegService as CertRegService,
            mockUploadCertificateService as UploadCertificateService,
            mockNavigationHelperService as NavigationHelperService,
            mockActivatedRoute as ActivatedRoute,
            mockToasterService as ToasterService,
            mockRouter as Router,
            mockTelemetryService as TelemetryService,
            mockLayoutService as LayoutService,
            mockFormService as FormService
        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be create a instance of Certificate Configuration Component', () => {
        expect(component).toBeTruthy();
    });

    it('Should reset isTemplateChanged property on cert preview close/No button click', () => {
        // Template changed state value
        component.isTemplateChanged = true;
        component.onPopState(new Event('popstate'));
        expect(component.isTemplateChanged).toBeFalsy();
    });

    it('should set certification creation state', () => {
        component.certificateCreation();
        expect(component.currentState).toEqual(component.screenStates.certRules)
    });

    it("remove selected certificates", () => {
        component.removeSelectedCertificate();
        expect(component.selectedTemplate).toEqual(null);
    })

    describe("telemetry event", () => {
        it('should send telemetry impression event', () => {
            mockNavigationHelperService.getPageLoadTime = jest.fn().mockReturnValue(10);
            component.setTelemetryImpressionData();
            expect(mockTelemetryService.impression).toHaveBeenCalled();
        });

        it('should set Telemetry Impression Data on ngAfterViewInit', () => {
            jest.spyOn(component, 'setTelemetryImpressionData').mockImplementation();
            component.ngAfterViewInit();
            expect(component.setTelemetryImpressionData).toHaveBeenCalled();
        });
        
        it('should send telemetry interact event for all the clicks on "add certificate" mode', () => {
            component.configurationMode = 'add';
            const mockInteractData = {id: 'add-certificate'};
            component.sendInteractData(mockInteractData);
            expect(mockTelemetryService.interact).toHaveBeenCalled();
        });
    
        it('should send telemetry interact event for all the clicks on "edit certificate" mode', () => {
            component.configurationMode = 'edit';
            component.selectedTemplate = {name: 'SOME_MOCK_TEMPLATE'};
            const mockInteractData = {id: 'add-certificate'};
            component.sendInteractData(mockInteractData);
            expect(mockTelemetryService.interact).toHaveBeenCalled();
        });

        it('should set edit certificate', () => {
            jest.spyOn(component, 'sendInteractData').mockImplementation();
            component.editCertificate();
            expect(component.configurationMode).toEqual('edit');
        });

        it('should close template detect modal', () => {
            jest.spyOn(component, 'sendInteractData').mockImplementation();
            component.closeTemplateDetectModal();
            expect(component.isTemplateChanged).toBeFalsy();
            expect(component.sendInteractData).toHaveBeenCalledWith({ id: 'cancel-template-change' });
        });
    
        it('should navigate to cert rules screen', () => {
            jest.spyOn(component, 'sendInteractData').mockImplementation();
            component.navigateToCertRules();
            expect(component.currentState).toEqual('certRules');
            expect(component.sendInteractData).toHaveBeenCalledWith({ id: 'add-certificate' });
        });
    })

    describe("initializeLabels", () => {
        it('should initializeLabels', () => {
            component.initializeLabels();
            expect(component.config.select.label).toEqual(mockResourceService.frmelmnts.lbl.Select)
        })
    });

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

    describe("checkMultipleAssessment", () => {
        it("should set isSingleAssessment=True if SelfAssess count is 1", () => {
            component.courseDetails = { contentTypesCount: JSON.stringify({ SelfAssess: 1 }) };
            component.checkMultipleAssessment();
            expect(component.isSingleAssessment).toBeTruthy();
        });

        it("should set isSingleAssessment=False if SelfAssess count is more than 1", () => {
            component.courseDetails = { contentTypesCount: JSON.stringify({ SelfAssess: 2 }) };
            component.checkMultipleAssessment();
            expect(component.isSingleAssessment).toBeFalsy();
        })

        it("should set isSingleAssessment=False if SelfAssess count is 0 ", () => {
            component.courseDetails = { contentTypesCount: JSON.stringify({ SelfAssess: 0 }) };
            component.checkMultipleAssessment();
            expect(component.isSingleAssessment).toBeFalsy();
        })

        it("should log an error if there is no SelfAssess ", () => {
            component.courseDetails = { contentTypesCount: {} };
            jest.spyOn(console, 'log').mockImplementation();
            component.checkMultipleAssessment();
            expect(console.log).toHaveBeenCalled();
        })
    });

    describe("getTemplateList", () => {
        it("should fetch certificate list successfully", () => {
            component.templateIdentifier = "do_1131446242806251521827";
            mockUploadCertificateService.getCertificates = jest.fn().mockImplementation(() => of(CertMockResponse.certTemplateListData));
            component.getTemplateList().subscribe((data) => {
                expect(mockUploadCertificateService.getCertificates).toHaveBeenCalled();
                expect(component.selectedTemplate).toEqual(CertMockResponse.certTemplateListData.result.content[1])
            });
        })

        it("should fetch certificate list successfully with newTemplateIdentifier ", () => {
            component.newTemplateIdentifier = "do_11317806644278067214595";
            mockUploadCertificateService.getCertificates = jest.fn().mockImplementation(() => of(CertMockResponse.certTemplateListData));
            component.getTemplateList().subscribe((data) => {
                expect(mockUploadCertificateService.getCertificates).toHaveBeenCalled();
                expect(component.selectedTemplate).toEqual(CertMockResponse.certTemplateListData.result.content[0])
            });
        })

        it("should throw error ", () => {
            component.newTemplateIdentifier = "do_11317806644278067214595";
            mockUploadCertificateService.getCertificates = jest.fn(() => throwError({}));
            component.getTemplateList().subscribe(error => {
                expect(error).toBeDefined()
            })
        })

        it('should refresh template list', () => {
            jest.spyOn(component, 'getTemplateList').mockImplementation(() => throwError({}))
            component.refreshData();
            expect(mockToasterService.error).toHaveBeenCalledWith(mockResourceService.messages.emsg.m0005)
        })
    });

    describe("setCertEditable", () => {
        it("should set cert editable true if preview url is available", () => {
            component.previewUrl = "dummy-url";
            component.setCertEditable();
            expect(component.certEditable).toBeTruthy();
        })

        it("should set cert editable false if preview url is not available", () => {
            component.previewUrl = "";
            component.setCertEditable();
            expect(component.certEditable).toBeFalsy();
        })
    })

    describe("processCriteria", () => {
        it('should process on form field', () => {
            component.userPreference = new FormGroup({
                scoreRange: new FormControl('1'),
                issueTo: new FormControl('12'),
                allowPermission: new FormControl('123')
            });
            let criteria = CertMockResponse.batchDataWithCertificate.result.response.cert_templates.template_21.criteria;
            component.processCriteria(criteria);
            expect(component.issueTo).toEqual([{ "name": "My state teacher" }]);
        })
    })

    describe("processCertificateDetails", () => {
        it("should processCertificateDetails", () => {
            jest.spyOn(component, 'setCertEditable').mockImplementation();
            jest.spyOn(component, 'processCriteria').mockImplementation();
            let certTempDetails = CertMockResponse.batchDataWithCertificate.result.response.cert_templates.template_21;
            component.processCertificateDetails([certTempDetails]);
            expect(component.setCertEditable).toHaveBeenCalled();
            expect(component.processCriteria).toHaveBeenCalled();
        });

        it("should process Certificate Details and update preview url", () => {
            jest.spyOn(component, 'setCertEditable').mockImplementation();
            jest.spyOn(component, 'processCriteria').mockImplementation();
            let certTempDetails: any = CertMockResponse.batchDataWithCertificate.result.response.cert_templates.template_21;
            certTempDetails['url'] = "cert-url"
            component.processCertificateDetails([certTempDetails]);
            expect(component.setCertEditable).toHaveBeenCalled();
            expect(component.processCriteria).toHaveBeenCalled();
        })
    })

    describe("getBatchDetails", () => {
        it("should fetch the batch details without certificates", () => {
            jest.spyOn(component, 'getCertConfigFields')
            mockCertificateService.getBatchDetails = jest.fn().mockImplementation(() => of(CertMockResponse.batchData))
            component.getBatchDetails('is').subscribe(data => {
                expect(mockCertificateService.getBatchDetails).toHaveBeenCalled();
                expect(component.getCertConfigFields).toHaveBeenCalled();
            })
        });
        it("should fetch the batch details with certificates", () => {
            jest.spyOn(component, 'processCertificateDetails').mockImplementation();
            mockCertificateService.getBatchDetails = jest.fn().mockImplementation(() => of(CertMockResponse.batchDataWithCertificate))
            component.getBatchDetails('is').subscribe(data => {
                expect(mockCertificateService.getBatchDetails).toHaveBeenCalled();
                expect(component.processCertificateDetails).toHaveBeenCalled();
            })
        })
        it("should fetch the batch details with certificates array", () => {
            jest.spyOn(component, 'processCertificateDetails').mockImplementation();
            let mockData = CertMockResponse.batchDataWithCertificate;
            mockData.result.response.cert_templates = [{ ...CertMockResponse.batchDataWithCertificate.result.response.cert_templates }] as any;
            mockCertificateService.getBatchDetails = jest.fn().mockImplementation(() => of(mockData))
            component.getBatchDetails('is').subscribe(data => {
                expect(mockCertificateService.getBatchDetails).toHaveBeenCalled();
                expect(component.processCertificateDetails).toHaveBeenCalled();
                expect(component.batchDetails.cert_templates).toHaveLength(1);
            })
        })
    });

    describe("Initialize form fields and validate form", () => {
        it("Should enable add certificate if form is valid", () => {
            component.selectedTemplate = "tpl";
            component.userPreference = new FormGroup({
                scoreRange: new FormControl(null),
                issueTo: new FormControl('12'),
                allowPermission: new FormControl('123')
            });
            component.validateForm();
            expect(component.disableAddCertificate).toBeFalsy();
        });

        it("Should disable add certificate if form is not valid", () => {
            component.selectedTemplate = "";
            component.userPreference = new FormGroup({
                scoreRange: new FormControl('1'),
                issueTo: new FormControl('12'),
                allowPermission: new FormControl('123')
            });
            component.validateForm();
            expect(component.disableAddCertificate).toBeTruthy();
        });

        it('should initialize form fields and validateForm', () => {
            jest.spyOn(component, 'validateForm').mockImplementation();
            component.userPreference = new FormGroup({
                scoreRange: new FormControl(''),
                issueTo: new FormControl(''),
                allowPermission: new FormControl('')
            });
            component.initializeFormFields();
            component.userPreference.setValue({
                scoreRange: "1",
                issueTo: "12",
                allowPermission: "123"
            });
            expect(component.validateForm).toHaveBeenCalled();
        });
    });

    describe("getCourseDetails", () => {
        it("should get Course Details", () => {
            mockPlayerService.getCollectionHierarchy = jest.fn().mockImplementation(() => of(CertMockResponse.courseData));
            component.getCourseDetails("batch-id").subscribe(data => {
                expect(component.courseDetails).toEqual(CertMockResponse.courseData.result.content);
            })
        })
        it("should show error while get Course Details", () => {
            mockPlayerService.getCollectionHierarchy = jest.fn(() => throwError({}));
            component.getCourseDetails("batch-id").subscribe(error => {
                expect(error).toBeDefined()
            })
        })
    })

    describe("getCertificateFormData", () => {
        it('should get Certificate FormData', () => {
            mockFormService.getFormConfig = jest.fn().mockImplementation(() => of(CertMockResponse.certificateFormData))
            component.getCertificateFormData().subscribe(data => {
                expect(component.certificateFormConfig).toEqual(CertMockResponse.certificateFormData);
            })
        });

        it('should throw error on fetching Certificate FormData', () => {
            mockFormService.getFormConfig = jest.fn(() => throwError({}))
            component.getCertificateFormData().subscribe(data => {}, error => {
                expect(error).toBeDefined();
            })
        });
    })

    describe("ngOnInit", () => {
        it('should fetch all required data for certificate', () => {
            jest.spyOn(component, 'initializeLabels');
            jest.spyOn(component, 'redoLayout');
            jest.spyOn(component, 'initializeFormFields');
            jest.spyOn(component, 'checkMultipleAssessment').mockReturnValue();
            jest.spyOn(component, 'getCourseDetails').mockReturnValue(of(CertMockResponse.courseData));
            jest.spyOn(component, 'getBatchDetails').mockReturnValue(of(CertMockResponse.batchData))
            jest.spyOn(component, 'getTemplateList').mockReturnValue(of(CertMockResponse.certTemplateListData))
            jest.spyOn(component, 'getCertificateFormData').mockReturnValue(of(CertMockResponse.certificateFormData))
            mockNavigationHelperService.setNavigationUrl = jest.fn();
            component.ngOnInit();
            expect(component.getCourseDetails).toHaveBeenCalled();
            expect(component.checkMultipleAssessment).toHaveBeenCalled();
            expect(component.showLoader).toBeFalsy()
        });

        it('should show error message if there is error while fetching data from api', () => {
            jest.spyOn(component, 'initializeLabels');
            jest.spyOn(component, 'redoLayout');
            jest.spyOn(component, 'initializeFormFields');
            jest.spyOn(component, 'getCourseDetails').mockImplementation(() => throwError({}))
            mockNavigationHelperService.setNavigationUrl = jest.fn();
            component.ngOnInit();
            expect(component.getCourseDetails).toHaveBeenCalled();
            expect(mockToasterService.error).toHaveBeenCalledWith(mockResourceService.messages.emsg.m0005);
        });
    });

    describe("getCertConfigFields", () => {
        it("should fetch certificate preferences successfully", () => {
            mockCertificateService.fetchCertificatePreferences = jest.fn().mockImplementation(() => of(CertMockResponse.certRulesData))
            component.getCertConfigFields();
            expect(mockCertificateService.fetchCertificatePreferences).toHaveBeenCalled();
        })
        it("should fetch certificate preferences successfully", () => {
            mockCertificateService.fetchCertificatePreferences = jest.fn().mockImplementation(() => throwError({}));
            component.getCertConfigFields();
            expect(mockToasterService.error).toHaveBeenCalledWith(mockResourceService.messages.emsg.m0005);
        })
    });

    describe("attachCertificateToBatch", () => {
        it("should attach certificate to batch for update mode", () => {
            jest.spyOn(component, 'sendInteractData').mockImplementation();
            component.selectedTemplate = CertMockResponse.certTemplateListData.result.content[0];
            component.addScoreRule = false;
            component.isTemplateChanged = true;
            mockCertRegService.addCertificateTemplate = jest.fn().mockImplementation(() => of(CertMockResponse.certAddSuccess));
            mockCertificateService.getBatchDetails = jest.fn().mockImplementation(() => of(CertMockResponse.batchData));
            component.attachCertificateToBatch();
            expect(mockCertRegService.addCertificateTemplate).toHaveBeenCalled();
            expect(mockToasterService.success).toHaveBeenCalledWith(mockResourceService.frmelmnts.cert.lbl.certUpdateSuccess);
        });

        it("should attach certificate to batch for add mode and processCertificateDetails", () => {
            jest.spyOn(component, 'sendInteractData').mockImplementation();
            jest.spyOn(component, 'processCertificateDetails').mockImplementation();
            jest.spyOn(component, 'goBack').mockImplementation();
            component.selectedTemplate = CertMockResponse.certTemplateListData.result.content[0];
            component.addScoreRule = false;
            component.isTemplateChanged = true;
            component.configurationMode = "add"
            mockCertRegService.addCertificateTemplate = jest.fn().mockImplementation(() => of(CertMockResponse.certAddSuccess));
            mockCertificateService.getBatchDetails = jest.fn().mockImplementation(() => of(CertMockResponse.batchData));
            component.attachCertificateToBatch();
            expect(mockCertRegService.addCertificateTemplate).toHaveBeenCalled();
            expect(mockToasterService.success).toHaveBeenCalledWith(mockResourceService.frmelmnts.cert.lbl.certAddSuccess);
        });

        it("should get error while attach certificate to batch and getBatchDetails", () => {
            jest.spyOn(component, 'sendInteractData').mockImplementation();
            component.selectedTemplate = CertMockResponse.certTemplateListData.result.content[0];
            component.addScoreRule = false;
            component.isTemplateChanged = true;
            mockCertRegService.addCertificateTemplate = jest.fn().mockImplementation(() => of(CertMockResponse.certAddSuccess));
            mockCertificateService.getBatchDetails = jest.fn(() => throwError({}));
            component.attachCertificateToBatch();
            expect(mockCertRegService.addCertificateTemplate).toHaveBeenCalled();
            expect(mockToasterService.error).toHaveBeenCalledWith(mockResourceService.messages.emsg.m0005);
        });

        it("should get error for add certificate", () => {
            jest.spyOn(component, 'sendInteractData').mockImplementation();
            component.configurationMode = "add"
            component.selectedTemplate = CertMockResponse.certTemplateListData.result.content[0];
            mockCertRegService.addCertificateTemplate = jest.fn(() => throwError({}));
            component.attachCertificateToBatch();
            expect(mockToasterService.error).toHaveBeenCalledWith(mockResourceService.frmelmnts.cert.lbl.certAddError);
        });

        it("should get error for update certificate", () => {
            jest.spyOn(component, 'sendInteractData').mockImplementation();
            component.configurationMode = "update"
            component.selectedTemplate = CertMockResponse.certTemplateListData.result.content[0];
            mockCertRegService.addCertificateTemplate = jest.fn(() => throwError({}));
            component.attachCertificateToBatch();
            expect(mockToasterService.error).toHaveBeenCalledWith(mockResourceService.frmelmnts.cert.lbl.certEditError);
        });
    })

    describe("updateCertificate", () => {
        it("should not update certificate if selected template are same", () => {
            component.templateIdentifier = "124";
            component.selectedTemplate = { name: "11234" };
            component.updateCertificate();
            expect(component.isTemplateChanged).toBeTruthy();
        });

        it("should attach certificate to batch", () => {
            component.templateIdentifier = "124";
            component.selectedTemplate = { name: "124" };
            jest.spyOn(component, 'attachCertificateToBatch').mockImplementation();
            component.updateCertificate();
            expect(component.attachCertificateToBatch).toHaveBeenCalled();
        })
    });

    describe("handleCertificateEvent", () => {
        it('should handle "select" click on hover certificate templates', () => {
            /** Arrange */
            const mockEvent = { name: 'select' };
            const mockTemplate = { name: 'SOME_MOCK_TEMPLATE' };
            component.selectedTemplate = { name: 'SOME_MOCK_TEMPLATE' };
            jest.spyOn(component, 'validateForm').mockImplementation();
            jest.spyOn(component, 'sendInteractData').mockImplementation();

            /** Act */
            component.handleCertificateEvent(mockEvent, mockTemplate);

            /** Assert */
            expect(component.selectedTemplate).toEqual(mockTemplate);
            expect(component.config.remove.show).toBeTruthy();
            expect(component.config.select.show).toBeFalsy();
            expect(component.validateForm).toHaveBeenCalled();
            expect(component.sendInteractData).toHaveBeenCalledWith({ id: 'select-template' });
        });

        it('should handle "remove" click on hover certificate templates', () => {
            /** Arrange */
            const mockEvent = { name: 'remove' };
            const mockTemplate = { name: 'SOME_MOCK_TEMPLATE' };
            component.selectedTemplate = { name: 'SOME_MOCK_TEMPLATE' };
            jest.spyOn(component, 'validateForm').mockImplementation();
            jest.spyOn(component, 'sendInteractData').mockImplementation();

            /** Act */
            component.handleCertificateEvent(mockEvent, mockTemplate);

            /** Assert */
            expect(component.selectedTemplate).toEqual({});
            expect(component.config.select.show).toBeTruthy();
            expect(component.config.remove.show).toBeFalsy();
            expect(component.validateForm).toHaveBeenCalled();
            expect(component.sendInteractData).toHaveBeenCalledWith({ id: 'unselect-template' });
        });

        it('should handle "preview" click on hover certificate templates', () => {
            /** Arrange */
            const mockEvent = { name: 'preview' };
            const mockTemplate = { name: 'SOME_MOCK_TEMPLATE' };
            component.selectedTemplate = { name: 'SOME_MOCK_TEMPLATE' };
            jest.spyOn(component, 'validateForm').mockImplementation();
            jest.spyOn(component, 'sendInteractData').mockImplementation();

            /** Act */
            component.handleCertificateEvent(mockEvent, mockTemplate);

            /** Assert */
            expect(component.previewTemplate).toEqual(mockTemplate);
            expect(component.showPreviewModal).toBeTruthy();
            expect(component.sendInteractData).toHaveBeenCalledWith({ id: 'preview-template' });
        });
    })

    describe("getConfig", () => {
        it('should fetch the configs for "select" hover button', () => {
            /** Arrange */
            const mockTemplate = { name: 'SOME_MOCK_TEMPLATE' };
            component.selectedTemplate = { name: 'SOME_MOCK_TEMPLATE' };
            const mocConfig = { show: true, label: 'select', name: 'select' };

            /** Act */
            const returnVal = component.getConfig(mocConfig, mockTemplate);

            /** Assert */
            expect(returnVal).toEqual({
                show: false,
                label: 'select',
                name: 'select'
            });
        });

        it('should fetch the configs for hover buttons other than "select"', () => {
            /** Arrange */
            const mockTemplate = { name: 'SOME_MOCK_TEMPLATE' };
            component.selectedTemplate = { name: 'SOME_MOCK_TEMPLATE' };
            const mocConfig = { show: true, label: 'preview', name: 'preview' };

            /** Act */
            const returnVal = component.getConfig(mocConfig, mockTemplate);

            /** Assert */
            expect(returnVal).toEqual({
                show: true,
                label: 'preview',
                name: 'preview'
            });
        });
    })

    describe("closeModal", () => {
        it('should close preview modal if user clicks "Select template" from preview popup', () => {
            /** Arrange */
            const mockEvent = {
                name: 'select',
                template: { name: 'SOME_TEMPLATE' }
            };
            component.certTemplateList = [];
            jest.spyOn(component, 'validateForm').mockImplementation();
            jest.spyOn(component, 'sendInteractData').mockImplementation();

            /** Act */
            component.closeModal(mockEvent);

            /** Assert */
            expect(component.showPreviewModal).toBeFalsy();
            expect(component.selectedTemplate).toEqual({ name: 'SOME_TEMPLATE' });
            expect(component.validateForm).toHaveBeenCalled();
            expect(component.sendInteractData).toHaveBeenCalledWith({ id: 'select-template' });
        });

        it('should close preview modal if user clicks "close" from preview popup', () => {
            /** Arrange */
            const mockEvent = {
            };
            component.certTemplateList = [];
            component.selectedTemplate = { name: 'SOME_PRE_SELECTED_TEMPLATE' };
            jest.spyOn(component, 'validateForm').mockImplementation();
            jest.spyOn(component, 'sendInteractData').mockImplementation();

            /** Act */
            component.closeModal(mockEvent);

            /** Assert */
            expect(component.showPreviewModal).toBeFalsy();
            expect(component.selectedTemplate).toEqual({ name: 'SOME_PRE_SELECTED_TEMPLATE' });
            expect(component.validateForm).toHaveBeenCalled();
            expect(component.sendInteractData).toHaveBeenCalledWith({ id: 'close-preview' });
        });
    })

    describe("cancelSelection", () => {
        it('should reset the selected form fields and template for "add certificate" scenario', () => {
            /** Arrange */
            component.userPreference = new FormGroup({
                certificateType: new FormControl('Completion certificate'),
                issueTo: new FormControl('My state teacher'),
                allowPermission: new FormControl(true)
            });
            component.configurationMode = 'add';
            jest.spyOn(component, 'sendInteractData').mockImplementation();
            jest.spyOn(component.userPreference, 'reset');

            /** Act */
            component.cancelSelection();

            /** Assert */
            expect(component.currentState).toEqual('default');
            expect(component.sendInteractData).toHaveBeenCalledWith({ id: 'cancel-add-certificate' });
            expect(component.userPreference.reset).toHaveBeenCalled();
            expect(component.selectedTemplate).toEqual({});
        });

        it('should reset the selected form fields and template for "update certificate" scenario', () => {
            /** Arrange */
            component.batchDetails = CertMockResponse.batchDataWithCertificate.result.response;
            component.userPreference = new FormGroup({
                certificateType: new FormControl('Completion certificate'),
                issueTo: new FormControl('My state teacher'),
                allowPermission: new FormControl(true)
            });
            component.configurationMode = 'edit';
            jest.spyOn(component, 'sendInteractData').mockImplementation();
            jest.spyOn(component, 'processCertificateDetails').mockImplementation();

            /** Act */
            component.cancelSelection();

            /** Assert */
            expect(component.currentState).toEqual('default');
            expect(component.sendInteractData).toHaveBeenCalledWith({ id: 'cancel-update-certificate' });
            expect(component.processCertificateDetails).toHaveBeenCalledWith(
                CertMockResponse.batchDataWithCertificate.result.response.cert_templates);
        });
    });

    describe("navigateToCreateTemplate", () => {
        it('should navigate to create-template page', () => {
            component.navigateToCreateTemplate();
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/certs/configure/create-template'], {queryParams: { type: 'edit', courseId: 'do_456789', batchId: '124631256' }});
        });
        it('should navigate to create-certificate-template page for svgEditor', () => {
            component.certificateFormConfig = {enableSVGEditor : true};
            component.navigateToCreateTemplate();
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/certs/configure/create-certificate-template'], {queryParams: { type: 'edit', courseId: 'do_456789', batchId: '124631256' }});
        }); 
    })

    describe("handleParameterChange", () => {
        it('should call handleParameterChange method with event as All', () => {
            const eventAll = 'All';
            component.handleParameterChange(eventAll);
            expect(component.isStateCertificate).toBeFalsy();
          });
          it('should call handleParameterChange method with event as teacher', () => {
            const event ={value: 'My state teacher'};
            component.handleParameterChange(event);
            expect(component.isStateCertificate).toBeTruthy();
          });
    })

    describe("Add and Remove Rule", () => {
        it('should add rule', () => {
            component.addRule();
            expect(component.addScoreRule).toBeTruthy();
        });
        it('should remove rule', () => {
            component.removeRule();
            expect(component.addScoreRule).toBeFalsy();
        });
    })

    describe("ngOnDestroy", () => {
        it('should destroy sub', () => {
            component.unsubscribe$ = {
                next: jest.fn(),
                complete: jest.fn()
            } as any;
            mockUploadCertificateService.certificate = {
                next: jest.fn()
            } as any;
            component.ngOnDestroy();
            expect(component.unsubscribe$.next).toHaveBeenCalled();
            expect(component.unsubscribe$.complete).toHaveBeenCalled();
        });
    });

   







})