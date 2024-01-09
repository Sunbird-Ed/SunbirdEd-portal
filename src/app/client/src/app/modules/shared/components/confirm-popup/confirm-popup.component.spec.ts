import { Component,Input,EventEmitter,Output,ViewChild } from '@angular/core';
import { ResourceService } from '../../services';
import { ConfirmPopupComponent } from './confirm-popup.component';

describe('ConfirmPopupComponent', () => {
    let component: ConfirmPopupComponent;

    let resourceService :Partial<ResourceService> ={};

    beforeAll(() => {
        component = new ConfirmPopupComponent(
            resourceService as ResourceService
        )
        component.modal = { deny: jest.fn() } as any; 
    });

    beforeEach(() => {
        
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });

    it('should emit confirmation event with true and close modal on confirm', () => {
        // Arrange
        const emitSpy = jest.spyOn(component.confirmation, 'emit');
    
        // Act
        component.confirm(true);
    
        // Assert
        expect(emitSpy).toHaveBeenCalledWith(true);
        expect(component.modal.deny).toHaveBeenCalled();
     });

    it('should emit confirmation event with false and close modal on confirm', () => {
        // Arrange
        const emitSpy = jest.spyOn(component.confirmation, 'emit');
    
        // Act
        component.confirm(false);
    
        // Assert
        expect(emitSpy).toHaveBeenCalledWith(false);
        expect(component.modal.deny).toHaveBeenCalled();
    });

    it('should close modal on closeModal', () => {
        component.modal = {
          deny: jest.fn() 
        } as any;
        component.modal = true;
        expect(component.modal).toBeTruthy();
      });
    
    
});