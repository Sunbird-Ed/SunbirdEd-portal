import { LocationStrategy } from '@angular/common';
import { Component,OnInit,Input,ViewChild,EventEmitter,Output } from '@angular/core';
import { EditSubmissionComponent} from './edit-submission.component';

describe('EditSubmissionComponent', () => {
    let component: EditSubmissionComponent;
    let onPopStateCallback: () => void;

    const location :Partial<LocationStrategy> ={
        onPopState: jest.fn((callback: () => void) => {
            onPopStateCallback = callback;
        }) as any,
    };

    beforeAll(() => {
        component = new EditSubmissionComponent(
            location as LocationStrategy
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit',() =>{
        it('should not set updatedValue if defaultValue does not exist', () => {
            const editData = {
                action: 'edit',
                returnParams: {}
            } as any;
            component.editData = editData;
            component.ngOnInit();

            expect(component.updatedValue).toBeUndefined();
        });

        it('should set updatedValue to defaultValue if it exists', () => {
            const mockDefaultValue = 'Mock Default Value';
            const editData = {
                defaultValue: mockDefaultValue,
                action: 'edit',
                returnParams: {}
            } as any;
            component.editData = editData;
            component.ngOnInit();

            expect(component.updatedValue).toBe(mockDefaultValue);
        });
    });
    
    describe('closeModal',() =>{
        it('should emit action with null data and deny modal if modal exists', () => {
            const mockModal = {
                deny: jest.fn()
            };
            component.modal = mockModal;
            jest.spyOn(component.onAction,'emit');
            component.closeModal();

            expect(mockModal.deny).toHaveBeenCalled();
            expect(component.onAction.emit).toHaveBeenCalledWith({ action: component.editData.action, data: null });
        });

        it('should emit action with null data if modal does not exist', () => {
            component.modal = undefined;
            component.closeModal();

            expect(component.onAction.emit).toHaveBeenCalledWith({ action: component.editData.action, data: null });
        });
    });


    describe('submit',() =>{
        it('should emit action with updated data and returnParams if modal exists', () => {
            const mockModal = {
                deny: jest.fn()
            };
            component.modal = mockModal;
            const updatedValue = 'Updated Value';
            const returnParams = { param1: 'value1', param2: 'value2' };
            const editData = {
                action: 'edit',
                returnParams: returnParams
            } as any;
            component.editData = editData;
            component.updatedValue = updatedValue;
            component.submit();

            expect(mockModal.deny).toHaveBeenCalled();
            expect(component.onAction.emit).toHaveBeenCalledWith({ action: editData.action, data: updatedValue, returnParams: returnParams });
        });

        it('should emit action with updated data and returnParams as null if modal does not exist', () => {
            component.modal = undefined;
            const updatedValue = 'Updated Value';
            const returnParams = { param1: 'value1', param2: 'value2' };
            const editData = {
                action: 'edit',
                returnParams: returnParams
            } as any;
            component.editData = editData;
            component.updatedValue = updatedValue;
            component.submit();

            expect(component.onAction.emit).toHaveBeenCalledWith({ action: editData.action, data: updatedValue, returnParams: returnParams });
        });
    });
    
    it('should call modal.deny() when onPopState is triggered and modal exists', () => {
        component.modal = { deny: jest.fn() };
        onPopStateCallback();

        expect(component.modal.deny).toHaveBeenCalled();
    });

});