import { Component,OnInit,ViewChild,Output,EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ResourceService } from '../../services';
import { _ } from 'lodash-es';
import { QrCodeModalComponent } from './qr-code-modal.component';

describe('QrCodeModalComponent', () => {
    let component: QrCodeModalComponent;

    const router :Partial<Router> = {
        navigate: jest.fn(),
    };
	const resourceService :Partial<ResourceService> = {
        instance: 'mockInstance',
    };
    const modal: any = { deny: jest.fn() }; 

    beforeAll(() => {
        component = new QrCodeModalComponent(
            router as Router,
			resourceService as ResourceService
        );
        component.modal = modal;
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });

    it('should set interact event data for closing the modal', () => {
        component.setInteractEventData();
        const expectedData = {
          id: 'close-dial-code',
          type: 'click',
          pageid: 'explore',
        };
        expect(component.closeDialCodeInteractEdata).toEqual(expectedData);
    });
    
    it('should set interact event data for submitting dial code', () => {
        const dialCode = '12345';
        component.setsubmitDialCodeInteractEdata(dialCode);
        const expectedData = {
          id: 'submit-dial-code',
          type: 'submit',
          pageid: 'explore',
          extra: { dialCode: dialCode },
        };
        expect(component.submitDialCodeInteractEdata).toEqual(expectedData);
    });

    it('should emit a "success" event when closeModal is called', () => {
        const emitSpy = jest.spyOn(component.closeQrModal, 'emit');
        component.closeModal();
        expect(emitSpy).toHaveBeenCalledWith('success');
    });

    it('should close the modal and navigate to the provided dial code', () => {
        const dialCodeVal = '12345';
        component.onSubmit(dialCodeVal);
        expect(modal.deny).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/get/dial/', dialCodeVal]);
    });

    it('should set interact event data and convert instance to uppercase during ngOnInit', () => {
        const setInteractEventDataSpy = jest.spyOn(component, 'setInteractEventData');
        component.ngOnInit();
        expect(setInteractEventDataSpy).toHaveBeenCalled();
        expect(component.instance).toBe('MOCK INSTANCE');
    });
    
});