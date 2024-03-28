import { Component,OnInit,EventEmitter,Output } from '@angular/core';
import { ResourceService } from '../../services/index';
import { _ } from 'lodash-es';
import { InstallAppComponent } from './install-app.component';
describe('InstallAppComponent', () => {
    let component: InstallAppComponent;

    const resourceService :Partial<ResourceService> ={};

    beforeAll(() => {
        component = new InstallAppComponent(
            resourceService as ResourceService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });

    it('should set instance to uppercase in ngOnInit()', () => {
        //@ts-ignore
        resourceService.instance = 'example';
        component.ngOnInit();
        expect(component.instance).toEqual('EXAMPLE');
    });

    it('should set showPopUp to false in closePopUp()', () => {
        component.showPopUp = true;
        component.closePopUp();
        expect(component.showPopUp).toBeFalsy();
    });

    it('should close pop up and emit viewInBrowser event in navigateToLibrary()', () => {
        jest.spyOn(component, 'closePopUp');
        jest.spyOn(component.viewInBrowser, 'emit');
        component.navigateToLibrary();
        expect(component.closePopUp).toHaveBeenCalled();
        expect(component.viewInBrowser.emit).toHaveBeenCalled();
    });
});