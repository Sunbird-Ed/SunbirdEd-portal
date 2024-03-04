import { Component,Input,Output,OnInit,ViewChild,EventEmitter,ElementRef,OnDestroy } from '@angular/core';
import { ToasterService,ResourceService } from '@sunbird/shared';
import { UserService,LearnerService } from '@sunbird/core';
import { _ } from 'lodash-es';
import { ProfileService } from '@sunbird/profile';
import { IInteractEventObject } from '@sunbird/telemetry';
import { CertificateNameUpdatePopupComponent } from './certificate-name-update-popup.component';
import { of, throwError } from 'rxjs';

describe('CertificateNameUpdatePopupComponent', () => {
    let component: CertificateNameUpdatePopupComponent;

    const mockUserService :Partial<UserService> ={};
	const mockResourceService :Partial<ResourceService> ={
        messages:{
            fmsg:{
                m0085: 'mock-error-message',
            }
        },
        instance: 'mock-instance',
    };
	const mockToasterService :Partial<ToasterService> ={
        error: jest.fn(),
    };
	const mockLearnerService :Partial<LearnerService> ={};
	const mockProfileService :Partial<ProfileService> ={
        updateProfile: jest.fn(),
    };

    beforeAll(() => {
        component = new CertificateNameUpdatePopupComponent(
            mockUserService as UserService,
			mockResourceService as ResourceService,
			mockToasterService as ToasterService,
			mockLearnerService as LearnerService,
			mockProfileService as ProfileService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        component.fNameInputEl = { nativeElement: { focus: jest.fn() }};
        component.lNameInputEl = { nativeElement: { focus: jest.fn() }};
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });

    it('should call ngOnDestroy and destroy certificate-name', () => {
        component.modal = { deny: jest.fn() };
        component.ngOnDestroy();

        expect(component.modal.deny).toHaveBeenCalled();
    });
    
    describe('updateProfileName',() =>{
        it('should update profile name successfully', () => {
            component.profileInfo = { id: 1, firstName: 'mock-first-name', lastName: 'mock-last-name' };
            const mockData = { firstName: 'mock-first-name', lastName: 'mock-last-name' };
            jest.spyOn(component['profileService'] as any,'updateProfile' as any).mockReturnValue(of({}));
            jest.spyOn(component,'closePopup');
            component.updateProfileName();
        
            expect(mockProfileService.updateProfile).toHaveBeenCalledWith(mockData);
            expect(component.disableContinueBtn).toBe(true);
            expect(localStorage.getItem('isCertificateNameUpdated_1')).toBe('true');
            expect(component.closePopup).toHaveBeenCalled();
        });

        it('should handle error while updating profile name', () => {
            component.profileInfo = { id: 1, firstName: 'mock-first-name', lastName: 'mock-last-name' };
            const errorMessage = 'mock-error';
            jest.spyOn(component['profileService'] as any,'updateProfile' as any).mockReturnValue(throwError(errorMessage));
            component.updateProfileName();
        
            expect(component.disableContinueBtn).toBe(false);
            expect(mockToasterService.error).toHaveBeenCalledWith(component.resourceService.messages.fmsg.m0085);
        });
    });
    
    describe('allowToEdit',() =>{ 
        it('should allow editing first name', (done) => {
            component.fNameInputEl.nativeElement = { focus: jest.fn()};
            component.allowToEdit('firstName');
        
            expect(component.isNameEditable).toBe(true);
            setTimeout(() => {
                expect(component.fNameInputEl.nativeElement.focus).toHaveBeenCalled();
                done();
            },100);
        });

        it('should allow editing last name', (done) => {
            component.lNameInputEl.nativeElement = { focus: jest.fn() }
            component.allowToEdit('lastName');
        
            expect(component.isLastNameEditable).toBe(true);
            setTimeout(() => {
                expect(component.lNameInputEl.nativeElement.focus).toHaveBeenCalled();
                done();
            },100);
        });
    });
    
    describe('onClickCheckbox',() => {
        it('should disable continue button and reset name editability when checkbox is unchecked', () => {
            component.disableContinueBtn = false;
            component.isNameEditable = true;
            component.isLastNameEditable = true;
            component.onClickCheckbox(false);
        
            expect(component.disableContinueBtn).toBe(true);
            expect(component.isNameEditable).toBe(false);
            expect(component.isLastNameEditable).toBe(false);
        });
        
        it('should enable continue button and keep name editability when checkbox is checked', () => {
            component.disableContinueBtn = true;
            component.isNameEditable = false;
            component.isLastNameEditable = false;
            component.onClickCheckbox(true);
        
            expect(component.disableContinueBtn).toBe(false);
            expect(component.isNameEditable).toBe(false);
            expect(component.isLastNameEditable).toBe(false);
        });
    });

    it('should set instance to upper case of resourceService instance on initialization', () => {
        const mockResourceServiceInstance = 'mock instance';
        component.ngOnInit();

        expect(component.instance).toBe(mockResourceServiceInstance.toUpperCase());
    });
});