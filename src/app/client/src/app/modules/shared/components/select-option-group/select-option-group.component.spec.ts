import { Component,Input,Output,EventEmitter,OnInit } from '@angular/core';
import { _ } from 'lodash-es';
import { SelectOptionGroupComponent } from './select-option-group.component';

describe('SelectOptionGroupComponent', () => {
    let component: SelectOptionGroupComponent;

    beforeEach(() => {
        component = new SelectOptionGroupComponent();
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize preSelectedValue in ngOnInit', () => {
        component.selectedOption = { label: 'Test Label', value: 'Test Value', selectedOption: 'Selected Option' };
        component.optionData = [
          { label: 'Option 1', value: 'Value 1' },
          { label: 'Option 2', value: 'Value 2' },
        ];
        component.ngOnInit();
        expect(component.preSelectedValue).toBe('Selected Option');
    });

    it('should emit selected value when onChange is called', () => {
        const emitSpy = jest.spyOn(component.selectedValue, 'emit');
        const option = { label: 'Test Label', value: 'Test Value', selectedOption: 'Selected Option' };
        component.onChange(option);
        expect(emitSpy).toHaveBeenCalledWith(option);
    });
    
    it('should set preSelectedValue based on selectedOptionValue', () => {
        component.selectedOptionValue = { index: 1 };
        component.optionData = [
          { label: 'Option 1', value: 'Value 1' },
          { label: 'Option 2', value: 'Value 2' },
        ];
        component.choosedValue();
        expect(component.preSelectedValue).toBe(component.optionData[1]);
    });

    it('should set preSelectedValue based on selectedOption.label', () => {
        component.selectedOptionValue = null;
        component.selectedOption = { label: 'selected label', value: 'Test Value', selectedOption: 'Selected Option' };
        component.optionData = [
          { label: 'result.consumption.frmelmnts.lbl.publisher', option: [{ value: 'Option 1', name: 'Name 1' }] },
          { label: 'Other Label', value: 'Test Value' },
        ];
        component.choosedValue();
        expect(component.preSelectedValue).toBe('Selected Option');
    });

    it('should set preSelectedValue to selectedOption.selectedOption when no other conditions are met', () => {
       component.selectedOptionValue = null;
       component.selectedOption = { label: 'Other Label', value: 'Test Value', selectedOption: 'Selected Option' };
       component.optionData = [
         { label: 'Result Label', value: 'Test Value' },
         { label: 'Other Label', value: 'Test Value' },
       ];
       component.choosedValue();
       expect(component.preSelectedValue).toBe('Selected Option');
    });  
}); 