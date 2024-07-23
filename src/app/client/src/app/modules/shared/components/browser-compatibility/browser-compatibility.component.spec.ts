import { Component,OnInit,ViewChild,Input } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ResourceService } from '../../services/index';
import { BrowserCompatibilityComponent } from './browser-compatibility.component';
import { of } from 'rxjs';

describe('BrowserCompatibilityComponent', () => {
    let component: BrowserCompatibilityComponent;

    const resourceService: Partial<ResourceService> = {};
    const _deviceDetectorService: Partial<DeviceDetectorService> = {
        getDeviceInfo: jest.fn(),
    };
  
    beforeEach(() => {
      component = new BrowserCompatibilityComponent(
        resourceService as ResourceService,
        _deviceDetectorService as DeviceDetectorService
      );
    });
    
    it('should create an instance of the component', () => {
        expect(component).toBeTruthy();
    })

    it('should set browserCompatible to true when openCompatibilityModel is called', () => {
        component.openCompatibilityModel();
        expect(component.browserCompatible).toBe(true);
    });

    it('should set browserCompatible to false and save in localStorage when hideCompatibilityModel is called', () => {
        component.hideCompatibilityModel();
        expect(component.browserCompatible).toBe(false);
        expect(localStorage.getItem('BrowserIncompatibleModel')).toBe('shown');
    });

    it('should set showBrowserMsg to true when modalHandler is called', () => {
        component.modalHandler();
        expect(component.showBrowserMsg).toBe(true);
    });

    it('should set browserCompatible to true if localStorage does not contain "BrowserIncompatibleModel" when modalHandler is called', () => {
        localStorage.removeItem('BrowserIncompatibleModel');
        component.modalHandler();
        expect(component.browserCompatible).toBe(true);
    });

    it('should initialize on ngOninit',()=>{
       const mockDeviceInfo = {browser: 'chrome'};
       jest.spyOn(component['_deviceDetectorService'] as any,'getDeviceInfo').mockReturnValue(mockDeviceInfo);
       jest.spyOn(component,'showCompatibilityModal');
       component.ngOnInit();
       expect(component.showCompatibilityModal).toHaveBeenCalled();
    });

    it('should call modalHandler on showCompatibilityModal',()=>{
        const mockDeviceInfo = {browser: 'firefox'};
        component.showModal= true;
        jest.spyOn(component['_deviceDetectorService'] as any,'getDeviceInfo').mockReturnValue(mockDeviceInfo);
        jest.spyOn(component,'modalHandler');
        component.showCompatibilityModal();
        expect(component.deviceInfo).toEqual(mockDeviceInfo);
        expect(component.modalHandler).toHaveBeenCalled();
    })
});