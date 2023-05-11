import { ToasterService } from "../../../shared";
import { IdentifyAccountComponent } from "./identify-account.component";
import { ActivatedRoute, Router } from "@angular/router";
import { RecaptchaService, ResourceService } from "../../../shared";
import { FormBuilder } from "@angular/forms";
import { RecoverAccountService } from "../../services";
import { TelemetryService } from "../../../telemetry";
import { of, throwError } from "rxjs";
import { identifyAcountMockResponse } from "./identify-account.component.spec.data";

xdescribe("Identify Account Component ", () => {
    let identifyAccountComponent: IdentifyAccountComponent;

    const activatedRoute: Partial<ActivatedRoute> = {
        snapshot: {
            data: { telemetry: { env: '', type: '', pageid: '' } },
            queryParams: {
                client_id: 'portal', redirectUri: '/learn',
                state: 'state-id', response_type: 'code', version: '3'
            }
        } as any
    };
    const resourceService: Partial<ResourceService> = {};
    const formBuilder: Partial<FormBuilder> = {
        group: jest.fn()
    };
    const toasterService: Partial<ToasterService> = {};
    const router: Partial<Router> = {};
    const recoverAccountService: Partial<RecoverAccountService> = {
        fuzzyUserSearch: jest.fn(() => of(identifyAcountMockResponse.fuzzySuccessResponseWithCount)) as any
    };
    const recaptchaService: Partial<RecaptchaService> = {};
    const telemetryService: Partial<TelemetryService> = {};
   

    beforeAll(() => {
        identifyAccountComponent = new IdentifyAccountComponent(
            activatedRoute as ActivatedRoute,
            resourceService as ResourceService,
            formBuilder as FormBuilder,
            toasterService as ToasterService,
            router as Router,
            recoverAccountService as RecoverAccountService,
            recaptchaService as RecaptchaService,
            telemetryService as TelemetryService)

    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it("should be created", () => {
        expect(identifyAccountComponent).toBeTruthy();
    });

    it('should initialize form', () => {
        // arrange
        formBuilder.group = jest.fn(() => ({

            valueChanges: of({}),
            status: '',
            controls: {
                identifier: { valueChanges: of({}), }
            },
        })) as any;
        // act
        identifyAccountComponent.ngOnInit()
        // assert
    })
    it('should initialize form for valid form status', () => {
        // arrange
        formBuilder.group = jest.fn(() => ({
            valueChanges: of({}),
            status: 'VALID',
            controls: {
                identifier: { valueChanges: of({}), }
            },
        })) as any;
        // act
        identifyAccountComponent.ngOnInit()
        // assert
    })

    it('should call initiateFuzzyUserSearch', () => {
        // arrange
        const captchaResponse = "G-cjkdjflsfkja";
        identifyAccountComponent.isP1CaptchaEnabled = 'true';
        recoverAccountService.fuzzyUserSearch = jest.fn(() => of(identifyAcountMockResponse.fuzzySuccessResponseWithCount)) as any
        //act
        identifyAccountComponent.handleNext(captchaResponse)
        identifyAccountComponent.initiateFuzzyUserSearch(captchaResponse)
        // assert
    })

    it('should call handleNext', () => {
        // arrange
        const captchaResponse = "G-cjkdjflsfkja";
        identifyAccountComponent.isP1CaptchaEnabled = 'false';
        recoverAccountService.fuzzyUserSearch = jest.fn(() => of(identifyAcountMockResponse.fuzzySuccessResponseWithoutCount)) as any
        //act
        identifyAccountComponent.handleNext(captchaResponse)
        // assert
    })

    it('should throw error if form fields are partially matched', () => {
        // arrange
        const captchaResponse = "G-cjkdjflsfkja";
        identifyAccountComponent.isP1CaptchaEnabled = 'false';
        identifyAccountComponent.googleCaptchaSiteKey = 'cjkdjflsfkja'
        jest.spyOn(recoverAccountService, 'fuzzyUserSearch').mockReturnValue(throwError(identifyAcountMockResponse.fuzzySearchErrorResponsePartial))
        identifyAccountComponent.captchaRef = {
            reset: jest.fn()
        } as any
        //act
        identifyAccountComponent.handleNext(captchaResponse)
        // assert
        expect(identifyAccountComponent.identiferStatus).toBe('MATCHED');
    })


    it('should not call navigateToNextStep', () => {
        // arrange
        const captchaResponse = "G-cjkdjflsfkja";
        identifyAccountComponent.isP1CaptchaEnabled = 'false';
        identifyAccountComponent.googleCaptchaSiteKey = 'cjkdjflsfkja'
        identifyAcountMockResponse.fuzzySearchErrorResponsePartial.status = 418
        identifyAcountMockResponse.fuzzySearchErrorResponsePartial.responseCode = 'ERROR'
        jest.spyOn(recoverAccountService, 'fuzzyUserSearch').mockReturnValue(throwError(identifyAcountMockResponse.fuzzySearchErrorResponsePartial))
        Object.defineProperty(window, 'location', {
            get() {
                return { href: 'test.com' };
            },
        });
        identifyAccountComponent.captchaRef = {
            reset: jest.fn()
        } as any
        //act
        identifyAccountComponent.handleNext(captchaResponse)
        // assert
        expect(identifyAccountComponent.identiferStatus).toBe('VALIDATING_FAILED');
    })

    it('should throw error if form fields are not matched', () => {
        // arrange
        const captchaResponse = "G-cjkdjflsfkja";
        identifyAccountComponent.isP1CaptchaEnabled = 'false';
        identifyAccountComponent.googleCaptchaSiteKey = 'cjkdjflsfkja'
        identifyAcountMockResponse.fuzzySearchErrorResponsePartial.status = 403
        identifyAcountMockResponse.fuzzySearchErrorResponsePartial.responseCode = 'ERROR'
        jest.spyOn(recoverAccountService, 'fuzzyUserSearch').mockReturnValue(throwError(identifyAcountMockResponse.fuzzySearchErrorResponsePartial))
        identifyAccountComponent.captchaRef = {
            reset: jest.fn()
        } as any
        //act
        identifyAccountComponent.handleNext(captchaResponse)
        // assert
        expect(identifyAccountComponent.identiferStatus).toBe('NOT_MATCHED');
    })

});
