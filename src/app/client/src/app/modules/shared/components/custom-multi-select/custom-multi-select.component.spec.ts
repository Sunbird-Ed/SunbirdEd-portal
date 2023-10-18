import { ResourceService } from './../../services/resource/resource.service';
import { ChangeDetectorRef } from '@angular/core';
import * as _ from 'lodash-es';
import { CustomMultiSelectComponent } from './custom-multi-select.component';
import { Response } from './custom-multi-select.component.spec.data'

describe('CustomMultiSelectComponent', () => {
    let component: CustomMultiSelectComponent;
    const mockChangeDetectionRef: Partial<ChangeDetectorRef> = {
        detectChanges:jest.fn()
    };
    const mockResourceService: Partial<ResourceService> = {};
    beforeAll(() => {
        component = new CustomMultiSelectComponent(
            mockChangeDetectionRef as ChangeDetectorRef,
            mockResourceService as ResourceService,
        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it('should create component of CustomMultiSelectComponent', () => {
        expect(component).toBeTruthy();
    });
    it('should create component and call the checkbox method', () => {
        component.checkBox = { name: true } as any;
        component.checkbox('name');
        expect(JSON.stringify(component.checkBox)).toEqual(JSON.stringify({ name: false }));
    });
    it('should create component and call the checkbox method', () => {
        component.checkBox = { text: false } as any;
        component.checkbox('name');
        expect(JSON.stringify(component.checkBox)).toEqual(JSON.stringify({ text: false, name: true }));
    });
    it('should create component and call the selectAll method', () => {
        component.checkBox = { text: false } as any;
        component.field = Response.field;
        component.selectAll('name');
        expect(component.refresh).toBeTruthy();
    });
    it('should create component and call the selectAll method', () => {
        component.checkBox = { name: true } as any;
        component.field = Response.field;
        component.selectAll('name');
        expect(component.refresh).toBeTruthy();
    });
    it('should create component and call the selectedOption method', () => {
        component.checkBox = { text: false } as any;
        component.field = Response.field;
        const event = ['1','2','3','4','5','6','7','8','9','10']
        component.selectedOption(event);
        expect(component.selectAllCheckBox).toBeTruthy();
    });
    it('should create component and call the ngOninit method', () => {
        component.field = Response.field;
        component.selectAllCheckBox = false;
        component.ngOnInit();
        expect(component.selectAllCheckBox).toBeFalsy();
    });
    it('should create component and call the ngOninit method with inputData length', () => {
        component.field = Response.field;
        component.selectAllCheckBox = false;
       component.inputData = ['1','2','3','4','5','6','7','8','9','10']
        component.ngOnInit();
        expect(component.selectAllCheckBox).toBeTruthy();
    });
});