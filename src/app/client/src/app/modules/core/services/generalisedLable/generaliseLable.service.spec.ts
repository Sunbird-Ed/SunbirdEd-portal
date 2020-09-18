import { TestBed } from '@angular/core/testing';
import { GeneraliseLabelService } from './generaliseLable.service';
import { ResourceService, ConfigService } from '@sunbird/shared';
import { FormService, CoreModule } from '@sunbird/core';
import { UsageService } from '../../../dashboard/services/usage/usage.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { SharedModule } from '@sunbird/shared';
import { of } from 'rxjs';
import { MockResponse } from './generaliseLable.service.spec.data';

describe('GeneraliseLabelService', () => {
    configureTestSuite();
    beforeEach(() => TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule],
        providers: [ConfigService, FormService, UsageService, ResourceService]
    }));

    it('should be created', () => {
        const service: GeneraliseLabelService = TestBed.get(GeneraliseLabelService);
        expect(service).toBeTruthy();
    });

    it('should fetch genralised resource bundles from form config', () => {
        const service: GeneraliseLabelService = TestBed.get(GeneraliseLabelService);
        const formService = TestBed.get(FormService);
        spyOn(formService, 'getFormConfig').and.returnValue(of(MockResponse.resourceBundleConfig));
        service.getGeneraliseResourceBundle();
        expect(service['gResourseBundleForm']).toEqual(MockResponse.resourceBundleConfig[0]);
    });

    it('should fetch generalised labels from blob storage ', () => {
        const service: GeneraliseLabelService = TestBed.get(GeneraliseLabelService);
        const usageService = TestBed.get(UsageService);
        spyOn(usageService, 'getData').and.returnValue(of(MockResponse.generaliseLblResponse));
        service['gResourseBundleForm'] = MockResponse.resourceBundleConfig;
        service.initialize(MockResponse.courseHierarchy, 'en');
        expect(service.frmelmnts).toBeDefined();
        expect(service.messages).toBeDefined();
        expect(service['_gLables']).toBeDefined();
    });
});
