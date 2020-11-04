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

    it('should not fetch labels from blob storage if already present', () => {
        const service: GeneraliseLabelService = TestBed.get(GeneraliseLabelService);
        spyOn<any>(service, 'setLabels').and.callThrough();
        service['_gLables']['all_labels_en.json'] = JSON.parse(MockResponse.generaliseLblResponse.result);
        service['gResourseBundleForm'] = MockResponse.resourceBundleConfig;
        service['getLabels'](MockResponse.courseHierarchy, 'en');
        expect(service['setLabels']).toHaveBeenCalled();
    });

    it('should return filename', () => {
        const service: GeneraliseLabelService = TestBed.get(GeneraliseLabelService);
        service['gResourseBundleForm'] = MockResponse.resourceBundleConfig;
        const fileName = service['getResourcedFileName'](MockResponse.courseHierarchy, 'en');
        expect(fileName).toEqual('all_labels_en.json');
    });

    it('should return default resource bundle if content type wise resource bundle not found', () => {
        const service: GeneraliseLabelService = TestBed.get(GeneraliseLabelService);
        service['gResourseBundleForm'] = MockResponse.resourceBundleConfig;
        MockResponse.courseHierarchy.contentType = 'LessionPlan';
        const fileName = service['getResourcedFileName'](MockResponse.courseHierarchy, 'en');
        expect(service['contentTypeLblKey']).toEqual('dflt');
        expect(fileName).toEqual('all_labels_en.json');
    });

    it('should return default english resource bundle', () => {
        const service: GeneraliseLabelService = TestBed.get(GeneraliseLabelService);
        service['gResourseBundleForm'] = MockResponse.resourceBundleConfig;
        MockResponse.courseHierarchy.contentType = 'LessionPlan';
        const fileName = service['getResourcedFileName'](MockResponse.courseHierarchy, 'mr');
        expect(fileName).toEqual('all_labels_en.json');
    });

    it('should return nontrackable if content type is textbook and trackable = No ', () => {
        const service: GeneraliseLabelService = TestBed.get(GeneraliseLabelService);
        service['gResourseBundleForm'] = MockResponse.resourceBundleConfig;
        const mockData = MockResponse.courseHierarchy;
        mockData.contentType = 'TextBook';
        mockData.trackable.enabled = 'No';
        const fileName = service['getResourcedFileName'](MockResponse.courseHierarchy, 'en');
        expect(fileName).toEqual('all_labels_en.json');
        expect(service['isTrackable']).toEqual('nontrackable');
    });
    it('should return trackable course resource bundle if content type is course and trackable object is not available', () => {
        const service: GeneraliseLabelService = TestBed.get(GeneraliseLabelService);
        service['gResourseBundleForm'] = MockResponse.resourceBundleConfig;
        const mockData = MockResponse.courseHierarchy;
        delete mockData.trackable;
        mockData.contentType = 'Course';
        const fileName = service['getResourcedFileName'](MockResponse.courseHierarchy, 'en');
        expect(fileName).toEqual('all_labels_en.json');
        expect(service['isTrackable']).toEqual('trackable');
    });
});
